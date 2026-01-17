import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Button, Input, Card, CardBody, Alert } from "../../components/ui";
import type { PostingInput, PostTransactionRequest } from "../../types";

interface TransactionFormProps {
  ledgerID: string;
  onSuccess?: (transactionId: string) => void;
}

/**
 * Transaction posting form - uses the ONLY implemented backend endpoint
 * POST /v1/transactions
 * 
 * This form allows posting double-entry transactions with multiple postings.
 * Backend validates:
 * - Double-entry (debits must equal credits)
 * - At least 2 postings
 * - Positive amounts
 * - Valid account codes
 * - Idempotency via idempotency_key
 */
export function TransactionForm({ ledgerID, onSuccess }: TransactionFormProps) {
  const qc = useQueryClient();
  
  const [externalId, setExternalId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 16) // datetime-local format
  );
  const [postings, setPostings] = useState<PostingInput[]>([
    { account_code: "", direction: "debit", amount: "" },
    { account_code: "", direction: "credit", amount: "" },
  ]);

  const mutation = useMutation({
    mutationFn: async (request: PostTransactionRequest) => {
      return apiClient.postTransaction(request);
    },
    onSuccess: (data) => {
      // Invalidate accounts query to refresh balances
      qc.invalidateQueries({ queryKey: ["accounts", ledgerID] });
      qc.invalidateQueries({ queryKey: ["transactions", ledgerID] });
      
      if (onSuccess) {
        onSuccess(data.transaction_id);
      }
      
      // Reset form
      setExternalId("");
      setPostings([
        { account_code: "", direction: "debit", amount: "" },
        { account_code: "", direction: "credit", amount: "" },
      ]);
    },
  });

  const addPosting = () => {
    setPostings([...postings, { account_code: "", direction: "debit", amount: "" }]);
  };

  const removePosting = (index: number) => {
    if (postings.length > 2) {
      setPostings(postings.filter((_, i) => i !== index));
    }
  };

  const updatePosting = (index: number, field: keyof PostingInput, value: string) => {
    const updated = [...postings];
    updated[index] = { ...updated[index], [field]: value };
    setPostings(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate idempotency key (in production, this should be more sophisticated)
    const idempotencyKey = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: PostTransactionRequest = {
      idempotency_key: idempotencyKey,
      external_id: externalId,
      currency: currency,
      occurred_at: new Date(occurredAt).toISOString(),
      postings: postings,
    };
    
    mutation.mutate(request);
  };

  // Calculate totals for validation feedback
  const calculateTotals = () => {
    let debits = 0;
    let credits = 0;
    
    postings.forEach(p => {
      const amount = parseFloat(p.amount || "0");
      if (p.direction === "debit") {
        debits += amount;
      } else {
        credits += amount;
      }
    });
    
    return { debits, credits, balanced: Math.abs(debits - credits) < 0.01 };
  };

  const totals = calculateTotals();

  return (
    <Card variant="bordered">
      <CardBody>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Post Transaction
        </h2>
        
        <div className="space-y-4">
          {mutation.isError && (
            <Alert variant="error" title="Transaction Failed">
              {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
            </Alert>
          )}
          
          {mutation.isSuccess && (
            <Alert variant="success" title="Transaction Posted">
              Transaction ID: <code className="font-mono text-sm">{mutation.data.transaction_id}</code>
            </Alert>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="External ID"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="invoice-123"
              helperText="Optional reference to external system"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <Input
            label="Occurred At"
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            required
            helperText="When this transaction occurred"
          />

          {/* Postings Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-gray-900">
                Postings (Journal Entries)
              </h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addPosting}
              >
                Add Posting
              </Button>
            </div>

            <div className="space-y-3">
              {postings.map((posting, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={posting.account_code}
                      onChange={(e) => updatePosting(index, "account_code", e.target.value)}
                      placeholder="Account code (e.g., 1000)"
                      required
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="w-32">
                    <select
                      value={posting.direction}
                      onChange={(e) => updatePosting(index, "direction", e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  
                  <div className="w-40">
                    <input
                      type="text"
                      value={posting.amount}
                      onChange={(e) => updatePosting(index, "amount", e.target.value)}
                      placeholder="100.50"
                      required
                      pattern="^\d+(\.\d{1,10})?$"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  
                  {postings.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePosting(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Balance Check */}
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Debits:</span>
                <span className="font-mono">{totals.debits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Credits:</span>
                <span className="font-mono">{totals.credits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-300">
                <span>Balance:</span>
                <span className={totals.balanced ? "text-green-600" : "text-red-600"}>
                  {totals.balanced ? "✓ Balanced" : "✗ Not Balanced"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              isLoading={mutation.isPending}
              disabled={!totals.balanced || postings.length < 2}
            >
              Post Transaction
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

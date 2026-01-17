import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table, StatusBadge, Input } from "../../components/ui";
import { formatCurrency } from "../../utils/formatters";
import { useState } from "react";
import type { Account, AccountType } from "../../types";

function getAccountTypeStatus(type: AccountType): "success" | "info" | "warning" | "neutral" | "error" {
    switch (type.toLowerCase()) {
        case "asset":
            return "success";
        case "liability":
            return "warning";
        case "equity":
            return "info";
        case "revenue":
            return "success";
        case "expense":
            return "error";
        default:
            return "neutral";
    }
}

export function AccountsTable({ ledgerID, currency = "USD" }: { ledgerID: string; currency?: string }) {
    const qc = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState<AccountType>("asset");

    const query = useQuery({
        queryKey: ["accounts", ledgerID],
        queryFn: () => apiClient.getAccounts(),
    });

    const createMutation = useMutation({
        mutationFn: async (data: { code: string; name: string; type: string }) => 
            apiClient.createAccount(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["accounts", ledgerID] });
            setShowCreateForm(false);
            setCode("");
            setName("");
        },
    });

    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            code,
            name,
            type,
        });
    };

    const columns = [
        {
            key: "code" as const,
            header: "CODE",
            render: (row: Account) => (
                <code className="rounded-md bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800">
                    {row.code}
                </code>
            ),
            className: "text-left",
        },
        {
            key: "name" as const,
            header: "NAME",
            render: (row: Account) => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{row.id}</div>
                </div>
            ),
            className: "text-left",
        },
        {
            key: "type" as const,
            header: "TYPE",
            render: (row: Account) => (
                <StatusBadge status={getAccountTypeStatus(row.type)}>
                    {row.type}
                </StatusBadge>
            ),
            className: "text-left",
        },
        {
            key: "balance" as const,
            header: "BALANCE",
            render: (row: Account) => {
                const balance = parseFloat(row.balance);
                const isNegative = balance < 0;
                return (
                    <div className={`font-mono font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}>
                        {formatCurrency(row.balance, currency)}
                    </div>
                );
            },
            className: "text-right",
        },
        {
            key: "ledger_id" as const,
            header: "LEDGER ID",
            render: (row: Account) => (
                <code className="text-xs font-mono text-gray-500">{row.ledger_id}</code>
            ),
            className: "text-left",
        },
        {
            key: "created_at" as const,
            header: "CREATED",
            render: (row: Account) => (
                <div className="text-sm text-gray-600">
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>
            ),
            className: "text-left",
        },
    ];

    const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
        { value: "asset", label: "Asset" },
        { value: "liability", label: "Liability" },
        { value: "equity", label: "Equity" },
        { value: "revenue", label: "Revenue" },
        { value: "expense", label: "Expense" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage ledger accounts
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                    {showCreateForm ? "Cancel" : "Create Account"}
                </button>
            </div>

            {/* Create Account Form */}
            {showCreateForm && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Create New Account</h2>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        <form onSubmit={handleCreateAccount} className="space-y-4">
                            <div>
                                <Input
                                    id="account-code"
                                    label="Account Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="1000"
                                    required
                                    helperText="Unique code for this account (e.g., 1000, 1100)"
                                />
                            </div>

                            <div>
                                <Input
                                    id="account-name"
                                    label="Account Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Cash"
                                    required
                                    helperText="A descriptive name for this account"
                                />
                            </div>

                            <div>
                                <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Type
                                </label>
                                <select
                                    id="account-type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as AccountType)}
                                    required
                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {ACCOUNT_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Account"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Accounts Table */}
            <Card variant="bordered">
                <Table
                    data={query.data || []}
                    columns={columns}
                    keyField="id"
                    loading={query.isLoading}
                    emptyMessage="No accounts found for this ledger."
                />
            </Card>
        </div>
    );
}

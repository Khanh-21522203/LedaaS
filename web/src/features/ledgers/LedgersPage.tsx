import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

const CURRENCIES = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
];

export function LedgersPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [currency, setCurrency] = useState("USD");

    // Fetch ledgers from API (will use mock data if backend not available)
    const ledgersQuery = useQuery({
        queryKey: ["ledgers"],
        queryFn: () => apiClient.getLedgers(),
    });

    // Create ledger mutation
    const createMutation = useMutation({
        mutationFn: (data: { project_id: string; name: string; code: string; currency: string }) => 
            apiClient.createLedger(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ledgers"] });
            setShowForm(false);
            setName("");
            setCode("");
            setCurrency("USD");
        },
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        createMutation.mutate({
            project_id: "default-project",
            name,
            code,
            currency,
        });
    }

    function handleLedgerClick(ledgerId: string) {
        navigate(`/ledgers/${ledgerId}`);
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Ledgers</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your financial ledgers and accounts</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                    {showForm ? "Cancel" : "Create Ledger"}
                </button>
            </div>

            {/* Create Ledger Form */}
            {showForm && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Create New Ledger</h2>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="ledger-name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="ledger-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Production Ledger"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <p className="mt-1 text-xs text-gray-500">A descriptive name for your ledger</p>
                            </div>

                            <div>
                                <label htmlFor="ledger-code" className="block text-sm font-medium text-gray-700">
                                    Code
                                </label>
                                <input
                                    id="ledger-code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="production"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <p className="mt-1 text-xs text-gray-500">Unique identifier (lowercase, hyphens allowed)</p>
                            </div>

                            <div>
                                <label htmlFor="ledger-currency" className="block text-sm font-medium text-gray-700">
                                    Base Currency
                                </label>
                                <select
                                    id="ledger-currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {CURRENCIES.map((curr) => (
                                        <option key={curr.value} value={curr.value}>
                                            {curr.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Create Ledger
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ledgers Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                NAME
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                CODE
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                CURRENCY
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                PROJECT ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                CREATED
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {ledgersQuery.isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : (ledgersQuery.data || []).map((ledger) => (
                            <tr key={ledger.id} className="transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{ledger.name}</div>
                                        <div className="text-xs text-gray-500">{ledger.id}</div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <code className="rounded-md bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800">
                                        {ledger.code}
                                    </code>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        {ledger.currency}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs text-gray-500">{ledger.project_id}</code>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                    {new Date(ledger.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleLedgerClick(ledger.id)}
                                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!ledgersQuery.isLoading && (ledgersQuery.data || []).length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No ledgers found. Create your first ledger to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
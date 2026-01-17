import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";
import { Card, CardBody, Button } from "../../components/ui";
import { useApiKey } from "../../contexts/ApiKeyContext";

const tabs = [
    { path: "accounts", label: "Accounts", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0 01-2 2v-16m-4 0h4m-4 0h4m-4 0h4" },
    { path: "transactions", label: "Transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { path: "api-keys", label: "API Keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { path: "webhooks", label: "Webhooks", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { path: "events", label: "Events", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "balance", label: "Balance", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export function LedgerDetailPage() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    const navigate = useNavigate();
    const { apiKey } = useApiKey();

    const { data: ledger, isLoading } = useQuery({
        queryKey: ["ledger", ledgerID],
        queryFn: () => apiClient.getLedger(ledgerID || ""),
        enabled: !!ledgerID,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!ledger) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-500 mb-4">Ledger not found</p>
                <Button onClick={() => navigate("/ledgers")}>Back to Ledgers</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* API Key Warning */}
            {!apiKey && (
                <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-yellow-800">No API Key Selected</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>You need to select an API key to access ledger data (accounts, transactions, etc.).</p>
                            </div>
                            <div className="mt-3">
                                <Link to={`/ledgers/${ledgerID}/api-keys`}>
                                    <button className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700">
                                        Manage API Keys
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{ledger.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">{ledger.code}</p>
                </div>
                <div className="flex items-center gap-3">
                    {apiKey && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            API Key Active
                        </span>
                    )}
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                    </span>
                </div>
            </div>

            {/* Ledger Info */}
            <Card>
                <CardBody>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ledger ID</p>
                            <p className="mt-1 text-sm text-gray-900 font-mono">{ledger.id.slice(0, 12)}...</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Created</p>
                            <p className="mt-1 text-sm text-gray-900">
                                {new Date(ledger.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Currency</p>
                            <p className="mt-1 text-sm text-gray-900">{ledger.currency || "USD"}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={`/ledgers/${ledgerID}/${tab.path}`}
                            className="group inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        >
                            <svg
                                className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Select a tab to view details</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Choose from Accounts, Transactions, API Keys, Webhooks, Events, or Balance
                    </p>
                </div>
            </div>
        </div>
    );
}

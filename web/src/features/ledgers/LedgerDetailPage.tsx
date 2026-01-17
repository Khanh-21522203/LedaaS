import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";
import { Card, CardBody, Button } from "../../components/ui";
import type { Ledger } from "../../types";

const tabs = [
    { path: "accounts", label: "Accounts", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { path: "transactions", label: "Transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { path: "api-keys", label: "API Keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { path: "webhooks", label: "Webhooks", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

export function LedgerDetailPage() {
    const { ledgerID } = useParams<{ ledgerID: string }>();
    const navigate = useNavigate();

    const ledgerQuery = useQuery({
        queryKey: ["ledger", ledgerID],
        queryFn: async () => {
            // Since we don't have a single ledger endpoint, find it from the list
            const ledgers = await apiClient.getLedgers();
            return ledgers.find((l: Ledger) => l.id === ledgerID);
        },
        enabled: !!ledgerID,
    });

    const ledger = ledgerQuery.data;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/ledgers")}
                className="text-gray-600 hover:text-gray-900"
            >
                ← Back to Ledgers
            </Button>

            {/* Ledger Header */}
            {ledger && (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{ledger.name}</h1>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center">
                                    <span className="font-medium">Code:</span>
                                    <code className="ml-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-mono">
                                        {ledger.code}
                                    </code>
                                </span>
                                <span className="inline-flex items-center">
                                    <span className="font-medium">Currency:</span>
                                    <span className="ml-1 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                        {ledger.currency}
                                    </span>
                                </span>
                                <span className="inline-flex items-center">
                                    <span className="font-medium">ID:</span>
                                    <code className="ml-1 text-xs font-mono text-gray-500">
                                        {ledger.id}
                                    </code>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ledger Stats */}
            {ledger && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="bordered">
                        <CardBody>
                            <div className="text-sm font-medium text-gray-600">Total Accounts</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
                        </CardBody>
                    </Card>
                    <Card variant="bordered">
                        <CardBody>
                            <div className="text-sm font-medium text-gray-600">Total Transactions</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
                        </CardBody>
                    </Card>
                    <Card variant="bordered">
                        <CardBody>
                            <div className="text-sm font-medium text-gray-600">API Keys</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={`/ledgers/${ledgerID}/${tab.path}`}
                            className="group inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 whitespace-nowrap"
                        >
                            <svg
                                className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={tab.icon}
                                />
                            </svg>
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                {ledgerQuery.isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : !ledger ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-500">Ledger not found</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            Select a tab to view ledger details
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Choose from Accounts, Transactions, API Keys, or Webhooks
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

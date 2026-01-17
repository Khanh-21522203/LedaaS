import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table } from "../../components/ui";
import { formatDate } from "../../utils/formatters";
import type { BalanceHistory } from "../../types";

interface BalancePageProps {
    ledgerID: string;
}

export function BalancePage({ ledgerID }: BalancePageProps) {
    const summaryQuery = useQuery({
        queryKey: ["balance-summary", ledgerID],
        queryFn: () => apiClient.getBalanceSummary(),
        enabled: !!ledgerID,
    });

    const historyQuery = useQuery({
        queryKey: ["balance-history", ledgerID],
        queryFn: () => apiClient.getAccountBalanceHistory(),
        enabled: !!ledgerID,
    });

    const historyColumns = [
        {
            key: "account_code" as const,
            header: "ACCOUNT CODE",
            render: (row: BalanceHistory) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.account_code}
                </code>
            ),
            className: "text-left",
        },
        {
            key: "account_name" as const,
            header: "ACCOUNT NAME",
            render: (row: BalanceHistory) => (
                <span className="text-sm text-gray-900">
                    {row.account_name}
                </span>
            ),
            className: "text-left",
        },
        {
            key: "balance" as const,
            header: "BALANCE",
            render: (row: BalanceHistory) => (
                <span className={`text-sm font-medium ${parseFloat(row.balance) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {parseFloat(row.balance) >= 0 ? "+" : ""}{parseFloat(row.balance).toFixed(2)}
                </span>
            ),
            className: "text-right",
        },
        {
            key: "occurred_at" as const,
            header: "OCCURRED AT",
            render: (row: BalanceHistory) => (
                <div className="text-sm text-gray-600">
                    {formatDate(row.occurred_at)}
                </div>
            ),
            className: "text-left",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Balance</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View account balances and balance history
                </p>
            </div>

            {/* Balance Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Card variant="bordered">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Debits</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">
                                {summaryQuery.data?.total_debits ? parseFloat(summaryQuery.data.total_debits).toFixed(2) : "0.00"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Credits</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">
                                {summaryQuery.data?.total_credits ? parseFloat(summaryQuery.data.total_credits).toFixed(2) : "0.00"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Net Balance</p>
                            <p className={`mt-1 text-2xl font-semibold ${parseFloat(summaryQuery.data?.net_balance || "0") >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {parseFloat(summaryQuery.data?.net_balance || "0") >= 0 ? "+" : ""}{parseFloat(summaryQuery.data?.net_balance || "0").toFixed(2)}
                            </p>
                        </div>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${parseFloat(summaryQuery.data?.net_balance || "0") >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                            <svg className={`h-6 w-6 ${parseFloat(summaryQuery.data?.net_balance || "0") >= 0 ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Balance History Table */}
            <Card variant="bordered">
                <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Balance History</h2>
                    <p className="text-sm text-gray-500">Historical balance changes by account</p>
                </div>
                <Table
                    data={historyQuery.data || []}
                    columns={historyColumns}
                    keyField="occurred_at"
                    loading={historyQuery.isLoading}
                    emptyMessage="No balance history found."
                />
            </Card>
        </div>
    );
}

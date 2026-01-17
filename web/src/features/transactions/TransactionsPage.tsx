import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table, StatusBadge } from "../../components/ui";
import { formatDate, formatCurrency } from "../../utils/formatters";
import type { Transaction } from "../../types";

export function TransactionsPage({ ledgerID }: { ledgerID: string }) {
    const query = useQuery({
        queryKey: ["transactions", ledgerID],
        queryFn: () => apiClient.getTransactions(),
    });

    const columns = [
        {
            key: "id" as const,
            header: "TRANSACTION ID",
            render: (row: Transaction) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.id.slice(0, 12)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "external_id" as const,
            header: "EXTERNAL ID",
            render: (row: Transaction) => (
                <span className="text-sm text-gray-600">
                    {row.external_id || "-"}
                </span>
            ),
            className: "text-left",
        },
        {
            key: "amount" as const,
            header: "AMOUNT",
            render: (row: Transaction) => {
                const amount = parseFloat(row.amount);
                const isNegative = amount < 0;
                return (
                    <span className={`font-mono font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}>
                        {formatCurrency(row.amount)}
                    </span>
                );
            },
            className: "text-right",
        },
        {
            key: "currency" as const,
            header: "CURRENCY",
            render: (row: Transaction) => (
                <StatusBadge status="neutral">
                    {row.currency}
                </StatusBadge>
            ),
            className: "text-left",
        },
        {
            key: "occurred_at" as const,
            header: "OCCURRED AT",
            render: (row: Transaction) => (
                <div className="text-sm text-gray-600">
                    {formatDate(row.occurred_at)}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "created_at" as const,
            header: "CREATED",
            render: (row: Transaction) => (
                <div className="text-sm text-gray-500">
                    {formatDate(row.created_at)}
                </div>
            ),
            className: "text-left",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View and manage ledger transactions
                </p>
            </div>

            {/* Transactions Table */}
            <Card variant="bordered">
                <Table
                    data={query.data || []}
                    columns={columns}
                    keyField="id"
                    loading={query.isLoading}
                    emptyMessage="No transactions found for this ledger."
                />
            </Card>
        </div>
    );
}

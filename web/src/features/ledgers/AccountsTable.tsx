import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table, StatusBadge } from "../../components/ui";
import type { Account, AccountType } from "../../types";

function formatCurrency(amount: string | number, currency: string): string {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numAmount);
}

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

export function AccountsTable({ ledgerID }: { ledgerID: string }) {
    const query = useQuery({
        queryKey: ["accounts", ledgerID],
        queryFn: () => apiClient.getAccounts(ledgerID),
    });

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
                        {formatCurrency(row.balance, "USD")}
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View and manage ledger accounts
                </p>
            </div>

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
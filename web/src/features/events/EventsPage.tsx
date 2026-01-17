import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table } from "../../components/ui";
import { formatDate } from "../../utils/formatters";
import type { Event } from "../../types";

interface EventsPageProps {
    ledgerID: string;
}

export function EventsPage({ ledgerID }: EventsPageProps) {
    const query = useQuery({
        queryKey: ["events", ledgerID],
        queryFn: () => apiClient.getEvents(),
        enabled: !!ledgerID,
    });

    const columns = [
        {
            key: "id" as const,
            header: "EVENT ID",
            render: (row: Event) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.id.slice(0, 12)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "aggregate_type" as const,
            header: "AGGREGATE TYPE",
            render: (row: Event) => (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {row.aggregate_type}
                </span>
            ),
            className: "text-left",
        },
        {
            key: "aggregate_id" as const,
            header: "AGGREGATE ID",
            render: (row: Event) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.aggregate_id.slice(0, 12)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "event_type" as const,
            header: "EVENT TYPE",
            render: (row: Event) => (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {row.event_type}
                </span>
            ),
            className: "text-left",
        },
        {
            key: "occurred_at" as const,
            header: "OCCURRED AT",
            render: (row: Event) => (
                <div className="text-sm text-gray-600">
                    {formatDate(row.occurred_at)}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "created_at" as const,
            header: "CREATED",
            render: (row: Event) => (
                <div className="text-sm text-gray-500">
                    {formatDate(row.created_at)}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "idempotency_key" as const,
            header: "IDEMPOTENCY KEY",
            render: (row: Event) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.idempotency_key || "-"}
                </code>
            ),
            className: "text-left",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View ledger event history and audit trail
                </p>
            </div>

            {/* Events Table */}
            <Card variant="bordered">
                <Table
                    data={query.data || []}
                    columns={columns}
                    keyField="id"
                    loading={query.isLoading}
                    emptyMessage="No events found."
                />
            </Card>
        </div>
    );
}

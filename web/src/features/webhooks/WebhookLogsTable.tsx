import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, Table, StatusBadge, Button, Modal } from "../../components/ui";
import { useState } from "react";
import type { WebhookDelivery } from "../../types";

// Extended interface for display with extra fields from mock/future endpoints
interface WebhookDeliveryDisplay extends WebhookDelivery {
    endpoint_url?: string;
    request_payload?: string;
    response_body?: string;
}

function getStatusVariant(status: string): "success" | "warning" | "error" | "info" | "neutral" {
    switch (status) {
        case "success":
            return "success";
        case "retryable_error":
            return "warning";
        case "non_retryable_error":
            return "error";
        default:
            return "neutral";
    }
}

function formatDate(date: string): string {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function WebhookLogsTable({ ledgerID }: { ledgerID: string }) {
    const [selectedLog, setSelectedLog] = useState<WebhookDeliveryDisplay | null>(null);

    const query = useQuery({
        queryKey: ["webhook-logs", ledgerID],
        queryFn: () => apiClient.getWebhookDeliveries(ledgerID),
    });

    const columns = [
        {
            key: "id" as const,
            header: "DELIVERY ID",
            render: (row: WebhookDeliveryDisplay) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.id.slice(0, 12)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "event_id" as const,
            header: "EVENT ID",
            render: (row: WebhookDeliveryDisplay) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.event_id.slice(0, 8)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "webhook_endpoint_id" as const,
            header: "ENDPOINT ID",
            render: (row: WebhookDeliveryDisplay) => (
                <code className="text-xs font-mono text-gray-500">
                    {row.webhook_endpoint_id.slice(0, 8)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "endpoint_url" as const,
            header: "ENDPOINT",
            render: (row: WebhookDeliveryDisplay) => (
                <div className="max-w-xs truncate" title={row.endpoint_url || "N/A"}>
                    {row.endpoint_url || "N/A"}
                </div>
            ),
            className: "text-left max-w-xs",
        },
        {
            key: "status" as const,
            header: "STATUS",
            render: (row: WebhookDeliveryDisplay) => (
                <StatusBadge status={getStatusVariant(row.status)}>
                    {row.status.replace(/_/g, " ")}
                </StatusBadge>
            ),
            className: "text-left",
        },
        {
            key: "http_status" as const,
            header: "HTTP",
            render: (row: WebhookDeliveryDisplay) => {
                if (!row.http_status) return <span className="text-gray-400">-</span>;
                const isSuccess = row.http_status >= 200 && row.http_status < 300;
                return (
                    <span className={`font-mono text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                        {row.http_status}
                    </span>
                );
            },
            className: "text-left",
        },
        {
            key: "attempt" as const,
            header: "ATTEMPT",
            render: (row: WebhookDeliveryDisplay) => (
                <span className="font-mono text-sm">{row.attempt}</span>
            ),
            className: "text-left",
        },
        {
            key: "last_attempt_at" as const,
            header: "LAST ATTEMPT",
            render: (row: WebhookDeliveryDisplay) => (
                <div className="text-sm text-gray-600">
                    {row.last_attempt_at ? formatDate(row.last_attempt_at) : "N/A"}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "created_at" as const,
            header: "CREATED",
            render: (row: WebhookDeliveryDisplay) => (
                <div className="text-sm text-gray-600">
                    {formatDate(row.created_at)}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "actions" as const,
            header: "",
            render: (row: WebhookDeliveryDisplay) => (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(row)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        View Details
                    </Button>
                </div>
            ),
            className: "text-right",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Webhook Logs</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Monitor webhook delivery attempts and troubleshoot issues
                </p>
            </div>

            {/* Webhook Logs Table */}
            <Card variant="bordered">
                <Table
                    data={query.data || []}
                    columns={columns}
                    keyField="id"
                    loading={query.isLoading}
                    emptyMessage="No webhook delivery logs found."
                />
            </Card>

            {/* Details Modal */}
            <Modal
                isOpen={selectedLog !== null}
                onClose={() => setSelectedLog(null)}
                title="Webhook Delivery Details"
                size="lg"
            >
                {selectedLog && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Event ID
                                </label>
                                <code className="mt-1 block text-sm font-mono text-gray-900">
                                    {selectedLog.event_id}
                                </code>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <StatusBadge status={getStatusVariant(selectedLog.status)}>
                                        {selectedLog.status.replace(/_/g, " ")}
                                    </StatusBadge>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Endpoint URL
                                </label>
                                <code className="mt-1 block text-sm break-all text-gray-900">
                                    {selectedLog.endpoint_url}
                                </code>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    HTTP Status
                                </label>
                                <div className="mt-1 font-mono text-gray-900">
                                    {selectedLog.http_status || "N/A"}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Attempt Number
                                </label>
                                <div className="mt-1 font-mono text-gray-900">
                                    {selectedLog.attempt}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Attempt
                                </label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {selectedLog.last_attempt_at ? formatDate(selectedLog.last_attempt_at) : "N/A"}
                                </div>
                            </div>
                        </div>

                        {selectedLog.error_message && (
                            <div className="rounded-lg bg-red-50 p-4">
                                <label className="block text-sm font-medium text-red-900">
                                    Error Message
                                </label>
                                <p className="mt-1 text-sm text-red-800">
                                    {selectedLog.error_message}
                                </p>
                            </div>
                        )}

                        {selectedLog.request_payload && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Request Payload
                                </label>
                                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs font-mono text-green-300">
                                    {JSON.stringify(JSON.parse(selectedLog.request_payload), null, 2)}
                                </pre>
                            </div>
                        )}

                        {selectedLog.response_body && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Response Body
                                </label>
                                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs font-mono text-green-300">
                                    {JSON.stringify(JSON.parse(selectedLog.response_body), null, 2)}
                                </pre>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
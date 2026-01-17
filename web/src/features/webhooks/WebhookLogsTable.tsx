import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Card, CardBody, Table, StatusBadge, Button, Modal, Input } from "../../components/ui";
import { formatDateWithSeconds } from "../../utils/formatters";
import { logger } from "../../utils/logger";
import { useState } from "react";
import type { WebhookDeliveryResponse } from "../../types";

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

export function WebhookLogsTable({ ledgerID }: { ledgerID: string }) {
    const qc = useQueryClient();
    const [showCreateEndpoint, setShowCreateEndpoint] = useState(false);
    const [url, setUrl] = useState("");
    const [selectedLog, setSelectedLog] = useState<WebhookDeliveryResponse | null>(null);

    const deliveriesQuery = useQuery({
        queryKey: ["webhook-logs", ledgerID],
        queryFn: () => apiClient.getWebhookDeliveries(100),
    });

    const endpointsQuery = useQuery({
        queryKey: ["webhook-endpoints", ledgerID],
        queryFn: () => apiClient.getWebhookEndpoints(),
    });

    const createEndpointMutation = useMutation({
        mutationFn: (data: { url: string }) => apiClient.createWebhookEndpoint(data),
        onSuccess: () => {
            setShowCreateEndpoint(false);
            setUrl("");
            qc.invalidateQueries({ queryKey: ["webhook-endpoints", ledgerID] });
        },
    });

    const handleCreateEndpoint = (e: React.FormEvent) => {
        e.preventDefault();
        createEndpointMutation.mutate({ url });
    };

    const columns = [
        {
            key: "id" as const,
            header: "DELIVERY ID",
            render: (row: WebhookDeliveryResponse) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.id.slice(0, 12)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "event_id" as const,
            header: "EVENT ID",
            render: (row: WebhookDeliveryResponse) => (
                <code className="text-xs font-mono text-gray-600">
                    {row.event_id.slice(0, 8)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "webhook_endpoint_id" as const,
            header: "ENDPOINT ID",
            render: (row: WebhookDeliveryResponse) => (
                <code className="text-xs font-mono text-gray-500">
                    {row.webhook_endpoint_id.slice(0, 8)}...
                </code>
            ),
            className: "text-left",
        },
        {
            key: "endpoint_url" as const,
            header: "ENDPOINT",
            render: (row: WebhookDeliveryResponse) => (
                <div className="max-w-xs truncate" title={row.endpoint_url || "N/A"}>
                    {row.endpoint_url || "N/A"}
                </div>
            ),
            className: "text-left max-w-xs",
        },
        {
            key: "status" as const,
            header: "STATUS",
            render: (row: WebhookDeliveryResponse) => (
                <StatusBadge status={getStatusVariant(row.status)}>
                    {row.status.replace(/_/g, " ")}
                </StatusBadge>
            ),
            className: "text-left",
        },
        {
            key: "http_status" as const,
            header: "HTTP",
            render: (row: WebhookDeliveryResponse) => {
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
            render: (row: WebhookDeliveryResponse) => (
                <span className="font-mono text-sm">{row.attempt}</span>
            ),
            className: "text-left",
        },
        {
            key: "last_attempt_at" as const,
            header: "LAST ATTEMPT",
            render: (row: WebhookDeliveryResponse) => (
                <div className="text-sm text-gray-600">
                    {row.last_attempt_at ? formatDateWithSeconds(row.last_attempt_at) : "N/A"}
                </div>
            ),
            className: "text-left",
        },
        {
            key: "actions" as const,
            header: "",
            render: (row: WebhookDeliveryResponse) => (
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
                <h1 className="text-2xl font-semibold text-gray-900">Webhooks</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Monitor webhook delivery attempts and troubleshoot issues
                </p>
            </div>

            {/* Create Webhook Endpoint */}
            {showCreateEndpoint && (
                <Card variant="bordered">
                    <CardBody className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Create Webhook Endpoint</h2>
                        <form
                            onSubmit={handleCreateEndpoint}
                            className="space-y-4"
                        >
                            <div>
                                <Input
                                    id="webhook-url"
                                    label="Webhook URL"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://your-server.com/webhook"
                                    required
                                    helperText="The URL where webhook events will be sent"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    isLoading={createEndpointMutation.isPending}
                                >
                                    Create Endpoint
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowCreateEndpoint(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            )}

            {/* Webhook Endpoints List */}
            {!showCreateEndpoint && endpointsQuery.data && endpointsQuery.data.length > 0 && (
                <Card variant="bordered">
                    <CardBody className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Webhook Endpoints</h2>
                        <div className="space-y-2">
                            {endpointsQuery.data.map((endpoint) => (
                                <div key={endpoint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">{endpoint.url}</div>
                                        <div className="text-xs text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                {endpoint.is_active ? "Active" : "Inactive"}
                                            </span>
                                            <span className="ml-2">• Created {formatDateWithSeconds(endpoint.created_at)}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => logger.log("Edit endpoint", endpoint.id)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Webhook Logs Table */}
            <Card variant="bordered">
                <Table
                    data={deliveriesQuery.data || []}
                    columns={columns}
                    keyField="id"
                    loading={deliveriesQuery.isLoading}
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
                                    Delivery ID
                                </label>
                                <code className="mt-1 block text-sm font-mono text-gray-900">
                                    {selectedLog.id}
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
                                    Event ID
                                </label>
                                <code className="mt-1 block text-sm font-mono text-gray-900">
                                    {selectedLog.event_id}
                                </code>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Attempt
                                </label>
                                <div className="mt-1 text-sm text-gray-600">
                                    {selectedLog.last_attempt_at ? formatDateWithSeconds(selectedLog.last_attempt_at) : "N/A"}
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

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Button, Input, Card, CardBody, Table, Alert, StatusBadge } from "../../components/ui";
import type { ApiKey } from "../../types";

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function ApiKeysPage({ ledgerID }: { ledgerID: string }) {
    const qc = useQueryClient();
    const [description, setDescription] = useState("");
    const [newKey, setNewKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const keysQuery = useQuery({
        queryKey: ["api-keys", ledgerID],
        queryFn: () => apiClient.getApiKeys(ledgerID),
    });

    const createKey = useMutation({
        mutationFn: (desc: string) => apiClient.createApiKey(ledgerID, desc),
        onSuccess: (data) => {
            setNewKey(data.raw_key);
            setDescription("");
            qc.invalidateQueries({ queryKey: ["api-keys", ledgerID] });
        },
    });

    const revokeKey = useMutation({
        mutationFn: (id: string) => apiClient.revokeApiKey(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["api-keys", ledgerID] });
        },
    });

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleRevoke = (id: string, prefix: string) => {
        if (confirm(`Are you sure you want to revoke the API key ${prefix}? This action cannot be undone.`)) {
            revokeKey.mutate(id);
        }
    };

    const columns = [
        {
            key: "prefix" as const,
            header: "PREFIX",
            render: (row: ApiKey) => (
                <code className="rounded-md bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800">
                    {row.prefix}
                </code>
            ),
            className: "text-left",
        },
        {
            key: "description" as const,
            header: "DESCRIPTION",
            render: (row: ApiKey) => (
                <div className="font-medium text-gray-900">{row.description || "(No description)"}</div>
            ),
            className: "text-left",
        },
        {
            key: "is_active" as const,
            header: "STATUS",
            render: (row: ApiKey) => (
                <StatusBadge status={row.is_active ? "success" : "error"}>
                    {row.is_active ? "Active" : "Revoked"}
                </StatusBadge>
            ),
            className: "text-left",
        },
        {
            key: "revoked_at" as const,
            header: "REVOKED AT",
            render: (row: ApiKey) => (
                <div className="text-sm text-gray-600">{row.revoked_at ? formatDate(row.revoked_at) : "-"}</div>
            ),
            className: "text-left",
        },
        {
            key: "created_at" as const,
            header: "CREATED",
            render: (row: ApiKey) => (
                <div className="text-sm text-gray-600">{formatDate(row.created_at)}</div>
            ),
            className: "text-left",
        },
        {
            key: "id" as const,
            header: "ID",
            render: (row: ApiKey) => (
                <code className="text-xs font-mono text-gray-500">{row.id}</code>
            ),
            className: "text-left",
        },
        {
            key: "actions" as const,
            header: "",
            render: (row: ApiKey) => (
                <div className="flex justify-end space-x-2">
                    {row.is_active && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRevoke(row.id, row.prefix)}
                            isLoading={revokeKey.isPending}
                        >
                            Revoke
                        </Button>
                    )}
                </div>
            ),
            className: "text-right",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage API keys for programmatic access to your ledger
                </p>
            </div>

            {/* New Key Alert */}
            {newKey && (
                <Alert variant="warning" title="Save your API key now">
                    <div className="space-y-3">
                        <p className="text-sm">
                            You won't be able to see this key again. Copy it and store it securely.
                        </p>
                        <div className="relative">
                            <pre className="overflow-x-auto rounded-md bg-gray-900 p-3 text-sm font-mono text-green-300">
                                {newKey}
                            </pre>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => copyToClipboard(newKey)}
                                className="absolute top-2 right-2"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setNewKey(null)}>
                            Dismiss
                        </Button>
                    </div>
                </Alert>
            )}

            {/* Generate Key Form */}
            <Card variant="bordered">
                <CardBody className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Generate New API Key</h2>
                    <form
                        className="flex flex-col gap-4 sm:flex-row sm:items-end"
                        onSubmit={(e) => {
                            e.preventDefault();
                            createKey.mutate(description);
                        }}
                    >
                        <div className="flex-1">
                            <Input
                                id="key-description"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., Production API key"
                                required
                                helperText="A descriptive name to help you identify this key"
                            />
                        </div>
                        <Button
                            type="submit"
                            isLoading={createKey.isPending}
                            className="sm:mb-[1px]"
                        >
                            Generate Key
                        </Button>
                    </form>
                </CardBody>
            </Card>

            {/* API Keys Table */}
            <Card variant="bordered">
                <Table
                    data={keysQuery.data || []}
                    columns={columns}
                    keyField="id"
                    loading={keysQuery.isLoading}
                    emptyMessage="No API keys found. Generate your first key to get started."
                />
            </Card>
        </div>
    );
}
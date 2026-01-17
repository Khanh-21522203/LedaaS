import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";

interface ApiKey {
    id: string;
    prefix: string;
    description: string;
    is_active: boolean;
    created_at: string;
}

export function ApiKeysPage({ ledgerID }: { ledgerID: string }) {
    const qc = useQueryClient();
    const [description, setDescription] = useState("");
    const [newKey, setNewKey] = useState<string | null>(null);

    const keysQuery = useQuery({
        queryKey: ["api-keys", ledgerID],
        queryFn: async () => {
            const res = await api.get<ApiKey[]>(`/ledgers/${ledgerID}/api-keys`);
            return res.data;
        },
    });

    const createKey = useMutation({
        mutationFn: async (desc: string) => {
            const res = await api.post<{ raw_key: string }>(`/ledgers/${ledgerID}/api-keys`, {
                description: desc,
            });
            return res.data;
        },
        onSuccess: (data) => {
            setNewKey(data.raw_key);
            qc.invalidateQueries({ queryKey: ["api-keys", ledgerID] });
        },
    });

    const revokeKey = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/api-keys/${id}/revoke`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["api-keys", ledgerID] });
        },
    });

    if (keysQuery.isLoading) {
        return <div className="p-6">Loading API keys...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">API Keys</h1>

            <form
                className="mb-6 flex items-end gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    createKey.mutate(description);
                    setDescription("");
                }}
            >
                <div className="flex-1">
                    <label className="block text-sm font-medium">Description</label>
                    <input
                        className="mt-1 block w-full rounded border px-3 py-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Production API key"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    disabled={createKey.isPending}
                >
                    Generate Key
                </button>
            </form>

            {newKey && (
                <div className="mb-6 rounded border border-yellow-400 bg-yellow-50 p-4">
                    <p className="font-semibold text-yellow-900">
                        Copy this key now. You will not see it again.
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-2 text-sm text-green-300">
            {newKey}
          </pre>
                    <button
                        onClick={() => setNewKey(null)}
                        className="mt-2 text-sm text-yellow-900 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <table className="min-w-full border">
                <thead className="bg-gray-50">
                <tr>
                    <th className="border px-4 py-2 text-left">Prefix</th>
                    <th className="border px-4 py-2 text-left">Description</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Created</th>
                    <th className="border px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {keysQuery.data?.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-mono text-sm">{key.prefix}</td>
                        <td className="border px-4 py-2">{key.description}</td>
                        <td className="border px-4 py-2">
                            {key.is_active ? (
                                <span className="text-green-600">Active</span>
                            ) : (
                                <span className="text-red-600">Revoked</span>
                            )}
                        </td>
                        <td className="border px-4 py-2">
                            {new Date(key.created_at).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2 text-right">
                            {key.is_active && (
                                <button
                                    onClick={() => {
                                        if (confirm("Revoke this API key?")) {
                                            revokeKey.mutate(key.id);
                                        }
                                    }}
                                    className="text-red-600 hover:underline"
                                >
                                    Revoke
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
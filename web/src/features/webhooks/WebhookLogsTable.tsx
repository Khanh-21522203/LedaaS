import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

interface WebhookDelivery {
    id: string;
    event_id: string;
    endpoint_url: string;
    status: string;
    http_status: number;
    attempt: number;
    last_attempt_at: string;
    error_message?: string;
}

export function WebhookLogsTable({ ledgerID }: { ledgerID: string }) {
    const query = useQuery({
        queryKey: ["webhook-logs", ledgerID],
        queryFn: async () => {
            const res = await api.get<WebhookDelivery[]>(`/ledgers/${ledgerID}/webhook-deliveries`);
            return res.data;
        },
    });

    if (query.isLoading) {
        return <div className="p-6">Loading webhook logs...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Webhook Logs</h1>
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                <tr>
                    <th className="border px-4 py-2 text-left">Event ID</th>
                    <th className="border px-4 py-2 text-left">Endpoint</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">HTTP</th>
                    <th className="border px-4 py-2 text-left">Attempt</th>
                    <th className="border px-4 py-2 text-left">Last Attempt</th>
                </tr>
                </thead>
                <tbody>
                {query.data?.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-mono text-xs">{log.event_id.slice(0, 8)}</td>
                        <td className="border px-4 py-2">{log.endpoint_url}</td>
                        <td className="border px-4 py-2">
                <span
                    className={
                        log.status === "success"
                            ? "text-green-600"
                            : log.status === "retryable_error"
                                ? "text-yellow-600"
                                : "text-red-600"
                    }
                >
                  {log.status}
                </span>
                        </td>
                        <td className="border px-4 py-2">{log.http_status || "-"}</td>
                        <td className="border px-4 py-2">{log.attempt}</td>
                        <td className="border px-4 py-2">
                            {new Date(log.last_attempt_at).toLocaleString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
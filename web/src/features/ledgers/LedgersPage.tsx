import { useState } from "react";
import { useLedgers, useCreateLedger } from "../../api/ledgers";

export function LedgersPage() {
    const ledgersQuery = useLedgers();
    const createLedger = useCreateLedger();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [currency, setCurrency] = useState("USD");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        createLedger.mutate(
            {
                project_id: "default-project-id", // TODO: Get from context
                name,
                code,
                currency,
            },
            {
                onSuccess: () => {
                    setShowForm(false);
                    setName("");
                    setCode("");
                },
            }
        );
    }

    if (ledgersQuery.isLoading) {
        return <div className="p-6">Loading ledgers...</div>;
    }

    return (
        <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ledgers</h1>
            <button
    onClick={() => setShowForm(!showForm)}
    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
        Create Ledger
    </button>
    </div>

    {showForm && (
        <form onSubmit={onSubmit} className="mb-6 space-y-4 rounded border p-4">
    <div>
        <label className="block text-sm font-medium">Name</label>
        <input
        className="mt-1 block w-full rounded border px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Production"
        required
        />
        </div>
        <div>
        <label className="block text-sm font-medium">Code</label>
            <input
        className="mt-1 block w-full rounded border px-3 py-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="production"
        required
        />
        </div>
        <div>
        <label className="block text-sm font-medium">Currency</label>
            <input
        className="mt-1 block w-full rounded border px-3 py-2"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        placeholder="USD"
        required
        />
        </div>
        <div className="flex gap-2">
    <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        disabled={createLedger.isPending}
            >
            Create
            </button>
            <button
        type="button"
        onClick={() => setShowForm(false)}
        className="rounded border px-4 py-2 hover:bg-gray-50"
            >
            Cancel
            </button>
            </div>
            </form>
    )}

    <table className="min-w-full border">
    <thead className="bg-gray-50">
    <tr>
        <th className="border px-4 py-2 text-left">Name</th>
        <th className="border px-4 py-2 text-left">Code</th>
        <th className="border px-4 py-2 text-left">Currency</th>
        <th className="border px-4 py-2 text-left">Created</th>
        </tr>
        </thead>
        <tbody>
        {ledgersQuery.data?.map((ledger) => (
                <tr key={ledger.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{ledger.name}</td>
                <td className="border px-4 py-2">{ledger.code}</td>
                <td className="border px-4 py-2">{ledger.currency}</td>
                <td className="border px-4 py-2">
                {new Date(ledger.created_at).toLocaleDateString()}
                </td>
                </tr>
))}
    </tbody>
    </table>
    </div>
);
}
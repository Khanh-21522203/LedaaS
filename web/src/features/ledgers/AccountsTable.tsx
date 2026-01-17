import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

interface Account {
    id: string;
    code: string;
    name: string;
    type: string;
    balance: string;
}

export function AccountsTable({ ledgerID }: { ledgerID: string }) {
    const query = useQuery({
        queryKey: ["accounts", ledgerID],
        queryFn: async () => {
            const res = await api.get<Account[]>(`/ledgers/${ledgerID}/accounts`);
            return res.data;
        },
    });

    if (query.isLoading) {
        return <div className="p-6">Loading accounts...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Accounts</h1>
            <table className="min-w-full border">
                <thead className="bg-gray-50">
                <tr>
                    <th className="border px-4 py-2 text-left">Code</th>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Type</th>
                    <th className="border px-4 py-2 text-right">Balance</th>
                </tr>
                </thead>
                <tbody>
                {query.data?.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-mono">{account.code}</td>
                        <td className="border px-4 py-2">{account.name}</td>
                        <td className="border px-4 py-2 capitalize">{account.type}</td>
                        <td className="border px-4 py-2 text-right font-mono">
                            {parseFloat(account.balance).toFixed(2)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
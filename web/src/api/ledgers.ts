import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { Ledger } from "../types";

export function useLedgers() {
    return useQuery({
        queryKey: ["ledgers"],
        queryFn: async () => {
            const res = await api.get<Ledger[]>("/ledgers");
            return res.data;
        },
    });
}

export function useCreateLedger() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: {
            project_id: string;
            name: string;
            code: string;
            currency: string;
        }) => {
            const res = await api.post<Ledger>("/ledgers", input);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ledgers"] });
        },
    });
}
import type { ReactNode } from "react";

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (row: T) => ReactNode;
    className?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
}

export function Table<T>({ data, columns, keyField, loading, emptyMessage = "No data available", className = "" }: TableProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex items-center space-x-3 text-gray-500">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
                <thead>
                    <tr className="bg-gray-50">
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                scope="col"
                                className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${column.className || ""}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((row) => (
                        <tr key={String(row[keyField])} className="transition-colors hover:bg-gray-50 border-b border-gray-200">
                            {columns.map((column) => (
                                <td
                                    key={`${String(row[keyField])}-${String(column.key)}`}
                                    className={`px-4 py-3 text-sm text-gray-900 ${column.className || ""}`}
                                >
                                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[String(column.key)])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

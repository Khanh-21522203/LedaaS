export type Status = "success" | "warning" | "error" | "info" | "neutral";

export interface StatusBadgeProps {
    status: Status;
    children: React.ReactNode;
}

const statusStyles = {
    success: {
        bg: "bg-green-50",
        text: "text-green-700",
        dot: "bg-green-500",
    },
    warning: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
    },
    error: {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
    },
    info: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",
    },
    neutral: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        dot: "bg-gray-500",
    },
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
    const style = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {children}
        </span>
    );
}

import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "bordered" | "elevated";
}

export function Card({ variant = "default", className = "", children }: CardProps) {
    const variants = {
        default: "bg-white",
        bordered: "bg-white border border-gray-200",
        elevated: "bg-white shadow-lg",
    };

    return (
        <div className={`rounded-lg ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ className = "", children }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`border-t border-gray-200 px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

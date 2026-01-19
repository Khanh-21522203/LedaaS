import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const errorId = error ? `${inputId}-error` : undefined;
        const helperId = helperText ? `${inputId}-helper` : undefined;

        return (
            <div className="space-y-1">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
                    className={`
                        block w-full rounded-md border-gray-300 shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border"}
                        px-3 py-2 text-sm
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p id={errorId} className="text-sm text-red-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={helperId} className="text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

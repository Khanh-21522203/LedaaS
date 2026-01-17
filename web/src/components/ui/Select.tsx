import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = "", id, helperText, ...props }, ref) => {
        const generatedId = useId();
        const selectId = id || generatedId;
        const errorId = error ? `${selectId}-error` : undefined;
        const helperId = helperText ? `${selectId}-helper` : undefined;

        return (
            <div className="space-y-1">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
                    className={`
                        block w-full rounded-md border-gray-300 shadow-sm
                        focus:border-blue-500 focus:ring-blue-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border"}
                        px-3 py-2 text-sm
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
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

Select.displayName = "Select";

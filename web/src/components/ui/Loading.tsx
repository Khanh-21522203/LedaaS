export function Loading({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-8 w-8",
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <svg className={`animate-spin text-blue-600 ${sizes[size]}`} viewBox="0 0 24 24" fill="none">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            {text && <span className="text-sm text-gray-600">{text}</span>}
        </div>
    );
}

export function PageLoading() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
                <Loading size="lg" />
                <p className="mt-4 text-sm text-gray-500">Loading...</p>
            </div>
        </div>
    );
}

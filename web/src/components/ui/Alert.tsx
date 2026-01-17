export type AlertVariant = "info" | "warning" | "error" | "success";

export interface AlertProps {
    variant: AlertVariant;
    title?: string;
    children: React.ReactNode;
    onDismiss?: () => void;
}

const alertStyles = {
    info: {
        container: "bg-blue-50 border-blue-200",
        icon: "text-blue-500",
        title: "text-blue-800",
        content: "text-blue-700",
    },
    warning: {
        container: "bg-yellow-50 border-yellow-200",
        icon: "text-yellow-500",
        title: "text-yellow-800",
        content: "text-yellow-700",
    },
    error: {
        container: "bg-red-50 border-red-200",
        icon: "text-red-500",
        title: "text-red-800",
        content: "text-red-700",
    },
    success: {
        container: "bg-green-50 border-green-200",
        icon: "text-green-500",
        title: "text-green-800",
        content: "text-green-700",
    },
};

const icons = {
    info: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    warning: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    error: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    success: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
};

export function Alert({ variant, title, children, onDismiss }: AlertProps) {
    const style = alertStyles[variant];

    return (
        <div className={`rounded-lg border p-4 ${style.container}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${style.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        {icons[variant]}
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${style.title}`}>
                            {title}
                        </h3>
                    )}
                    <div className={title ? "mt-1 text-sm" : "text-sm"}>
                        <p className={style.content}>{children}</p>
                    </div>
                </div>
                {onDismiss && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onDismiss}
                            className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.icon} hover:opacity-75`}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

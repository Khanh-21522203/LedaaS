import { useState } from "react";
import { Input, Button } from "../../components/ui";

export function SettingsPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Success Alert */}
            {showSuccess && (
                <div className="mt-4 rounded-md bg-green-50 p-4">
                    <p className="text-sm text-green-800">Settings saved successfully</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Profile Settings */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                </div>
                <div className="border-t border-gray-200 p-6">
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <Input
                                id="full-name"
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                required
                                helperText="Your display name"
                            />
                        </div>

                        <div>
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                helperText="Your email address"
                                disabled
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                isLoading={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* API Configuration */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
                </div>
                <div className="border-t border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Base URL
                        </label>
                        <input
                            type="text"
                            value="/api"
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            API endpoint is configured by application
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Authentication Method
                        </label>
                        <input
                            type="text"
                            value="JWT Token (Session Cookie)"
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Dashboard APIs use JWT cookie for authentication
                        </p>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">About</h2>
                </div>
                <div className="border-t border-gray-200 p-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Application</span>
                            <span className="font-medium text-gray-900">LaaS (Ledger as a Service)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Version</span>
                            <span className="font-medium text-gray-900">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Backend</span>
                            <span className="font-medium text-gray-900">Go</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Frontend</span>
                            <span className="font-medium text-gray-900">React + TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

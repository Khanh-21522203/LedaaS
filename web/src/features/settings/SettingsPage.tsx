import { useState } from "react";
import { Card, CardBody, Input, Button, Alert } from "../../components/ui";

export function SettingsPage() {
    const [email, setEmail] = useState("admin@laas.com");
    const [fullName, setFullName] = useState("Admin User");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
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
                <Alert variant="success" title="Settings saved successfully">
                    Your changes have been saved.
                </Alert>
            )}

            {/* Profile Settings */}
            <Card variant="bordered">
                <CardBody className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                        <p className="text-sm text-gray-500">
                            Update your personal information
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <Input
                                id="full-name"
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
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
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                isLoading={isSaving}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            {/* API Configuration */}
            <Card variant="bordered">
                <CardBody className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
                        <p className="text-sm text-gray-500">
                            Configure your API settings
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Base URL
                            </label>
                            <input
                                type="text"
                                value="/api"
                                disabled
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                API endpoint is configured by the application
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Authentication Method
                            </label>
                            <input
                                type="text"
                                value="Bearer Token (API Key)"
                                disabled
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* About */}
            <Card variant="bordered">
                <CardBody className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">About</h2>
                    </div>

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
                </CardBody>
            </Card>
        </div>
    );
}

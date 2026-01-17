import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui";
import { logger } from "../../utils/logger";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        logger.log("[LOGIN_PAGE] 🚀 Form submitted with email:", email);

        try {
            logger.log("[LOGIN_PAGE] Calling login() from AuthContext...");
            const success = await login(email, password);
            logger.log("[LOGIN_PAGE] login() returned:", success);
            
            if (success) {
                logger.log("[LOGIN_PAGE] ✓ Login successful! Navigating to /ledgers...");
                navigate("/ledgers");
                logger.log("[LOGIN_PAGE] ✓ Navigation triggered");
            } else {
                logger.error("[LOGIN_PAGE] ✗ Login returned false");
                setError("Authentication failed. Please try again.");
            }
        } catch (err) {
            logger.error("[LOGIN_PAGE] ✗ Exception caught:", err);
            if (err instanceof AxiosError) {
                logger.error("[LOGIN_PAGE] Axios error:", {
                    message: err.message,
                    status: err.response?.status,
                    data: err.response?.data
                });
                setError(err.response?.data?.error || err.response?.data?.message || "Invalid credentials. Please check your email and password.");
            } else {
                logger.error("[LOGIN_PAGE] Non-Axios error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
            logger.log("[LOGIN_PAGE] Loading state set to false");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    {/* Logo */}
                    <div className="text-center">
                        <svg className="mx-auto w-12 h-12 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2H7a2 2 0 00-2 2v14a2 2 0 002 2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">Sign in to LaaS</h1>
                        <p className="mt-2 text-sm text-gray-500">Enter your credentials to access your ledgers</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <Input
                                id="email"
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="ml-1 text-indigo-600 font-semibold hover:underline focus:outline-none"
                            >
                                Create account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

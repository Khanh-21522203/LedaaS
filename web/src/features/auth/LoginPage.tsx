import { useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await api.post("/auth/login", { email, password });
            navigate("/");
        } catch {
            setError("Invalid credentials");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm space-y-4 rounded bg-white p-6 shadow"
            >
                <h1 className="text-lg font-semibold">Sign in to LaaS</h1>
                {error && <div className="text-sm text-red-600">{error}</div>}

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        className="mt-1 block w-full rounded border px-3 py-2"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        className="mt-1 block w-full rounded border px-3 py-2"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
}
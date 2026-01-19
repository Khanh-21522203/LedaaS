import { useNavigate } from "react-router-dom";

export function UnauthenticatedPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                        <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Authentication Required</h1>
                    <p className="text-xl text-gray-600">
                        Please sign in or create an account to access your ledgers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate("/login")}
                        className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-200 bg-white p-10 transition-all hover:border-indigo-500 hover:shadow-xl hover:scale-105"
                    >
                        <div className="mb-6 rounded-full bg-indigo-100 p-4 group-hover:bg-indigo-200 transition-colors">
                            <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h3>
                        <p className="text-gray-600">Access your existing account</p>
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-purple-200 bg-white p-10 transition-all hover:border-purple-500 hover:shadow-xl hover:scale-105"
                    >
                        <div className="mb-6 rounded-full bg-purple-100 p-4 group-hover:bg-purple-200 transition-colors">
                            <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Register</h3>
                        <p className="text-gray-600">Start managing your ledgers today</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

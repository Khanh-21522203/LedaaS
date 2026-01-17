import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
    { path: "/ledgers", label: "Ledgers" },
];

export function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xl font-bold text-gray-900">LaaS</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                                        location.pathname.startsWith(item.path)
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button
                            onClick={handleLogout}
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Sign out
                        </button>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 border-t border-gray-200 pb-3 pt-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block border-l-4 px-3 py-2 text-base font-medium ${
                                    location.pathname.startsWith(item.path)
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="block w-full border-l-4 border-transparent px-3 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

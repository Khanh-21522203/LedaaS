import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RequireAuthProps {
    children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
    const { isAuthenticated, isLoading, hasAuthFlag } = useAuth();
    const location = useLocation();

    if (!hasAuthFlag) {
        return <Navigate to="/unauthenticated" replace state={{ from: location }} />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }
 
    if (!isAuthenticated) {
        return <Navigate to="/unauthenticated" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}

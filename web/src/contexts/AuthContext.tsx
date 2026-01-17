import { createContext, useContext, useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { api, apiClient } from "../api/client";
import { logger } from "../utils/logger";
import type { UserResponse } from "../types";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserResponse | null;
    hasAuthFlag: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<UserResponse | null>;
    clearAuth: () => void;
}

const AUTH_FLAG_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthFlag(): boolean {
    return localStorage.getItem(AUTH_FLAG_KEY) === 'true';
}

function setAuthFlag(value: boolean): void {
    if (value) {
        localStorage.setItem(AUTH_FLAG_KEY, 'true');
    } else {
        localStorage.removeItem(AUTH_FLAG_KEY);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [hasAuthFlag, setHasAuthFlag] = useState(getAuthFlag());
    
    // Use a ref to track clearAuth function for the interceptor
    const clearAuthRef = useRef<(() => void) | null>(null);

    const clearAuth = () => {
        setUser(null);
        setIsAuthenticated(false);
        setAuthFlag(false);
        setHasAuthFlag(false);
    };

    // Store the clearAuth function in the ref for the interceptor
    clearAuthRef.current = clearAuth;

    const checkAuth = async (): Promise<UserResponse | null> => {
        setIsLoading(true);
        try {
            logger.log("[CHECK_AUTH] Starting auth check...");
            const currentUser = await apiClient.getCurrentUser();
            logger.log("[CHECK_AUTH] ✓ API call successful, user data:", currentUser);
            
            logger.log("[CHECK_AUTH] Setting state: user, isAuthenticated=true, flags=true");
            setUser(currentUser);
            setIsAuthenticated(true);
            setAuthFlag(true);
            setHasAuthFlag(true);
            setIsLoading(false);
            
            logger.log("[CHECK_AUTH] ✓ State updated successfully");
            return currentUser;
        } catch (err) {
            logger.error("[CHECK_AUTH] ✗ Failed to get user:");
            if (err instanceof AxiosError) {
                logger.error("[CHECK_AUTH] Error details:", {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    url: err.config?.url,
                    message: err.message
                });
            }
            clearAuth();
            setIsLoading(false);
            return null;
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            logger.log("[LOGIN] Step 1: Calling login API...");
            await apiClient.login(email, password);
            logger.log("[LOGIN] Step 1: ✓ Login API call successful");
            
            logger.log("[LOGIN] Step 2: Setting auth flag...");
            setAuthFlag(true);
            setHasAuthFlag(true);
            logger.log("[LOGIN] Step 2: ✓ Auth flag set to true");
            
            logger.log("[LOGIN] Step 3: Fetching user profile via checkAuth()...");
            const user = await checkAuth();
            logger.log("[LOGIN] Step 3: checkAuth() returned:", user);
            
            if (user !== null) {
                logger.log("[LOGIN] Step 4: ✓ SUCCESS - User authenticated:", {
                    id: user.id,
                    email: user.email,
                    org: user.organization_id
                });
                return true;
            } else {
                logger.error("[LOGIN] Step 4: ✗ FAILED - checkAuth returned null");
                return false;
            }
        } catch (err) {
            logger.error("[LOGIN] ✗ EXCEPTION during login:", err);
            if (err instanceof AxiosError) {
                logger.error("[LOGIN] Axios error details:", {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    url: err.config?.url
                });
            }
            clearAuth();
            throw err;
        }
    };

    const logout = async () => {
        await apiClient.logout();
        clearAuth();
    };

    // Set up global 401 interceptor
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error instanceof AxiosError && error.response?.status === 401) {
                    const url = error.config?.url || '';
                    // Only clear auth for authentication endpoints
                    // Don't clear for other endpoints (like /ledgers) - let components handle those
                    if (url.includes('/auth/me') || url.includes('/auth/check')) {
                        logger.error("401 on auth endpoint - clearing auth state");
                        clearAuthRef.current?.();
                    } else {
                        logger.warn("401 on non-auth endpoint:", url, "- not clearing auth state");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    // Check auth status on mount only if flag is present
    useEffect(() => {
        if (getAuthFlag()) {
            checkAuth().catch(() => {
                // Auth check failed, state already cleared by checkAuth
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, hasAuthFlag, login, logout, checkAuth, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

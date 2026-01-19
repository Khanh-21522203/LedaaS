import { createContext, useContext, useState, useEffect } from "react";
import { apiClientWithKey } from "../api/client";

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string) => void;
    clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'selected_api_key';

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
    const [apiKey, setApiKeyState] = useState<string | null>(() => {
        return sessionStorage.getItem(API_KEY_STORAGE_KEY);
    });

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        sessionStorage.setItem(API_KEY_STORAGE_KEY, key);
        // Update the axios instance with the new key
        apiClientWithKey.defaults.headers.common['Authorization'] = `Bearer ${key}`;
    };

    const clearApiKey = () => {
        setApiKeyState(null);
        sessionStorage.removeItem(API_KEY_STORAGE_KEY);
        delete apiClientWithKey.defaults.headers.common['Authorization'];
    };

    // Set the Authorization header on mount if key exists
    useEffect(() => {
        if (apiKey) {
            apiClientWithKey.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
        }
    }, [apiKey]);

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
}

export function useApiKey() {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error("useApiKey must be used within an ApiKeyProvider");
    }
    return context;
}

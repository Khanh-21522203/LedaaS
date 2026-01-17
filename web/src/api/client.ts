import axios, { AxiosError } from "axios";
import type {
  PostTransactionRequest,
  PostTransactionResponse,
  Account,
  Transaction,
  Ledger,
  ApiKey,
  UserResponse,
  WebhookDeliveryResponse,
  WebhookEndpointResponse,
  AccountResponse,
  Event,
  BalanceSummary,
  BalanceHistory,
} from "../types";

/**
 * Base API client configured for the LedaaS backend
 * Backend is expected at /api proxy (configured in vite.config.ts)
 */
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API client for API key authenticated requests (Authorization header)
 * Used for ledger operations (transactions, accounts, events, webhooks)
 */
export const apiClientWithKey = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor for global error handling
 * Note: 401 errors are handled by AuthContext checkAuth() - no automatic redirect
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClientWithKey.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * API client with typed methods matching backend routes
 * 
 * Backend now has two auth mechanisms:
 * 1. JWT Cookie Auth (Dashboard APIs) - for user management
 * 2. API Key Auth (Ledger APIs) - for ledger operations
 */
export const apiClient = {
  // =========================================================================
  // Authentication APIs (No auth required)
  // =========================================================================

  /**
   * Register a new user
   * Backend: POST /api/auth/register
   */
  register: async (data: {
    email: string;
    password: string;
    organization_name: string;
  }): Promise<{ user_id: string; organization_id: string }> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * Login with email and password
   * Backend: POST /api/auth/login
   * Sets session cookie
   */
  login: async (email: string, password: string): Promise<void> => {
    await api.post("/auth/login", { email, password });
  },

  /**
   * Get current user info
   * Backend: GET /api/auth/me
   * Auth: JWT cookie
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/auth/me");
    return response.data;
  },

  /**
   * Logout
   * Backend: Clear session cookie
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // =========================================================================
  // Dashboard Ledger Management APIs (JWT auth via cookie)
  // =========================================================================

  /**
   * Get all ledgers for current user
   * Backend: GET /api/ledgers
   * Auth: JWT cookie
   */
  getLedgers: async (): Promise<Ledger[]> => {
    const response = await api.get<Ledger[]>("/ledgers");
    return response.data;
  },

  /**
   * Get a specific ledger
   * Backend: GET /api/ledgers?id={id}
   * Auth: JWT cookie
   */
  getLedger: async (id: string): Promise<Ledger> => {
    const response = await api.get<Ledger>(`/ledgers?id=${id}`);
    return response.data;
  },

  /**
   * Create a new ledger
   * Backend: POST /api/ledgers
   * Auth: JWT cookie
   */
  createLedger: async (data: {
    project_id: string;
    name: string;
    code: string;
    currency: string;
  }): Promise<Ledger> => {
    const response = await api.post<Ledger>("/ledgers", data);
    return response.data;
  },

  // =========================================================================
  // Dashboard API Key Management APIs (JWT auth via cookie)
  // =========================================================================

  /**
   * Get all API keys for a ledger
   * Backend: GET /api/ledgers/api-keys?ledger_id={id}
   * Auth: JWT cookie
   */
  getApiKeys: async (ledgerId: string): Promise<ApiKey[]> => {
    const response = await api.get<ApiKey[]>(`/ledgers/api-keys?ledger_id=${ledgerId}`);
    return response.data;
  },

  /**
   * Create a new API key
   * Backend: POST /api/ledgers/api-keys?ledger_id={id}
   * Auth: JWT cookie
   */
  createApiKey: async (
    ledgerId: string,
    description: string
  ): Promise<{ raw_key: string }> => {
    const response = await api.post<{ raw_key: string }>(
      `/ledgers/api-keys?ledger_id=${ledgerId}`,
      { description }
    );
    return response.data;
  },

  /**
   * Revoke an API key
   * Backend: POST /api/api-keys/revoke?id={id}
   * Auth: JWT cookie
   */
  revokeApiKey: async (keyId: string): Promise<void> => {
    await api.post(`/api-keys/revoke?id=${keyId}`);
  },

  // =========================================================================
  // Transaction APIs (API key auth via Authorization header)
  // =========================================================================

  /**
   * Post a transaction to the ledger
   * Backend: POST /v1/transactions
   * Auth: API key in Authorization header (Bearer token)
   */
  postTransaction: async (
    request: PostTransactionRequest
  ): Promise<PostTransactionResponse> => {
    const response = await apiClientWithKey.post<PostTransactionResponse>(
      "/v1/transactions",
      request
    );
    return response.data;
  },

  /**
   * Get all transactions for a ledger
   * Backend: GET /v1/transactions
   * Auth: API key in Authorization header
   */
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClientWithKey.get<Transaction[]>("/v1/transactions");
    return response.data;
  },

  /**
   * Get a specific transaction
   * Backend: GET /v1/transactions?id={id}
   * Auth: API key in Authorization header
   */
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await apiClientWithKey.get<Transaction>(`/v1/transactions?id=${id}`);
    return response.data;
  },

  // =========================================================================
  // Account APIs (API key auth via Authorization header)
  // =========================================================================

  /**
   * Get all accounts for current ledger
   * Backend: GET /v1/accounts
   * Auth: API key in Authorization header
   */
  getAccounts: async (): Promise<Account[]> => {
    const response = await apiClientWithKey.get<Account[]>("/v1/accounts");
    return response.data;
  },

  /**
   * Get a specific account by code
   * Backend: GET /v1/accounts?code={code}
   * Auth: API key in Authorization header
   */
  getAccount: async (code: string): Promise<AccountResponse> => {
    const response = await apiClientWithKey.get<AccountResponse>(`/v1/accounts?code=${code}`);
    return response.data;
  },

  /**
   * Create a new account
   * Backend: POST /v1/accounts
   * Auth: API key in Authorization header
   */
  createAccount: async (data: {
    code: string;
    name: string;
    type: string;
  }): Promise<AccountResponse> => {
    const response = await apiClientWithKey.post<AccountResponse>("/v1/accounts", data);
    return response.data;
  },

  // =========================================================================
  // Event APIs (API key auth via Authorization header)
  // =========================================================================

  /**
   * Get all events for current ledger
   * Backend: GET /v1/events
   * Auth: API key in Authorization header
   */
  getEvents: async (): Promise<Event[]> => {
    const response = await apiClientWithKey.get<Event[]>("/v1/events");
    return response.data;
  },

  /**
   * Get a specific event
   * Backend: GET /v1/events?id={id}
   * Auth: API key in Authorization header
   */
  getEvent: async (id: string): Promise<Event> => {
    const response = await apiClientWithKey.get<Event>(`/v1/events?id=${id}`);
    return response.data;
  },

  // =========================================================================
  // Balance APIs (API key auth via Authorization header)
  // =========================================================================

  /**
   * Get balance summary for current ledger
   * Backend: GET /v1/balance/summary
   * Auth: API key in Authorization header
   */
  getBalanceSummary: async (): Promise<BalanceSummary> => {
    const response = await apiClientWithKey.get<BalanceSummary>("/v1/balance/summary");
    return response.data;
  },

  /**
   * Get balance history for an account
   * Backend: GET /v1/accounts/balance-history
   * Auth: API key in Authorization header
   */
  getAccountBalanceHistory: async (params?: {
    account_code?: string;
    from?: string;
    to?: string;
  }): Promise<BalanceHistory[]> => {
    const queryParams = new URLSearchParams();
    if (params?.account_code) queryParams.append("account_code", params.account_code);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);
    const response = await apiClientWithKey.get<BalanceHistory[]>(
      `/v1/accounts/balance-history?${queryParams.toString()}`
    );
    return response.data;
  },

  // =========================================================================
  // Webhook Management (API key auth via Authorization header)
  // =========================================================================

  /**
   * Get webhook endpoints for current ledger
   * Backend: GET /v1/webhook-endpoints
   * Auth: API key in Authorization header
   */
  getWebhookEndpoints: async (): Promise<WebhookEndpointResponse[]> => {
    const response = await apiClientWithKey.get<WebhookEndpointResponse[]>(
      "/v1/webhook-endpoints"
    );
    return response.data;
  },

  /**
   * Create a new webhook endpoint
   * Backend: POST /v1/webhook-endpoints
   * Auth: API key in Authorization header
   */
  createWebhookEndpoint: async (data: {
    url: string;
  }): Promise<{ id: string; url: string; secret: string }> => {
    const response = await apiClientWithKey.post<{
      id: string;
      url: string;
      secret: string;
    }>("/v1/webhook-endpoints", data);
    return response.data;
  },

  /**
   * Get webhook delivery logs for current ledger
   * Backend: GET /v1/webhook-deliveries
   * Auth: API key in Authorization header
   */
  getWebhookDeliveries: async (
    limit?: number
  ): Promise<WebhookDeliveryResponse[]> => {
    const response = await apiClientWithKey.get<WebhookDeliveryResponse[]>(
      `/v1/webhook-deliveries${limit ? `?limit=${limit}` : ""}`
    );
    return response.data;
  },
};

// Export the base api instance for custom calls
export default api;

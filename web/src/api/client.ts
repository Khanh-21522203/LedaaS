import axios, { AxiosError } from "axios";
import type {
  PostTransactionRequest,
  PostTransactionResponse,
  Account,
  Transaction,
  Ledger,
  ApiKey,
  WebhookDelivery,
  WebhookEndpoint,
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
 * Response interceptor for global error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Redirect to login on 401 Unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * API client with typed methods matching backend routes
 * 
 * IMPORTANT: Most routes are NOT yet implemented in the backend.
 * Only POST /v1/transactions is currently available.
 * The frontend should gracefully handle 404s for unimplemented routes.
 */
export const apiClient = {
  // =========================================================================
  // Transaction API (IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Post a transaction to the ledger
   * Backend: POST /v1/transactions
   * Auth: Requires API key in Authorization header (Bearer token)
   */
  postTransaction: async (
    request: PostTransactionRequest
  ): Promise<PostTransactionResponse> => {
    const response = await api.post<PostTransactionResponse>(
      "/v1/transactions",
      request
    );
    return response.data;
  },

  // =========================================================================
  // Account API (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Get all accounts for a ledger
   * Backend: GET /v1/ledgers/:ledgerId/accounts (NOT IMPLEMENTED)
   */
  getAccounts: async (ledgerId: string): Promise<Account[]> => {
    try {
      const response = await api.get<Account[]>(
        `/v1/ledgers/${ledgerId}/accounts`
      );
      return response.data;
    } catch (error) {
      // Return mock data if endpoint not implemented
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Accounts endpoint not yet implemented - using mock data");
        return [
          {
            id: "acc_001",
            ledger_id: ledgerId,
            code: "1000",
            name: "Cash",
            type: "asset",
            balance: "50000.00",
            created_at: new Date().toISOString(),
          },
          {
            id: "acc_002",
            ledger_id: ledgerId,
            code: "1100",
            name: "Accounts Receivable",
            type: "asset",
            balance: "25000.00",
            created_at: new Date().toISOString(),
          },
          {
            id: "acc_003",
            ledger_id: ledgerId,
            code: "2000",
            name: "Accounts Payable",
            type: "liability",
            balance: "15000.00",
            created_at: new Date().toISOString(),
          },
          {
            id: "acc_004",
            ledger_id: ledgerId,
            code: "3000",
            name: "Owner's Equity",
            type: "equity",
            balance: "60000.00",
            created_at: new Date().toISOString(),
          },
          {
            id: "acc_005",
            ledger_id: ledgerId,
            code: "4000",
            name: "Revenue",
            type: "revenue",
            balance: "75000.00",
            created_at: new Date().toISOString(),
          },
          {
            id: "acc_006",
            ledger_id: ledgerId,
            code: "5000",
            name: "Operating Expenses",
            type: "expense",
            balance: "15000.00",
            created_at: new Date().toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  /**
   * Get a specific account
   * Backend: GET /v1/ledgers/:ledgerId/accounts/:accountId (NOT IMPLEMENTED)
   */
  getAccount: async (ledgerId: string, accountId: string): Promise<Account> => {
    const response = await api.get<Account>(
      `/v1/ledgers/${ledgerId}/accounts/${accountId}`
    );
    return response.data;
  },

  // =========================================================================
  // Transaction Query API (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Get all transactions for a ledger
   * Backend: GET /v1/ledgers/:ledgerId/transactions (NOT IMPLEMENTED)
   */
  getTransactions: async (ledgerId: string): Promise<Transaction[]> => {
    try {
      const response = await api.get<Transaction[]>(
        `/v1/ledgers/${ledgerId}/transactions`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Transactions endpoint not yet implemented - using mock data");
        return [
          {
            id: "txn_001",
            ledger_id: ledgerId,
            external_id: "invoice-2026-001",
            amount: "1500.00",
            currency: "USD",
            occurred_at: new Date(Date.now() - 3600000).toISOString(),
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "txn_002",
            ledger_id: ledgerId,
            external_id: "payment-2026-042",
            amount: "2500.00",
            currency: "USD",
            occurred_at: new Date(Date.now() - 7200000).toISOString(),
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  /**
   * Get a specific transaction
   * Backend: GET /v1/ledgers/:ledgerId/transactions/:transactionId (NOT IMPLEMENTED)
   */
  getTransaction: async (
    ledgerId: string,
    transactionId: string
  ): Promise<Transaction> => {
    const response = await api.get<Transaction>(
      `/v1/ledgers/${ledgerId}/transactions/${transactionId}`
    );
    return response.data;
  },

  // =========================================================================
  // Ledger Management API (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Get all ledgers for current user
   * Backend: GET /v1/ledgers (NOT IMPLEMENTED)
   */
  getLedgers: async (): Promise<Ledger[]> => {
    try {
      const response = await api.get<Ledger[]>("/v1/ledgers");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Ledgers endpoint not yet implemented - using mock data");
        return [
          {
            id: "1",
            project_id: "default-project",
            name: "Production Ledger",
            code: "production",
            currency: "USD",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            project_id: "default-project",
            name: "Development Ledger",
            code: "development",
            currency: "EUR",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  /**
   * Create a new ledger
   * Backend: POST /v1/ledgers (NOT IMPLEMENTED)
   */
  createLedger: async (data: {
    project_id: string;
    name: string;
    code: string;
    currency: string;
  }): Promise<Ledger> => {
    try {
      const response = await api.post<Ledger>("/v1/ledgers", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Create ledger endpoint not yet implemented - using mock");
        // Return mock created ledger
        return {
          id: "ledger_" + Date.now(),
          project_id: data.project_id,
          name: data.name,
          code: data.code,
          currency: data.currency,
          created_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  },

  // =========================================================================
  // API Key Management (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Get all API keys for a ledger
   * Backend: GET /v1/ledgers/:ledgerId/api-keys (NOT IMPLEMENTED)
   */
  getApiKeys: async (ledgerId: string): Promise<ApiKey[]> => {
    try {
      const response = await api.get<ApiKey[]>(
        `/v1/ledgers/${ledgerId}/api-keys`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("API keys endpoint not yet implemented - using mock data");
        return [
          {
            id: "key_001",
            ledger_id: ledgerId,
            key_hash: "hash1",
            prefix: "laas_test_abc123",
            description: "Test API Key",
            is_active: true,
            created_at: new Date().toISOString(),
            revoked_at: null,
          },
          {
            id: "key_002",
            ledger_id: ledgerId,
            key_hash: "hash2",
            prefix: "laas_prod_xyz789",
            description: "Production API Key",
            is_active: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            revoked_at: null,
          },
        ];
      }
      throw error;
    }
  },

  /**
   * Create a new API key
   * Backend: POST /v1/ledgers/:ledgerId/api-keys (NOT IMPLEMENTED)
   */
  createApiKey: async (
    ledgerId: string,
    description: string
  ): Promise<{ raw_key: string }> => {
    try {
      const response = await api.post<{ raw_key: string }>(
        `/v1/ledgers/${ledgerId}/api-keys`,
        { description }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Create API key endpoint not yet implemented - using mock");
        // Generate mock API key
        const randomKey = `laas_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        return { raw_key: randomKey };
      }
      throw error;
    }
  },

  /**
   * Revoke an API key
   * Backend: POST /v1/api-keys/:keyId/revoke (NOT IMPLEMENTED)
   */
  revokeApiKey: async (keyId: string): Promise<void> => {
    try {
      await api.post(`/v1/api-keys/${keyId}/revoke`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Revoke API key endpoint not yet implemented - mock success");
        // Mock success - do nothing
        return;
      }
      throw error;
    }
  },

  // =========================================================================
  // Webhook Management (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Get webhook endpoints for a ledger
   * Backend: GET /v1/ledgers/:ledgerId/webhooks (NOT IMPLEMENTED)
   */
  getWebhookEndpoints: async (ledgerId: string): Promise<WebhookEndpoint[]> => {
    try {
      const response = await api.get<WebhookEndpoint[]>(
        `/v1/ledgers/${ledgerId}/webhooks`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Webhook endpoints not yet implemented");
        return [];
      }
      throw error;
    }
  },

  /**
   * Get webhook delivery logs for a ledger
   * Backend: GET /v1/ledgers/:ledgerId/webhook-deliveries (NOT IMPLEMENTED)
   */
  getWebhookDeliveries: async (ledgerId: string): Promise<WebhookDelivery[]> => {
    try {
      const response = await api.get<WebhookDelivery[]>(
        `/v1/ledgers/${ledgerId}/webhook-deliveries`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Webhook deliveries endpoint not yet implemented - using mock data");
        return [
          {
            id: "delivery_001",
            event_id: "evt_" + Date.now(),
            webhook_endpoint_id: "endpoint_001",
            status: "success",
            attempt: 1,
            last_attempt_at: new Date().toISOString(),
            http_status: 200,
            error_message: null,
            created_at: new Date().toISOString(),
          },
          {
            id: "delivery_002",
            event_id: "evt_" + (Date.now() - 3600000),
            webhook_endpoint_id: "endpoint_001",
            status: "retryable_error",
            attempt: 2,
            last_attempt_at: new Date(Date.now() - 3600000).toISOString(),
            http_status: 500,
            error_message: "Internal server error",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  // =========================================================================
  // Authentication (NOT YET IMPLEMENTED in backend)
  // =========================================================================

  /**
   * Login with email and password
   * Backend: POST /auth/login (NOT IMPLEMENTED)
   */
  login: async (email: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await api.post<{ token: string }>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Login endpoint not yet implemented - using mock auth");
        // Mock successful login
        return { token: "mock-jwt-token-" + Date.now() };
      }
      throw error;
    }
  },

  /**
   * Logout
   * Backend: POST /auth/logout (NOT IMPLEMENTED)
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

// Export the base api instance for custom calls
export default api;
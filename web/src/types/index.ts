/**
 * Core domain types matching the Golang backend exactly
 * 
 * Database hierarchy: Organization → Project → Ledger → Accounts/Transactions
 */

// ============================================================================
// IAM Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface OrgUser {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'developer';
  created_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Ledger {
  id: string;
  project_id: string;
  name: string;
  code: string;
  currency: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  ledger_id: string;
  key_hash: string;
  prefix: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  revoked_at: string | null;
}

// ============================================================================
// Ledger Domain Types (matching backend/database schema exactly)
// ============================================================================

/**
 * Account types following standard accounting classification
 */
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

/**
 * Posting direction for double-entry accounting
 */
export type PostingDirection = 'debit' | 'credit';

/**
 * Account read model (projected from events)
 * Balance is stored as NUMERIC(38,10) in PostgreSQL
 */
export interface Account {
  id: string;
  ledger_id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: string; // IMPORTANT: String for precision, not number
  created_at: string;
}

/**
 * Transaction read model (projected from events)
 */
export interface Transaction {
  id: string;
  ledger_id: string;
  external_id: string | null;
  amount: string; // String for precision
  currency: string;
  occurred_at: string;
  created_at: string;
}

/**
 * Posting (journal entry line item)
 */
export interface Posting {
  id: string;
  ledger_id: string;
  transaction_id: string;
  account_id: string;
  amount: string; // String for precision
  direction: PostingDirection;
  created_at: string;
}

/**
 * Event (source of truth in event sourcing architecture)
 */
export interface Event {
  id: string;
  ledger_id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
  idempotency_key: string | null;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Posting input for transaction creation
 * Matches ledger.PostingInput in Go
 */
export interface PostingInput {
  account_code: string;
  direction: PostingDirection;
  amount: string; // String for precision (e.g., "100.50")
}

/**
 * Request to create a transaction via POST /v1/transactions
 * Matches ledger.PostTransactionRequest in Go
 */
export interface PostTransactionRequest {
  idempotency_key: string;
  external_id: string;
  currency: string;
  occurred_at: string; // ISO 8601 format
  postings: PostingInput[];
}

/**
 * Response from POST /v1/transactions
 * Matches ledger.PostTransactionResponse in Go
 */
export interface PostTransactionResponse {
  transaction_id: string;
  status: 'accepted';
}

/**
 * Authentication principal (from context after API key auth)
 * Matches auth.Principal in Go
 */
export interface Principal {
  api_key_id: string;
  organization_id: string;
  project_id: string;
  ledger_id: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookDeliveryStatus = 'success' | 'retryable_error' | 'non_retryable_error';

export interface WebhookEndpoint {
  id: string;
  ledger_id: string;
  url: string;
  secret: string;
  is_active: boolean;
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  event_id: string;
  webhook_endpoint_id: string;
  status: WebhookDeliveryStatus;
  attempt: number;
  last_attempt_at: string | null;
  http_status: number | null;
  error_message: string | null;
  created_at: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Error response from backend
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Validation error for transaction posting
 */
export interface ValidationError {
  field: string;
  message: string;
}

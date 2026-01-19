/**
 * Application-wide constants and enums
 */

export const ACCOUNT_TYPES = {
    ASSET: 'asset',
    LIABILITY: 'liability',
    EQUITY: 'equity',
    REVENUE: 'revenue',
    EXPENSE: 'expense',
} as const;

export const CURRENCIES = [
    { value: "VND", label: "VND - Vietnamese Dong" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "JPY", label: "Japanese Yen" },
] as const;

export const WEBHOOK_STATUSES = {
    SUCCESS: 'success',
    RETRYABLE_ERROR: 'retryable_error',
    NON_RETRYABLE_ERROR: 'non_retryable_error',
} as const;

export const AUTH_FLAG_KEY = 'isLoggedIn';

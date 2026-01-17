/**
 * Form validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    return { valid: true };
}

/**
 * Validate ledger code format (lowercase, hyphens allowed)
 */
export function isValidLedgerCode(code: string): boolean {
    const codeRegex = /^[a-z0-9-]+$/;
    return codeRegex.test(code);
}

/**
 * Validate account code format (alphanumeric)
 */
export function isValidAccountCode(code: string): boolean {
    const codeRegex = /^[A-Za-z0-9-_]+$/;
    return codeRegex.test(code);
}

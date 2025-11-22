/**
 * Token Manager Utility
 *
 * Handles JWT token operations:
 * - Decode JWT tokens
 * - Validate token expiration
 * - Extract token claims
 * - Token storage management
 *
 * Note: This is a basic implementation for development.
 * In production, use a library like jwt-decode for robust JWT handling.
 */

export interface JwtPayload {
  sub: string;          // Subject (user ID)
  email: string;        // User email
  role: string;         // User role
  iat: number;          // Issued at (timestamp)
  exp: number;          // Expiration (timestamp)
  [key: string]: any;   // Additional claims
}

export class TokenManager {
  /**
   * Decode JWT token
   * Warning: This does NOT verify the signature. Server-side verification is required.
   */
  static decode(token: string): JwtPayload | null {
    try {
      // JWT structure: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode payload (Base64URL)
      const payload = parts[1];
      const decodedPayload = this.base64UrlDecode(payload);
      return JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // Convert exp from seconds to milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  }

  /**
   * Check if token will expire soon (within buffer time)
   * @param bufferMinutes - Minutes before expiration to consider "expiring soon"
   */
  static isExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const bufferTime = bufferMinutes * 60 * 1000;

    return (expirationTime - currentTime) <= bufferTime;
  }

  /**
   * Get remaining time until expiration (in seconds)
   */
  static getRemainingTime(token: string): number {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return 0;
    }

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const remainingMs = Math.max(0, expirationTime - currentTime);

    return Math.floor(remainingMs / 1000);
  }

  /**
   * Extract user ID from token
   */
  static getUserId(token: string): string | null {
    const payload = this.decode(token);
    return payload?.sub ?? null;
  }

  /**
   * Extract user role from token
   */
  static getRole(token: string): string | null {
    const payload = this.decode(token);
    return payload?.role ?? null;
  }

  /**
   * Validate token structure (basic check)
   */
  static isValid(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Check if token is expired
    if (this.isExpired(token)) {
      return false;
    }

    return true;
  }

  /**
   * Store token in storage
   * @param token - JWT token
   * @param persistent - Use localStorage (true) or sessionStorage (false)
   */
  static store(token: string, key: string = 'auth-token', persistent: boolean = false): void {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(key, token);
  }

  /**
   * Retrieve token from storage
   * Checks both localStorage and sessionStorage
   */
  static retrieve(key: string = 'auth-token'): string | null {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }

  /**
   * Remove token from storage
   */
  static remove(key: string = 'auth-token'): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all tokens from storage
   */
  static clearAll(): void {
    const tokenKeys = ['auth-token', 'pythia-token', 'pythia-refresh-token'];
    tokenKeys.forEach(key => this.remove(key));
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Base64URL decode
   * JWT uses Base64URL encoding (RFC 4648)
   */
  private static base64UrlDecode(base64Url: string): string {
    // Replace URL-safe characters
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    base64 += padding;

    // Decode Base64
    try {
      return atob(base64);
    } catch (error) {
      throw new Error('Invalid Base64 string');
    }
  }
}

/**
 * Helper function to create a mock JWT token for testing
 * DO NOT USE IN PRODUCTION - tokens must be signed by the server
 */
export function createMockToken(payload: Partial<JwtPayload>): string {
  const header = { alg: 'HS256', typ: 'JWT' };

  const now = Math.floor(Date.now() / 1000);
  const defaultPayload: JwtPayload = {
    sub: payload.sub ?? '1',
    email: payload.email ?? 'user@example.com',
    role: payload.role ?? 'USER',
    iat: payload.iat ?? now,
    exp: payload.exp ?? (now + 3600), // 1 hour
    ...payload
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(defaultPayload));
  const signature = 'mock-signature';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

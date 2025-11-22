/**
 * Token Manager Tests
 *
 * Tests JWT token decoding, validation, and storage management
 */

import { TokenManager, JwtPayload, createMockToken } from './token-manager';

describe('TokenManager', () => {
  let validToken: string;
  let expiredToken: string;

  beforeEach(() => {
    const now = Math.floor(Date.now() / 1000);

    // Valid token (expires in 1 hour)
    validToken = createMockToken({
      sub: 'user-123',
      email: 'test@pythia.ai',
      role: 'ADMIN',
      iat: now,
      exp: now + 3600
    });

    // Expired token (expired 1 hour ago)
    expiredToken = createMockToken({
      sub: 'user-123',
      email: 'test@pythia.ai',
      role: 'USER',
      iat: now - 7200,
      exp: now - 3600
    });

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('decode()', () => {
    it('should decode valid JWT token', () => {
      const payload = TokenManager.decode(validToken);

      expect(payload).toBeTruthy();
      expect(payload?.sub).toBe('user-123');
      expect(payload?.email).toBe('test@pythia.ai');
      expect(payload?.role).toBe('ADMIN');
    });

    it('should return null for invalid token format', () => {
      const payload = TokenManager.decode('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for token with wrong number of parts', () => {
      const payload = TokenManager.decode('part1.part2');
      expect(payload).toBeNull();
    });

    it('should return null for empty string', () => {
      const payload = TokenManager.decode('');
      expect(payload).toBeNull();
    });
  });

  describe('isExpired()', () => {
    it('should return false for valid token', () => {
      expect(TokenManager.isExpired(validToken)).toBeFalse();
    });

    it('should return true for expired token', () => {
      expect(TokenManager.isExpired(expiredToken)).toBeTrue();
    });

    it('should return true for invalid token', () => {
      expect(TokenManager.isExpired('invalid-token')).toBeTrue();
    });

    it('should return true for token without exp claim', () => {
      const tokenWithoutExp = createMockToken({ exp: undefined as any });
      expect(TokenManager.isExpired(tokenWithoutExp)).toBeTrue();
    });
  });

  describe('isExpiringSoon()', () => {
    it('should return false for token expiring in > 5 minutes', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        sub: 'user-123',
        exp: now + 600 // 10 minutes
      });

      expect(TokenManager.isExpiringSoon(token, 5)).toBeFalse();
    });

    it('should return true for token expiring in < 5 minutes', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        sub: 'user-123',
        exp: now + 120 // 2 minutes
      });

      expect(TokenManager.isExpiringSoon(token, 5)).toBeTrue();
    });

    it('should use default buffer of 5 minutes', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        sub: 'user-123',
        exp: now + 240 // 4 minutes
      });

      expect(TokenManager.isExpiringSoon(token)).toBeTrue();
    });

    it('should return true for expired token', () => {
      expect(TokenManager.isExpiringSoon(expiredToken)).toBeTrue();
    });
  });

  describe('getRemainingTime()', () => {
    it('should return correct remaining time in seconds', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        sub: 'user-123',
        exp: now + 600 // 10 minutes
      });

      const remaining = TokenManager.getRemainingTime(token);
      expect(remaining).toBeGreaterThan(595);
      expect(remaining).toBeLessThanOrEqual(600);
    });

    it('should return 0 for expired token', () => {
      expect(TokenManager.getRemainingTime(expiredToken)).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      expect(TokenManager.getRemainingTime('invalid-token')).toBe(0);
    });
  });

  describe('getUserId()', () => {
    it('should extract user ID from token', () => {
      const userId = TokenManager.getUserId(validToken);
      expect(userId).toBe('user-123');
    });

    it('should return null for invalid token', () => {
      const userId = TokenManager.getUserId('invalid-token');
      expect(userId).toBeNull();
    });
  });

  describe('getRole()', () => {
    it('should extract role from token', () => {
      const role = TokenManager.getRole(validToken);
      expect(role).toBe('ADMIN');
    });

    it('should return null for invalid token', () => {
      const role = TokenManager.getRole('invalid-token');
      expect(role).toBeNull();
    });
  });

  describe('isValid()', () => {
    it('should return true for valid, non-expired token', () => {
      expect(TokenManager.isValid(validToken)).toBeTrue();
    });

    it('should return false for expired token', () => {
      expect(TokenManager.isValid(expiredToken)).toBeFalse();
    });

    it('should return false for invalid format', () => {
      expect(TokenManager.isValid('invalid-token')).toBeFalse();
    });

    it('should return false for empty string', () => {
      expect(TokenManager.isValid('')).toBeFalse();
    });

    it('should return false for null', () => {
      expect(TokenManager.isValid(null as any)).toBeFalse();
    });

    it('should return false for undefined', () => {
      expect(TokenManager.isValid(undefined as any)).toBeFalse();
    });
  });

  describe('Storage Management', () => {
    const testToken = 'test-jwt-token';
    const testKey = 'test-token';

    describe('store()', () => {
      it('should store token in sessionStorage by default', () => {
        TokenManager.store(testToken, testKey, false);

        expect(sessionStorage.getItem(testKey)).toBe(testToken);
        expect(localStorage.getItem(testKey)).toBeNull();
      });

      it('should store token in localStorage when persistent=true', () => {
        TokenManager.store(testToken, testKey, true);

        expect(localStorage.getItem(testKey)).toBe(testToken);
        expect(sessionStorage.getItem(testKey)).toBeNull();
      });

      it('should use default key if not provided', () => {
        TokenManager.store(testToken);
        expect(sessionStorage.getItem('auth-token')).toBe(testToken);
      });
    });

    describe('retrieve()', () => {
      it('should retrieve token from localStorage', () => {
        localStorage.setItem(testKey, testToken);
        expect(TokenManager.retrieve(testKey)).toBe(testToken);
      });

      it('should retrieve token from sessionStorage', () => {
        sessionStorage.setItem(testKey, testToken);
        expect(TokenManager.retrieve(testKey)).toBe(testToken);
      });

      it('should prefer localStorage over sessionStorage', () => {
        localStorage.setItem(testKey, 'local-token');
        sessionStorage.setItem(testKey, 'session-token');
        expect(TokenManager.retrieve(testKey)).toBe('local-token');
      });

      it('should return null if token not found', () => {
        expect(TokenManager.retrieve(testKey)).toBeNull();
      });
    });

    describe('remove()', () => {
      it('should remove token from both storages', () => {
        localStorage.setItem(testKey, testToken);
        sessionStorage.setItem(testKey, testToken);

        TokenManager.remove(testKey);

        expect(localStorage.getItem(testKey)).toBeNull();
        expect(sessionStorage.getItem(testKey)).toBeNull();
      });
    });

    describe('clearAll()', () => {
      it('should clear all known token keys', () => {
        localStorage.setItem('auth-token', 'token1');
        localStorage.setItem('pythia-token', 'token2');
        localStorage.setItem('pythia-refresh-token', 'token3');
        sessionStorage.setItem('auth-token', 'token4');

        TokenManager.clearAll();

        expect(localStorage.getItem('auth-token')).toBeNull();
        expect(localStorage.getItem('pythia-token')).toBeNull();
        expect(localStorage.getItem('pythia-refresh-token')).toBeNull();
        expect(sessionStorage.getItem('auth-token')).toBeNull();
      });
    });
  });

  describe('createMockToken()', () => {
    it('should create valid mock token', () => {
      const token = createMockToken({
        sub: 'test-user',
        email: 'test@example.com',
        role: 'USER'
      });

      const payload = TokenManager.decode(token);
      expect(payload?.sub).toBe('test-user');
      expect(payload?.email).toBe('test@example.com');
      expect(payload?.role).toBe('USER');
    });

    it('should use default values for missing claims', () => {
      const token = createMockToken({});
      const payload = TokenManager.decode(token);

      expect(payload?.sub).toBe('1');
      expect(payload?.email).toBe('user@example.com');
      expect(payload?.role).toBe('USER');
      expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should override default values with provided claims', () => {
      const customExp = Math.floor(Date.now() / 1000) + 7200;
      const token = createMockToken({
        sub: 'admin-001',
        role: 'ADMIN',
        exp: customExp
      });

      const payload = TokenManager.decode(token);
      expect(payload?.sub).toBe('admin-001');
      expect(payload?.role).toBe('ADMIN');
      expect(payload?.exp).toBe(customExp);
    });
  });
});

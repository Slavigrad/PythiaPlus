/**
 * Authentication Service
 *
 * Manages user authentication state, login/logout, and token management
 * Uses signals for reactive state management
 *
 * Features:
 * - Signal-based auth state
 * - JWT token management
 * - localStorage persistence
 * - Auto-logout on token expiration
 * - Redirect URL tracking
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, LoginCredentials, LoginResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/auth';
  private readonly STORAGE_KEY_USER = 'pythia-user';
  private readonly STORAGE_KEY_TOKEN = 'pythia-token';
  private readonly STORAGE_KEY_REFRESH = 'pythia-refresh-token';

  // Signal State
  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly redirectUrl = signal<string>('/');

  // Computed Signals
  readonly isAuthenticated = computed(() =>
    this.currentUser() !== null && this.token() !== null
  );

  readonly isAdmin = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'ADMIN';
  });

  readonly isHR = computed(() =>
    this.currentUser()?.role === 'hr' || this.isAdmin()
  );

  readonly isManager = computed(() =>
    this.currentUser()?.role === 'manager' || this.isHR()
  );

  readonly isRegularUser = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'USER' || role === 'viewer';
  });

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`;
    return initials.toUpperCase();
  });

  readonly hasRole = (role: UserRole) => computed(() => {
    const user = this.currentUser();
    if (!user) return false;

    // Admin has all roles
    if (user.role === 'admin') return true;

    // HR has manager and viewer
    if (user.role === 'hr' && ['manager', 'viewer'].includes(role)) return true;

    // Manager has viewer
    if (user.role === 'manager' && role === 'viewer') return true;

    return user.role === role;
  });

  readonly hasPermission = (permission: string) => computed(() => {
    const user = this.currentUser();
    return user?.permissions.includes(permission) ?? false;
  });

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Login with credentials
   * Supports "Remember Me" for persistent sessions
   */
  login(credentials: LoginCredentials): Observable<User> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, credentials)
      .pipe(
        tap(response => {
          const rememberMe = credentials.rememberMe ?? false;
          this.setAuthState(response.user, response.token, response.refreshToken, rememberMe);
          this.loading.set(false);

          // Navigate to redirect URL or default
          const redirectTo = this.redirectUrl() || '/';
          this.redirectUrl.set('/');
          this.router.navigate([redirectTo]);
        }),
        map(response => response.user),
        catchError((error: HttpErrorResponse) => {
          this.loading.set(false);
          const errorMsg = this.getErrorMessage(error);
          this.error.set(errorMsg);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout and clear auth state
   */
  logout(): void {
    // Optional: Call backend logout endpoint
    this.http.post(`${this.API_BASE_URL}/logout`, {})
      .pipe(catchError(() => of(null)))
      .subscribe();

    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Refresh auth token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.STORAGE_KEY_REFRESH);

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ token: string }>(`${this.API_BASE_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.token.set(response.token);
          localStorage.setItem(this.STORAGE_KEY_TOKEN, response.token);
        }),
        map(response => response.token),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Check if user has specific role
   */
  hasRoleSync(role: UserRole): boolean {
    return this.hasRole(role)();
  }

  /**
   * Check if user has specific permission
   */
  hasPermissionSync(permission: string): boolean {
    return this.hasPermission(permission)();
  }

  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================

  /**
   * Set authentication state
   * Uses localStorage for "Remember Me", sessionStorage otherwise
   */
  private setAuthState(user: User, token: string, refreshToken: string, rememberMe: boolean = false): void {
    this.currentUser.set(user);
    this.token.set(token);

    // Choose storage based on "Remember Me"
    const storage = rememberMe ? localStorage : sessionStorage;

    // Persist auth state
    storage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    storage.setItem(this.STORAGE_KEY_TOKEN, token);
    storage.setItem(this.STORAGE_KEY_REFRESH, refreshToken);

    // Store rememberMe flag
    if (rememberMe) {
      localStorage.setItem('pythia-remember-me', 'true');
    }
  }

  /**
   * Clear authentication state from all storages
   */
  private clearAuthState(): void {
    this.currentUser.set(null);
    this.token.set(null);
    this.error.set(null);

    // Clear both localStorage and sessionStorage
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.STORAGE_KEY_USER);
      storage.removeItem(this.STORAGE_KEY_TOKEN);
      storage.removeItem(this.STORAGE_KEY_REFRESH);
    });
    localStorage.removeItem('pythia-remember-me');
  }

  /**
   * Load authentication state from storage on app init
   * Checks both localStorage (Remember Me) and sessionStorage
   */
  private loadFromStorage(): void {
    // Try localStorage first (Remember Me sessions)
    let userJson = localStorage.getItem(this.STORAGE_KEY_USER);
    let token = localStorage.getItem(this.STORAGE_KEY_TOKEN);

    // Fallback to sessionStorage
    if (!userJson || !token) {
      userJson = sessionStorage.getItem(this.STORAGE_KEY_USER);
      token = sessionStorage.getItem(this.STORAGE_KEY_TOKEN);
    }

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUser.set(user);
        this.token.set(token);
      } catch (error) {
        console.error('Failed to load auth state from storage:', error);
        this.clearAuthState();
      }
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Invalid email or password';
    } else if (error.status === 403) {
      return 'Access forbidden';
    } else if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return error.error?.message || 'An unexpected error occurred';
    }
  }
}

/**
 * Mock Auth Service (for development without backend)
 *
 * Uncomment and use this for local development
 */
export class MockAuthService extends AuthService {
  private mockUsers: Map<string, { user: User; password: string }> = new Map([
    ['admin@pythia.com', {
      password: 'admin123',
      user: {
        id: '1',
        email: 'admin@pythia.com',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        role: 'admin',
        permissions: ['*'],
        avatarUrl: ''
      }
    }],
    ['hr@pythia.com', {
      password: 'hr123',
      user: {
        id: '2',
        email: 'hr@pythia.com',
        firstName: 'HR',
        lastName: 'Manager',
        fullName: 'HR Manager',
        role: 'hr',
        permissions: ['employees.read', 'employees.write', 'candidates.read'],
        avatarUrl: ''
      }
    }]
  ]);

  override login(credentials: LoginCredentials): Observable<User> {
    this.loading.set(true);
    this.error.set(null);

    // Simulate network delay
    return new Observable(observer => {
      setTimeout(() => {
        const mockUser = this.mockUsers.get(credentials.email);

        if (mockUser && mockUser.password === credentials.password) {
          const mockToken = `mock-jwt-token-${Date.now()}`;
          const mockRefreshToken = `mock-refresh-token-${Date.now()}`;
          const rememberMe = credentials.rememberMe ?? false;

          // Call parent's setAuthState method (private, but accessible via 'this')
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('pythia-user', JSON.stringify(mockUser.user));
          storage.setItem('pythia-token', mockToken);
          storage.setItem('pythia-refresh-token', mockRefreshToken);

          this.currentUser.set(mockUser.user);
          this.token.set(mockToken);
          this.loading.set(false);

          // Navigate to redirect URL
          const redirectTo = this.redirectUrl() || '/';
          this.redirectUrl.set('/');
          this.router.navigate([redirectTo]);

          observer.next(mockUser.user);
          observer.complete();
        } else {
          this.loading.set(false);
          this.error.set('Invalid email or password');
          observer.error(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }
}

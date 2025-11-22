/**
 * User Models
 *
 * Domain models for authentication and authorization
 *
 * Supports two role systems:
 * 1. Simple: ADMIN (full access) vs USER (search only)
 * 2. Hierarchical: admin > hr > manager > viewer (legacy)
 */

// Simple role system for Pythia (Oracle-inspired)
export type SimpleUserRole = 'ADMIN' | 'USER';

// Legacy hierarchical role system
export type LegacyUserRole = 'admin' | 'hr' | 'manager' | 'viewer';

// Combined role type
export type UserRole = SimpleUserRole | LegacyUserRole;

/**
 * User Preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'de' | 'fr';
  emailNotifications?: boolean;
  compactView?: boolean;
}

/**
 * User Entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  avatarUrl?: string;
  company?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  lastLogin?: string;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login Response from API
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token Refresh Response
 */
export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

/**
 * Auth State (Signal-based)
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

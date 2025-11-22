/**
 * User Profile Service
 *
 * Manages user profile data and preferences
 * Uses signals for reactive state management
 *
 * Features:
 * - User preferences (theme, language, notifications)
 * - Profile updates
 * - Avatar management
 * - localStorage persistence
 */

import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, UserPreferences } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/users';
  private readonly STORAGE_KEY_PREFERENCES = 'pythia-preferences';

  // Signal State
  readonly preferences = signal<UserPreferences>({
    theme: 'auto',
    language: 'en',
    emailNotifications: true,
    compactView: false
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Computed Signals
  readonly currentTheme = computed(() => this.preferences().theme);
  readonly currentLanguage = computed(() => this.preferences().language);

  readonly isDarkMode = computed(() => {
    const theme = this.preferences().theme;
    if (theme === 'dark') return true;
    if (theme === 'light') return false;

    // Auto mode - check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  constructor() {
    this.loadPreferences();

    // Auto-save preferences when user changes
    effect(() => {
      const prefs = this.preferences();
      this.saveToStorage(prefs);
    });

    // Load user preferences when logged in
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.preferences) {
        this.preferences.set(user.preferences);
      }
    });
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    this.loading.set(true);
    this.error.set(null);

    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    const updatedPreferences = { ...this.preferences(), ...preferences };

    return this.http.patch<UserPreferences>(
      `${this.API_BASE_URL}/${userId}/preferences`,
      updatedPreferences
    ).pipe(
      tap(prefs => {
        this.preferences.set(prefs);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        this.error.set('Failed to update preferences');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update theme preference
   */
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.preferences.update(prefs => ({ ...prefs, theme }));

    // Apply theme to document
    this.applyTheme(theme);
  }

  /**
   * Update language preference
   */
  setLanguage(language: 'en' | 'de' | 'fr'): void {
    this.preferences.update(prefs => ({ ...prefs, language }));
  }

  /**
   * Toggle compact view
   */
  toggleCompactView(): void {
    this.preferences.update(prefs => ({
      ...prefs,
      compactView: !prefs.compactView
    }));
  }

  /**
   * Toggle email notifications
   */
  toggleEmailNotifications(): void {
    this.preferences.update(prefs => ({
      ...prefs,
      emailNotifications: !prefs.emailNotifications
    }));
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    this.loading.set(true);
    this.error.set(null);

    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.patch<User>(`${this.API_BASE_URL}/${userId}`, updates)
      .pipe(
        tap(user => {
          // Update auth service with new user data
          this.authService.currentUser.set(user);
          this.loading.set(false);
        }),
        catchError(error => {
          this.loading.set(false);
          this.error.set('Failed to update profile');
          return throwError(() => error);
        })
      );
  }

  /**
   * Upload avatar image
   */
  uploadAvatar(file: File): Observable<string> {
    this.loading.set(true);
    this.error.set(null);

    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<{ avatarUrl: string }>(
      `${this.API_BASE_URL}/${userId}/avatar`,
      formData
    ).pipe(
      tap(response => {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.authService.currentUser.set({
            ...currentUser,
            avatarUrl: response.avatarUrl
          });
        }
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        this.error.set('Failed to upload avatar');
        return throwError(() => error);
      })
    ).pipe(
      tap(response => response.avatarUrl)
    );
  }

  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY_PREFERENCES);
    if (stored) {
      try {
        const prefs = JSON.parse(stored) as UserPreferences;
        this.preferences.set(prefs);
        this.applyTheme(prefs.theme);
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    } else {
      // Apply default theme
      this.applyTheme(this.preferences().theme);
    }
  }

  /**
   * Save preferences to localStorage
   */
  private saveToStorage(preferences: UserPreferences): void {
    localStorage.setItem(this.STORAGE_KEY_PREFERENCES, JSON.stringify(preferences));
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;

    if (theme === 'auto') {
      // Use system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark-theme', isDark);
      root.classList.toggle('light-theme', !isDark);
    } else {
      root.classList.toggle('dark-theme', theme === 'dark');
      root.classList.toggle('light-theme', theme === 'light');
    }

    // Set data attribute for CSS
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Mock User Profile Service (for development)
 */
export class MockUserProfileService extends UserProfileService {
  override updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    // Simulate network delay
    return new Observable(observer => {
      setTimeout(() => {
        const updatedPreferences = { ...this.preferences(), ...preferences };
        this.preferences.set(updatedPreferences);
        observer.next(updatedPreferences);
        observer.complete();
      }, 300);
    });
  }

  override updateProfile(updates: Partial<User>): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          this.authService.currentUser.set(updatedUser);
          observer.next(updatedUser);
          observer.complete();
        } else {
          observer.error(new Error('User not authenticated'));
        }
      }, 300);
    });
  }
}

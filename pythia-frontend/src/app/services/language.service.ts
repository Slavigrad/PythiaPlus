import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Language, LanguageResponse, LanguageRequest } from '../models/language.model';

/**
 * Language Service
 *
 * Manages CRUD operations for language master data
 * - GET: Fetch all languages
 * - POST: Create new language
 * - PUT: Update existing language
 * - DELETE: Remove language
 *
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly languages = signal<Language[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  /**
   * Fetch all languages from the API
   */
  loadLanguages(): Observable<LanguageResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<LanguageResponse>(`${this.API_BASE_URL}/languages`).pipe(
      tap(response => {
        this.languages.set(response.items);
        this.total.set(response.total);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Create a new language
   */
  createLanguage(request: LanguageRequest): Observable<Language> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Language>(`${this.API_BASE_URL}/languages`, request).pipe(
      tap(newLanguage => {
        // Add to local state
        this.languages.update(languages => [...languages, newLanguage]);
        this.total.update(t => t + 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Update an existing language
   */
  updateLanguage(id: number, request: LanguageRequest): Observable<Language> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Language>(`${this.API_BASE_URL}/languages/${id}`, request).pipe(
      tap(updatedLanguage => {
        // Update local state
        this.languages.update(languages =>
          languages.map(language => language.id === id ? updatedLanguage : language)
        );
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Delete a language
   */
  deleteLanguage(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/languages/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.languages.update(languages => languages.filter(language => language.id !== id));
        this.total.update(t => t - 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): void {
    this.loading.set(false);

    if (error.status === 0) {
      this.error.set('Unable to connect to server. Please check your connection.');
    } else if (error.status === 404) {
      this.error.set('Language not found.');
    } else if (error.status === 409) {
      this.error.set('A language with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

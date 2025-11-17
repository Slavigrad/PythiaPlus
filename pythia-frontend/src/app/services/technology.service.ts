import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Technology, TechnologyResponse, TechnologyRequest } from '../models/technology.model';

/**
 * Technology Service
 *
 * Manages CRUD operations for technology master data
 * - GET: Fetch all technologies
 * - POST: Create new technology
 * - PUT: Update existing technology
 * - DELETE: Remove technology
 *
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly technologies = signal<Technology[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  /**
   * Fetch all technologies from the API
   */
  loadTechnologies(): Observable<TechnologyResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<TechnologyResponse>(`${this.API_BASE_URL}/technologies`).pipe(
      tap(response => {
        this.technologies.set(response.items);
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
   * Create a new technology
   */
  createTechnology(request: TechnologyRequest): Observable<Technology> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Technology>(`${this.API_BASE_URL}/technologies`, request).pipe(
      tap(newTech => {
        // Add to local state
        this.technologies.update(techs => [...techs, newTech]);
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
   * Update an existing technology
   */
  updateTechnology(id: number, request: TechnologyRequest): Observable<Technology> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Technology>(`${this.API_BASE_URL}/technologies/${id}`, request).pipe(
      tap(updatedTech => {
        // Update local state
        this.technologies.update(techs =>
          techs.map(tech => tech.id === id ? updatedTech : tech)
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
   * Delete a technology
   */
  deleteTechnology(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/technologies/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.technologies.update(techs => techs.filter(tech => tech.id !== id));
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
      this.error.set('Technology not found.');
    } else if (error.status === 409) {
      this.error.set('A technology with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

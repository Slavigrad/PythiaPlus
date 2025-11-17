import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Training, TrainingResponse, TrainingRequest } from '../models/training.model';

/**
 * Training Service
 *
 * Manages CRUD operations for training master data
 * - GET: Fetch all trainings
 * - POST: Create new training
 * - PUT: Update existing training
 * - DELETE: Remove training
 *
 * Uses signals for reactive state management
 * Includes client-side search/filter functionality
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly trainings = signal<Training[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  // Search/filter state
  readonly searchQuery = signal('');

  /**
   * Filtered trainings based on search query
   * Searches across: name, description, category
   * Case-insensitive partial matching
   */
  readonly filteredTrainings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.trainings();

    if (!query) {
      return items;
    }

    return items.filter(training =>
      training.name.toLowerCase().includes(query) ||
      training.description.toLowerCase().includes(query) ||
      training.category.toLowerCase().includes(query)
    );
  });

  /**
   * Fetch all trainings from the API
   */
  loadTrainings(): Observable<TrainingResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<TrainingResponse>(`${this.API_BASE_URL}/trainings`).pipe(
      tap(response => {
        this.trainings.set(response.items);
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
   * Create a new training
   */
  createTraining(request: TrainingRequest): Observable<Training> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Training>(`${this.API_BASE_URL}/trainings`, request).pipe(
      tap(newTraining => {
        // Add to local state
        this.trainings.update(trainings => [...trainings, newTraining]);
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
   * Update an existing training
   */
  updateTraining(id: number, request: TrainingRequest): Observable<Training> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Training>(`${this.API_BASE_URL}/trainings/${id}`, request).pipe(
      tap(updatedTraining => {
        // Update local state
        this.trainings.update(trainings =>
          trainings.map(training => training.id === id ? updatedTraining : training)
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
   * Delete a training
   */
  deleteTraining(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/trainings/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.trainings.update(trainings => trainings.filter(training => training.id !== id));
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
   * Reset search query to show all trainings
   */
  resetSearch(): void {
    this.searchQuery.set('');
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): void {
    this.loading.set(false);

    if (error.status === 0) {
      this.error.set('Unable to connect to server. Please check your connection.');
    } else if (error.status === 404) {
      this.error.set('Training not found.');
    } else if (error.status === 409) {
      this.error.set('A training with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

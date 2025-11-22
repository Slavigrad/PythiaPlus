import { inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Response interface for paginated/list API responses
 */
export interface DataResponse<T> {
  items: T[];
  total: number;
}

/**
 * Base Data Service
 *
 * Abstract base class for all CRUD data services.
 * Eliminates code duplication across 17+ services.
 *
 * Features:
 * - Reactive state management with signals
 * - Standardized loading/error states
 * - Built-in search/filter functionality
 * - Consistent HTTP error handling
 * - CRUD operations (load, create, update, delete)
 * - Type-safe generic implementation
 *
 * Usage:
 * ```typescript
 * export class TechnologyService extends BaseDataService<Technology, TechnologyRequest> {
 *   protected getEndpoint(): string {
 *     return 'technologies';
 *   }
 *
 *   protected getSearchFields(item: Technology): string[] {
 *     return [item.name, item.description, item.category, item.code || ''];
 *   }
 *
 *   protected getItemNotFoundMessage(): string {
 *     return 'Technology not found.';
 *   }
 *
 *   protected getDuplicateMessage(): string {
 *     return 'A technology with this name already exists.';
 *   }
 * }
 * ```
 *
 * @template T - Entity type (e.g., Technology, Role)
 * @template R - Request type for create/update (e.g., TechnologyRequest)
 */
export abstract class BaseDataService<T extends { id: number }, R = Partial<T>> {
  protected readonly http = inject(HttpClient);

  // API configuration
  protected readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly data: WritableSignal<T[]> = signal<T[]>([]);
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string | null> = signal<string | null>(null);
  readonly total: WritableSignal<number> = signal(0);

  // Search/filter state
  readonly searchQuery: WritableSignal<string> = signal('');

  /**
   * Filtered data based on search query
   * Searches across fields defined by getSearchFields()
   * Case-insensitive partial matching
   */
  readonly filteredData: Signal<T[]> = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.data();

    if (!query) {
      return items;
    }

    return items.filter(item => {
      const fields = this.getSearchFields(item);
      return fields.some(field =>
        field.toLowerCase().includes(query)
      );
    });
  });

  /**
   * Get the API endpoint for this resource (without leading slash)
   * Example: 'technologies', 'roles', 'employees'
   */
  protected abstract getEndpoint(): string;

  /**
   * Get searchable fields for an item
   * Used by filteredData computed signal
   *
   * @param item - The item to extract search fields from
   * @returns Array of string values to search across
   */
  protected abstract getSearchFields(item: T): string[];

  /**
   * Get error message for 404 (not found)
   * Can be overridden for custom messages
   */
  protected getItemNotFoundMessage(): string {
    return 'Item not found.';
  }

  /**
   * Get error message for 409 (duplicate/conflict)
   * Can be overridden for custom messages
   */
  protected getDuplicateMessage(): string {
    return 'An item with this name already exists.';
  }

  /**
   * Fetch all items from the API
   */
  load(): Observable<DataResponse<T>> {
    this.loading.set(true);
    this.error.set(null);

    const url = `${this.API_BASE_URL}/${this.getEndpoint()}`;

    return this.http.get<DataResponse<T>>(url).pipe(
      tap(response => {
        this.data.set(response.items);
        this.total.set(response.total);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new item
   *
   * @param request - The data for the new item
   * @returns Observable of the created item
   */
  create(request: R): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    const url = `${this.API_BASE_URL}/${this.getEndpoint()}`;

    return this.http.post<T>(url, request).pipe(
      tap(newItem => {
        // Add to local state
        this.data.update(items => [...items, newItem]);
        this.total.update(t => t + 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing item
   *
   * @param id - The ID of the item to update
   * @param request - The updated data
   * @returns Observable of the updated item
   */
  update(id: number, request: R): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    const url = `${this.API_BASE_URL}/${this.getEndpoint()}/${id}`;

    return this.http.put<T>(url, request).pipe(
      tap(updatedItem => {
        // Update local state
        this.data.update(items =>
          items.map(item => item.id === id ? updatedItem : item)
        );
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an item
   *
   * @param id - The ID of the item to delete
   * @returns Observable<void>
   */
  delete(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    const url = `${this.API_BASE_URL}/${this.getEndpoint()}/${id}`;

    return this.http.delete<void>(url).pipe(
      tap(() => {
        // Remove from local state
        this.data.update(items => items.filter(item => item.id !== id));
        this.total.update(t => t - 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
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
   * Reset search query to show all items
   */
  resetSearch(): void {
    this.searchQuery.set('');
  }

  /**
   * Handle HTTP errors with standardized messages
   * Can be overridden for custom error handling
   */
  protected handleError(error: HttpErrorResponse): void {
    this.loading.set(false);

    if (error.status === 0) {
      this.error.set('Unable to connect to server. Please check your connection.');
    } else if (error.status === 404) {
      this.error.set(this.getItemNotFoundMessage());
    } else if (error.status === 409) {
      this.error.set(this.getDuplicateMessage());
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

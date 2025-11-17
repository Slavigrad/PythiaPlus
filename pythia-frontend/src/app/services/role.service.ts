import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Role, RoleResponse, RoleRequest } from '../models/role.model';

/**
 * Role Service
 *
 * Manages CRUD operations for role master data
 * - GET: Fetch all roles
 * - POST: Create new role
 * - PUT: Update existing role
 * - DELETE: Remove role
 *
 * Uses signals for reactive state management
 * Includes client-side search/filter functionality
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  // Search/filter state
  readonly searchQuery = signal('');

  /**
   * Filtered roles based on search query
   * Searches across: name, description, category
   * Case-insensitive partial matching
   */
  readonly filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.roles();

    if (!query) {
      return items;
    }

    return items.filter(role =>
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query) ||
      role.category.toLowerCase().includes(query)
    );
  });

  /**
   * Fetch all roles from the API
   */
  loadRoles(): Observable<RoleResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<RoleResponse>(`${this.API_BASE_URL}/roles`).pipe(
      tap(response => {
        this.roles.set(response.items);
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
   * Create a new role
   */
  createRole(request: RoleRequest): Observable<Role> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Role>(`${this.API_BASE_URL}/roles`, request).pipe(
      tap(newRole => {
        // Add to local state
        this.roles.update(roles => [...roles, newRole]);
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
   * Update an existing role
   */
  updateRole(id: number, request: RoleRequest): Observable<Role> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Role>(`${this.API_BASE_URL}/roles/${id}`, request).pipe(
      tap(updatedRole => {
        // Update local state
        this.roles.update(roles =>
          roles.map(role => role.id === id ? updatedRole : role)
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
   * Delete a role
   */
  deleteRole(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/roles/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.roles.update(roles => roles.filter(role => role.id !== id));
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
   * Reset search query to show all roles
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
      this.error.set('Role not found.');
    } else if (error.status === 409) {
      this.error.set('A role with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

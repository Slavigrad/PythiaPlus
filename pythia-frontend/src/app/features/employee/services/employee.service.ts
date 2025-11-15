import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Employee } from '../../../models';

/**
 * Employee Service
 *
 * Manages employee data fetching and caching
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Signal state
  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Fetch employee by ID
   */
  getEmployeeById(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Employee>(`${this.API_BASE_URL}/employees/${id}`)
      .pipe(
        tap((employee) => {
          this.employee.set(employee);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Clear current employee data
   */
  clearEmployee(): void {
    this.employee.set(null);
    this.error.set(null);
  }

  /**
   * Get human-readable error message
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'Employee not found';
    } else if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {
  Employee,
  EmployeeUpdateRequest,
  EmployeeUpdateResponse,
  EmployeeListResponse,
  EmployeeListItem
} from '../../../models';

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

  // Signal state for single employee
  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Signal state for employee list
  readonly employees = signal<EmployeeListItem[]>([]);
  readonly listLoading = signal(false);
  readonly listError = signal<string | null>(null);
  readonly pageMetadata = signal<{ size: number; totalElements: number; totalPages: number; number: number } | null>(null);

  // Update operation state
  readonly updateLoading = signal(false);
  readonly updateError = signal<string | null>(null);

  /**
   * Fetch all employees
   * Returns an observable for flexible subscription handling
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.API_BASE_URL}/employees`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Failed to fetch employees:', error);
          throw error;
        })
      );
  }

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
   * Update employee (PUT)
   * Sends only the fields provided, preserves omitted fields
   *
   * @param id Employee ID
   * @param data Employee update data
   * @returns Observable of updated employee
   */
  updateEmployee(id: number, data: EmployeeUpdateRequest): Observable<Employee> {
    this.updateLoading.set(true);
    this.updateError.set(null);

    return this.http.put<EmployeeUpdateResponse>(
      `${this.API_BASE_URL}/employees/${id}`,
      data
    ).pipe(
      tap(response => {
        this.employee.set(response.employee);
        this.updateLoading.set(false);
      }),
      map(response => response.employee),
      catchError((error: HttpErrorResponse) => {
        this.updateError.set(this.getErrorMessage(error));
        this.updateLoading.set(false);
        throw error;
      })
    );
  }

  /**
   * Partial update employee (PATCH)
   * Same behavior as PUT in our API - preserves omitted fields
   *
   * @param id Employee ID
   * @param data Partial employee update data
   * @returns Observable of updated employee
   */
  patchEmployee(id: number, data: Partial<EmployeeUpdateRequest>): Observable<Employee> {
    this.updateLoading.set(true);
    this.updateError.set(null);

    return this.http.patch<EmployeeUpdateResponse>(
      `${this.API_BASE_URL}/employees/${id}`,
      data
    ).pipe(
      tap(response => {
        this.employee.set(response.employee);
        this.updateLoading.set(false);
      }),
      map(response => response.employee),
      catchError((error: HttpErrorResponse) => {
        this.updateError.set(this.getErrorMessage(error));
        this.updateLoading.set(false);
        throw error;
      })
    );
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

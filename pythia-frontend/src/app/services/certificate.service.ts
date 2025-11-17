import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Certificate, CertificateResponse, CertificateRequest } from '../models/certificate.model';

/**
 * Certificate Service
 *
 * Manages CRUD operations for certificate master data
 * - GET: Fetch all certificates
 * - POST: Create new certificate
 * - PUT: Update existing certificate
 * - DELETE: Remove certificate
 *
 * Uses signals for reactive state management
 * Includes client-side search/filter functionality
 */
@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly certificates = signal<Certificate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  // Search/filter state
  readonly searchQuery = signal('');

  /**
   * Filtered certificates based on search query
   * Searches across: name, description, category
   * Case-insensitive partial matching
   */
  readonly filteredCertificates = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.certificates();

    if (!query) {
      return items;
    }

    return items.filter(cert =>
      cert.name.toLowerCase().includes(query) ||
      cert.description.toLowerCase().includes(query) ||
      cert.category.toLowerCase().includes(query) ||
      (cert.code?.toLowerCase().includes(query) ?? false)
    );
  });

  /**
   * Fetch all certificates from the API
   */
  loadCertificates(): Observable<CertificateResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CertificateResponse>(`${this.API_BASE_URL}/certificates`).pipe(
      tap(response => {
        this.certificates.set(response.items);
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
   * Create a new certificate
   */
  createCertificate(request: CertificateRequest): Observable<Certificate> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Certificate>(`${this.API_BASE_URL}/certificates`, request).pipe(
      tap(newCertificate => {
        // Add to local state
        this.certificates.update(certificates => [...certificates, newCertificate]);
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
   * Update an existing certificate
   */
  updateCertificate(id: number, request: CertificateRequest): Observable<Certificate> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Certificate>(`${this.API_BASE_URL}/certificates/${id}`, request).pipe(
      tap(updatedCertificate => {
        // Update local state
        this.certificates.update(certificates =>
          certificates.map(certificate => certificate.id === id ? updatedCertificate : certificate)
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
   * Delete a certificate
   */
  deleteCertificate(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/certificates/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.certificates.update(certificates => certificates.filter(certificate => certificate.id !== id));
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
   * Reset search query to show all certificates
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
      this.error.set('Certificate not found.');
    } else if (error.status === 409) {
      this.error.set('A certificate with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

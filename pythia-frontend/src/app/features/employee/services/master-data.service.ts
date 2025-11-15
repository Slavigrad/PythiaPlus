import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Master Technology
 */
export interface MasterTechnology {
  id: number;
  name: string;
}

/**
 * Master Skill
 */
export interface MasterSkill {
  id: number;
  name: string;
}

/**
 * Master Certification
 */
export interface MasterCertification {
  id: number;
  name: string;
}

/**
 * Master Language
 */
export interface MasterLanguage {
  id: number;
  name: string;
}

/**
 * Master Data Service
 *
 * Manages master data for autocomplete functionality
 * - Technologies
 * - Skills
 * - Certifications
 * - Languages
 *
 * Data is cached in signals after first fetch
 */
@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/master-data';

  // Cached master data signals
  readonly technologies = signal<MasterTechnology[]>([]);
  readonly skills = signal<MasterSkill[]>([]);
  readonly certifications = signal<MasterCertification[]>([]);
  readonly languages = signal<MasterLanguage[]>([]);

  // Loading and error states
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all technologies
   * Returns cached data if available, otherwise fetches from API
   */
  getTechnologies(): Observable<MasterTechnology[]> {
    // Return cached data if available
    if (this.technologies().length > 0) {
      return of(this.technologies());
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<MasterTechnology[]>(`${this.API_BASE_URL}/technologies`)
      .pipe(
        tap(data => {
          this.technologies.set(data);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of([]);
        })
      );
  }

  /**
   * Get all skills
   * Returns cached data if available, otherwise fetches from API
   */
  getSkills(): Observable<MasterSkill[]> {
    // Return cached data if available
    if (this.skills().length > 0) {
      return of(this.skills());
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<MasterSkill[]>(`${this.API_BASE_URL}/skills`)
      .pipe(
        tap(data => {
          this.skills.set(data);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of([]);
        })
      );
  }

  /**
   * Get all certifications
   * Returns cached data if available, otherwise fetches from API
   */
  getCertifications(): Observable<MasterCertification[]> {
    // Return cached data if available
    if (this.certifications().length > 0) {
      return of(this.certifications());
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<MasterCertification[]>(`${this.API_BASE_URL}/certifications`)
      .pipe(
        tap(data => {
          this.certifications.set(data);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of([]);
        })
      );
  }

  /**
   * Get all languages
   * Returns cached data if available, otherwise fetches from API
   */
  getLanguages(): Observable<MasterLanguage[]> {
    // Return cached data if available
    if (this.languages().length > 0) {
      return of(this.languages());
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<MasterLanguage[]>(`${this.API_BASE_URL}/languages`)
      .pipe(
        tap(data => {
          this.languages.set(data);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of([]);
        })
      );
  }

  /**
   * Clear all cached data
   * Useful for force refresh
   */
  clearCache(): void {
    this.technologies.set([]);
    this.skills.set([]);
    this.certifications.set([]);
    this.languages.set([]);
  }

  /**
   * Get human-readable error message
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
}

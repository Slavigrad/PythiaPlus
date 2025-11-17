import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Skill, SkillResponse, SkillRequest } from '../models/skill.model';

/**
 * Skill Service
 *
 * Manages CRUD operations for skill master data
 * - GET: Fetch all skills
 * - POST: Create new skill
 * - PUT: Update existing skill
 * - DELETE: Remove skill
 *
 * Uses signals for reactive state management
 * Includes client-side search/filter functionality
 */
@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // Reactive state signals
  readonly skills = signal<Skill[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  // Search/filter state
  readonly searchQuery = signal('');

  /**
   * Filtered skills based on search query
   * Searches across: name, description, category
   * Case-insensitive partial matching
   */
  readonly filteredSkills = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.skills();

    if (!query) {
      return items;
    }

    return items.filter(skill =>
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query) ||
      (skill.code?.toLowerCase().includes(query) ?? false)
    );
  });

  /**
   * Fetch all skills from the API
   */
  loadSkills(): Observable<SkillResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<SkillResponse>(`${this.API_BASE_URL}/skills`).pipe(
      tap(response => {
        this.skills.set(response.items);
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
   * Create a new skill
   */
  createSkill(request: SkillRequest): Observable<Skill> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Skill>(`${this.API_BASE_URL}/skills`, request).pipe(
      tap(newSkill => {
        // Add to local state
        this.skills.update(skills => [...skills, newSkill]);
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
   * Update an existing skill
   */
  updateSkill(id: number, request: SkillRequest): Observable<Skill> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Skill>(`${this.API_BASE_URL}/skills/${id}`, request).pipe(
      tap(updatedSkill => {
        // Update local state
        this.skills.update(skills =>
          skills.map(skill => skill.id === id ? updatedSkill : skill)
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
   * Delete a skill
   */
  deleteSkill(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/skills/${id}`).pipe(
      tap(() => {
        // Remove from local state
        this.skills.update(skills => skills.filter(skill => skill.id !== id));
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
   * Reset search query to show all skills
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
      this.error.set('Skill not found.');
    } else if (error.status === 409) {
      this.error.set('A skill with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}

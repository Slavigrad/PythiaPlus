import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService, DataResponse } from '../core/services/base-data.service';
import { Technology, TechnologyRequest } from '../models/technology.model';

/**
 * Technology Service
 *
 * Manages CRUD operations for technology master data.
 * Extends BaseDataService for standardized data management.
 *
 * Features (inherited from BaseDataService):
 * - Reactive state management with signals
 * - Loading/error states
 * - Search/filter functionality
 * - CRUD operations (load, create, update, delete)
 * - Consistent error handling
 *
 * Signals:
 * - data: WritableSignal<Technology[]> - All technologies
 * - loading: WritableSignal<boolean> - Loading state
 * - error: WritableSignal<string | null> - Error message
 * - total: WritableSignal<number> - Total count
 * - searchQuery: WritableSignal<string> - Search filter
 * - filteredData: Signal<Technology[]> - Filtered results
 *
 * Methods:
 * - load(): Observable<TechnologyResponse> - Fetch all technologies
 * - create(request): Observable<Technology> - Create new technology
 * - update(id, request): Observable<Technology> - Update technology
 * - delete(id): Observable<void> - Delete technology
 * - clearError(): void - Clear error state
 * - resetSearch(): void - Clear search filter
 */
@Injectable({
  providedIn: 'root'
})
export class TechnologyService extends BaseDataService<Technology, TechnologyRequest> {
  /**
   * API endpoint for technologies
   */
  protected getEndpoint(): string {
    return 'technologies';
  }

  /**
   * Define searchable fields for technology filtering
   * Searches across: name, description, category, code
   */
  protected getSearchFields(tech: Technology): string[] {
    return [
      tech.name,
      tech.description,
      tech.category,
      tech.code || ''
    ];
  }

  /**
   * Custom error message for 404 responses
   */
  protected override getItemNotFoundMessage(): string {
    return 'Technology not found.';
  }

  /**
   * Custom error message for 409 (duplicate) responses
   */
  protected override getDuplicateMessage(): string {
    return 'A technology with this name already exists.';
  }

  /**
   * Load all technologies
   * Alias for base load() method with proper return type
   */
  loadTechnologies(): Observable<DataResponse<Technology>> {
    return this.load();
  }

  /**
   * Create a new technology
   * Alias for base create() method
   */
  createTechnology(request: TechnologyRequest): Observable<Technology> {
    return this.create(request);
  }

  /**
   * Update an existing technology
   * Alias for base update() method
   */
  updateTechnology(id: number, request: TechnologyRequest): Observable<Technology> {
    return this.update(id, request);
  }

  /**
   * Delete a technology
   * Alias for base delete() method
   */
  deleteTechnology(id: number): Observable<void> {
    return this.delete(id);
  }

  /**
   * Computed signal for backward compatibility
   * Returns filtered technologies based on search query
   */
  get technologies() {
    return this.data;
  }

  /**
   * Computed signal for filtered technologies
   * Provides backward compatibility with existing code
   */
  get filteredTechnologies() {
    return this.filteredData;
  }
}

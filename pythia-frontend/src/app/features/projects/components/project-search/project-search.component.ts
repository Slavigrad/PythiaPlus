import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';

/**
 * Project Search Component
 *
 * Debounced search input for filtering projects by text query.
 *
 * Features:
 * - 500ms debounce for optimal performance
 * - Search across project names, descriptions, and companies
 * - Loading indicator during search
 * - Clear button to reset search
 * - Keyboard shortcuts (Escape to clear)
 * - Accessibility compliant (ARIA labels, roles)
 *
 * Design:
 * - Clean modern search bar with icon
 * - Smooth transitions and animations
 * - Visual feedback for loading state
 * - Integrates seamlessly with Pythia theme
 */
@Component({
  selector: 'app-project-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-search.component.html',
  styleUrl: './project-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSearchComponent {
  // Inject service
  private readonly projectsService = inject(ProjectsService);

  // ============================================================================
  // STATE SIGNALS
  // ============================================================================

  /** Current search query */
  protected readonly searchQuery = signal('');

  /** Loading state during search */
  protected readonly isSearching = signal(false);

  /** Debounce timer ID */
  private debounceTimer: any = null;

  /** Debounce delay in milliseconds */
  private readonly DEBOUNCE_DELAY = 500;

  // ============================================================================
  // CONSTRUCTOR
  // ============================================================================

  constructor() {
    // Set up effect to handle debounced search
    effect(() => {
      const query = this.searchQuery();

      // Clear existing timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // If query is empty, search immediately
      if (query.length === 0) {
        this.performSearch(query);
        return;
      }

      // Set loading state
      this.isSearching.set(true);

      // Debounce the search
      this.debounceTimer = setTimeout(() => {
        this.performSearch(query);
        this.isSearching.set(false);
      }, this.DEBOUNCE_DELAY);
    });
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Handle search input change
   */
  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  /**
   * Clear search query
   */
  protected clearSearch(): void {
    this.searchQuery.set('');
    this.isSearching.set(false);
  }

  /**
   * Handle keyboard shortcuts
   */
  protected onKeydown(event: KeyboardEvent): void {
    // Escape key clears search
    if (event.key === 'Escape') {
      this.clearSearch();
      (event.target as HTMLInputElement).blur();
    }
  }

  /**
   * Check if search query has value
   */
  protected get hasQuery(): boolean {
    return this.searchQuery().length > 0;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Perform the actual search
   */
  private performSearch(query: string): void {
    this.projectsService.search(query);
  }
}

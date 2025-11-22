import { Component, signal, inject, effect, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { SearchService } from '../../services/search';
import {
  MIN_QUERY_LENGTH,
  SEARCH_DEBOUNCE_MS,
  EXAMPLE_QUERIES
} from '../../core/constants';

/**
 * Search Bar Component
 *
 * Purpose: Natural language search input with URL persistence
 * Features: Debounced search, example queries, keyboard shortcuts, URL state, ripple effects
 */
@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, MatRippleModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  private readonly searchService = inject(SearchService);

  // Input from URL (for initial state)
  readonly initialQuery = input<string>('');

  protected readonly query = signal('');
  private debounceTimeout: any;
  private isInitialized = false;

  // Example queries (from constants)
  protected readonly exampleQueries = EXAMPLE_QUERIES;

  constructor() {
    // Initialize from URL input
    effect(() => {
      const urlQuery = this.initialQuery();
      if (!this.isInitialized && urlQuery) {
        this.query.set(urlQuery);
        this.isInitialized = true;
      }
    });

    // Debounced search effect
    effect(() => {
      const currentQuery = this.query();

      // Clear previous timeout
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      // Debounce search
      this.debounceTimeout = setTimeout(() => {
        if (currentQuery.trim().length >= MIN_QUERY_LENGTH) {
          this.searchService.search({ query: currentQuery });
        } else if (currentQuery.trim().length === 0) {
          this.searchService.clear();
        }
      }, SEARCH_DEBOUNCE_MS);
    });
  }

  protected onExampleClick(example: string): void {
    this.query.set(example);
  }

  protected onClear(): void {
    this.query.set('');
    this.searchService.clear();
  }
}

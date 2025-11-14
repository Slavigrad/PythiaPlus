import { Component, signal, inject, effect, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

/**
 * Search Bar Component
 *
 * Purpose: Natural language search input with URL persistence
 * Features: Debounced search, example queries, keyboard shortcuts, URL state
 */
@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
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

  protected readonly exampleQueries = [
    'Find React developers in Zurich',
    'Senior Python developers with 5+ years experience',
    'Show me available machine learning engineers'
  ];

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

      // Debounce search by 500ms
      this.debounceTimeout = setTimeout(() => {
        if (currentQuery.trim().length >= 3) {
          this.searchService.search({ query: currentQuery });
        } else if (currentQuery.trim().length === 0) {
          this.searchService.clear();
        }
      }, 500);
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

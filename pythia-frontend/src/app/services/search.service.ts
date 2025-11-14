import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { SearchParams } from '../models/search-params.model';
import { SearchResponse } from '../models/search-response.model';
import { Candidate } from '../models/candidate.model';

/**
 * Search Service - Signal-Based State Management
 *
 * Purpose: Manages semantic search state and API communication
 * Features: Signal-based reactivity, error handling, loading states
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1/search';

  // Signal-based state (Angular 20)
  readonly searchResults = signal<Candidate[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly lastQuery = signal<string>('');

  // Computed signals
  readonly hasResults = computed(() => this.searchResults().length > 0);
  readonly resultCount = computed(() => this.searchResults().length);
  readonly isEmpty = computed(() =>
    !this.loading() && !this.hasResults() && this.lastQuery() === ''
  );
  readonly hasError = computed(() => this.error() !== null);

  /**
   * Perform semantic search
   */
  search(params: SearchParams): void {
    // Validate query
    if (!params.query || params.query.trim().length < 3) {
      this.searchResults.set([]);
      this.lastQuery.set('');
      return;
    }

    // Set loading state
    this.loading.set(true);
    this.error.set(null);
    this.lastQuery.set(params.query);

    // Build query params
    const queryParams = new URLSearchParams({
      query: params.query,
      topK: (params.topK || 10).toString(),
      minScore: (params.minScore || 0.7).toString()
    });

    // Make HTTP request
    this.http.get<SearchResponse>(`${this.apiUrl}?${queryParams}`)
      .pipe(
        tap(response => {
          this.searchResults.set(response.results);
          this.loading.set(false);
        }),
        catchError(err => {
          console.error('Search error:', err);
          this.error.set('Failed to search candidates. Please try again.');
          this.loading.set(false);
          this.searchResults.set([]);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Clear search results
   */
  clear(): void {
    this.searchResults.set([]);
    this.error.set(null);
    this.lastQuery.set('');
  }
}

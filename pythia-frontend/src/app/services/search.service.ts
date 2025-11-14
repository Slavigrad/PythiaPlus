import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { SearchParams } from '../models/search-params.model';
import { SearchResponse } from '../models/search-response.model';
import { Candidate } from '../models/candidate.model';
import { environment } from '../../environments/environment';
import {
  DEFAULT_TOP_K,
  DEFAULT_MIN_SCORE,
  MIN_QUERY_LENGTH,
  ERROR_MESSAGES
} from '../core/constants';

/**
 * Search Service - Signal-Based State Management with URL Persistence
 *
 * Purpose: Manages semantic search state and API communication
 * Features: Signal-based reactivity, error handling, loading states, URL persistence
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/search`;

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
   * Perform semantic search and update URL
   */
  search(params: SearchParams, updateUrl: boolean = true): void {
    // Validate query
    if (!params.query || params.query.trim().length < MIN_QUERY_LENGTH) {
      this.searchResults.set([]);
      this.lastQuery.set('');
      if (updateUrl) {
        this.updateUrl('', params.topK, params.minScore);
      }
      return;
    }

    // Set loading state
    this.loading.set(true);
    this.error.set(null);
    this.lastQuery.set(params.query);

    // Update URL with search params
    if (updateUrl) {
      this.updateUrl(params.query, params.topK, params.minScore);
    }

    // Build query params
    const queryParams = new URLSearchParams({
      query: params.query,
      topK: (params.topK || DEFAULT_TOP_K).toString(),
      minScore: (params.minScore || DEFAULT_MIN_SCORE).toString()
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
          this.error.set(ERROR_MESSAGES.SEARCH_FAILED);
          this.loading.set(false);
          this.searchResults.set([]);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Update URL with search parameters
   */
  private updateUrl(query: string, topK?: number, minScore?: number): void {
    const queryParams: any = {};

    if (query) {
      queryParams.q = query;
    }
    if (topK && topK !== DEFAULT_TOP_K) {
      queryParams.topK = topK;
    }
    if (minScore && minScore !== DEFAULT_MIN_SCORE) {
      queryParams.minScore = minScore;
    }

    this.router.navigate([], {
      relativeTo: this.router.routerState.root,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  /**
   * Clear search results and URL params
   */
  clear(): void {
    this.searchResults.set([]);
    this.error.set(null);
    this.lastQuery.set('');
    this.updateUrl('');
  }
}

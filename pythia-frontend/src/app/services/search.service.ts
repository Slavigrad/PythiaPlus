import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { SearchParams } from '../models/search-params.model';
import { SearchResponse } from '../models/search-response.model';
import { Candidate } from '../models/candidate.model';
import { FacetGroup } from '../models/facet.model';
import { environment } from '../../environments/environment';
import {
  DEFAULT_TOP_K,
  DEFAULT_MIN_SCORE,
  MIN_QUERY_LENGTH,
  ERROR_MESSAGES
} from '../core/constants';

/**
 * Search Service - Signal-Based State Management with URL Persistence & Faceted Search
 *
 * Purpose: Manages semantic search state and API communication with faceted filtering
 * Features: Signal-based reactivity, error handling, loading states, URL persistence, facet filters
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
  readonly facets = signal<FacetGroup | null>(null);
  readonly totalCount = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly lastQuery = signal<string>('');

  // Active filters
  readonly activeFilters = signal<Partial<SearchParams>>({});

  // Computed signals
  readonly hasResults = computed(() => this.searchResults().length > 0);
  readonly resultCount = computed(() => this.searchResults().length);
  readonly isEmpty = computed(() =>
    !this.loading() && !this.hasResults() && this.lastQuery() === ''
  );
  readonly hasError = computed(() => this.error() !== null);
  readonly activeFilterCount = computed(() => {
    const filters = this.activeFilters();
    let count = 0;
    if (filters.location) count++;
    if (filters.availability) count++;
    if (filters.technologies?.length) count += filters.technologies.length;
    if (filters.skills?.length) count += filters.skills.length;
    if (filters.certifications?.length) count += filters.certifications.length;
    if (filters.minYearsExperience) count++;
    return count;
  });
  readonly averageMatchScore = computed(() => {
    const results = this.searchResults();
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, candidate) => acc + candidate.matchScore.matched, 0);
    return Math.round((sum / results.length) * 100);
  });

  /**
   * Perform semantic search with faceted filters and update URL
   */
  search(params: SearchParams, updateUrl: boolean = true): void {
    // Validate query
    if (!params.query || params.query.trim().length < MIN_QUERY_LENGTH) {
      this.searchResults.set([]);
      this.facets.set(null);
      this.totalCount.set(0);
      this.lastQuery.set('');
      this.activeFilters.set({});
      if (updateUrl) {
        this.updateUrlWithParams(params);
      }
      return;
    }

    // Set loading state
    this.loading.set(true);
    this.error.set(null);
    this.lastQuery.set(params.query);
    this.activeFilters.set(params);

    // Update URL with search params
    if (updateUrl) {
      this.updateUrlWithParams(params);
    }

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.set('query', params.query);
    queryParams.set('topK', (params.topK || DEFAULT_TOP_K).toString());
    queryParams.set('minScore', (params.minScore || DEFAULT_MIN_SCORE).toString());

    // Add facet filters
    if (params.location) {
      queryParams.set('location', params.location);
    }
    if (params.availability) {
      queryParams.set('availability', params.availability);
    }
    if (params.technologies?.length) {
      params.technologies.forEach(tech => queryParams.append('technologies', tech));
    }
    if (params.skills?.length) {
      params.skills.forEach(skill => queryParams.append('skills', skill));
    }
    if (params.certifications?.length) {
      params.certifications.forEach(cert => queryParams.append('certifications', cert));
    }
    if (params.minYearsExperience !== undefined) {
      queryParams.set('minYearsExperience', params.minYearsExperience.toString());
    }

    // Make HTTP request
    this.http.get<SearchResponse>(`${this.apiUrl}?${queryParams}`)
      .pipe(
        tap(response => {
          this.searchResults.set(response.results);
          this.facets.set(response.facets || null);
          this.totalCount.set(response.totalCount);
          this.loading.set(false);
        }),
        catchError(err => {
          console.error('Search error:', err);
          this.error.set(ERROR_MESSAGES.SEARCH_FAILED);
          this.loading.set(false);
          this.searchResults.set([]);
          this.facets.set(null);
          this.totalCount.set(0);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Update URL with all search parameters including filters
   */
  private updateUrlWithParams(params: SearchParams): void {
    const queryParams: any = {};

    if (params.query) {
      queryParams.q = params.query;
    }
    if (params.topK && params.topK !== DEFAULT_TOP_K) {
      queryParams.topK = params.topK;
    }
    if (params.minScore && params.minScore !== DEFAULT_MIN_SCORE) {
      queryParams.minScore = params.minScore;
    }

    // Add filter params
    if (params.location) {
      queryParams.location = params.location;
    }
    if (params.availability) {
      queryParams.availability = params.availability;
    }
    if (params.technologies?.length) {
      queryParams.technologies = params.technologies.join(',');
    }
    if (params.skills?.length) {
      queryParams.skills = params.skills.join(',');
    }
    if (params.certifications?.length) {
      queryParams.certifications = params.certifications.join(',');
    }
    if (params.minYearsExperience !== undefined) {
      queryParams.minYears = params.minYearsExperience;
    }

    this.router.navigate([], {
      relativeTo: this.router.routerState.root,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  /**
   * Toggle a facet filter (add if not present, remove if present)
   */
  toggleFilter(type: 'location' | 'availability' | 'technologies' | 'skills' | 'certifications', value: string): void {
    const currentParams = this.activeFilters();
    const newParams = { ...currentParams };

    if (type === 'location' || type === 'availability') {
      // Single-select: toggle on/off
      if (newParams[type] === value) {
        delete newParams[type];
      } else {
        newParams[type] = value;
      }
    } else {
      // Multi-select: toggle in array
      const currentArray = newParams[type] || [];
      const index = currentArray.indexOf(value);
      if (index > -1) {
        newParams[type] = currentArray.filter(v => v !== value);
        if (newParams[type]?.length === 0) {
          delete newParams[type];
        }
      } else {
        newParams[type] = [...currentArray, value];
      }
    }

    // Re-run search with updated filters
    this.search({ query: currentParams.query || '', ...newParams });
  }

  /**
   * Clear all filters (keep query, topK, minScore)
   */
  clearFilters(): void {
    const currentParams = this.activeFilters();
    this.search({
      query: currentParams.query || '',
      topK: currentParams.topK,
      minScore: currentParams.minScore
    });
  }

  /**
   * Clear search results and URL params
   */
  clear(): void {
    this.searchResults.set([]);
    this.facets.set(null);
    this.totalCount.set(0);
    this.error.set(null);
    this.lastQuery.set('');
    this.activeFilters.set({});
    this.updateUrlWithParams({ query: '' });
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { SearchParams } from '../models/search-params.model';
import { SearchResponse } from '../models/search-response.model';
import { Candidate } from '../models/candidate.model';
import { FacetGroup } from '../models/facet.model';
import { InternalFilters, createEmptyInternalFilters, hasActiveInternalFilters } from '../models/internal-filters.model';
import { environment } from '../../environments/environment';
import {
  DEFAULT_TOP_K,
  DEFAULT_MIN_SCORE,
  MIN_QUERY_LENGTH,
  ERROR_MESSAGES
} from '../core/constants';

/**
 * Search Service - Signal-Based State Management with Result Caching & Internal Filtering
 *
 * Purpose: Manages semantic search state, API communication, result caching, and client-side filtering
 * Features:
 *  - Signal-based reactivity
 *  - Backend search with faceted filters
 *  - Result caching for navigation (employee profile → back to search)
 *  - Client-side internal filtering (search + quick filter chips)
 *  - URL persistence
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/search`;

  // Backend search state
  readonly searchResults = signal<Candidate[]>([]);
  readonly facets = signal<FacetGroup | null>(null);
  readonly totalCount = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly lastQuery = signal<string>('');
  readonly activeFilters = signal<Partial<SearchParams>>({});

  // Result caching (for navigation back from employee profile)
  private readonly cachedResults = signal<Candidate[]>([]);
  private readonly cachedFacets = signal<FacetGroup | null>(null);
  private readonly cachedTotalCount = signal<number>(0);
  private readonly cachedQuery = signal<string>('');
  private readonly cachedFilters = signal<Partial<SearchParams>>({});
  readonly cacheTimestamp = signal<number | null>(null);

  // Internal filtering (client-side refinement of loaded results)
  readonly internalFilters = signal<InternalFilters>(createEmptyInternalFilters());
  readonly filteredResults = signal<Candidate[]>([]);

  // Computed signals - Cache
  readonly isCacheActive = computed(() => this.cacheTimestamp() !== null);
  readonly hasCachedResults = computed(() => this.cachedResults().length > 0);

  // Computed signals - Results (use filtered results if filters are active, otherwise search results)
  readonly displayResults = computed(() => {
    const filters = this.internalFilters();
    return hasActiveInternalFilters(filters) ? this.filteredResults() : this.searchResults();
  });
  readonly hasResults = computed(() => this.displayResults().length > 0);
  readonly resultCount = computed(() => this.displayResults().length);
  readonly totalResultCount = computed(() => this.searchResults().length);
  readonly hasInternalFilters = computed(() => hasActiveInternalFilters(this.internalFilters()));
  readonly isEmpty = computed(() =>
    !this.loading() && !this.hasResults && this.lastQuery() === ''
  );
  readonly hasError = computed(() => this.error() !== null);

  // Computed signals - Filters
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
  readonly internalFilterCount = computed(() => {
    const filters = this.internalFilters();
    let count = 0;
    if (filters.searchText.trim() !== '') count++;
    count += filters.technologies.length;
    count += filters.skills.length;
    count += filters.certifications.length;
    return count;
  });

  // Computed signals - Stats
  readonly averageMatchScore = computed(() => {
    const results = this.displayResults();
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

          // Cache the results for navigation back from employee profile
          this.cacheResults(response.results, response.facets || null, response.totalCount, params);

          // Clear any internal filters from previous searches
          this.clearInternalFilters();
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
    this.clearCache();
    this.clearInternalFilters();
    this.updateUrlWithParams({ query: '' });
  }

  // ========================================
  // RESULT CACHING METHODS
  // ========================================

  /**
   * Cache search results for navigation back from employee profile
   */
  private cacheResults(
    results: Candidate[],
    facets: FacetGroup | null,
    totalCount: number,
    params: SearchParams
  ): void {
    this.cachedResults.set(results);
    this.cachedFacets.set(facets);
    this.cachedTotalCount.set(totalCount);
    this.cachedQuery.set(params.query);
    this.cachedFilters.set(params);
    this.cacheTimestamp.set(Date.now());
  }

  /**
   * Restore search results from cache
   * Used when navigating back from employee profile
   */
  restoreFromCache(): boolean {
    if (!this.hasCachedResults()) {
      return false;
    }

    this.searchResults.set(this.cachedResults());
    this.facets.set(this.cachedFacets());
    this.totalCount.set(this.cachedTotalCount());
    this.lastQuery.set(this.cachedQuery());
    this.activeFilters.set(this.cachedFilters());

    return true;
  }

  /**
   * Clear cache and reset to fresh search state
   */
  clearCache(): void {
    this.cachedResults.set([]);
    this.cachedFacets.set(null);
    this.cachedTotalCount.set(0);
    this.cachedQuery.set('');
    this.cachedFilters.set({});
    this.cacheTimestamp.set(null);
  }

  // ========================================
  // INTERNAL FILTERING METHODS (Client-side)
  // ========================================

  /**
   * Apply internal filters to loaded search results
   * This happens client-side without backend calls
   */
  applyInternalFilters(filters: InternalFilters): void {
    this.internalFilters.set(filters);

    // If no filters are active, show all search results
    if (!hasActiveInternalFilters(filters)) {
      this.filteredResults.set(this.searchResults());
      return;
    }

    // Filter candidates based on internal filters
    const filtered = this.searchResults().filter(candidate =>
      this.matchesInternalFilters(candidate, filters)
    );

    this.filteredResults.set(filtered);
  }

  /**
   * Clear internal filters and show all results
   */
  clearInternalFilters(): void {
    this.internalFilters.set(createEmptyInternalFilters());
    this.filteredResults.set(this.searchResults());
  }

  /**
   * Update internal search text filter
   */
  updateInternalSearchText(searchText: string): void {
    const currentFilters = this.internalFilters();
    this.applyInternalFilters({
      ...currentFilters,
      searchText
    });
  }

  /**
   * Toggle a technology filter chip
   */
  toggleTechnologyFilter(technology: string): void {
    const currentFilters = this.internalFilters();
    const technologies = currentFilters.technologies.includes(technology)
      ? currentFilters.technologies.filter(t => t !== technology)
      : [...currentFilters.technologies, technology];

    this.applyInternalFilters({
      ...currentFilters,
      technologies
    });
  }

  /**
   * Toggle a skill filter chip
   */
  toggleSkillFilter(skill: string): void {
    const currentFilters = this.internalFilters();
    const skills = currentFilters.skills.includes(skill)
      ? currentFilters.skills.filter(s => s !== skill)
      : [...currentFilters.skills, skill];

    this.applyInternalFilters({
      ...currentFilters,
      skills
    });
  }

  /**
   * Toggle a certification filter chip
   */
  toggleCertificationFilter(certification: string): void {
    const currentFilters = this.internalFilters();
    const certifications = currentFilters.certifications.includes(certification)
      ? currentFilters.certifications.filter(c => c !== certification)
      : [...currentFilters.certifications, certification];

    this.applyInternalFilters({
      ...currentFilters,
      certifications
    });
  }

  /**
   * Check if a candidate matches internal filters
   * Uses AND logic: candidate must match ALL active filters
   */
  private matchesInternalFilters(candidate: Candidate, filters: InternalFilters): boolean {
    // Search text filter (searches across multiple fields)
    if (filters.searchText.trim() !== '') {
      const searchLower = filters.searchText.toLowerCase();
      const matchesSearch = (
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.fullName.toLowerCase().includes(searchLower) ||
        candidate.title.toLowerCase().includes(searchLower) ||
        candidate.location.toLowerCase().includes(searchLower) ||
        candidate.availability.toLowerCase().includes(searchLower) ||
        candidate.technologies?.some(t => t.toLowerCase().includes(searchLower)) ||
        candidate.skills?.some(s => s.toLowerCase().includes(searchLower)) ||
        candidate.certifications?.some(c => c.toLowerCase().includes(searchLower))
      );

      if (!matchesSearch) {
        return false;
      }
    }

    // Technology filters (AND logic: must have ALL selected technologies)
    if (filters.technologies.length > 0) {
      const candidateTechs = candidate.technologies || [];
      const hasAllTechs = filters.technologies.every(tech =>
        candidateTechs.some(ct => ct.toLowerCase() === tech.toLowerCase())
      );

      if (!hasAllTechs) {
        return false;
      }
    }

    // Skill filters (AND logic: must have ALL selected skills)
    if (filters.skills.length > 0) {
      const candidateSkills = candidate.skills || [];
      const hasAllSkills = filters.skills.every(skill =>
        candidateSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      );

      if (!hasAllSkills) {
        return false;
      }
    }

    // Certification filters (AND logic: must have ALL selected certifications)
    if (filters.certifications.length > 0) {
      const candidateCerts = candidate.certifications || [];
      const hasAllCerts = filters.certifications.every(cert =>
        candidateCerts.some(cc => cc.toLowerCase() === cert.toLowerCase())
      );

      if (!hasAllCerts) {
        return false;
      }
    }

    return true;
  }
}

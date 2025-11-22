import { Candidate } from '../core/candidate';
import { FacetGroup } from './facet.model';

/**
 * Search Result Model (Search Domain)
 *
 * Complete search result including candidates and facets
 * This is the primary model for search state management
 */
export interface SearchResult {
  /** Search results (candidates) */
  results: Candidate[];

  /** Total number of results */
  totalCount: number;

  /** Original search query */
  query: string;

  /** Facets for filtering (optional) */
  facets?: FacetGroup;

  /** Search execution timestamp */
  timestamp?: number;

  /** Search duration in milliseconds (optional) */
  duration?: number;
}

/**
 * Check if search has results
 */
export function hasSearchResults(searchResult: SearchResult): boolean {
  return searchResult.results.length > 0;
}

/**
 * Check if search is empty
 */
export function isSearchEmpty(searchResult: SearchResult): boolean {
  return searchResult.results.length === 0;
}

/**
 * Create empty search result
 */
export function createEmptySearchResult(query: string = ''): SearchResult {
  return {
    results: [],
    totalCount: 0,
    query,
    timestamp: Date.now()
  };
}

/**
 * Get search result summary (e.g., "Found 42 candidates for 'React developer'")
 */
export function getSearchResultSummary(searchResult: SearchResult): string {
  const count = searchResult.totalCount;
  const query = searchResult.query;

  if (count === 0) {
    return `No candidates found for "${query}"`;
  }

  if (count === 1) {
    return `Found 1 candidate for "${query}"`;
  }

  return `Found ${count} candidates for "${query}"`;
}

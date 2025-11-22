/**
 * Search Parameters DTO
 *
 * Data Transfer Object for semantic search API with faceted filtering
 * API Contract: GET /api/v1/search
 */
export interface SearchParamsDto {
  /** Natural language search query (required) */
  query: string;

  /** Number of results to return (default: 10, max: 50) */
  topK?: number;

  /** Minimum similarity score threshold 0.0-1.0 (default: 0.7) */
  minScore?: number;

  // Facet filters (optional)
  /** Single location filter (e.g., "Zurich") */
  location?: string;

  /** Single availability filter */
  availability?: string;

  /** Multiple technology filters (AND logic) */
  technologies?: string[];

  /** Multiple skill filters (AND logic) */
  skills?: string[];

  /** Multiple certification filters (AND logic) */
  certifications?: string[];

  /** Minimum years of experience filter */
  minYearsExperience?: number;
}

/**
 * Default search parameters
 */
export const DEFAULT_SEARCH_PARAMS: Partial<SearchParamsDto> = {
  topK: 10,
  minScore: 0.7
};

/**
 * Factory function to create search params with defaults
 */
export function createSearchParams(
  query: string,
  overrides: Partial<SearchParamsDto> = {}
): SearchParamsDto {
  return {
    query,
    topK: DEFAULT_SEARCH_PARAMS.topK,
    minScore: DEFAULT_SEARCH_PARAMS.minScore,
    ...overrides
  };
}

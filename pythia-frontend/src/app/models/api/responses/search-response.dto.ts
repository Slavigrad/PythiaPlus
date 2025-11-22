import { Candidate } from '../../core/candidate';

/**
 * Facet
 *
 * Represents a single facet value with count
 */
export interface FacetDto {
  /** Facet value (e.g., "Zurich", "React") */
  value: string;

  /** Number of candidates with this value */
  count: number;
}

/**
 * Facet Group
 *
 * All facets returned from search API (ordered by count desc)
 */
export interface FacetGroupDto {
  locations: FacetDto[];
  availabilities: FacetDto[];
  technologies: FacetDto[];
  skills: FacetDto[];
  certifications: FacetDto[];
}

/**
 * Search Response DTO
 *
 * Response from semantic search API
 * API Contract: GET /api/v1/search
 */
export interface SearchResponseDto {
  /** Search results (candidates) */
  results: Candidate[];

  /** Total number of results */
  totalCount: number;

  /** Original search query */
  query: string;

  /** Optional: Facets for filtering (if requested) */
  facets?: FacetGroupDto;
}

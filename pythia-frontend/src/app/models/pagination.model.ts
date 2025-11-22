/**
 * Pagination Model
 *
 * Shared pagination metadata used across all paginated responses
 */

/**
 * Pagination metadata
 *
 * Provides information about the current page and total available data
 */
export interface PaginationMetadata {
  /** Current page number (0-indexed) */
  page: number;

  /** Number of items per page */
  size: number;

  /** Total number of items across all pages */
  totalElements: number;

  /** Total number of pages */
  totalPages: number;
}


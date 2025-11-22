/**
 * Pagination Metadata Model (Shared)
 *
 * Shared pagination metadata used across all paginated responses
 * Backend-agnostic pagination structure
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

/**
 * Sort Direction
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Sort Order
 *
 * Represents sorting configuration
 */
export interface SortOrder {
  /** Field to sort by */
  field: string;

  /** Sort direction */
  direction: SortDirection;
}

/**
 * Pagination Request Parameters
 *
 * Query parameters for paginated API requests
 */
export interface PaginationParams {
  /** Page number (0-indexed) */
  page?: number;

  /** Page size */
  size?: number;

  /** Sort field */
  sortBy?: string;

  /** Sort direction */
  sortDirection?: SortDirection;
}

/**
 * Default pagination parameters
 */
export const DEFAULT_PAGINATION: PaginationParams = {
  page: 0,
  size: 10,
  sortDirection: SortDirection.ASC
};

/**
 * Check if there's a next page
 */
export function hasNextPage(pagination: PaginationMetadata): boolean {
  return pagination.page < pagination.totalPages - 1;
}

/**
 * Check if there's a previous page
 */
export function hasPreviousPage(pagination: PaginationMetadata): boolean {
  return pagination.page > 0;
}

/**
 * Get current page (1-indexed for display)
 */
export function getCurrentPageDisplay(pagination: PaginationMetadata): number {
  return pagination.page + 1;
}

/**
 * Calculate total pages from total elements and page size
 */
export function calculateTotalPages(totalElements: number, pageSize: number): number {
  return Math.ceil(totalElements / pageSize);
}

/**
 * Create empty pagination metadata
 */
export function createEmptyPagination(size: number = 10): PaginationMetadata {
  return {
    page: 0,
    size,
    totalElements: 0,
    totalPages: 0
  };
}

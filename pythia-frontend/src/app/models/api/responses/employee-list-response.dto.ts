import { Employee } from '../../core/employee';
import { PaginationMetadata } from '../../shared';

/**
 * Employee List Response DTO
 *
 * Paginated response from GET /api/v1/employees
 * Contains employee list and pagination metadata
 */
export interface EmployeeListResponseDto {
  /** Employee items for current page */
  items: Employee[];

  /** Pagination metadata */
  pagination: PaginationMetadata;
}

/**
 * Factory function to create empty employee list response
 */
export function createEmptyEmployeeListResponse(): EmployeeListResponseDto {
  return {
    items: [],
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }
  };
}

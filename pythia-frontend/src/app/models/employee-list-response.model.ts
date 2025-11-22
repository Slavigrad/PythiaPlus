/**
 * Employee List Response Model
 *
 * Pythia Hybrid response format for employee list endpoint
 * Matches Pythia's existing /search endpoint pattern for consistency
 */

import { Employee } from './employee.model';

/**
 * Employee List Response (Pythia Hybrid format)
 *
 * Response from GET /api/v1/employees with pagination
 * This format is consistent with Pythia's /search endpoint
 */
export interface EmployeeListResponse {
  employees: Employee[];
  pagination: PaginationMetadata;
}

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

  /** Total number of employees across all pages */
  totalElements: number;

  /** Total number of pages */
  totalPages: number;
}

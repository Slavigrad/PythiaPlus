/**
 * Employee List Response Model
 *
 * Pythia Hybrid response format for employee list endpoint
 * Matches Pythia's existing /search endpoint pattern for consistency
 */

import { Employee } from './employee.model';
import { PaginationMetadata } from './pagination.model';

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

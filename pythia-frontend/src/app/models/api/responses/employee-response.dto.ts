import { Employee } from '../../core/employee';

/**
 * Employee Create Response DTO
 *
 * Response from POST /api/v1/employees
 */
export interface EmployeeCreateResponseDto {
  id: number;
  fullName: string;
  email: string;
  message?: string;
}

/**
 * Employee Update Response DTO
 *
 * Response from PUT/PATCH /api/v1/employees/{id}
 */
export interface EmployeeUpdateResponseDto {
  message: string;
  employee: Employee;
}

/**
 * Employee Get Response DTO
 *
 * Response from GET /api/v1/employees/{id}
 */
export interface EmployeeGetResponseDto extends Employee {
  // Extends Employee - no additional fields needed
}

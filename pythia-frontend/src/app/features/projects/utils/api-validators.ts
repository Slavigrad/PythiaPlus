/**
 * API Response Validators
 *
 * Validates backend responses match expected contracts before processing.
 * Provides fail-fast error handling to catch backend bugs early.
 *
 * Design Philosophy:
 * - Validate structure AND types AND constraints
 * - Throw descriptive errors with context
 * - Use TypeScript assertion signatures for type narrowing
 * - Log validation failures for debugging
 *
 * @module APIValidators
 */

import { ProjectListResponseBackend } from '../../../models/project-backend.model';
import { isValidNumber, isValidArray } from './type-guards';

/**
 * Custom validation error with contextual details
 *
 * @example
 * ```typescript
 * throw new ValidationError('Missing field', { field: 'pagination', response });
 * ```
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';

    // Maintain proper stack trace in V8 engines
    if ('captureStackTrace' in Error) {
      (Error as { captureStackTrace(target: object, constructor: Function): void })
        .captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Validate project list response structure
 *
 * Checks that the backend response matches the expected contract:
 * - Has 'projects' array
 * - Has 'pagination' object with all required fields
 * - All fields have correct types
 * - All values meet logical constraints
 *
 * Uses TypeScript assertion signature to narrow type after validation.
 *
 * @param response - Raw backend response (unknown type)
 * @throws {ValidationError} If response is invalid
 *
 * @example
 * ```typescript
 * const response = await http.get('/api/v1/projects');
 * validateProjectListResponse(response);  // Throws if invalid
 * // After this line, TypeScript knows response is ProjectListResponseBackend
 * const projects = response.projects;  // Type-safe access
 * ```
 */
export function validateProjectListResponse(
  response: unknown
): asserts response is ProjectListResponseBackend {

  // ============================================================================
  // STEP 1: Check response exists
  // ============================================================================

  if (!response || typeof response !== 'object') {
    console.error('[API Validator] Response is null, undefined, or not an object:', response);
    throw new ValidationError(
      'Invalid API response: response is null or not an object',
      { response }
    );
  }

  const resp = response as Record<string, unknown>;

  // ============================================================================
  // STEP 2: Validate 'projects' array
  // ============================================================================

  if (!('projects' in resp)) {
    console.error('[API Validator] Response missing required field: projects', response);
    throw new ValidationError(
      'Invalid API response: missing required field "projects"',
      { response }
    );
  }

  if (!isValidArray(resp['projects'])) {
    console.error('[API Validator] Field "projects" is not an array:', resp['projects']);
    throw new ValidationError(
      'Invalid API response: "projects" must be an array',
      { projects: resp['projects'], response }
    );
  }

  // ============================================================================
  // STEP 3: Validate 'pagination' object exists
  // ============================================================================

  if (!('pagination' in resp)) {
    console.error('[API Validator] Response missing required field: pagination', response);
    throw new ValidationError(
      'Invalid API response: missing required field "pagination"',
      { response }
    );
  }

  if (!resp['pagination'] || typeof resp['pagination'] !== 'object') {
    console.error('[API Validator] Field "pagination" is not an object:', resp['pagination']);
    throw new ValidationError(
      'Invalid API response: "pagination" must be an object',
      { pagination: resp['pagination'], response }
    );
  }

  const pagination = resp['pagination'] as Record<string, unknown>;

  // ============================================================================
  // STEP 4: Validate pagination fields exist and have correct types
  // ============================================================================

  // Validate 'page' field
  if (!('page' in pagination)) {
    console.error('[API Validator] Pagination missing required field: page', pagination);
    throw new ValidationError(
      'Invalid API response: pagination missing required field "page"',
      { pagination }
    );
  }

  if (!isValidNumber(pagination['page'])) {
    console.error('[API Validator] pagination.page is not a valid number:', pagination['page']);
    throw new ValidationError(
      'Invalid API response: pagination.page must be a number',
      { page: pagination['page'], pagination }
    );
  }

  // Validate 'size' field
  if (!('size' in pagination)) {
    console.error('[API Validator] Pagination missing required field: size', pagination);
    throw new ValidationError(
      'Invalid API response: pagination missing required field "size"',
      { pagination }
    );
  }

  if (!isValidNumber(pagination['size'])) {
    console.error('[API Validator] pagination.size is not a valid number:', pagination['size']);
    throw new ValidationError(
      'Invalid API response: pagination.size must be a number',
      { size: pagination['size'], pagination }
    );
  }

  // Validate 'totalElements' field
  if (!('totalElements' in pagination)) {
    console.error('[API Validator] Pagination missing required field: totalElements', pagination);
    throw new ValidationError(
      'Invalid API response: pagination missing required field "totalElements"',
      { pagination }
    );
  }

  if (!isValidNumber(pagination['totalElements'])) {
    console.error('[API Validator] pagination.totalElements is not a valid number:', pagination['totalElements']);
    throw new ValidationError(
      'Invalid API response: pagination.totalElements must be a number',
      { totalElements: pagination['totalElements'], pagination }
    );
  }

  // Validate 'totalPages' field
  if (!('totalPages' in pagination)) {
    console.error('[API Validator] Pagination missing required field: totalPages', pagination);
    throw new ValidationError(
      'Invalid API response: pagination missing required field "totalPages"',
      { pagination }
    );
  }

  if (!isValidNumber(pagination['totalPages'])) {
    console.error('[API Validator] pagination.totalPages is not a valid number:', pagination['totalPages']);
    throw new ValidationError(
      'Invalid API response: pagination.totalPages must be a number',
      { totalPages: pagination['totalPages'], pagination }
    );
  }

  // ============================================================================
  // STEP 5: Validate logical constraints
  // ============================================================================

  // Page must be non-negative (0-indexed)
  if ((pagination['page'] as number) < 0) {
    console.error('[API Validator] pagination.page cannot be negative:', pagination['page']);
    throw new ValidationError(
      'Invalid API response: pagination.page cannot be negative',
      { page: pagination['page'], pagination }
    );
  }

  // Size must be positive
  if ((pagination['size'] as number) <= 0) {
    console.error('[API Validator] pagination.size must be positive:', pagination['size']);
    throw new ValidationError(
      'Invalid API response: pagination.size must be positive',
      { size: pagination['size'], pagination }
    );
  }

  // TotalElements must be non-negative
  if ((pagination['totalElements'] as number) < 0) {
    console.error('[API Validator] pagination.totalElements cannot be negative:', pagination['totalElements']);
    throw new ValidationError(
      'Invalid API response: pagination.totalElements cannot be negative',
      { totalElements: pagination['totalElements'], pagination }
    );
  }

  // TotalPages must be non-negative
  if ((pagination['totalPages'] as number) < 0) {
    console.error('[API Validator] pagination.totalPages cannot be negative:', pagination['totalPages']);
    throw new ValidationError(
      'Invalid API response: pagination.totalPages cannot be negative',
      { totalPages: pagination['totalPages'], pagination }
    );
  }

  // ============================================================================
  // STEP 6: Validate totalPages calculation (optional but recommended)
  // ============================================================================

  const expectedTotalPages = (pagination['totalElements'] as number) === 0
    ? 0
    : Math.ceil((pagination['totalElements'] as number) / (pagination['size'] as number));

  if ((pagination['totalPages'] as number) !== expectedTotalPages) {
    console.warn(
      `[API Validator] pagination.totalPages (${pagination['totalPages']}) doesn't match calculation ` +
      `(ceil(${pagination['totalElements']} / ${pagination['size']}) = ${expectedTotalPages}). ` +
      `This may indicate a backend bug.`
    );
    // Don't throw - just warn, as backend might have valid reasons for different calculation
  }

  // ============================================================================
  // STEP 7: Validate projects array size (warning only)
  // ============================================================================

  const projectsCount = (resp['projects'] as unknown[]).length;

  // Check if number of projects exceeds page size
  if (projectsCount > (pagination['size'] as number)) {
    console.warn(
      `[API Validator] Response contains ${projectsCount} projects but page size is ${pagination['size']}. ` +
      `This may indicate a backend bug.`
    );
  }

  // Check if we're on a non-last page but have fewer items than page size
  if (
    projectsCount < (pagination['size'] as number) &&
    projectsCount > 0 &&
    (pagination['page'] as number) < (pagination['totalPages'] as number) - 1
  ) {
    console.warn(
      `[API Validator] On page ${pagination['page']} (not last page) but only ${projectsCount} items ` +
      `(expected ${pagination['size']}). This may indicate a backend bug.`
    );
  }

  // ============================================================================
  // Validation passed! TypeScript now knows this is ProjectListResponseBackend
  // ============================================================================
}

/**
 * Validate that a response contains expected properties
 *
 * Generic validator for checking presence of required fields.
 *
 * @param response - Response object to validate
 * @param requiredFields - Array of required field names
 * @param entityName - Name of entity being validated (for error messages)
 * @throws {ValidationError} If any required field is missing
 *
 * @example
 * ```typescript
 * validateRequiredFields(project, ['id', 'name', 'status'], 'Project');
 * ```
 */
export function validateRequiredFields(
  response: unknown,
  requiredFields: string[],
  entityName: string
): void {

  if (!response || typeof response !== 'object') {
    throw new ValidationError(
      `Invalid ${entityName}: response is null or not an object`,
      { response }
    );
  }

  const obj = response as Record<string, unknown>;

  for (const field of requiredFields) {
    if (!(field in obj)) {
      console.error(`[API Validator] ${entityName} missing required field: ${field}`, response);
      throw new ValidationError(
        `Invalid ${entityName}: missing required field "${field}"`,
        { field, response }
      );
    }

    if (obj[field] === null || obj[field] === undefined) {
      console.error(`[API Validator] ${entityName}.${field} is null or undefined`, response);
      throw new ValidationError(
        `Invalid ${entityName}: field "${field}" is null or undefined`,
        { field, value: obj[field], response }
      );
    }
  }
}

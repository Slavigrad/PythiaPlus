/**
 * Data Mappers - Barrel Export
 *
 * Data transformation utilities for converting between models
 * Pure functions for mapping between domain models and DTOs
 *
 * Mappers:
 * - employeeToProfile - Maps Employee → CandidateProfile
 *   Converts backend Employee model to frontend CandidateProfile
 *
 * Usage:
 * ```typescript
 * import { mapEmployeesToProfiles } from '@app/services/mappers';
 *
 * const profiles = mapEmployeesToProfiles(employees);
 * ```
 */

export * from './employee-to-profile.mapper';

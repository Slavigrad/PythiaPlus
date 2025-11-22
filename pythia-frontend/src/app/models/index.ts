/**
 * Models Root Barrel Export
 *
 * Legendary, world-class models architecture for PythiaPlus
 * Domain-Driven Design meets SOLID Principles
 *
 * Architecture:
 * - /core       - Core business domain models (Employee, Candidate, Profile, Project)
 * - /api        - API contracts (DTOs for requests/responses)
 * - /search     - Search domain (facets, filters, match scores)
 * - /shared     - Cross-domain utilities (pagination, sorting)
 * - /enums      - Centralized enumerations (Availability, Seniority, etc.)
 *
 * Usage Examples:
 * ```typescript
 * // Import from root
 * import { Employee, Candidate, Availability } from '@app/models';
 *
 * // Import from specific domain
 * import { Employee } from '@app/models/core/employee';
 * import { SearchParamsDto } from '@app/models/api/requests';
 * ```
 */

// ============================================================================
// CORE DOMAIN MODELS
// ============================================================================
// Pure business entities, domain logic, no API coupling

export * from './core/employee';
export * from './core/candidate';
export * from './core/profile';
export * from './core/project';

// ============================================================================
// API LAYER (DTOs)
// ============================================================================
// Data Transfer Objects for backend communication

export * from './api/requests';
export * from './api/responses';

// ============================================================================
// SEARCH DOMAIN
// ============================================================================
// Search-specific models (facets, filters, match scores)

export * from './search';

// ============================================================================
// SHARED MODELS
// ============================================================================
// Cross-domain utilities (pagination, sorting)

export * from './shared';

// ============================================================================
// ENUMS
// ============================================================================
// Centralized enumerations (single source of truth)

export * from './enums';

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================
// Most commonly used models re-exported for easy access

// Core entities
export type {
  // Employee domain
  Employee,
  EmployeePartial,
  EmployeeCreate,
  EmployeeUpdate,

  // Candidate domain
  Candidate,
  CandidateProfile,
  MatchScore,
  CurrentProject,

  // Profile components
  Skill,
  Technology,
  Certification,
  Language,
  WorkExperience,
  Education,
  Training,
  Role,

  // Project domain
  Project,
  ProjectBackend
} from './core';

// API DTOs
export type {
  // Request DTOs
  EmployeeCreateRequestDto,
  EmployeeUpdateRequestDto,
  SearchParamsDto,

  // Response DTOs
  SearchResponseDto,
  EmployeeCreateResponseDto,
  EmployeeUpdateResponseDto,
  EmployeeListResponseDto,
  FacetDto,
  FacetGroupDto
} from './api';

// Search domain
export type {
  Facet,
  FacetGroup,
  InternalFilters,
  SearchResult
} from './search';

// Shared
export type {
  PaginationMetadata,
  PaginationParams,
  SortOrder
} from './shared';

// Enums
export {
  Availability,
  Seniority,
  Proficiency,
  LanguageProficiency,
  SortDirection
} from './enums';

export {
  MatchScoreCategory
} from './search';

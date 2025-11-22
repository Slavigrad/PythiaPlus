/**
 * Type Guards and Validators
 *
 * Runtime type validation and conversion for backend data.
 * Replaces unsafe 'as any' casts with proper type-safe conversions.
 *
 * Design Philosophy:
 * - Fail gracefully with sensible defaults
 * - Log warnings for invalid data (helps catch backend bugs)
 * - Full type safety (no 'any' casts)
 * - Comprehensive JSDoc documentation
 *
 * @module TypeGuards
 */

import {
  ProjectComplexity,
  MilestoneStatus,
  SkillImportance,
  SkillProficiency,
  ProjectTechnology
} from '../../../models';

/**
 * Technology category type
 */
type TechnologyCategory = ProjectTechnology['category'];

/**
 * Validate and convert backend complexity string to frontend enum
 *
 * Handles both backend formats:
 * - LOW/MEDIUM/HIGH/VERY_HIGH (backend format)
 * - SIMPLE/MODERATE/COMPLEX/ENTERPRISE (frontend format)
 *
 * @param value - Backend complexity value
 * @returns Type-safe ProjectComplexity enum value
 *
 * @example
 * ```typescript
 * parseComplexity('HIGH')      // → 'COMPLEX'
 * parseComplexity('MODERATE')  // → 'MODERATE'
 * parseComplexity('INVALID')   // → 'MODERATE' (default, logs warning)
 * parseComplexity(null)        // → 'MODERATE' (default, logs warning)
 * ```
 */
export function parseComplexity(value: string | null | undefined): ProjectComplexity {
  // Mapping from backend values to frontend values
  const complexityMap: Record<string, ProjectComplexity> = {
    'LOW': 'SIMPLE',
    'MEDIUM': 'MODERATE',
    'HIGH': 'COMPLEX',
    'VERY_HIGH': 'ENTERPRISE',
    'SIMPLE': 'SIMPLE',
    'MODERATE': 'MODERATE',
    'COMPLEX': 'COMPLEX',
    'ENTERPRISE': 'ENTERPRISE'
  };

  if (!value) {
    console.warn('[TypeGuard] Missing complexity value, defaulting to MODERATE');
    return 'MODERATE';
  }

  const normalized = value.toUpperCase();
  const complexity = complexityMap[normalized];

  if (!complexity) {
    console.warn(`[TypeGuard] Unknown complexity value: "${value}", defaulting to MODERATE`);
    return 'MODERATE';
  }

  return complexity;
}

/**
 * Validate and convert milestone status string to enum
 *
 * @param value - Backend milestone status value
 * @returns Type-safe MilestoneStatus enum value
 *
 * @example
 * ```typescript
 * parseMilestoneStatus('IN_PROGRESS')  // → 'IN_PROGRESS'
 * parseMilestoneStatus('completed')    // → 'COMPLETED'
 * parseMilestoneStatus('INVALID')      // → 'PLANNED' (default, logs warning)
 * ```
 */
export function parseMilestoneStatus(value: string | null | undefined): MilestoneStatus {
  const validStatuses: MilestoneStatus[] = [
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'DELAYED',
    'CANCELLED'
  ];

  if (!value) {
    console.warn('[TypeGuard] Missing milestone status, defaulting to PLANNED');
    return 'PLANNED';
  }

  const normalized = value.toUpperCase() as MilestoneStatus;

  if (!validStatuses.includes(normalized)) {
    console.warn(`[TypeGuard] Invalid milestone status: "${value}", defaulting to PLANNED`);
    return 'PLANNED';
  }

  return normalized;
}

/**
 * Validate and convert skill importance string to enum
 *
 * @param value - Backend skill importance value
 * @returns Type-safe SkillImportance enum value
 *
 * @example
 * ```typescript
 * parseSkillImportance('CRITICAL')     // → 'REQUIRED'
 * parseSkillImportance('REQUIRED')     // → 'REQUIRED'
 * parseSkillImportance('PREFERRED')    // → 'PREFERRED'
 * parseSkillImportance('INVALID')      // → 'PREFERRED' (default, logs warning)
 * ```
 */
export function parseSkillImportance(value: string | null | undefined): SkillImportance {
  // Map backend values to frontend values
  const importanceMap: Record<string, SkillImportance> = {
    'CRITICAL': 'REQUIRED',
    'REQUIRED': 'REQUIRED',
    'IMPORTANT': 'PREFERRED',
    'PREFERRED': 'PREFERRED',
    'NICE_TO_HAVE': 'NICE_TO_HAVE',
    'OPTIONAL': 'NICE_TO_HAVE'
  };

  if (!value) {
    console.warn('[TypeGuard] Missing skill importance, defaulting to PREFERRED');
    return 'PREFERRED';
  }

  const normalized = value.toUpperCase();
  const importance = importanceMap[normalized];

  if (!importance) {
    console.warn(`[TypeGuard] Invalid skill importance: "${value}", defaulting to PREFERRED`);
    return 'PREFERRED';
  }

  return importance;
}

/**
 * Validate and convert skill proficiency string to enum
 *
 * @param value - Backend skill proficiency value
 * @returns Type-safe SkillProficiency enum value
 *
 * @example
 * ```typescript
 * parseSkillProficiency('EXPERT')       // → 'expert'
 * parseSkillProficiency('Intermediate') // → 'intermediate'
 * parseSkillProficiency('INVALID')      // → 'intermediate' (default, logs warning)
 * ```
 */
export function parseSkillProficiency(value: string | null | undefined): SkillProficiency {
  const validValues: SkillProficiency[] = ['beginner', 'intermediate', 'advanced', 'expert'];

  if (!value) {
    console.warn('[TypeGuard] Missing skill proficiency, defaulting to intermediate');
    return 'intermediate';
  }

  const normalized = value.toLowerCase() as SkillProficiency;

  if (!validValues.includes(normalized)) {
    console.warn(`[TypeGuard] Invalid skill proficiency: "${value}", defaulting to intermediate`);
    return 'intermediate';
  }

  return normalized;
}

/**
 * Validate and convert technology category string to enum
 *
 * @param value - Backend technology category value
 * @returns Type-safe TechnologyCategory enum value
 *
 * @example
 * ```typescript
 * parseTechnologyCategory('Frontend')   // → 'Frontend'
 * parseTechnologyCategory('backend')    // → 'Backend'
 * parseTechnologyCategory('INVALID')    // → 'Other' (default)
 * parseTechnologyCategory(null)         // → 'Other' (default)
 * ```
 */
export function parseTechnologyCategory(value: string | null | undefined): TechnologyCategory {
  const validCategories: TechnologyCategory[] = [
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Mobile',
    'Language',
    'Framework',
    'Other'
  ];

  if (!value) {
    return 'Other';
  }

  // Find case-insensitive match
  const category = validCategories.find(
    cat => cat.toLowerCase() === value.toLowerCase()
  );

  if (!category) {
    console.warn(`[TypeGuard] Unknown technology category: "${value}", defaulting to Other`);
    return 'Other';
  }

  return category;
}

/**
 * Type guard to check if a value is a non-empty string
 *
 * @param value - Value to check
 * @returns True if value is a non-empty string
 *
 * @example
 * ```typescript
 * isNonEmptyString('hello')  // → true
 * isNonEmptyString('')       // → false
 * isNonEmptyString(null)     // → false
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard to check if a value is a valid number
 *
 * @param value - Value to check
 * @returns True if value is a finite number
 *
 * @example
 * ```typescript
 * isValidNumber(42)        // → true
 * isValidNumber(NaN)       // → false
 * isValidNumber(Infinity)  // → false
 * isValidNumber('42')      // → false
 * ```
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Type guard to check if a value is a valid array
 *
 * @param value - Value to check
 * @returns True if value is an array
 *
 * @example
 * ```typescript
 * isValidArray([1, 2, 3])  // → true
 * isValidArray([])         // → true
 * isValidArray(null)       // → false
 * isValidArray('array')    // → false
 * ```
 */
export function isValidArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

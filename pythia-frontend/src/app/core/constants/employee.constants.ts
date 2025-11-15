/**
 * Employee Domain Constants - Pythia+
 * Centralized configuration for employee-related enumerations and values
 *
 * Purpose: Single source of truth for employee domain hardcoded values
 * Benefits: Type safety, maintainability, reusability across the application
 */

// ========================================
// Proficiency Levels
// ========================================

/**
 * Proficiency levels for technologies and skills
 * Used to indicate expertise level in a particular technology or skill
 */
export const PROFICIENCY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert'
] as const;

/**
 * Human-readable labels for proficiency levels
 */
export const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert'
};

/**
 * Proficiency level type derived from constant array
 */
export type Proficiency = typeof PROFICIENCY_LEVELS[number];

// ========================================
// Availability Status
// ========================================

/**
 * Employee availability statuses
 * Indicates current availability for new projects or positions
 */
export const AVAILABILITY_STATUSES = [
  'available',
  'busy',
  'unavailable',
  'notice_period'
] as const;

/**
 * Human-readable labels for availability statuses
 */
export const AVAILABILITY_LABELS: Record<Availability, string> = {
  available: 'Available',
  busy: 'Busy',
  unavailable: 'Unavailable',
  notice_period: 'Notice Period'
};

/**
 * Availability status type derived from constant array
 */
export type Availability = typeof AVAILABILITY_STATUSES[number];

// ========================================
// Seniority Levels
// ========================================

/**
 * Employee seniority levels
 * Represents career progression and experience level
 */
export const SENIORITY_LEVELS = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
  'Principal',
  'Staff'
] as const;

/**
 * Seniority level type derived from constant array
 */
export type Seniority = typeof SENIORITY_LEVELS[number];

/**
 * Typical years of experience range for each seniority level
 * Used for validation and UI hints
 */
export const SENIORITY_EXPERIENCE_RANGES: Record<Seniority, { min: number; max: number }> = {
  'Junior': { min: 0, max: 2 },
  'Mid-Level': { min: 2, max: 5 },
  'Senior': { min: 5, max: 10 },
  'Lead': { min: 8, max: 15 },
  'Principal': { min: 12, max: 20 },
  'Staff': { min: 15, max: 30 }
};

// ========================================
// Language Proficiency
// ========================================

/**
 * Language proficiency levels
 * Based on CEFR (Common European Framework of Reference for Languages)
 */
export const LANGUAGE_PROFICIENCY_LEVELS = [
  'native',
  'fluent',
  'advanced',
  'intermediate',
  'beginner'
] as const;

/**
 * Human-readable labels for language proficiency levels
 */
export const LANGUAGE_PROFICIENCY_LABELS: Record<LanguageProficiency, string> = {
  native: 'Native',
  fluent: 'Fluent (C2)',
  advanced: 'Advanced (C1)',
  intermediate: 'Intermediate (B1-B2)',
  beginner: 'Beginner (A1-A2)'
};

/**
 * Language proficiency type derived from constant array
 */
export type LanguageProficiency = typeof LANGUAGE_PROFICIENCY_LEVELS[number];

// ========================================
// Common Degree Types
// ========================================

/**
 * Common academic degree types
 * Used for education entries
 */
export const DEGREE_TYPES = [
  'BSc',
  'MSc',
  'PhD',
  'BA',
  'MA',
  'MBA',
  'BEng',
  'MEng',
  'Diploma',
  'Certificate'
] as const;

/**
 * Degree type derived from constant array
 */
export type DegreeType = typeof DEGREE_TYPES[number];


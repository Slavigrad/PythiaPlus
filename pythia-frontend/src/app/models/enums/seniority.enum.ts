/**
 * Seniority Enum
 *
 * Employee seniority levels
 * Centralized enum to prevent duplication
 */
export enum Seniority {
  JUNIOR = 'Junior',
  MID = 'Mid',
  SENIOR = 'Senior',
  LEAD = 'Lead',
  PRINCIPAL = 'Principal'
}

/**
 * Type alias for string literal union (alternative to enum)
 */
export type SeniorityType = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';

/**
 * Type guard to check if value is valid seniority
 */
export function isSeniority(value: unknown): value is Seniority {
  return Object.values(Seniority).includes(value as Seniority);
}

/**
 * Array of all seniority values (useful for dropdowns)
 */
export const SENIORITY_OPTIONS: readonly Seniority[] = Object.values(Seniority);

/**
 * Seniority ordering for comparisons (0 = lowest, 4 = highest)
 */
export const SENIORITY_ORDER: Record<Seniority, number> = {
  [Seniority.JUNIOR]: 0,
  [Seniority.MID]: 1,
  [Seniority.SENIOR]: 2,
  [Seniority.LEAD]: 3,
  [Seniority.PRINCIPAL]: 4
};

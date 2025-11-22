/**
 * Proficiency Enum
 *
 * Skill/Technology proficiency levels
 * Centralized enum to prevent duplication
 */
export enum Proficiency {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

/**
 * Type alias for string literal union (alternative to enum)
 */
export type ProficiencyType = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/**
 * Type guard to check if value is valid proficiency
 */
export function isProficiency(value: unknown): value is Proficiency {
  return Object.values(Proficiency).includes(value as Proficiency);
}

/**
 * Array of all proficiency values (useful for dropdowns)
 */
export const PROFICIENCY_OPTIONS: readonly Proficiency[] = Object.values(Proficiency);

/**
 * Proficiency ordering for comparisons (0 = lowest, 3 = highest)
 */
export const PROFICIENCY_ORDER: Record<Proficiency, number> = {
  [Proficiency.BEGINNER]: 0,
  [Proficiency.INTERMEDIATE]: 1,
  [Proficiency.ADVANCED]: 2,
  [Proficiency.EXPERT]: 3
};

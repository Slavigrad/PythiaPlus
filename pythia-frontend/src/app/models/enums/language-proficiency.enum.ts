/**
 * Language Proficiency Enum
 *
 * Language proficiency levels (CEFR standard: A1-C2)
 * Centralized enum to prevent duplication
 */
export enum LanguageProficiency {
  A1 = 'A1',  // Beginner
  A2 = 'A2',  // Elementary
  B1 = 'B1',  // Intermediate
  B2 = 'B2',  // Upper Intermediate
  C1 = 'C1',  // Advanced
  C2 = 'C2',  // Proficient
  NATIVE = 'Native'
}

/**
 * Type alias for string literal union (alternative to enum)
 */
export type LanguageProficiencyType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

/**
 * Type guard to check if value is valid language proficiency
 */
export function isLanguageProficiency(value: unknown): value is LanguageProficiency {
  return Object.values(LanguageProficiency).includes(value as LanguageProficiency);
}

/**
 * Array of all language proficiency values (useful for dropdowns)
 */
export const LANGUAGE_PROFICIENCY_OPTIONS: readonly LanguageProficiency[] = Object.values(LanguageProficiency);

/**
 * Language proficiency ordering for comparisons (0 = lowest, 6 = highest)
 */
export const LANGUAGE_PROFICIENCY_ORDER: Record<LanguageProficiency, number> = {
  [LanguageProficiency.A1]: 0,
  [LanguageProficiency.A2]: 1,
  [LanguageProficiency.B1]: 2,
  [LanguageProficiency.B2]: 3,
  [LanguageProficiency.C1]: 4,
  [LanguageProficiency.C2]: 5,
  [LanguageProficiency.NATIVE]: 6
};

/**
 * Language proficiency descriptions
 */
export const LANGUAGE_PROFICIENCY_DESCRIPTIONS: Record<LanguageProficiency, string> = {
  [LanguageProficiency.A1]: 'Beginner - Can understand and use basic phrases',
  [LanguageProficiency.A2]: 'Elementary - Can communicate in simple routine tasks',
  [LanguageProficiency.B1]: 'Intermediate - Can deal with most situations while traveling',
  [LanguageProficiency.B2]: 'Upper Intermediate - Can interact with native speakers fluently',
  [LanguageProficiency.C1]: 'Advanced - Can use language flexibly and effectively',
  [LanguageProficiency.C2]: 'Proficient - Can understand virtually everything',
  [LanguageProficiency.NATIVE]: 'Native - Mother tongue or equivalent mastery'
};

import { LanguageProficiency } from '../../enums';

/**
 * Language Model (Domain Entity)
 *
 * Represents language proficiency in an employee or candidate profile
 * This is the core domain model - not tied to API structure
 */
export interface Language {
  /** Language identifier */
  id: number;

  /** Language name (e.g., "English", "German", "French") */
  name: string;

  /** Proficiency level (CEFR: A1-C2, Native) */
  proficiency: LanguageProficiency;

  /** Optional: Specific level code (e.g., "C2", "B2") */
  level?: string;
}

/**
 * Language with Master Data (for autocomplete/selection)
 *
 * Extended language model that includes master data fields
 */
export interface LanguageWithMetadata extends Language {
  /** ISO 639-1 language code (e.g., "en", "de", "fr") */
  code: string;

  /** Language description */
  description: string;

  /** Language category/family (e.g., "Germanic", "Romance") */
  category: string;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Check if language proficiency is business-ready (B2 or higher)
 */
export function isBusinessReady(language: Language): boolean {
  const businessReadyLevels: LanguageProficiency[] = [
    LanguageProficiency.B2,
    LanguageProficiency.C1,
    LanguageProficiency.C2,
    LanguageProficiency.NATIVE
  ];
  return businessReadyLevels.includes(language.proficiency);
}

/**
 * Factory function to create a new language
 */
export function createLanguage(
  name: string,
  proficiency: LanguageProficiency = LanguageProficiency.A1,
  level?: string
): Omit<Language, 'id'> {
  return {
    name,
    proficiency,
    level
  };
}

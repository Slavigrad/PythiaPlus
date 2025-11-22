import { Proficiency } from '../../enums';

/**
 * Skill Model (Domain Entity)
 *
 * Represents a skill entry in an employee or candidate profile
 * This is the core domain model - not tied to API structure
 */
export interface Skill {
  /** Skill identifier */
  id: number;

  /** Skill name (e.g., "Angular", "Leadership", "Agile") */
  name: string;

  /** Proficiency level in this skill */
  proficiency: Proficiency;

  /** Years of experience with this skill */
  years: number;
}

/**
 * Skill with Master Data (for autocomplete/selection)
 *
 * Extended skill model that includes master data fields
 */
export interface SkillWithMetadata extends Skill {
  /** Unique code identifier from master data */
  code: string | null;

  /** Skill description from master data */
  description: string;

  /** Skill category (e.g., "Technical", "Soft Skills") */
  category: string;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Factory function to create a new skill
 */
export function createSkill(
  name: string,
  proficiency: Proficiency = Proficiency.BEGINNER,
  years: number = 0
): Omit<Skill, 'id'> {
  return {
    name,
    proficiency,
    years
  };
}

import { Proficiency } from '../../enums';

/**
 * Technology Model (Domain Entity)
 *
 * Represents a technology/tool entry in an employee or candidate profile
 * This is the core domain model - not tied to API structure
 */
export interface Technology {
  /** Technology identifier */
  id: number;

  /** Technology name (e.g., "Angular", "PostgreSQL", "Docker") */
  name: string;

  /** Proficiency level in this technology */
  proficiency: Proficiency;

  /** Years of experience with this technology */
  years: number;
}

/**
 * Technology with Master Data (for autocomplete/selection)
 *
 * Extended technology model that includes master data fields
 */
export interface TechnologyWithMetadata extends Technology {
  /** Unique code identifier from master data */
  code: string | null;

  /** Technology description from master data */
  description: string;

  /** Technology category (e.g., "Frontend", "Backend", "Database") */
  category: string;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Factory function to create a new technology
 */
export function createTechnology(
  name: string,
  proficiency: Proficiency = Proficiency.BEGINNER,
  years: number = 0
): Omit<Technology, 'id'> {
  return {
    name,
    proficiency,
    years
  };
}

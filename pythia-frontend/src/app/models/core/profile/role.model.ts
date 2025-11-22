/**
 * Role Model (Domain Entity)
 *
 * Represents a job role or position
 * This is the core domain model - not tied to API structure
 */
export interface Role {
  /** Role identifier */
  id: number;

  /** Role name/title (e.g., "Senior Software Engineer", "Product Manager") */
  name: string;

  /** Optional: Role description */
  description?: string;

  /** Optional: Department (e.g., "Engineering", "Product") */
  department?: string;

  /** Optional: Level/Grade */
  level?: string;
}

/**
 * Role with Master Data (for autocomplete/selection)
 *
 * Extended role model that includes master data fields
 */
export interface RoleWithMetadata extends Role {
  /** Unique code identifier from master data */
  code: string | null;

  /** Role category (e.g., "Engineering", "Management") */
  category: string;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Factory function to create a new role
 */
export function createRole(
  name: string,
  options: {
    description?: string;
    department?: string;
    level?: string;
  } = {}
): Omit<Role, 'id'> {
  return {
    name,
    description: options.description,
    department: options.department,
    level: options.level
  };
}

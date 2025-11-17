/**
 * Skill Model
 *
 * Represents a skill entry in the master data system
 */
export interface Skill {
  id: number;
  name: string;
  code: string | null;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Skill API Response
 *
 * Response structure from GET /api/v1/skills
 */
export interface SkillResponse {
  items: Skill[];
  total: number;
  category: string;
}

/**
 * Skill Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface SkillRequest {
  name: string;
  code?: string; // Optional - unique identifier code
  description: string;
  category?: string; // Optional - defaults to "Skills" on backend
}

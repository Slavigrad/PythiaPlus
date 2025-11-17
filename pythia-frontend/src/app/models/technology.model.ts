/**
 * Technology Model
 *
 * Represents a technology entry in the master data system
 */
export interface Technology {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Technology API Response
 *
 * Response structure from GET /api/v1/technologies
 */
export interface TechnologyResponse {
  items: Technology[];
  total: number;
  category: string;
}

/**
 * Technology Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface TechnologyRequest {
  name: string;
  description: string;
  category?: string; // Optional - defaults to "Technologies" on backend
}

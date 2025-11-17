/**
 * Language Model
 *
 * Represents a language entry in the master data system
 */
export interface Language {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Language API Response
 *
 * Response structure from GET /api/v1/languages
 */
export interface LanguageResponse {
  items: Language[];
  total: number;
  category: string;
}

/**
 * Language Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface LanguageRequest {
  name: string;
  description: string;
  category?: string; // Optional - defaults to "Languages" on backend
}

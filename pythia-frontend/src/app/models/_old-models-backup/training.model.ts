/**
 * Training Model
 *
 * Represents a training entry in the master data system
 */
export interface Training {
  id: number;
  name: string;
  code: string | null;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Training API Response
 *
 * Response structure from GET /api/v1/trainings
 */
export interface TrainingResponse {
  items: Training[];
  total: number;
  category: string;
}

/**
 * Training Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface TrainingRequest {
  name: string;
  code?: string; // Optional - unique identifier code
  description: string;
  category?: string; // Optional - defaults to "Trainings" on backend
}

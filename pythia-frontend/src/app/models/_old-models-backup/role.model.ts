/**
 * Role Model
 *
 * Represents a role entry in the master data system
 */
export interface Role {
  id: number;
  name: string;
  code: string | null;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role API Response
 *
 * Response structure from GET /api/v1/roles
 */
export interface RoleResponse {
  items: Role[];
  total: number;
  category: string;
}

/**
 * Role Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface RoleRequest {
  name: string;
  code?: string; // Optional - unique identifier code
  description: string;
  category?: string; // Optional - defaults to "Roles" on backend
}

/**
 * Certificate Model
 *
 * Represents a certificate entry in the master data system
 */
export interface Certificate {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Certificate API Response
 *
 * Response structure from GET /api/v1/certificates
 */
export interface CertificateResponse {
  items: Certificate[];
  total: number;
  category: string;
}

/**
 * Certificate Create/Update Request
 *
 * Payload for POST/PUT operations
 */
export interface CertificateRequest {
  name: string;
  description: string;
  category?: string; // Optional - defaults to "Certificates" on backend
}

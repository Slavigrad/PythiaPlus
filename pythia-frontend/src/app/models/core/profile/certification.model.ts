/**
 * Certification Model (Domain Entity)
 *
 * Represents a professional certification
 * This is the core domain model - not tied to API structure
 */
export interface Certification {
  /** Certification identifier */
  id: number;

  /** Certification name (e.g., "AWS Certified Solutions Architect") */
  name: string;

  /** Date when certification was issued (ISO date string) */
  issuedOn: string;

  /** Expiration date (ISO date string) or null if no expiration */
  expiresOn: string | null;

  /** Optional: Issuing organization */
  issuingOrganization?: string;

  /** Optional: Credential ID for verification */
  credentialId?: string;

  /** Optional: URL to verify certification */
  credentialUrl?: string;
}

/**
 * Certification with Master Data (for autocomplete/selection)
 *
 * Extended certification model that includes master data fields
 */
export interface CertificationWithMetadata extends Certification {
  /** Unique code identifier from master data */
  code: string | null;

  /** Certification description from master data */
  description: string;

  /** Certification category (e.g., "Cloud", "Agile", "Security") */
  category: string;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Check if certification is currently valid (not expired)
 */
export function isCertificationValid(cert: Certification): boolean {
  if (!cert.expiresOn) {
    return true; // No expiration = always valid
  }

  const expiryDate = new Date(cert.expiresOn);
  const today = new Date();
  return expiryDate > today;
}

/**
 * Check if certification is expiring soon (within next 90 days)
 */
export function isCertificationExpiringSoon(cert: Certification, daysThreshold: number = 90): boolean {
  if (!cert.expiresOn) {
    return false; // No expiration = not expiring
  }

  const expiryDate = new Date(cert.expiresOn);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
}

/**
 * Factory function to create a new certification
 */
export function createCertification(
  name: string,
  issuedOn: string,
  options: {
    expiresOn?: string | null;
    issuingOrganization?: string;
    credentialId?: string;
    credentialUrl?: string;
  } = {}
): Omit<Certification, 'id'> {
  return {
    name,
    issuedOn,
    expiresOn: options.expiresOn ?? null,
    issuingOrganization: options.issuingOrganization,
    credentialId: options.credentialId,
    credentialUrl: options.credentialUrl
  };
}

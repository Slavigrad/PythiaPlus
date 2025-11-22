/**
 * Availability Enum
 *
 * Employee/Candidate availability status
 * Centralized enum to prevent duplication
 */
export enum Availability {
  AVAILABLE = 'Available',
  NOTICE_PERIOD = 'Notice Period',
  UNAVAILABLE = 'Unavailable'
}

/**
 * Type alias for string literal union (alternative to enum)
 */
export type AvailabilityType = 'Available' | 'Notice Period' | 'Unavailable';

/**
 * Type guard to check if value is valid availability
 */
export function isAvailability(value: unknown): value is Availability {
  return Object.values(Availability).includes(value as Availability);
}

/**
 * Array of all availability values (useful for dropdowns)
 */
export const AVAILABILITY_OPTIONS: readonly Availability[] = Object.values(Availability);

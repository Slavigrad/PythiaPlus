/**
 * Training Model (Domain Entity)
 *
 * Represents a training, course, or workshop
 * This is the core domain model - not tied to API structure
 */
export interface Training {
  /** Training identifier */
  id: number;

  /** Training name/title */
  name: string;

  /** Training provider/organization */
  provider: string;

  /** Completion date (ISO date string: YYYY-MM-DD) */
  completionDate: string;

  /** Optional: Duration in hours */
  durationHours?: number;

  /** Optional: Certificate URL */
  certificateUrl?: string;

  /** Optional: Training description */
  description?: string;

  /** Optional: Skills learned */
  skills?: string[];
}

/**
 * Check if training was completed recently (within last 12 months)
 */
export function isRecentTraining(training: Training, monthsThreshold: number = 12): boolean {
  const completionDate = new Date(training.completionDate);
  const today = new Date();
  const monthsSinceCompletion = Math.floor(
    (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return monthsSinceCompletion <= monthsThreshold;
}

/**
 * Factory function to create a new training
 */
export function createTraining(
  name: string,
  provider: string,
  completionDate: string,
  options: {
    durationHours?: number;
    certificateUrl?: string;
    description?: string;
    skills?: string[];
  } = {}
): Omit<Training, 'id'> {
  return {
    name,
    provider,
    completionDate,
    durationHours: options.durationHours,
    certificateUrl: options.certificateUrl,
    description: options.description,
    skills: options.skills
  };
}

/**
 * Work Experience Model (Domain Entity)
 *
 * Represents a work experience entry in an employee or candidate profile
 * This is the core domain model - not tied to API structure
 */
export interface WorkExperience {
  /** Work experience identifier */
  id: number;

  /** Company name */
  company: string;

  /** Job title/role */
  role: string;

  /** Start date (ISO date string: YYYY-MM-DD) */
  startDate: string;

  /** End date (ISO date string: YYYY-MM-DD) or null if current position */
  endDate: string | null;

  /** Job description and responsibilities */
  description: string;

  /** Optional: Location of the job */
  location?: string;

  /** Optional: Employment type (Full-time, Part-time, Contract, etc.) */
  employmentType?: string;
}

/**
 * Check if this is current employment (no end date)
 */
export function isCurrentPosition(experience: WorkExperience): boolean {
  return experience.endDate === null;
}

/**
 * Calculate duration in months
 */
export function getDurationInMonths(experience: WorkExperience): number {
  const start = new Date(experience.startDate);
  const end = experience.endDate ? new Date(experience.endDate) : new Date();

  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

/**
 * Get formatted duration string (e.g., "2 years 3 months")
 */
export function getFormattedDuration(experience: WorkExperience): string {
  const months = getDurationInMonths(experience);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }

  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
}

/**
 * Factory function to create a new work experience
 */
export function createWorkExperience(
  company: string,
  role: string,
  startDate: string,
  options: {
    endDate?: string | null;
    description?: string;
    location?: string;
    employmentType?: string;
  } = {}
): Omit<WorkExperience, 'id'> {
  return {
    company,
    role,
    startDate,
    endDate: options.endDate ?? null,
    description: options.description ?? '',
    location: options.location,
    employmentType: options.employmentType
  };
}

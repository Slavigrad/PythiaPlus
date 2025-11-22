/**
 * Project Model (Domain Entity)
 *
 * Represents a project in the system
 * This is the core domain model - not tied to API structure
 */
export interface Project {
  /** Project identifier */
  id: number;

  /** Project name */
  name: string;

  /** Company/client name */
  company: string;

  /** Project description */
  description: string;

  /** Start date (ISO date string: YYYY-MM-DD) */
  startDate: string;

  /** End date (ISO date string: YYYY-MM-DD) or null if ongoing */
  endDate: string | null;

  /** Optional: Project status */
  status?: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';

  /** Optional: Technologies used in project */
  technologies?: string[];

  /** Optional: Team size */
  teamSize?: number;

  /** Optional: Role in project */
  role?: string;
}

/**
 * Project Backend Model (API Response)
 *
 * Backend representation of a project
 * Used for API integration
 */
export interface ProjectBackend {
  id: number;
  projectName: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  employeeId: number;
}

/**
 * Check if project is currently active (no end date)
 */
export function isActiveProject(project: Project): boolean {
  return project.endDate === null;
}

/**
 * Calculate project duration in months
 */
export function getProjectDurationMonths(project: Project): number {
  const start = new Date(project.startDate);
  const end = project.endDate ? new Date(project.endDate) : new Date();

  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

/**
 * Get formatted project duration (e.g., "2 years 3 months")
 */
export function getFormattedProjectDuration(project: Project): string {
  const months = getProjectDurationMonths(project);
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
 * Map backend project to domain project
 */
export function mapBackendProject(backend: ProjectBackend): Project {
  return {
    id: backend.id,
    name: backend.projectName,
    company: backend.companyName,
    description: backend.description ?? '',
    startDate: backend.startDate,
    endDate: backend.endDate
  };
}

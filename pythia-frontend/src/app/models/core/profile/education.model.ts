/**
 * Education Model (Domain Entity)
 *
 * Represents an education entry in an employee or candidate profile
 * This is the core domain model - not tied to API structure
 */
export interface Education {
  /** Education identifier */
  id: number;

  /** Institution name (e.g., "ETH Zurich", "University of St. Gallen") */
  institution: string;

  /** Degree type (e.g., "BSc", "MSc", "PhD", "MBA") */
  degree: string;

  /** Field of study (e.g., "Computer Science", "Business Administration") */
  field: string;

  /** Start year */
  startYear: number;

  /** End year (or expected graduation year) */
  endYear: number;

  /** Optional: GPA or grade */
  gpa?: string;

  /** Optional: Honors or distinctions */
  honors?: string;

  /** Optional: Description of coursework or achievements */
  description?: string;
}

/**
 * Check if education is currently in progress
 */
export function isCurrentEducation(education: Education): boolean {
  const currentYear = new Date().getFullYear();
  return education.endYear >= currentYear;
}

/**
 * Get formatted education period (e.g., "2015-2019")
 */
export function getEducationPeriod(education: Education): string {
  return `${education.startYear}-${education.endYear}`;
}

/**
 * Get formatted education title (e.g., "MSc Computer Science")
 */
export function getEducationTitle(education: Education): string {
  return `${education.degree} ${education.field}`;
}

/**
 * Factory function to create a new education entry
 */
export function createEducation(
  institution: string,
  degree: string,
  field: string,
  startYear: number,
  endYear: number,
  options: {
    gpa?: string;
    honors?: string;
    description?: string;
  } = {}
): Omit<Education, 'id'> {
  return {
    institution,
    degree,
    field,
    startYear,
    endYear,
    gpa: options.gpa,
    honors: options.honors,
    description: options.description
  };
}

import { Availability, Seniority } from '../../enums';
import {
  Technology,
  Skill,
  Certification,
  Language,
  WorkExperience,
  Education
} from '../profile';

/**
 * Employee Model (Core Domain Entity)
 *
 * Represents a complete employee profile with all associated data
 * This is the primary domain model for internal employee management
 *
 * Domain Rules:
 * - fullName and email are required (unique identifiers)
 * - All profile arrays default to empty if not provided
 * - location can be computed from city + country
 * - yearsExperience should match total work experience duration
 */
export interface Employee {
  /** Unique employee identifier */
  id: number;

  /** Full name (required) */
  fullName: string;

  /** Job title */
  title: string;

  /** Email address (required, unique) */
  email: string;

  /** Phone number */
  phone: string;

  /** Optional: Combined location (e.g., "Zurich, Switzerland") */
  location?: string;

  /** Optional: City from backend */
  city?: string;

  /** Optional: Country from backend */
  country?: string;

  /** Profile picture URL or base64 */
  profilePicture: string;

  /** Professional summary/bio */
  summary: string;

  /** Department (e.g., "Engineering", "Product") */
  department: string;

  /** Seniority level */
  seniority: Seniority;

  /** Total years of professional experience */
  yearsExperience: number;

  /** Current availability status */
  availability: Availability;

  /** Technologies/tools expertise */
  technologies: Technology[];

  /** Skills (technical and soft skills) */
  skills: Skill[];

  /** Professional certifications */
  certifications: Certification[];

  /** Language proficiencies */
  languages: Language[];

  /** Work history */
  workExperiences: WorkExperience[];

  /** Educational background */
  educations: Education[];

  /** Created timestamp (ISO date string) */
  createdAt: string | null;

  /** Last updated timestamp (ISO date string) */
  updatedAt: string | null;
}

/**
 * Partial employee for draft/edit state
 */
export type EmployeePartial = Partial<Employee>;

/**
 * Employee creation payload (without id and timestamps)
 */
export type EmployeeCreate = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Employee update payload (without id and timestamps)
 */
export type EmployeeUpdate = Partial<EmployeeCreate>;

/**
 * Check if employee is currently available
 */
export function isEmployeeAvailable(employee: Employee): boolean {
  return employee.availability === Availability.AVAILABLE;
}

/**
 * Get employee's primary technology stack (top 5 by years)
 */
export function getPrimaryTechnologies(employee: Employee, limit: number = 5): Technology[] {
  return [...employee.technologies]
    .sort((a, b) => b.years - a.years)
    .slice(0, limit);
}

/**
 * Get employee's years of experience as formatted string
 */
export function getFormattedExperience(employee: Employee): string {
  const years = Math.floor(employee.yearsExperience);
  const decimal = employee.yearsExperience - years;
  const months = Math.round(decimal * 12);

  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }

  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
}

/**
 * Compute location from city and country
 */
export function computeLocation(city?: string, country?: string): string {
  if (city && country) {
    return `${city}, ${country}`;
  }
  return city || country || '';
}

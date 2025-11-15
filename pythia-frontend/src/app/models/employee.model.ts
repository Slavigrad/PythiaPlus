/**
 * Employee Model
 *
 * Represents a complete employee profile with skills, experience, and certifications
 * Used for displaying detailed employee information in the talent search system
 */

/**
 * Proficiency levels for technologies and skills
 */
export type Proficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Employee availability status
 */
export type Availability = 'available' | 'busy' | 'unavailable' | 'notice_period';

/**
 * Seniority levels
 */
export type Seniority = 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Principal' | 'Staff';

/**
 * Technology expertise with proficiency and years of experience
 */
export interface Technology {
  id: number;
  name: string;
  proficiency: Proficiency;
  years: number;
}

/**
 * Skill with proficiency and years of experience
 */
export interface Skill {
  id: number;
  name: string;
  proficiency: Proficiency;
  years: number;
}

/**
 * Professional certification
 */
export interface Certification {
  id: number;
  name: string;
  issuedOn: string;  // ISO date string
  expiresOn: string | null;  // ISO date string or null if no expiration
}

/**
 * Language proficiency
 */
export interface Language {
  id: number;
  name: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
  level?: string;  // e.g., "C2", "B2", etc.
}

/**
 * Work experience entry
 */
export interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startDate: string;  // ISO date string
  endDate: string | null;  // ISO date string or null if current position
  description: string;
}

/**
 * Education entry
 */
export interface Education {
  id: number;
  institution: string;
  degree: string;  // e.g., "MSc", "BSc", "PhD"
  field: string;   // e.g., "Computer Science"
  startYear: number;
  endYear: number;
}

/**
 * Complete Employee Profile
 *
 * Main interface representing a full employee record with all associated data
 */
export interface Employee {
  id: number;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  profilePicture: string;
  summary: string;
  department: string;
  seniority: Seniority;
  yearsExperience: number;
  availability: Availability;
  technologies: Technology[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  workExperiences: WorkExperience[];
  educations: Education[];
  createdAt: string | null;  // ISO date string
  updatedAt: string | null;  // ISO date string
}

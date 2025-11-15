/**
 * Employee Update Models
 *
 * Request DTOs for updating employee profiles via PUT/PATCH endpoints
 * Matches backend API structure exactly
 */

/**
 * Technology update item for employee profile
 */
export interface TechnologyUpdateItem {
  technologyId: number;
  proficiency?: string;  // e.g., "beginner", "intermediate", "advanced", "expert"
  years?: number;
}

/**
 * Skill update item for employee profile
 */
export interface SkillUpdateItem {
  skillId: number;
  proficiency?: string;  // e.g., "beginner", "intermediate", "advanced", "expert"
  years?: number;
}

/**
 * Certification update item for employee profile
 */
export interface CertificationUpdateItem {
  certificationId: number;
  issuedOn?: string;     // ISO date format: "2023-01-15"
  expiresOn?: string;    // ISO date format: "2026-01-15" or null for no expiry
}

/**
 * Language update item for employee profile
 */
export interface LanguageUpdateItem {
  languageId: number;
  level?: string;        // e.g., "A1", "A2", "B1", "B2", "C1", "C2", "native"
}

/**
 * Work experience update item for employee profile
 */
export interface WorkExperienceUpdateItem {
  company: string;
  role: string;
  startDate: string;     // ISO date format: "2020-01-01"
  endDate?: string | null;  // ISO date format or null for current position
  description?: string;
}

/**
 * Education update item for employee profile
 */
export interface EducationUpdateItem {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;  // null for ongoing education
}

/**
 * Employee Update Request
 *
 * Main DTO for updating employee profiles via PUT or PATCH
 * All fields are optional - omitted fields preserve existing values
 *
 * IMPORTANT: Array fields (technologies, skills, etc.) use DELETE ALL + INSERT strategy
 * - Send empty array [] to clear all items
 * - Omit field to keep existing items unchanged
 * - Send array with items to replace all existing items
 */
export interface EmployeeUpdateRequest {
  // Basic Information
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  summary?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability?: 'available' | 'notice' | 'unavailable';

  // Technologies (DELETE ALL + INSERT)
  technologies?: TechnologyUpdateItem[];

  // Skills (DELETE ALL + INSERT)
  skills?: SkillUpdateItem[];

  // Certifications (DELETE ALL + INSERT)
  certifications?: CertificationUpdateItem[];

  // Languages (DELETE ALL + INSERT)
  languages?: LanguageUpdateItem[];

  // Work Experiences (DELETE ALL + INSERT)
  workExperiences?: WorkExperienceUpdateItem[];

  // Educations (DELETE ALL + INSERT)
  educations?: EducationUpdateItem[];
}

/**
 * Employee Update Response
 *
 * Response from backend after successful update
 */
export interface EmployeeUpdateResponse {
  message: string;
  employee: any;  // Will be typed as Employee from employee.model.ts
}

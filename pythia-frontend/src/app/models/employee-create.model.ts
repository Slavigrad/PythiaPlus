/**
 * Employee Create Model
 *
 * Data Transfer Object for creating new employee profiles
 * Matches the backend API contract from:
 * /backend-api/employee-create/frontend-employee-create-integration-guide.md
 */

import { Availability, Seniority, Proficiency, LanguageProficiency } from '../core/constants/employee.constants';

/**
 * Technology for employee creation
 */
export interface EmployeeCreateTechnology {
  name: string;
  proficiency: string;  // Beginner, Intermediate, Advanced, Expert
  yearsOfExperience?: number;
}

/**
 * Skill for employee creation
 */
export interface EmployeeCreateSkill {
  name: string;
  proficiency: string;  // Beginner, Intermediate, Advanced, Expert
  yearsOfExperience?: number;
}

/**
 * Certification for employee creation
 */
export interface EmployeeCreateCertification {
  name: string;
  issuingOrganization: string;
  issueDate?: string;  // YYYY-MM-DD format
  expiryDate?: string;  // YYYY-MM-DD format or undefined if doesn't expire
  credentialId?: string;
  credentialUrl?: string;
}

/**
 * Language for employee creation (references language by ID)
 */
export interface EmployeeCreateLanguage {
  languageId: number;
  level: LanguageProficiency;
}

/**
 * Work experience for employee creation
 */
export interface EmployeeCreateWorkExperience {
  company: string;
  role: string;
  startDate: string;  // YYYY-MM-DD format
  endDate: string | null;  // YYYY-MM-DD format or null for current position
  description: string;
}

/**
 * Education for employee creation
 */
export interface EmployeeCreateEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;  // YYYY-MM-DD format
  endDate?: string;   // YYYY-MM-DD format or undefined for current enrollment
}

/**
 * Complete Employee Create Request
 *
 * API Contract: POST /api/v1/employees
 * Required fields: fullName, email
 * All other fields are optional
 */
export interface EmployeeCreate {
  // Required fields
  fullName: string;
  email: string;

  // Optional basic information
  title?: string;
  phone?: string;
  city?: string;
  country?: string;
  location?: string;  // Combined location field for UI
  profilePicture?: string;
  summary?: string;
  department?: string;
  seniority?: Seniority;
  yearsExperience?: number;
  availability?: Availability;

  // Optional related arrays
  technologies?: EmployeeCreateTechnology[];
  skills?: EmployeeCreateSkill[];
  certifications?: EmployeeCreateCertification[];
  languages?: EmployeeCreateLanguage[];
  workExperiences?: EmployeeCreateWorkExperience[];
  educations?: EmployeeCreateEducation[];
}

/**
 * Partial employee create for draft state
 * All fields are optional (including the required ones)
 */
export type EmployeeCreateDraft = Partial<EmployeeCreate>;

/**
 * Employee creation API response
 */
export interface EmployeeCreateResponse {
  id: number;
  fullName: string;
  email: string;
  // ... other fields populated by backend
}

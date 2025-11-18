/**
 * Employee Create Model
 *
 * Data Transfer Object for creating new employee profiles
 * Matches the backend API contract from:
 * /backend-api/employee-create/frontend-employee-create-integration-guide.md
 */

import { Availability, Seniority, Proficiency, LanguageProficiency } from '../core/constants/employee.constants';

/**
 * Technology for employee creation (references technology by ID)
 */
export interface EmployeeCreateTechnology {
  technologyId: number;
  proficiency: Proficiency;
  years: number;
}

/**
 * Skill for employee creation (references skill by ID)
 */
export interface EmployeeCreateSkill {
  skillId: number;
  proficiency: Proficiency;
  years: number;
}

/**
 * Certification for employee creation (references certification by ID)
 */
export interface EmployeeCreateCertification {
  certificationId: number;
  issuedOn: string;  // YYYY-MM-DD format
  expiresOn: string | null;  // YYYY-MM-DD format or null
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
  field: string;
  startYear: number;
  endYear: number;
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

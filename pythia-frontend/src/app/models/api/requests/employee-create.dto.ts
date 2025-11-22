import { Availability, Seniority, Proficiency, LanguageProficiency } from '../../enums';

/**
 * Employee Create Request DTO
 *
 * Data Transfer Object for creating new employee profiles
 * API Contract: POST /api/v1/employees
 *
 * Required fields: fullName, email
 * All other fields are optional
 */

/**
 * Technology for employee creation
 */
export interface EmployeeCreateTechnologyDto {
  name: string;
  proficiency: Proficiency | string;
  yearsOfExperience?: number;
}

/**
 * Skill for employee creation
 */
export interface EmployeeCreateSkillDto {
  name: string;
  proficiency: Proficiency | string;
  yearsOfExperience?: number;
}

/**
 * Certification for employee creation
 */
export interface EmployeeCreateCertificationDto {
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
export interface EmployeeCreateLanguageDto {
  languageId: number;
  level: LanguageProficiency | string;
}

/**
 * Work experience for employee creation
 */
export interface EmployeeCreateWorkExperienceDto {
  company: string;
  role: string;
  startDate: string;  // YYYY-MM-DD format
  endDate: string | null;  // YYYY-MM-DD format or null for current position
  description: string;
}

/**
 * Education for employee creation
 */
export interface EmployeeCreateEducationDto {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;  // YYYY-MM-DD format
  endDate?: string;   // YYYY-MM-DD format or undefined for current enrollment
}

/**
 * Complete Employee Create Request DTO
 */
export interface EmployeeCreateRequestDto {
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
  seniority?: Seniority | string;
  yearsExperience?: number;
  availability?: Availability | string;

  // Optional related arrays
  technologies?: EmployeeCreateTechnologyDto[];
  skills?: EmployeeCreateSkillDto[];
  certifications?: EmployeeCreateCertificationDto[];
  languages?: EmployeeCreateLanguageDto[];
  workExperiences?: EmployeeCreateWorkExperienceDto[];
  educations?: EmployeeCreateEducationDto[];
}

/**
 * Partial employee create for draft state
 */
export type EmployeeCreateDraftDto = Partial<EmployeeCreateRequestDto>;

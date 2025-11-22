import { Availability, Seniority } from '../../enums';

/**
 * Employee Update Request DTO
 *
 * Data Transfer Object for updating employee profiles
 * API Contract: PUT/PATCH /api/v1/employees/{id}
 *
 * All fields are optional - omitted fields preserve existing values
 *
 * IMPORTANT: Array fields use DELETE ALL + INSERT strategy
 * - Send empty array [] to clear all items
 * - Omit field to keep existing items unchanged
 * - Send array with items to replace all existing items
 */

/**
 * Technology update item
 */
export interface TechnologyUpdateItemDto {
  technologyId: number;
  proficiency?: string;
  years?: number;
}

/**
 * Skill update item
 */
export interface SkillUpdateItemDto {
  skillId: number;
  proficiency?: string;
  years?: number;
}

/**
 * Certification update item
 */
export interface CertificationUpdateItemDto {
  certificationId: number;
  issuedOn?: string;  // ISO date: "2023-01-15"
  expiresOn?: string;  // ISO date: "2026-01-15" or null
}

/**
 * Language update item
 */
export interface LanguageUpdateItemDto {
  languageId: number;
  level?: string;  // "A1", "A2", "B1", "B2", "C1", "C2", "Native"
}

/**
 * Work experience update item
 */
export interface WorkExperienceUpdateItemDto {
  company: string;
  role: string;
  startDate: string;  // ISO date: "2020-01-01"
  endDate?: string | null;  // ISO date or null for current
  description?: string;
}

/**
 * Education update item
 */
export interface EducationUpdateItemDto {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;  // null for ongoing
}

/**
 * Complete Employee Update Request DTO
 */
export interface EmployeeUpdateRequestDto {
  // Basic Information (all optional)
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  summary?: string;
  department?: string;
  seniority?: Seniority | string;
  yearsExperience?: number;
  availability?: Availability | string;

  // Related arrays (DELETE ALL + INSERT strategy)
  technologies?: TechnologyUpdateItemDto[];
  skills?: SkillUpdateItemDto[];
  certifications?: CertificationUpdateItemDto[];
  languages?: LanguageUpdateItemDto[];
  workExperiences?: WorkExperienceUpdateItemDto[];
  educations?: EducationUpdateItemDto[];
}

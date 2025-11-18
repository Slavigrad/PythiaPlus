/**
 * Employee List Response Model
 *
 * HAL/HATEOAS response format for employee list endpoint
 */

/**
 * Employee summary for list view
 * Simplified version of Employee interface for list display
 * Note: id is extracted from _links.self.href by the service
 */
export interface EmployeeListItem {
  id?: number;  // Extracted from _links.self.href
  fullName: string;
  title: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  summary: string;
  department: string;
  seniority: string;
  yearsExperience: number;
  availability: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  _links?: {
    self: { href: string };
    employee: { href: string };
    experiences: { href: string };
    employeeSkills: { href: string };
    employeeCertifications: { href: string };
    educations: { href: string };
    employeeTechnologies: { href: string };
    employeeLanguages: { href: string };
  };
}

/**
 * Pagination metadata
 */
export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

/**
 * HAL Links
 */
export interface HalLinks {
  self: { href: string };
  profile?: { href: string };
  search?: { href: string };
}

/**
 * Employee List Response (HAL/HATEOAS format)
 */
export interface EmployeeListResponse {
  _embedded: {
    employees: EmployeeListItem[];
  };
  _links: HalLinks;
  page: PageMetadata;
}

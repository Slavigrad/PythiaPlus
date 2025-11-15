import { Candidate } from './candidate.model';

/**
 * Technology with experience details
 */
export interface Technology {
  name: string;             // "Node.js"
  yearsExperience: number;  // 7
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

/**
 * Training/Course information
 */
export interface Training {
  name: string;             // "Angular Advanced Workshop"
  provider?: string;        // "Google", "Coursera", etc.
  completedYear?: number;   // 2023
}

/**
 * Professional certification
 */
export interface Certification {
  name: string;             // "AWS Solutions Architect"
  issuer: string;           // "Amazon Web Services"
  issuedDate?: string;      // "2023-05"
  expiryDate?: string;      // "2026-05" or null
}

/**
 * Current or past project
 */
export interface CurrentProject {
  name: string;             // "E-Commerce Platform"
  company: string;          // "Tech Corp"
  role: string;             // "Lead Developer"
  startDate?: string;       // "2024-01"
}

/**
 * Experience details
 */
export interface ExperienceDetails {
  totalYears: number;       // 6
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
}

/**
 * Availability details
 */
export interface AvailabilityDetails {
  status: 'Available' | 'Busy' | 'Not Available';
  startDate?: string;       // ISO date string: "2025-12-01"
}

/**
 * Extended Candidate Profile for Comparison
 *
 * Extends the base Candidate interface with detailed information
 * needed for side-by-side comparison view.
 */
export interface CandidateProfile extends Candidate {
  // Override experience and availability with detailed types
  experienceDetails: ExperienceDetails;
  availabilityDetails: AvailabilityDetails;

  // Detailed technology breakdown (replaces simple technologies array)
  detailedTechnologies: Technology[];

  // Detailed trainings (beyond simple list)
  trainings: Training[];

  // Detailed certifications (with dates and issuers)
  detailedCertifications: Certification[];

  // Current project details (replaces simple currentProject)
  currentProjectDetails?: CurrentProject;
}

import { Availability } from '../../enums';

/**
 * Match Score
 *
 * Represents semantic search match score
 */
export interface MatchScore {
  /** Matched score (0.0 to 1.0) - cosine similarity */
  matched: number;

  /** Total possible score (always 1.0 for normalized scores) */
  total: number;
}

/**
 * Current Project
 *
 * Candidate's current project information
 */
export interface CurrentProject {
  /** Project name */
  name: string;

  /** Company/client name */
  company: string;
}

/**
 * Candidate Model (Core Domain Entity)
 *
 * Represents a candidate profile in the talent search system
 * Optimized for search results and quick candidate evaluation
 *
 * Domain Rules:
 * - id, name, title are required
 * - matchScore represents semantic similarity to search query
 * - Arrays (technologies, skills, certifications) may be null from backend
 * - Availability determines if candidate can be approached
 */
export interface Candidate {
  /** Unique candidate identifier */
  id: string;

  /** Display name (short form) */
  name: string;

  /** Full name (for backend compatibility) */
  fullName: string;

  /** Job title */
  title: string;

  /** Location (e.g., "Zurich, Switzerland") */
  location: string;

  /** Profile picture URL or base64 */
  profilePicture: string;

  /** Total experience (e.g., "10.5 years") */
  experience: string;

  /** Current availability status */
  availability: Availability;

  /** Technologies/tools (may be null from API) */
  technologies: string[] | null;

  /** Skills (may be null from API) */
  skills: string[] | null;

  /** Certifications (may be null from API) */
  certifications: string[] | null;

  /** Current project information (may be null from API) */
  currentProject: CurrentProject | null;

  /** Semantic search match score */
  matchScore: MatchScore;
}

/**
 * Candidate Profile (Extended)
 *
 * Extended candidate model with full profile details
 * Used when showing detailed candidate information
 */
export interface CandidateProfile extends Candidate {
  /** Email address */
  email: string;

  /** Phone number */
  phone: string;

  /** Professional summary/bio */
  summary: string;

  /** Department */
  department: string;

  /** Language proficiencies */
  languages: string[];

  /** Work history */
  workHistory: string[];

  /** Educational background */
  education: string[];
}

/**
 * Check if candidate is currently available
 */
export function isCandidateAvailable(candidate: Candidate): boolean {
  return candidate.availability === Availability.AVAILABLE;
}

/**
 * Get match score as percentage (0-100)
 */
export function getMatchScorePercentage(candidate: Candidate): number {
  return Math.round(candidate.matchScore.matched * 100);
}

/**
 * Get match score as formatted string (e.g., "85%")
 */
export function getFormattedMatchScore(candidate: Candidate): string {
  return `${getMatchScorePercentage(candidate)}%`;
}

/**
 * Check if candidate has high match score (>= 80%)
 */
export function isHighMatch(candidate: Candidate, threshold: number = 0.8): boolean {
  return candidate.matchScore.matched >= threshold;
}

/**
 * Get all candidate technologies (handles null)
 */
export function getCandidateTechnologies(candidate: Candidate): string[] {
  return candidate.technologies ?? [];
}

/**
 * Get all candidate skills (handles null)
 */
export function getCandidateSkills(candidate: Candidate): string[] {
  return candidate.skills ?? [];
}

/**
 * Get all candidate certifications (handles null)
 */
export function getCandidateCertifications(candidate: Candidate): string[] {
  return candidate.certifications ?? [];
}

/**
 * Get candidate initials from name
 */
export function getCandidateInitials(candidate: Candidate): string {
  return candidate.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

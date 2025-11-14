/**
 * Candidate Model
 *
 * Represents a candidate profile in the talent search system
 * Note: Some fields may be null when returned from backend
 */
export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  profilePicture: string;
  experience: string;
  availability: 'Available' | 'Notice Period' | 'Unavailable';
  technologies: string[] | null;
  skills: string[] | null;
  certifications: string[] | null;
  currentProject: {
    name: string;
    company: string;
  } | null;
  matchScore: {
    matched: number;  // 0.0 to 1.0
    total: number;    // Always 1
  };
}

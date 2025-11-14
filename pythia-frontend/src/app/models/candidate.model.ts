/**
 * Candidate Model
 *
 * Represents a candidate profile in the talent search system
 */
export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  profilePicture: string;
  experience: string;
  availability: 'Available' | 'Notice Period' | 'Not Available';
  technologies: string[];
  skills: string[];
  certifications: string[];
  currentProject: {
    name: string;
    company: string;
  };
  matchScore: {
    matched: number;  // 0.0 to 1.0
    total: number;    // Always 1
  };
}

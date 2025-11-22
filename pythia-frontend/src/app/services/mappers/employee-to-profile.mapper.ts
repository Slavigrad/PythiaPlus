import { Employee } from '../models/employee.model';
import { CandidateProfile, Technology, Certification } from '../models/candidate-profile.model';

/**
 * Employee to CandidateProfile Mapper
 *
 * Purpose: Transform backend Employee data to frontend CandidateProfile format
 * Handles: Field name mismatches, data structure transformations, formatting
 */

/**
 * Map Employee to CandidateProfile
 *
 * Transforms the backend Employee model to the frontend CandidateProfile model
 * Handles name field mismatch (name vs fullName) and data structure differences
 */
export function mapEmployeeToProfile(employee: any): CandidateProfile {
  // Handle both 'name' (backend) and 'fullName' (frontend) fields
  const fullName = employee.fullName || employee.name || 'Unknown';

  // Map availability to match expected format
  const availabilityMap: Record<string, 'Available' | 'Notice Period' | 'Unavailable'> = {
    'available': 'Available',
    'notice': 'Notice Period',
    'unavailable': 'Unavailable'
  };

  const availability = availabilityMap[employee.availability?.toLowerCase()] || 'Available';

  // Map seniority to experience level
  const seniorityToLevel: Record<string, 'Junior' | 'Mid' | 'Senior' | 'Lead'> = {
    'Junior': 'Junior',
    'Mid': 'Mid',
    'Senior': 'Senior',
    'Lead': 'Lead',
    'Principal': 'Lead' // Map Principal to Lead
  };

  const level = seniorityToLevel[employee.seniority] || 'Mid';

  // Map availability status for detailed view
  const availabilityStatus: Record<string, 'Available' | 'Busy' | 'Not Available'> = {
    'Available': 'Available',
    'Notice Period': 'Busy',
    'Unavailable': 'Not Available'
  };

  const detailedAvailability = availabilityStatus[availability] || 'Available';

  // Transform to CandidateProfile format
  return {
    // Basic fields
    id: String(employee.id),
    name: fullName,  // For backward compatibility
    fullName,
    title: employee.title || '',
    location: employee.location || '',
    profilePicture: employee.profilePicture || '',

    // Experience (use the number directly, will be formatted in component)
    experience: employee.yearsExperience || 0,

    // Availability (use the string directly, will be formatted in component)
    availability,

    // Map technologies with proficiency
    technologies: (employee.technologies || []).map((tech: any) => tech.name || ''),

    // Skills (for backward compatibility)
    skills: (employee.skills || []).map((skill: any) => skill.name || ''),

    // Certifications (for backward compatibility)
    certifications: (employee.certifications || []).map((cert: any) => cert.name || ''),

    // Match score (placeholder for comparison view)
    matchScore: {
      matched: 0,
      total: 1
    },

    // Current project
    currentProject: employee.workExperiences?.[0]?.company
      ? {
          name: employee.workExperiences[0].company,
          company: employee.workExperiences[0].company
        }
      : null,

    // Detailed fields for comparison view
    experienceDetails: {
      totalYears: employee.yearsExperience || 0,
      level
    },

    availabilityDetails: {
      status: detailedAvailability,
      startDate: undefined // Backend doesn't provide this
    },

    detailedTechnologies: (employee.technologies || []).map((tech: any): Technology => ({
      name: tech.name || '',
      yearsExperience: tech.years || 0,
      proficiency: mapProficiency(tech.proficiency)
    })),

    trainings: [], // Backend doesn't provide trainings yet

    detailedCertifications: (employee.certifications || []).map((cert: any): Certification => ({
      name: cert.name || '',
      issuer: 'Unknown', // Backend doesn't provide issuer yet
      issuedDate: cert.issuedOn || undefined,
      expiryDate: cert.expiresOn || undefined
    })),

    currentProjectDetails: employee.workExperiences?.[0]
      ? {
          name: employee.workExperiences[0].company || '',
          company: employee.workExperiences[0].company || '',
          role: employee.workExperiences[0].role || '',
          startDate: employee.workExperiences[0].startDate || undefined
        }
      : undefined
  };
}

/**
 * Map proficiency level from backend to frontend format
 */
function mapProficiency(proficiency: string): 'Beginner' | 'Intermediate' | 'Expert' {
  const lowerProf = proficiency?.toLowerCase();

  if (lowerProf === 'beginner') return 'Beginner';
  if (lowerProf === 'intermediate') return 'Intermediate';
  if (lowerProf === 'advanced' || lowerProf === 'expert') return 'Expert';

  return 'Intermediate'; // Default
}

/**
 * Batch map multiple employees to profiles
 */
export function mapEmployeesToProfiles(employees: any[]): CandidateProfile[] {
  return employees.map(mapEmployeeToProfile);
}

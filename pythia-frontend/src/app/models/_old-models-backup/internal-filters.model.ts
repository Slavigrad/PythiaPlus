/**
 * Internal Filters Model
 *
 * Represents client-side filters applied to already-loaded search results
 * These filters work in-memory without backend calls for instant refinement
 */
export interface InternalFilters {
  /**
   * Text search within loaded results
   * Searches across: name, title, location, availability, technologies, skills, certifications
   */
  searchText: string;

  /**
   * Selected technology filters from quick chips
   * AND logic: candidate must have ALL selected technologies
   */
  technologies: string[];

  /**
   * Selected skill filters from quick chips
   * AND logic: candidate must have ALL selected skills
   */
  skills: string[];

  /**
   * Selected certification filters from quick chips
   * AND logic: candidate must have ALL selected certifications
   */
  certifications: string[];
}

/**
 * Factory function to create empty internal filters
 */
export function createEmptyInternalFilters(): InternalFilters {
  return {
    searchText: '',
    technologies: [],
    skills: [],
    certifications: []
  };
}

/**
 * Check if any internal filters are active
 */
export function hasActiveInternalFilters(filters: InternalFilters): boolean {
  return (
    filters.searchText.trim() !== '' ||
    filters.technologies.length > 0 ||
    filters.skills.length > 0 ||
    filters.certifications.length > 0
  );
}

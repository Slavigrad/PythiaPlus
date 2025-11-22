/**
 * Internal Filters Model (Search Domain)
 *
 * Client-side filters applied to already-loaded search results
 * These filters work in-memory without backend calls for instant refinement
 *
 * Use Case: User already has 50 search results, wants to quickly filter by
 * specific technologies without re-running the semantic search
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

/**
 * Count number of active filters
 */
export function countActiveFilters(filters: InternalFilters): number {
  let count = 0;
  if (filters.searchText.trim() !== '') count++;
  count += filters.technologies.length;
  count += filters.skills.length;
  count += filters.certifications.length;
  return count;
}

/**
 * Clear all filters
 */
export function clearAllFilters(): InternalFilters {
  return createEmptyInternalFilters();
}

/**
 * Remove specific technology filter
 */
export function removeTechnologyFilter(
  filters: InternalFilters,
  technology: string
): InternalFilters {
  return {
    ...filters,
    technologies: filters.technologies.filter(t => t !== technology)
  };
}

/**
 * Remove specific skill filter
 */
export function removeSkillFilter(
  filters: InternalFilters,
  skill: string
): InternalFilters {
  return {
    ...filters,
    skills: filters.skills.filter(s => s !== skill)
  };
}

/**
 * Remove specific certification filter
 */
export function removeCertificationFilter(
  filters: InternalFilters,
  certification: string
): InternalFilters {
  return {
    ...filters,
    certifications: filters.certifications.filter(c => c !== certification)
  };
}

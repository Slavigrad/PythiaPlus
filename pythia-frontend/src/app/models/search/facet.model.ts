/**
 * Facet Model (Search Domain)
 *
 * Represents a single facet value with count
 * Used for filtering and refining search results
 */
export interface Facet {
  /** Facet value (e.g., "Zurich", "Available", "React") */
  value: string;

  /** Number of candidates matching this facet value */
  count: number;
}

/**
 * Facet Group Model (Search Domain)
 *
 * All facets returned from search API
 * Facets are ordered by count (descending) for better UX
 */
export interface FacetGroup {
  /** Location facets (e.g., ["Zurich: 45", "Basel: 23"]) */
  locations: Facet[];

  /** Availability facets (e.g., ["Available: 120", "Notice Period: 45"]) */
  availabilities: Facet[];

  /** Technology facets (e.g., ["React: 89", "Angular: 67"]) */
  technologies: Facet[];

  /** Skill facets (e.g., ["Leadership: 102", "Agile: 87"]) */
  skills: Facet[];

  /** Certification facets (e.g., ["AWS Certified: 34", "PMP: 12"]) */
  certifications: Facet[];
}

/**
 * Get top N facets from a facet array
 */
export function getTopFacets(facets: Facet[], limit: number = 10): Facet[] {
  return facets.slice(0, limit);
}

/**
 * Find facet by value
 */
export function findFacetByValue(facets: Facet[], value: string): Facet | undefined {
  return facets.find(f => f.value === value);
}

/**
 * Check if facet group is empty
 */
export function isFacetGroupEmpty(facetGroup: FacetGroup): boolean {
  return (
    facetGroup.locations.length === 0 &&
    facetGroup.availabilities.length === 0 &&
    facetGroup.technologies.length === 0 &&
    facetGroup.skills.length === 0 &&
    facetGroup.certifications.length === 0
  );
}

/**
 * Create empty facet group
 */
export function createEmptyFacetGroup(): FacetGroup {
  return {
    locations: [],
    availabilities: [],
    technologies: [],
    skills: [],
    certifications: []
  };
}

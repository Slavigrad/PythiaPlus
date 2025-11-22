/**
 * Facet Model
 *
 * Represents a single facet value with its count
 * Used for filtering search results
 */
export interface Facet {
  value: string;  // Facet value (e.g., "Zurich", "Available", "React")
  count: number;  // Number of candidates with this value
}

/**
 * Facet Group Model
 *
 * Represents all facets returned from the search API
 * Ordered by count (descending)
 */
export interface FacetGroup {
  locations: Facet[];
  availabilities: Facet[];
  technologies: Facet[];
  skills: Facet[];
  certifications: Facet[];
}

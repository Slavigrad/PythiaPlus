/**
 * Search Parameters Model
 *
 * Parameters for semantic search API with faceted filtering
 */
export interface SearchParams {
  query: string;                // Natural language search query
  topK?: number;                // Number of results (default: 10)
  minScore?: number;            // Minimum match score 0.0-1.0 (default: 0.7)

  // Facet filters
  location?: string;            // Single location filter
  availability?: string;        // Single availability filter (Available, Notice Period, Unavailable)
  technologies?: string[];      // Multiple technology filters
  skills?: string[];            // Multiple skill filters
  certifications?: string[];    // Multiple certification filters
  minYearsExperience?: number;  // Minimum years of experience
}

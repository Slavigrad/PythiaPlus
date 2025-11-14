/**
 * Search Parameters Model
 *
 * Parameters for semantic search API
 */
export interface SearchParams {
  query: string;      // Natural language search query
  topK?: number;      // Number of results (default: 10)
  minScore?: number;  // Minimum match score 0.0-1.0 (default: 0.7)
}

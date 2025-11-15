import { Candidate } from './candidate.model';
import { FacetGroup } from './facet.model';

/**
 * Search Response Model
 *
 * Response from semantic search API with faceted search support
 */
export interface SearchResponse {
  results: Candidate[];
  totalCount: number;
  query: string;
  facets?: FacetGroup;  // Optional: facets for filtering
}

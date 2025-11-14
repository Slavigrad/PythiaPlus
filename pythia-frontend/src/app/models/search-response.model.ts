import { Candidate } from './candidate.model';

/**
 * Search Response Model
 *
 * Response from semantic search API
 */
export interface SearchResponse {
  results: Candidate[];
  totalCount: number;
  query: string;
}

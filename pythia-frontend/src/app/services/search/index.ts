/**
 * Search Domain Services - Barrel Export
 *
 * Semantic search services with vector similarity, facets, and filters
 * Powered by pgvector + Ollama embeddings (multilingual-e5-large-instruct)
 *
 * Services:
 * - SearchService - Main semantic search service with:
 *   - Signal-based reactive state
 *   - Result caching for navigation
 *   - Client-side internal filtering
 *   - URL persistence
 *   - Faceted search with aggregations
 *
 * Usage:
 * ```typescript
 * import { SearchService } from '@app/services/search';
 *
 * const searchService = inject(SearchService);
 * searchService.search({ query: 'Senior Kotlin developer', topK: 10, minScore: 0.7 });
 * ```
 */

export * from './search.service';

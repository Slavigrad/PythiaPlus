/**
 * Comparison State Services - Barrel Export
 *
 * Multi-select candidate comparison state management
 * Signal-based reactive state for side-by-side candidate comparison
 *
 * Services:
 * - ComparisonService - Manages candidate selection state:
 *   - Max 3 selections
 *   - Profile loading & caching
 *   - Comparison modal control
 *   - Signal-based reactivity
 *
 * Usage:
 * ```typescript
 * import { ComparisonService } from '@app/services/state/comparison';
 *
 * const comparisonService = inject(ComparisonService);
 * comparisonService.toggleSelection('candidate-id-123');
 * comparisonService.openComparison();
 * ```
 */

export * from './comparison.service';

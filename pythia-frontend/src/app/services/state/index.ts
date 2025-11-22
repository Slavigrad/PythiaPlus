/**
 * State Management Services - Barrel Export
 *
 * Application state services for cross-component state management
 * All services use signals for reactive state (Angular 20+)
 *
 * Domains:
 * - /comparison - Candidate comparison state (multi-select, max 3)
 * - /selection  - General selection state (future)
 * - /filters    - Global filter state (future)
 *
 * Usage:
 * ```typescript
 * import { ComparisonService } from '@app/services/state/comparison';
 * ```
 */

export * from './comparison';

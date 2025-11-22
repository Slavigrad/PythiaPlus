/**
 * Export Integration Services - Barrel Export
 *
 * External file export services (CSV, JSON, PDF)
 * Browser-native downloads without external dependencies
 *
 * Services:
 * - ExportService - Main export service:
 *   - CSV export (pythia-candidates-{timestamp}.csv)
 *   - JSON export (pythia-candidates-{timestamp}.json)
 *   - No external libraries required
 *
 * Usage:
 * ```typescript
 * import { ExportService } from '@app/services/integration/export';
 *
 * const exportService = inject(ExportService);
 * exportService.exportToCSV(candidates);
 * exportService.exportToJSON(candidates);
 * ```
 */

export * from './export.service';

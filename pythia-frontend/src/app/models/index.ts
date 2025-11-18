/**
 * Models Barrel Export
 *
 * Centralized export point for all model interfaces
 * Usage: import { Employee, Candidate, SearchParams } from '@app/models';
 */

// Employee models
export * from './employee.model';
export * from './employee-update.model';
export * from './employee-list-response.model';

// Candidate models
export * from './candidate.model';

// Search models
export * from './search-params.model';
export * from './search-response.model';

// Facet models
export * from './facet.model';

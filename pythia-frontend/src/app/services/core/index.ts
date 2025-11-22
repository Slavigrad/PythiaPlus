/**
 * Core Domain Services - Barrel Export
 *
 * Core business domain services (employees, candidates, profiles, projects)
 * Pure domain logic without external integrations
 *
 * Architecture:
 * - /profile  - Profile-related services (skills, languages, technologies, etc.)
 * - /candidate - Candidate domain services (future)
 * - /employee  - Employee domain services (future)
 * - /project   - Project domain services (future)
 *
 * Usage:
 * ```typescript
 * import { SkillService } from '@app/services/core/profile';
 * ```
 */

export * from './profile';

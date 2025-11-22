/**
 * Core Profile Services - Barrel Export
 *
 * Profile-related domain services for managing candidate/employee profile data
 * All services use signals for reactive state management (Angular 20+)
 *
 * Services:
 * - SkillService       - Skill data management
 * - LanguageService    - Language proficiency management
 * - TechnologyService  - Technology stack management
 * - RoleService        - Role/position management
 * - CertificateService - Certification management
 * - TrainingService    - Training/courses management
 *
 * Usage:
 * ```typescript
 * import { SkillService, LanguageService } from '@app/services/core/profile';
 * ```
 */

export * from './skill.service';
export * from './language.service';
export * from './technology.service';
export * from './role.service';
export * from './certificate.service';
export * from './training.service';

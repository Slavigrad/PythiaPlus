/**
 * Services Root Barrel Export
 *
 * Legendary, world-class services architecture for PythiaPlus
 * Domain-Driven Design meets SOLID Principles meets Angular 20 Signals
 *
 * Architecture Philosophy:
 * - Domain-Driven Design (DDD) - services organized by business domain
 * - Single Responsibility Principle - each service has ONE clear purpose
 * - Dependency Inversion - services depend on abstractions (signals), not implementations
 * - Signal-Based Reactivity - Angular 20+ signals for performant state management
 * - Barrel Exports - clean imports via index.ts files
 *
 * Folder Structure:
 * - /core          - Core business domain services (Employee, Candidate, Profile, Project)
 * - /search        - Search domain (semantic search, facets, filters)
 * - /state         - Application state management (comparison, selection)
 * - /integration   - External integrations (export, import, APIs)
 * - /mappers       - Data transformation utilities (DTO ↔ Model)
 * - /shared        - Cross-domain utilities (notifications, loading, storage)
 *
 * Key Principles:
 * 1. **Signal-First Architecture** - All services use signals, not BehaviorSubjects
 * 2. **inject() Function** - No constructor injection (Angular 20+ best practice)
 * 3. **OnPush Change Detection** - All components using services must use OnPush
 * 4. **Type Safety** - Full TypeScript strict mode compliance
 * 5. **Testability** - Each service has co-located .spec.ts tests
 * 6. **Performance** - Computed signals, caching, optimistic updates
 *
 * Usage Examples:
 * ```typescript
 * // Import from root (recommended for commonly used services)
 * import { SearchService, ComparisonService } from '@app/services';
 *
 * // Import from specific domain (for clarity in large files)
 * import { SearchService } from '@app/services/search';
 * import { SkillService } from '@app/services/core/profile';
 * import { ExportService } from '@app/services/integration/export';
 * import { mapEmployeesToProfiles } from '@app/services/mappers';
 *
 * // Use with inject() function (Angular 20+)
 * export class SearchPage {
 *   private readonly searchService = inject(SearchService);
 *   private readonly comparisonService = inject(ComparisonService);
 *
 *   protected readonly results = this.searchService.results;
 *   protected readonly loading = this.searchService.loading;
 * }
 * ```
 *
 * Signal-Based State Management Pattern:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ExampleService {
 *   // ✅ CORRECT: Use signals for reactive state
 *   readonly data = signal<Data[]>([]);
 *   readonly loading = signal(false);
 *   readonly error = signal<string | null>(null);
 *
 *   // Computed signals for derived state
 *   readonly hasData = computed(() => this.data().length > 0);
 *   readonly isEmpty = computed(() => !this.loading() && this.data().length === 0);
 *
 *   // ❌ WRONG: Don't use BehaviorSubject (old pattern)
 *   // private dataSubject = new BehaviorSubject<Data[]>([]);
 * }
 * ```
 */

// ============================================================================
// CORE DOMAIN SERVICES
// ============================================================================
// Pure business logic services for core entities

export * from './core/profile';

// Future core services
// export * from './core/candidate';
// export * from './core/employee';
// export * from './core/project';

// ============================================================================
// SEARCH DOMAIN SERVICES
// ============================================================================
// Semantic search, vector similarity, facets, filters

export * from './search';

// ============================================================================
// STATE MANAGEMENT SERVICES
// ============================================================================
// Application-wide state management (comparison, selection, filters)

export * from './state/comparison';

// Future state services
// export * from './state/selection';
// export * from './state/filters';

// ============================================================================
// INTEGRATION SERVICES
// ============================================================================
// External system integrations (export, import, APIs)

export * from './integration/export';

// Future integration services
// export * from './integration/import';
// export * from './integration/api';

// ============================================================================
// DATA MAPPERS
// ============================================================================
// Pure functions for transforming between models and DTOs

export * from './mappers';

// ============================================================================
// SHARED SERVICES
// ============================================================================
// Cross-domain utilities (notifications, loading, storage)

export * from './shared';

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================
// Most commonly used services re-exported for easy access

// Search Domain
export type { SearchService } from './search/search.service';

// State Management
export type { ComparisonService } from './state/comparison/comparison.service';

// Core Profile Services
export type {
  SkillService,
  LanguageService,
  TechnologyService,
  RoleService,
  CertificateService,
  TrainingService
} from './core/profile';

// Integration
export type { ExportService } from './integration/export/export.service';

// ============================================================================
// ARCHITECTURE NOTES
// ============================================================================
//
// WHY THIS ARCHITECTURE?
//
// 1. **Scalability**: Easy to add new services in the right domain
//    - New profile service? → core/profile/new-service.service.ts
//    - New export format? → integration/export/pdf-export.service.ts
//
// 2. **Maintainability**: Clear boundaries, no circular dependencies
//    - Each domain is self-contained
//    - Mappers handle cross-domain transformations
//
// 3. **Testability**: Services are isolated, easy to mock
//    - Co-located .spec.ts files
//    - Signal-based state is easy to test (no async complexity)
//
// 4. **Developer Experience**: Intuitive imports, autocomplete-friendly
//    - import { SearchService } from '@app/services'; // Clean!
//    - IDE autocomplete shows all available services
//
// 5. **Performance**: Signal-based reactivity is faster than Zone.js
//    - Computed signals auto-memoize
//    - OnPush change detection works perfectly with signals
//
// MIGRATION GUIDE (for old imports):
//
// Old: import { SearchService } from '@app/services/search.service';
// New: import { SearchService } from '@app/services/search';
// Or:  import { SearchService } from '@app/services';
//
// Old: import { SkillService } from '@app/services/skill.service';
// New: import { SkillService } from '@app/services/core/profile';
// Or:  import { SkillService } from '@app/services';
//
// ADDING NEW SERVICES:
//
// 1. Identify the domain (core, search, state, integration, shared)
// 2. Create service in appropriate folder:
//    - ng generate service core/employee/employee
// 3. Add to domain's index.ts barrel export
// 4. Optionally add to root index.ts for convenience
// 5. Write tests (co-located .spec.ts)
// 6. Use inject() function, NOT constructor injection
// 7. Use signals, NOT BehaviorSubjects
//
// QUALITY STANDARDS:
//
// ✅ All services MUST use signals for state
// ✅ All services MUST use inject() function
// ✅ All services MUST have .spec.ts tests (80%+ coverage)
// ✅ All services MUST follow Single Responsibility Principle
// ✅ All services MUST have JSDoc documentation
// ✅ All services MUST be providedIn: 'root' (unless component-scoped)
//
// This architecture is a living document. As the project grows:
// - Add new domains as needed (e.g., /analytics, /notifications)
// - Keep the structure flat (max 3 levels deep)
// - Update this documentation with new patterns
//

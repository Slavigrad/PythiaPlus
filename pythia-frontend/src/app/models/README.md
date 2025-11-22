# Models Architecture - Pythia+ 🏛️

> **Legendary Folder System** - Domain-Driven Design meets SOLID Principles

## 📐 Architecture Philosophy

This models folder follows **world-class software architecture** principles:

- ✅ **Domain-Driven Design (DDD)**: Models organized by business domain
- ✅ **SOLID Principles**: Single responsibility, Open/Closed, Interface segregation
- ✅ **Separation of Concerns**: Clear boundaries between API, domain, and presentation
- ✅ **Type Safety**: TypeScript discriminated unions, branded types, strict typing
- ✅ **Scalability**: Easy to extend without breaking existing code
- ✅ **Discoverability**: Intuitive naming and folder structure

---

## 🗂️ Folder Structure

```
models/
├── core/                              # Core domain models (business entities)
│   ├── employee/                      # Employee domain
│   ├── candidate/                     # Candidate domain
│   ├── profile/                       # Shared profile components
│   └── project/                       # Project domain
│
├── api/                               # API contracts (DTOs)
│   ├── requests/                      # Request DTOs
│   └── responses/                     # Response DTOs
│
├── search/                            # Search domain
│   ├── search-params.model.ts
│   ├── facet.model.ts
│   └── filters.model.ts
│
├── shared/                            # Cross-domain shared models
│   ├── pagination.model.ts
│   └── metadata.model.ts
│
├── enums/                             # Centralized enumerations
│   ├── availability.enum.ts
│   ├── seniority.enum.ts
│   └── proficiency.enum.ts
│
├── types/                             # Advanced TypeScript utilities
│   ├── branded-types.ts
│   ├── type-guards.ts
│   └── utility-types.ts
│
└── constants/                         # Model-related constants
    ├── validation-rules.const.ts
    └── default-values.const.ts
```

---

## 🎯 Domain Boundaries

### Core Domain (`/core`)

**Business entities** - pure domain models representing business concepts.

- **Employee Domain** (`/core/employee`): Internal employee profiles
- **Candidate Domain** (`/core/candidate`): Talent search candidates
- **Profile Domain** (`/core/profile`): Shared profile components (skills, tech, certs)
- **Project Domain** (`/core/project`): Project information

**Rules:**
- NO API-specific fields (no DTOs here)
- Pure TypeScript interfaces
- Domain logic and business rules only
- Reusable across features

### API Layer (`/api`)

**Data Transfer Objects (DTOs)** - API contracts for backend communication.

- **Requests** (`/api/requests`): Request payloads (POST/PUT bodies)
- **Responses** (`/api/responses`): Response structures from API

**Rules:**
- MUST match backend API contracts exactly
- Include API-specific metadata
- No business logic
- Validation happens at API boundary

### Search Domain (`/search`)

**Search-specific models** - semantic search and filtering.

- Search parameters
- Facets and facet groups
- Internal filters (client-side)
- Match scores

**Rules:**
- Search-domain specific
- Can reference core models
- Handles search state and filtering

### Shared Models (`/shared`)

**Cross-domain utilities** - reusable across all domains.

- Pagination metadata
- Sort parameters
- Generic API metadata

**Rules:**
- MUST be domain-agnostic
- Highly reusable
- Small, focused interfaces

### Enums (`/enums`)

**Centralized enumerations** - single source of truth for all enums.

**Benefits:**
- No duplicate enum definitions
- Easy to extend
- Type-safe string unions
- Centralized validation

### Types (`/types`)

**Advanced TypeScript patterns** - type safety utilities.

- **Branded Types**: `type EmployeeId = Brand<number, 'EmployeeId'>`
- **Type Guards**: `isEmployee(obj): obj is Employee`
- **Utility Types**: `DeepPartial<T>`, `NonNullableFields<T>`

### Constants (`/constants`)

**Model-related constants** - validation rules and defaults.

- Validation rules (min/max lengths, patterns)
- Default values
- Magic numbers as named constants

---

## 📦 Barrel Exports

**Every folder has an `index.ts`** for clean imports:

```typescript
// ✅ CORRECT: Import from barrel
import { Employee, Candidate } from '@app/models';

// ❌ WRONG: Deep imports
import { Employee } from '@app/models/core/employee/employee.model';
```

**Benefits:**
- Clean, maintainable imports
- Easy refactoring
- Encapsulation of internal structure
- IDE autocomplete support

---

## 🎨 Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Domain Model | `{name}.model.ts` | `employee.model.ts` |
| DTO Request | `{name}.dto.ts` | `employee-create.dto.ts` |
| DTO Response | `{name}-response.dto.ts` | `search-response.dto.ts` |
| Enum | `{name}.enum.ts` | `availability.enum.ts` |
| Type Guard | `{name}.guard.ts` | `employee.guard.ts` |
| Constant | `{name}.const.ts` | `validation-rules.const.ts` |
| Barrel Export | `index.ts` | `index.ts` |

### Interfaces

```typescript
// Domain models: PascalCase
export interface Employee { }
export interface Candidate { }

// DTOs: PascalCase + suffix
export interface EmployeeCreateRequest { }
export interface SearchResponseDto { }

// Enums: PascalCase + "Enum" suffix (optional)
export enum Availability { }
export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead';

// Type aliases: PascalCase
export type EmployeeId = Brand<number, 'EmployeeId'>;
```

---

## 🔧 Usage Examples

### Importing Models

```typescript
// Import from root barrel (recommended)
import {
  Employee,
  Candidate,
  SearchParams,
  Availability
} from '@app/models';

// Import from domain barrel
import { Employee, EmployeeCreateRequest } from '@app/models/core/employee';

// Import from API barrel
import { SearchResponseDto } from '@app/models/api/responses';
```

### Using Type Guards

```typescript
import { isEmployee, isCandidate } from '@app/models/types';

function processProfile(profile: Employee | Candidate) {
  if (isEmployee(profile)) {
    // TypeScript knows profile is Employee here
    console.log(profile.department);
  } else {
    // TypeScript knows profile is Candidate here
    console.log(profile.matchScore);
  }
}
```

### Using Branded Types

```typescript
import { EmployeeId, CandidateId } from '@app/models/types';

// Type-safe IDs prevent mixing up different entity IDs
function fetchEmployee(id: EmployeeId): Employee { }
function fetchCandidate(id: CandidateId): Candidate { }

const empId: EmployeeId = 123 as EmployeeId;
const candId: CandidateId = 456 as CandidateId;

fetchEmployee(empId);      // ✅ OK
fetchEmployee(candId);     // ❌ TypeScript error!
```

---

## 🚀 Adding New Models

### Adding a New Domain

1. Create domain folder in `/core`
2. Add domain models (e.g., `interview.model.ts`)
3. Create `index.ts` barrel export
4. Add to root `models/index.ts`

```bash
# Example: Adding Interview domain
mkdir -p src/app/models/core/interview
touch src/app/models/core/interview/interview.model.ts
touch src/app/models/core/interview/index.ts
```

### Adding a New DTO

1. Determine if it's a request or response
2. Create in appropriate `/api` subfolder
3. Export from barrel

```typescript
// api/requests/interview-create.dto.ts
export interface InterviewCreateRequest {
  candidateId: number;
  interviewerId: number;
  scheduledDate: string;
}

// api/requests/index.ts
export * from './interview-create.dto';
```

### Adding a New Enum

1. Create in `/enums` folder
2. Export from barrel

```typescript
// enums/interview-status.enum.ts
export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// enums/index.ts
export * from './interview-status.enum';
```

---

## 🎓 Design Principles

### 1. Single Responsibility Principle (SRP)

Each model has ONE clear purpose:
- `Employee` represents an employee entity
- `EmployeeCreateRequest` represents API payload for creating employees
- `SearchParams` represents search query parameters

### 2. Open/Closed Principle (OCP)

Easy to extend without modifying existing code:
- Add new domains without touching other domains
- Add new DTOs without changing domain models
- Add new enums without breaking existing code

### 3. Interface Segregation Principle (ISP)

Small, focused interfaces:
- Don't force clients to depend on methods they don't use
- Prefer composition over inheritance
- Use type unions for polymorphism

### 4. Dependency Inversion Principle (DIP)

Depend on abstractions:
- DTOs depend on domain models (not vice versa)
- Components depend on models (not implementations)
- Use interfaces, not concrete classes

### 5. DRY (Don't Repeat Yourself)

Single source of truth:
- Shared models in `/shared`
- Enums in `/enums` (not duplicated across files)
- Barrel exports prevent import duplication

---

## 🏆 Quality Standards

### Type Safety

- ✅ **Strict TypeScript**: No `any` types
- ✅ **Explicit nullability**: Use `| null` when needed
- ✅ **Optional properties**: Use `?` for optional fields
- ✅ **Readonly where appropriate**: `readonly` for immutable fields

### Documentation

- ✅ **JSDoc comments**: Every interface and property
- ✅ **Examples**: Show usage in comments
- ✅ **Links**: Reference backend API docs

### Testing

- ✅ **Type guards**: Test with valid/invalid data
- ✅ **Validators**: Unit test validation functions
- ✅ **Mappers**: Test transformations

---

## 📚 References

- [Domain-Driven Design (DDD)](https://martinfowler.com/tags/domain%20driven%20design.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Angular Style Guide](https://angular.dev/style-guide)

---

## 🎯 Success Metrics

A legendary models architecture achieves:

- ✅ **Scalability**: Can grow to 100+ models without chaos
- ✅ **Maintainability**: Easy to find, update, and refactor
- ✅ **Type Safety**: Compile-time guarantees prevent runtime errors
- ✅ **Developer Experience**: Fast autocomplete, clear structure
- ✅ **Team Collaboration**: New developers onboard quickly
- ✅ **Performance**: Tree-shaking removes unused code

---

**Last Updated**: 2025-11-22
**Architecture Status**: ✅ World-class, legendary, production-ready
**Quality Standard**: 🇨🇭 Swiss banking grade architecture

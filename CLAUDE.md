# CLAUDE.md - AI Assistant Guide for PythiaPlus

> **Last Updated**: 2025-11-14
> **Repository**: PythiaPlus - AI-Powered Talent Search Platform
> **Status**: Early Development Phase
> **Primary Branch**: `claude/claude-md-mhz5s71o1rt3kqx6-01RQb6KCaQ27c6huy8cj252s`

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Testing Strategy](#testing-strategy)
7. [Documentation Guide](#documentation-guide)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Project Overview

### What is PythiaPlus?

PythiaPlus (Pythia+ / Pythia) is an AI-powered talent search oracle that combines **semantic NLP matching** with **modern web technologies** to revolutionize talent acquisition. Named after the Oracle of Delphi, it transforms natural language queries into structured talent insights.

### Core Value Proposition

- **Semantic Understanding**: Uses 1024-dimensional embeddings to understand meaning, not just keywords
- **Natural Language Queries**: "Senior Kotlin developer in Zurich with cloud experience and B2 German"
- **Vector Search**: PostgreSQL pgvector for high-performance similarity search
- **Local LLMs**: Ollama-powered embeddings (no vendor lock-in, no API costs)
- **Swiss Quality**: Slavigrad design aesthetic with corporate-grade standards

### Project Goals

1. Build world-class talent search with semantic NLP
2. Achieve Swiss corporate quality standards (WCAG AA, Lighthouse 90+)
3. Demonstrate Angular 20 modern features (signals, @defer, control flow)
4. Create production-ready MVP in 10 days
5. Integrate with Kotlin Spring Boot 4 backend + pgvector

---

## Repository Structure

```
PythiaPlus/
├── pythia-frontend/                    # Angular 20 frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                   # Singleton services (future)
│   │   │   │   └── services/           # SearchService, NotificationService
│   │   │   ├── features/               # Feature modules (future)
│   │   │   │   └── search/             # Search feature
│   │   │   │       ├── pages/          # SearchPage component
│   │   │   │       ├── components/     # SearchBar, CandidateCard, etc.
│   │   │   │       └── models/         # TypeScript interfaces
│   │   │   ├── shared/                 # Reusable components (future)
│   │   │   │   ├── components/         # SkeletonCard, LoadingSpinner
│   │   │   │   └── utils/              # Helper functions
│   │   │   ├── app.ts                  # Root component (signals-based)
│   │   │   ├── app.config.ts           # Application configuration
│   │   │   └── app.routes.ts           # Route definitions
│   │   ├── styles/
│   │   │   └── themes/
│   │   │       └── _pythia-theme.scss  # Slavigrad design system
│   │   └── main.ts                     # Application entry point
│   ├── 01-documentation/               # Comprehensive project docs
│   │   ├── README.md                   # Documentation index
│   │   ├── design-pythia-mvp.md        # Complete design specification
│   │   ├── IMPLEMENTATION-QUICK-START.md  # Developer onboarding
│   │   ├── ANGULAR-20-QUICK-REFERENCE.md  # Angular 20 cheat sheet
│   │   ├── ANGULAR-20-UPGRADE-SUMMARY.md  # Migration guide
│   │   └── MVP-TASK-PLAN-CHANGELOG.md  # Version history
│   ├── 02-mvp-task-plan/               # Implementation roadmap
│   │   └── MVP-Task-Plan.md            # 5-phase, 10-day plan (30+ tasks)
│   ├── public/                         # Static assets
│   ├── package.json                    # Dependencies and scripts
│   ├── angular.json                    # Angular CLI configuration
│   └── tsconfig.json                   # TypeScript configuration
├── screenshot-ideas/                   # Design mockups (future)
├── README.md                           # Project overview
├── LICENSE                             # MIT License
├── .gitignore                          # Git ignore rules
└── CLAUDE.md                           # This file (AI assistant guide)
```

### Current State (as of 2025-11-14)

- Angular 20.3 project initialized with standalone components
- Comprehensive documentation complete (8 markdown files)
- MVP task plan ready (5 phases, 30+ tasks, 10 days)
- Pythia theme system created (_pythia-theme.scss)
- Basic app structure in place
- **Backend**: Not yet implemented (Kotlin Spring Boot 4 planned)
- **Components**: Minimal (starter app.ts only)
- **Status**: Phase 1 - Foundation (pre-implementation)

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.3.0 | Frontend framework with signals |
| **TypeScript** | 5.9.2 | Strict mode enabled |
| **Angular Material** | 20.2.2 | Material Design 3 components |
| **Angular CDK** | 20.2.2 | Component Dev Kit |
| **Chart.js** | 4.5.0 | Data visualization |
| **ng2-charts** | 8.0.0 | Angular wrapper for Chart.js |
| **RxJS** | 7.8.0 | Reactive programming |

### Backend Stack (Planned)

| Technology | Purpose |
|------------|---------|
| **Kotlin** | Backend language |
| **Spring Boot 4** | Backend framework |
| **PostgreSQL** | Database |
| **pgvector** | Vector similarity search |
| **Ollama** | Local LLM inference |
| **multilingual-e5-large-instruct** | 1024-dim embeddings |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Angular CLI** | 20.3.10 | Code generation and build |
| **Jasmine** | 5.9.0 | Testing framework |
| **Karma** | 6.4.0 | Test runner |
| **json-server** | 1.0.0-beta.3 | Mock API (development) |
| **concurrently** | 9.2.0 | Run multiple npm scripts |

---

## Development Workflows

### Setup and Installation

```bash
# Navigate to frontend
cd pythia-frontend

# Install dependencies
npm install

# Verify Angular version
ng version  # Should show 20.3.10

# Start development server
npm start  # Runs on http://localhost:4200

# Start mock API (when implemented)
npm run api  # Runs on http://localhost:3000

# Run both concurrently
npm run dev  # Starts API + App together
```

### Common Commands

```bash
# Development
npm start                    # Start dev server
npm run watch               # Build with watch mode
npm run dev                 # Run API + App concurrently

# Testing
npm test                    # Run tests (Karma)
npm run test:ci            # Run tests headless (CI)
npm run test:coverage      # Run tests with coverage

# Building
npm run build              # Development build
npm run build:prod         # Production build
npm run build:analyze      # Analyze bundle size

# Code Quality
npm run lint               # Run linter
npm run lint:fix           # Fix linting issues

# Deployment
npm run deploy:github-pages     # Deploy to GitHub Pages
npm run deploy:preview          # Preview build locally
npm run performance:audit       # Run Lighthouse audit
```

### Component Generation

```bash
# Generate component (standalone by default in Angular 20)
ng generate component features/search/components/search-bar

# Generate service
ng generate service core/services/search

# Generate interface
ng generate interface features/search/models/candidate

# Generate pipe
ng generate pipe shared/pipes/match-score

# Generate directive
ng generate directive shared/directives/highlight
```

### Git Workflow

```bash
# Current working branch
git branch  # Should show: claude/claude-md-mhz5s71o1rt3kqx6-01RQb6KCaQ27c6huy8cj252s

# Commit changes
git add .
git commit -m "feat: implement search bar component with signals"

# Push to remote (CRITICAL: must push to claude/* branch)
git push -u origin claude/claude-md-mhz5s71o1rt3kqx6-01RQb6KCaQ27c6huy8cj252s

# Retry logic for network failures
# If push fails, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
```

**IMPORTANT**: All development and pushes must go to the branch starting with `claude/` and ending with the session ID. Pushing to other branches will fail with 403.

---

## Code Conventions

### Angular 20 Modern Patterns

#### 1. Signal-Based State Management

```typescript
// ✅ CORRECT: Use signals for reactive state
import { Component, signal, computed } from '@angular/core';

@Component({...})
export class SearchBar {
  // Signal state
  protected readonly query = signal('');
  protected readonly loading = signal(false);

  // Computed signals
  protected readonly isValid = computed(() =>
    this.query().length >= 3
  );

  // Signal inputs (Angular 20)
  readonly placeholder = input<string>('Search candidates...');

  // Signal outputs (Angular 20)
  readonly search = output<string>();
}

// ❌ WRONG: Don't use traditional observables for simple state
searchQuery$ = new BehaviorSubject<string>('');
```

#### 2. Control Flow Syntax

```typescript
// ✅ CORRECT: Use @if/@for/@switch (Angular 20+)
@if (loading()) {
  <app-loading-spinner />
} @else if (hasResults()) {
  <app-results [data]="results()" />
} @else {
  <app-empty-state />
}

@for (candidate of candidates(); track candidate.id) {
  <app-candidate-card [candidate]="candidate" />
} @empty {
  <p>No candidates found.</p>
}

// ❌ WRONG: Don't use old *ngIf/*ngFor
<app-loading-spinner *ngIf="loading" />
<app-candidate-card *ngFor="let c of candidates" [candidate]="c" />
```

#### 3. Deferred Loading (@defer)

```typescript
// ✅ CORRECT: Use @defer for lazy loading
@defer (on interaction) {
  <app-search-options />
} @placeholder {
  <button>Advanced Options</button>
} @loading (minimum 100ms) {
  <app-skeleton-loader />
}

// Viewport-based loading
@defer (on viewport; prefetch on idle) {
  <app-candidate-card [candidate]="candidate" />
} @placeholder {
  <app-skeleton-card />
}
```

#### 4. Component Structure

```typescript
// ✅ CORRECT: Standalone component with signal inputs
import { Component, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'app-candidate-card',
  imports: [CommonModule, MatCardModule],  // Direct imports
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush  // ALWAYS use OnPush
})
export class CandidateCard {
  // Required input
  readonly candidate = input.required<Candidate>();

  // Optional input with default
  readonly showDetails = input(false);

  // Output event
  readonly select = output<string>();

  // Computed from inputs
  protected readonly initials = computed(() =>
    this.getInitials(this.candidate().name)
  );

  // Always use protected/private for internal members
  protected handleClick(): void {
    this.select.emit(this.candidate().id);
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
```

### TypeScript Conventions

#### Strict Mode (REQUIRED)

```typescript
// tsconfig.json - strict mode enabled
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}
```

#### Type Definitions

```typescript
// ✅ CORRECT: Define explicit interfaces
export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  skills: string[];
  matchScore: number;
  embedding?: number[];  // Optional with ?
}

export interface SearchParams {
  query: string;
  topK: number;
  minScore: number;
}

// ❌ WRONG: Don't use 'any'
const data: any = fetchData();  // NEVER do this
```

#### Naming Conventions

```typescript
// Components: PascalCase with descriptive names
export class CandidateCard { }
export class SearchBar { }
export class MatchScoreBadge { }

// Services: PascalCase ending with 'Service'
export class SearchService { }
export class NotificationService { }

// Interfaces: PascalCase (no 'I' prefix)
export interface Candidate { }  // ✅ CORRECT
export interface ICandidate { }  // ❌ WRONG (no I prefix)

// Files: kebab-case
candidate-card.component.ts
search.service.ts
match-score.model.ts

// Signals/Variables: camelCase
const searchQuery = signal('');
const isLoading = signal(false);

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080';
const DEFAULT_TOP_K = 10;
```

### Styling Conventions

#### Pythia Theme System

```scss
// Use Pythia theme variables from _pythia-theme.scss

// ✅ CORRECT: Use theme variables
.search-bar {
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);

  &:focus {
    border-color: var(--color-primary-500);  // Pythia red
  }
}

// Available theme tokens:
// Colors: --color-primary-*, --color-neutral-*, --color-success-*, etc.
// Spacing: --spacing-xs (4px), --spacing-sm (8px), --spacing-md (16px), etc.
// Radius: --radius-sm, --radius-md, --radius-lg, --radius-full
// Shadows: --shadow-sm, --shadow-md, --shadow-lg
// Typography: --font-size-*, --font-weight-*, --line-height-*

// ❌ WRONG: Don't hardcode colors or values
.search-bar {
  background-color: #f5f5f5;  // NEVER hardcode
  padding: 16px;              // Use --spacing-md instead
}
```

#### Component Scoping

```scss
// Always scope styles to component
:host {
  display: block;

  .candidate-card {
    // Component-specific styles
  }
}

// Use BEM-like naming for clarity
.candidate-card {
  &__header { }
  &__body { }
  &__footer { }
  &--featured { }  // Modifier
}
```

### Accessibility Standards

```typescript
// ✅ WCAG AA Compliance Required

// 1. Semantic HTML
<button>Search</button>          // ✅ CORRECT
<div (click)="search()">Search</div>  // ❌ WRONG

// 2. ARIA labels
<input
  type="search"
  aria-label="Search candidates"
  [attr.aria-describedby]="hasError() ? 'error-msg' : null"
/>

// 3. Keyboard navigation
@HostListener('keydown.enter')
handleEnter() { this.search(); }

@HostListener('keydown.escape')
handleEscape() { this.clear(); }

// 4. Focus management
<button
  [attr.aria-expanded]="isExpanded()"
  (click)="toggleOptions()"
>
  Advanced Options
</button>

// 5. Color contrast: 4.5:1 minimum
// 6. Focus indicators: Always visible
```

---

## Testing Strategy

### Testing Goals

- **Coverage Target**: 80%+ code coverage
- **Test Count**: 53 tests (per MVP plan)
- **Testing Framework**: Jasmine + Karma
- **CI Integration**: Headless Chrome for CI/CD

### Signal Testing Patterns

```typescript
// ✅ CORRECT: Test signals with Angular 20 patterns
describe('CandidateCard', () => {
  let component: CandidateCard;
  let fixture: ComponentFixture<CandidateCard>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateCard);
    component = fixture.componentInstance;

    // Set signal inputs (Angular 20)
    fixture.componentRef.setInput('candidate', mockCandidate);
    fixture.detectChanges();
  });

  it('should display candidate name', () => {
    expect(fixture.nativeElement.querySelector('.name').textContent)
      .toBe('John Doe');
  });

  it('should compute initials correctly', () => {
    expect(component.initials()).toBe('JD');
  });

  it('should emit select event on click', () => {
    let emittedId: string | undefined;
    component.select.subscribe(id => emittedId = id);

    fixture.nativeElement.querySelector('.card').click();

    expect(emittedId).toBe('123');
  });
});
```

### Service Testing

```typescript
describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should update loading signal during search', () => {
    expect(service.loading()).toBe(false);

    service.search({ query: 'test', topK: 10, minScore: 0.7 });
    expect(service.loading()).toBe(true);

    const req = httpMock.expectOne('/api/v1/search');
    req.flush({ results: [] });

    expect(service.loading()).toBe(false);
  });

  it('should handle errors correctly', () => {
    service.search({ query: 'test', topK: 10, minScore: 0.7 });

    const req = httpMock.expectOne('/api/v1/search');
    req.error(new ErrorEvent('Network error'));

    expect(service.error()).toBeTruthy();
    expect(service.results()).toEqual([]);
  });
});
```

### Effect Testing

```typescript
describe('SearchBar effects', () => {
  it('should debounce search by 500ms', fakeAsync(() => {
    component.query.set('test');
    tick(300);
    expect(searchService.search).not.toHaveBeenCalled();

    tick(200);
    expect(searchService.search).toHaveBeenCalledWith('test');
  }));
});
```

---

## Documentation Guide

### Documentation Structure

The repository contains extensive documentation in `pythia-frontend/01-documentation/`:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **README.md** | Documentation index | Start here for navigation |
| **design-pythia-mvp.md** | Complete design spec | Reference for all technical decisions |
| **MVP-Task-Plan.md** | 5-phase implementation roadmap | Daily task execution |
| **IMPLEMENTATION-QUICK-START.md** | Developer onboarding | First day setup |
| **ANGULAR-20-QUICK-REFERENCE.md** | Angular 20 cheat sheet | Daily coding reference |
| **ANGULAR-20-UPGRADE-SUMMARY.md** | Migration guide | Understanding Angular 20 improvements |
| **MVP-TASK-PLAN-CHANGELOG.md** | Version history | Understanding plan updates |

### How to Navigate Documentation

**For AI Assistants:**
1. Read `pythia-frontend/01-documentation/README.md` first
2. Reference `MVP-Task-Plan.md` for current implementation status
3. Check `design-pythia-mvp.md` for detailed technical specifications
4. Use `ANGULAR-20-QUICK-REFERENCE.md` for Angular 20 syntax

**When Implementing Tasks:**
1. Find task in `MVP-Task-Plan.md` (Phase 1-5)
2. Read task requirements and deliverables
3. Reference `design-pythia-mvp.md` for detailed specs
4. Use `IMPLEMENTATION-QUICK-START.md` for commands
5. Check `ANGULAR-20-QUICK-REFERENCE.md` for code patterns

---

## Common Tasks

### Task 1: Implement a New Component

```bash
# 1. Generate component
ng generate component features/search/components/search-bar

# 2. Follow Angular 20 patterns (see Code Conventions section)
# 3. Add to parent component's imports array
# 4. Write tests
# 5. Update MVP-Task-Plan.md checkbox
```

### Task 2: Add a New Service

```bash
# 1. Generate service
ng generate service core/services/search

# 2. Implement with signals
export class SearchService {
  readonly results = signal<Candidate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}

# 3. Provide in root (default)
@Injectable({ providedIn: 'root' })

# 4. Inject with inject() function
readonly searchService = inject(SearchService);
```

### Task 3: Update Theme

```scss
// Edit: pythia-frontend/src/styles/themes/_pythia-theme.scss

// Add new color
:root {
  --color-accent-500: #your-color;
}

// Use in components
.my-component {
  color: var(--color-accent-500);
}
```

### Task 4: Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (headless)
npm run test:ci
```

### Task 5: Build and Deploy

```bash
# Production build
npm run build:prod

# Analyze bundle
npm run build:analyze

# Deploy to GitHub Pages
npm run deploy:github-pages
```

---

## Troubleshooting

### Common Issues

#### Issue: Angular version mismatch

```bash
# Solution: Verify Angular version
ng version

# Should show Angular CLI: 20.3.10
# If not, update:
npm install -g @angular/cli@20.3.10
```

#### Issue: TypeScript strict mode errors

```typescript
// Problem: Property 'x' has no initializer
class MyComponent {
  data: Candidate;  // ❌ Error
}

// Solution 1: Initialize in constructor
class MyComponent {
  data: Candidate;
  constructor() {
    this.data = getInitialData();
  }
}

// Solution 2: Use signal (preferred)
class MyComponent {
  data = signal<Candidate | null>(null);
}

// Solution 3: Make optional (if truly optional)
class MyComponent {
  data?: Candidate;
}
```

#### Issue: Signal inputs not working

```typescript
// ❌ WRONG: Old-style @Input
@Input() candidate!: Candidate;

// ✅ CORRECT: Signal input (Angular 20+)
readonly candidate = input.required<Candidate>();

// Access in template: {{ candidate().name }}
// Access in code: this.candidate().name
```

#### Issue: Change detection not working

```typescript
// ✅ CORRECT: Always use OnPush + signals
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // REQUIRED
})

// Signals automatically trigger change detection
// No need for manual detectChanges()
```

#### Issue: Bundle size too large

```bash
# 1. Analyze bundle
npm run build:analyze

# 2. Check for missing @defer
# Lazy load with @defer (on interaction) or @defer (on viewport)

# 3. Verify tree-shaking
# Ensure imports are specific:
import { MatButtonModule } from '@angular/material/button';  // ✅
import * from '@angular/material';  // ❌ Imports everything
```

---

## AI Assistant Guidelines

### When Working on This Project

#### 1. Always Check Documentation First

- Read `MVP-Task-Plan.md` to understand current phase
- Reference `design-pythia-mvp.md` for specifications
- Use `ANGULAR-20-QUICK-REFERENCE.md` for syntax
- Check this CLAUDE.md for conventions

#### 2. Follow Angular 20 Modern Patterns

- Use signals for state (not BehaviorSubject)
- Use @if/@for/@switch (not *ngIf/*ngFor)
- Use @defer for lazy loading
- Use input()/output() for component API
- Always enable OnPush change detection
- Use inject() function (not constructor injection)

#### 3. Maintain Code Quality

- TypeScript strict mode (no 'any')
- Component-scoped styles with theme variables
- WCAG AA accessibility compliance
- 4.5:1 color contrast minimum
- Semantic HTML and ARIA labels
- Comprehensive tests (80%+ coverage)

#### 4. Git Workflow

- Develop on branch: `claude/claude-md-mhz5s71o1rt3kqx6-01RQb6KCaQ27c6huy8cj252s`
- Commit with descriptive messages: "feat: add search bar component"
- Push to the claude/* branch only
- Retry push up to 4 times with exponential backoff if network fails

#### 5. Task Tracking

- Update MVP-Task-Plan.md checkboxes as tasks complete
- Mark phase progress clearly
- Document any deviations from plan

#### 6. Code Generation

```bash
# Always use Angular CLI for consistency
ng generate component <path>    # Components
ng generate service <path>      # Services
ng generate interface <path>    # Interfaces

# Follow naming conventions:
# - Components: kebab-case (search-bar.component.ts)
# - Services: kebab-case (search.service.ts)
# - Classes: PascalCase (SearchBar, SearchService)
```

#### 7. Testing Requirements

- Write tests for every component and service
- Test signal reactivity chains
- Test computed signals
- Test effects with fakeAsync
- Test accessibility (keyboard, ARIA)
- Aim for 80%+ coverage

#### 8. Performance Optimization

- Use @defer for below-the-fold content
- Use @defer (on interaction) for optional features
- Verify bundle stays under 200kb initial
- Monitor with webpack-bundle-analyzer
- Target Lighthouse score 90+

#### 9. Backend Integration (Future)

When backend is ready:
- Update environment.ts with backend URL
- Replace mock API calls with real endpoints
- Test CORS configuration
- Verify embedding search works correctly
- Add proper error handling for backend errors

#### 10. Documentation Updates

When making significant changes:
- Update CLAUDE.md if conventions change
- Update MVP-Task-Plan.md progress
- Add comments for complex logic
- Update README.md if project structure changes

---

## Project Milestones

### Current Status: Phase 1 - Foundation

- [x] Angular 20 project initialized
- [x] Comprehensive documentation created
- [x] MVP task plan ready
- [x] Pythia theme system created
- [ ] Core services implementation (in progress)
- [ ] Mock API setup (pending)
- [ ] App component branding (pending)

### Phase Timeline (10 Days)

| Phase | Duration | Status | Key Deliverables |
|-------|----------|--------|------------------|
| Phase 1: Foundation | Days 1-2 | 🟡 In Progress | Services, mock API, branding |
| Phase 2: Search Interface | Days 3-4 | ⚪ Pending | SearchBar, control flow, states |
| Phase 3: Candidate Cards | Days 5-6 | ⚪ Pending | Cards, badges, animations |
| Phase 4: Advanced Options | Days 7-8 | ⚪ Pending | Options panel, @defer loading |
| Phase 5: Polish & Deploy | Days 9-10 | ⚪ Pending | Tests, accessibility, deployment |

### Success Criteria

- ✅ 14 components implemented
- ✅ 53 tests passing (80%+ coverage)
- ✅ Bundle size < 200kb initial
- ✅ Lighthouse score 90+
- ✅ WCAG AA compliant
- ✅ Backend integrated
- ✅ Production deployed

---

## Quick Reference Links

### Documentation
- [Main README](README.md)
- [Documentation Index](pythia-frontend/01-documentation/README.md)
- [Design Specification](pythia-frontend/01-documentation/design-pythia-mvp.md)
- [MVP Task Plan](pythia-frontend/02-mvp-task-plan/MVP-Task-Plan.md)
- [Quick Start Guide](pythia-frontend/01-documentation/IMPLEMENTATION-QUICK-START.md)
- [Angular 20 Reference](pythia-frontend/01-documentation/ANGULAR-20-QUICK-REFERENCE.md)

### External Resources
- [Angular 20 Documentation](https://angular.dev)
- [Angular Material 3](https://material.angular.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG AA Guidelines](https://www.w3.org/WAI/WCAG2AA-Conformance)

---

## Contact & Support

### For Questions About:
- **Architecture**: See design-pythia-mvp.md Section 2
- **Angular 20**: See ANGULAR-20-QUICK-REFERENCE.md
- **Tasks**: See MVP-Task-Plan.md
- **Setup**: See IMPLEMENTATION-QUICK-START.md
- **AI Conventions**: See this file (CLAUDE.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-14 | Initial CLAUDE.md creation |

---

**Last Updated**: 2025-11-14
**Document Status**: ✅ Complete and ready for AI assistants
**Quality Standard**: 🇨🇭 Swiss corporate grade

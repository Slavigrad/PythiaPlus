# Pythia+ MVP – Angular Design Document

## 1. Overview

Pythia+ is an Angular-based talent search application that leverages semantic search powered by NLP embeddings. The MVP focuses on a single, powerful use case: natural language candidate search with AI-powered relevance matching. It connects to a Kotlin Spring Boot backend with pgvector-optimized PostgreSQL database and features a clean Swiss banking aesthetic inspired by the pythia-theme.scss design system.

---

## 2. Architecture

### 2.1 High-Level Structure

```
/PythiaPlus
├── backend-kotlin/              # Spring Boot + PostgreSQL + pgvector
│    ├── api/v1/search           # GET endpoint for semantic search
│    └── master-data tables      # md_* tables for structured data
│
└── frontend-angular/            # Angular (Angular CLI + Material)
     └── search interface        # Single-page MVP search UI
```

### 2.2 Data Flow

1. User enters natural language query → "Find React developers in Zurich"
2. Frontend sends GET request to `/api/v1/search?query=React+developer&topK=10&minScore=0.7`
3. Backend performs semantic search using 1024-dimensional embeddings (jeffh/intfloat-multilingual-e5-large-instruct)
4. Results ranked by similarity score (cosine distance) returned as JSON
5. UI displays candidates with match scores, skills, and profile information

### 2.3 Performance & Request Handling

* **Debouncing** (500ms) for search input to prevent excessive API calls
* **Request cancellation** using RxJS `switchMap` - cancel previous search if new query arrives
* **Loading states** with skeleton placeholders during search
* **Client-side caching** using RxJS `shareReplay` for repeated identical queries
* **Error handling** with retry logic (2 attempts) for network failures
* **No pagination needed** - topK parameter controls result count (5, 10, 20, 50)

---

## 3. Backend API (Kotlin Spring Boot)

### 3.1 API Endpoint

| Method | Endpoint              | Description                           | Parameters                    |
|--------|-----------------------|---------------------------------------|-------------------------------|
| GET    | /api/v1/search        | Semantic search for candidates        | query, topK, minScore         |

### 3.2 Request Parameters

```typescript
interface SearchParams {
  query: string;      // Natural language search query (required)
  topK?: number;      // Number of results to return (default: 10, max: 50)
  minScore?: number;  // Minimum similarity score threshold (0.0-1.0, default: 0.7)
}
```

**Example Requests:**
```http
GET http://localhost:8080/api/v1/search?query=React+developer
GET http://localhost:8080/api/v1/search?query=backend+engineer&topK=5
GET http://localhost:8080/api/v1/search?query=senior+developer&minScore=0.7
```

### 3.3 Response Model

```typescript
interface SearchResponse {
  results: Candidate[];
  totalCount: number;
  query: string;
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  profilePicture: string;
  experience: string;                    // e.g., "10.5 years"
  availability: 'Available' | 'Notice Period' | 'Not Available';
  technologies: string[];               // e.g., ["Node.js", "React"]
  skills: string[];                     // e.g., ["Angular", "Vue.js"]
  certifications: string[];             // e.g., ["AWS Certified"]
  currentProject: {
    name: string;
    company: string;
  };
  matchScore: {
    matched: number;                    // Similarity score (0.0-1.0)
    total: number;                      // Always 1 for normalized score
  };
}
```

### 3.4 Example Response

```json
{
  "results": [
    {
      "id": "1",
      "name": "Lubomir Dobrovodsky",
      "title": "Senior Java Developer",
      "location": "Zurich",
      "profilePicture": "https://cdn.slavigrad.net/profiles/lubo.jpg",
      "experience": "10.5 years",
      "availability": "Available",
      "technologies": ["Node.js", "PostgreSQL", "React", "TypeScript"],
      "skills": ["Angular", "React", "Vue.js"],
      "certifications": ["Google UX Design Certificate"],
      "currentProject": {
        "name": "Blockchain Payment Gateway",
        "company": "CryptoTech Solutions"
      },
      "matchScore": {
        "matched": 0.7243756548787672,
        "total": 1
      }
    }
  ],
  "totalCount": 2,
  "query": "senior+developer"
}
```

---

## 4. Angular Frontend Design

### 4.1 Technical Stack

* **Angular 20.3** (latest with standalone components as default)
* **TypeScript 5.9** (strict mode enabled)
* **Angular Material 20.2 + CDK** (Material Design 3)
* **Angular Router** (single route for MVP)
* **Signals** for reactive state management (Angular's new reactivity primitive)
* **RxJS** for async operations and HTTP requests
* **Angular Reactive Forms** with signal-based controls

### 4.2 Project Structure

```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── components/              # UI components
│   │   │   ├── header/              # Pythia+ branded header
│   │   │   ├── search-bar/          # Main search input
│   │   │   ├── search-options/      # Advanced options (topK, minScore)
│   │   │   ├── candidate-card/      # Individual result card
│   │   │   ├── candidate-list/      # Results container
│   │   │   ├── match-score-badge/   # Visual score indicator
│   │   │   ├── skill-badge/         # Technology/skill pill
│   │   │   ├── example-queries/     # Clickable query suggestions
│   │   │   └── empty-state/         # Before first search
│   │   │
│   │   ├── pages/                   # Route components
│   │   │   └── search/              # Main search page (MVP)
│   │   │
│   │   ├── services/                # Business logic
│   │   │   ├── search.service.ts    # API integration
│   │   │   └── notification.service.ts  # Toast messages
│   │   │
│   │   ├── models/                  # TypeScript interfaces
│   │   │   ├── search-params.model.ts
│   │   │   ├── search-response.model.ts
│   │   │   └── candidate.model.ts
│   │   │
│   │   ├── shared/                  # Utilities
│   │   │   ├── constants/
│   │   │   │   └── example-queries.ts
│   │   │   └── utils/
│   │   │       └── match-score-formatter.ts
│   │   │
│   │   └── main.ts                  # Bootstrap
│   │
│   └── styles/                      # Global styles
│       ├── _pythia-theme.scss       # Color palette & variables
│       └── _material-overrides.scss # Material customization
```

### 4.3 Component Architecture (Angular 20 with Signals)

```
AppComponent (signal-based)
├── HeaderComponent
│   ├── Logo: "👥 Pythia+"
│   └── UserAvatar (placeholder)
│
└── SearchPageComponent
    ├── SearchBarComponent (signals for state)
    │   ├── Input field with search icon
    │   └── Example queries (clickable pills)
    │
    ├── SearchOptionsComponent (collapsible, signal-based)
    │   ├── TopK Selector ("Show me" dropdown)
    │   └── MinScore Slider ("Match quality")
    │
    ├── @if (no results) {
    │   EmptyStateComponent
    │   └── Instructions + example queries
    │ }
    │
    └── @if (hasResults()) {
        CandidateListComponent (@defer for performance)
        ├── ResultsHeader ("6 candidates found")
        └── @for (candidate of candidates(); track candidate.id) {
            @defer (on viewport) {
              CandidateCardComponent
              ├── Avatar with initials
              ├── Name + Title
              ├── Location
              ├── SkillBadgeComponent[] (technologies)
              └── MatchScoreBadgeComponent
            } @placeholder {
              SkeletonCardComponent
            }
          }
      }
```

### 4.4 Routing Strategy (MVP - Single Route)

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { 
    path: 'search', 
    component: SearchPageComponent 
  },
  { path: '**', redirectTo: '/search' }
];
```

### 4.5 State Management Strategy (Signal-Based)

#### SearchService (Angular 20 with Signals)
```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

  // Signal-based state (Angular 20)
  searchResults = signal<SearchResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals for derived state
  hasResults = computed(() => (this.searchResults()?.totalCount ?? 0) > 0);
  resultCount = computed(() => this.searchResults()?.totalCount ?? 0);

  search(params: SearchParams): Observable<SearchResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<SearchResponse>('/api/v1/search', { params })
      .pipe(
        retry(2),
        tap(results => {
          this.searchResults.set(results);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set(err.message);
          this.loading.set(false);
          return throwError(() => err);
        })
      );
  }

  clearResults(): void {
    this.searchResults.set(null);
    this.error.set(null);
  }
}
```

#### Search Flow with Signals + RxJS (Angular 20)
```typescript
// In SearchBarComponent
export class SearchBarComponent {
  private searchService = inject(SearchService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  // Signal-based form control
  searchQuery = signal<string>('');
  topK = signal<number>(10);
  minScore = signal<number>(0.7);

  // Computed signal for search params
  searchParams = computed(() => ({
    query: this.searchQuery(),
    topK: this.topK(),
    minScore: this.minScore()
  }));

  constructor() {
    // Effect to trigger search when params change
    effect(() => {
      const params = this.searchParams();

      if (params.query.length < 3) {
        this.searchService.clearResults();
        return;
      }

      // Debounce using setTimeout in effect
      const timeoutId = setTimeout(() => {
        this.performSearch(params);
      }, 500);

      // Cleanup on next effect run
      return () => clearTimeout(timeoutId);
    });
  }

  private performSearch(params: SearchParams): void {
    this.searchService.search(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.notificationService.showError('Search failed. Please try again.');
        }
      });
  }

  // Method for example query clicks
  setQuery(query: string): void {
    this.searchQuery.set(query);
  }
}
```

---

## 5. Angular 20 Modern Features & Best Practices

### 5.1 Signal-Based Reactivity

Angular 20 uses signals as the primary reactivity primitive, replacing RxJS BehaviorSubjects for state management.

#### Key Signal APIs

```typescript
// Basic signals
const count = signal(0);                    // Writable signal
count.set(5);                               // Set value
count.update(n => n + 1);                   // Update based on current value

// Computed signals (derived state)
const doubled = computed(() => count() * 2);

// Effects (side effects)
effect(() => {
  console.log('Count changed:', count());
});

// Signal inputs (Angular 20)
export class MyComponent {
  // Required input
  data = input.required<Data>();

  // Optional input with default
  size = input<'small' | 'medium' | 'large'>('medium');

  // Two-way binding
  value = model<string>('');
}

// Signal outputs
export class MyComponent {
  clicked = output<void>();
  valueChanged = output<string>();

  handleClick() {
    this.clicked.emit();
  }
}
```

### 5.2 Native Control Flow (@if, @for, @switch)

Angular 20 uses built-in control flow instead of structural directives.

```html
<!-- Conditional rendering -->
@if (loading()) {
  <app-loading-spinner />
} @else if (error()) {
  <app-error-message [error]="error()" />
} @else {
  <app-content [data]="data()" />
}

<!-- Loops with track -->
@for (candidate of candidates(); track candidate.id) {
  <app-candidate-card [candidate]="candidate" />
} @empty {
  <app-empty-state />
}

<!-- Switch statements -->
@switch (status()) {
  @case ('loading') {
    <app-loading-spinner />
  }
  @case ('error') {
    <app-error-message />
  }
  @case ('success') {
    <app-content />
  }
  @default {
    <app-empty-state />
  }
}
```

### 5.3 Deferred Loading (@defer)

Lazy load components for better performance.

```html
<!-- Defer on viewport (lazy load when visible) -->
@defer (on viewport) {
  <app-candidate-card [candidate]="candidate()" />
} @placeholder {
  <app-skeleton-card />
} @loading (minimum 100ms) {
  <app-loading-spinner />
} @error {
  <app-error-fallback />
}

<!-- Defer on interaction -->
@defer (on interaction) {
  <app-advanced-options />
} @placeholder {
  <button>Show Advanced Options</button>
}

<!-- Defer on idle -->
@defer (on idle) {
  <app-analytics-tracker />
}

<!-- Defer on timer -->
@defer (on timer(2s)) {
  <app-promotional-banner />
}

<!-- Multiple triggers -->
@defer (on viewport; on timer(5s)) {
  <app-heavy-component />
}
```

### 5.4 Modern Component Patterns

#### Standalone Components (Default in Angular 20)

```typescript
import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, MatButtonModule], // Direct imports
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-container">
      <input
        type="search"
        [(ngModel)]="searchQuery"
        [placeholder]="placeholder()"
        (keyup.enter)="onSearch()"
      />

      @if (showExamples()) {
        <div class="examples">
          @for (example of examples(); track example) {
            <button (click)="selectExample(example)">
              {{ example }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class SearchBarComponent {
  // Signal inputs
  placeholder = input<string>('Search...');
  examples = input<string[]>([]);

  // Signal outputs
  search = output<string>();

  // Local state
  searchQuery = model<string>('');
  showExamples = signal(true);

  // Computed state
  hasQuery = computed(() => this.searchQuery().length > 0);

  onSearch(): void {
    if (this.hasQuery()) {
      this.search.emit(this.searchQuery());
    }
  }

  selectExample(example: string): void {
    this.searchQuery.set(example);
    this.onSearch();
  }
}
```

### 5.5 Dependency Injection with inject()

```typescript
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class SearchPageComponent {
  // Inject services using inject() function
  private searchService = inject(SearchService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Access service signals directly
  results = this.searchService.searchResults;
  loading = this.searchService.loading;
  error = this.searchService.error;

  constructor() {
    // Effects run automatically
    effect(() => {
      if (this.error()) {
        this.notificationService.showError(this.error()!);
      }
    });
  }

  performSearch(query: string): void {
    this.searchService.search({ query })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```

### 5.6 TypeScript Strict Mode Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

---

## 6. UI/UX Implementation

### 6.1 Pythia+ Theme (from pythia-theme.scss)

#### Color Palette
```scss
$primary-red: #D32F2F;           // Brand red
$primary-red-dark: #C62828;      // Darker red for hover
$primary-red-light: #FFCDD2;     // Light red for backgrounds

$neutral-50: #FAFAFA;            // Lightest gray
$neutral-100: #F5F5F5;           // Light gray background
$neutral-200: #EEEEEE;           // Borders
$neutral-300: #E0E0E0;           // Disabled
$neutral-400: #BDBDBD;           // Placeholder
$neutral-500: #9E9E9E;           // Secondary text
$neutral-700: #616161;           // Body text
$neutral-900: #212121;           // Headings

// Semantic colors
$success: #4CAF50;               // Green for high scores
$warning: #FF9800;               // Orange for medium scores
$error: #F44336;                 // Red for errors
$info: #2196F3;                  // Blue for info
```

#### Typography
```scss
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px
$font-size-2xl: 1.5rem;   // 24px
```

#### Spacing System (8px grid)
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

### 6.2 Responsive Design

* **Desktop (1200px+)**: Centered content with max-width 1400px
* **Tablet (768-1199px)**: Full-width with padding
* **Mobile (<768px)**: Stacked layout, simplified controls

### 6.3 Component Specifications

#### HeaderComponent
```scss
height: 64px;
background: $primary-red;
color: white;

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: $font-size-xl;
}

.subtitle {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
}
```

#### SearchBarComponent
```scss
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-2xl $spacing-md;
}

.search-input {
  width: 100%;
  height: 56px;
  font-size: $font-size-lg;
  border: 2px solid $neutral-200;
  border-radius: 8px;
  padding: 0 $spacing-md 0 48px; // Space for search icon
  
  &:focus {
    border-color: $primary-red;
    outline: none;
  }
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: $neutral-500;
}
```

#### ExampleQueriesComponent
```scss
.example-queries {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: $spacing-md;
}

.query-pill {
  padding: $spacing-sm $spacing-md;
  background: $neutral-100;
  border: 1px solid $neutral-200;
  border-radius: 20px;
  cursor: pointer;
  font-size: $font-size-sm;
  transition: all 0.2s;
  
  &:hover {
    background: $primary-red-light;
    border-color: $primary-red;
    color: $primary-red;
  }
}
```

#### SearchOptionsComponent (Collapsible)
```scss
.advanced-options {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-lg;
  background: $neutral-50;
  border-radius: 8px;
  margin-top: $spacing-md;
}

.option-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: $spacing-md;
  align-items: center;
  margin-bottom: $spacing-lg;
}

// TopK Selector
.topk-dropdown {
  width: 100%;
  height: 40px;
  border: 1px solid $neutral-200;
  border-radius: 6px;
  padding: 0 $spacing-sm;
  font-size: $font-size-base;
}

// MinScore Slider
.score-slider {
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    $warning 0%,      // 50-70%: Cast a wide net
    $success 50%,     // 70-85%: Good matches
    #2E7D32 100%      // 85-100%: Excellent matches
  );
  border-radius: 4px;
  
  &::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border: 3px solid $primary-red;
    border-radius: 50%;
    cursor: pointer;
  }
}

.score-zones {
  display: flex;
  justify-content: space-between;
  font-size: $font-size-xs;
  color: $neutral-500;
  margin-top: $spacing-xs;
}
```

#### CandidateCardComponent
```scss
.candidate-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 8px;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: $font-size-lg;
  color: white;
  
  // Color variants
  &.color-orange { background: #FF9800; }
  &.color-green { background: #4CAF50; }
  &.color-blue { background: #2196F3; }
  &.color-purple { background: #9C27B0; }
}

.candidate-info {
  flex: 1;
  
  .name {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $neutral-900;
    margin-bottom: 4px;
  }
  
  .title {
    font-size: $font-size-base;
    color: $neutral-700;
  }
  
  .location {
    font-size: $font-size-sm;
    color: $neutral-500;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }
}

.skills-section {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
  margin-top: $spacing-md;
}
```

#### SkillBadgeComponent
```scss
.skill-badge {
  padding: 4px 12px;
  background: #E3F2FD;  // Light blue
  color: #1976D2;       // Blue text
  border-radius: 4px;
  font-size: $font-size-sm;
  font-weight: 500;
  white-space: nowrap;
}
```

#### MatchScoreBadgeComponent
```scss
.match-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  
  .score {
    font-size: $font-size-2xl;
    font-weight: 700;
    
    &.excellent { color: $success; }      // 85-100%
    &.good { color: $warning; }           // 70-85%
    &.weak { color: $neutral-500; }       // <70%
  }
  
  .label {
    font-size: $font-size-xs;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    
    &.excellent {
      background: rgba(76, 175, 80, 0.1);
      color: $success;
    }
    
    &.good {
      background: rgba(255, 152, 0, 0.1);
      color: $warning;
    }
    
    &.weak {
      background: $neutral-100;
      color: $neutral-500;
    }
  }
}
```

#### EmptyStateComponent
```scss
.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  max-width: 600px;
  margin: 0 auto;
  
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto $spacing-lg;
    color: $neutral-300;
  }
  
  .title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $neutral-900;
    margin-bottom: $spacing-sm;
  }
  
  .description {
    font-size: $font-size-base;
    color: $neutral-500;
    line-height: 1.6;
  }
}
```

#### ResultsHeaderComponent
```scss
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg 0;
  border-bottom: 2px solid $neutral-200;
  margin-bottom: $spacing-lg;
  
  .count {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $neutral-900;
    
    .query-text {
      font-weight: 400;
      color: $neutral-500;
    }
  }
}
```

### 6.4 Match Score Display Logic

```typescript
interface MatchScoreDisplay {
  percentage: string;      // "89%"
  color: string;          // Color class
  label: string;          // "Excellent match"
  colorClass: string;     // "excellent" | "good" | "weak"
}

function formatMatchScore(score: number): MatchScoreDisplay {
  const percentage = Math.round(score * 100);
  
  if (score >= 0.85) {
    return {
      percentage: `${percentage}%`,
      color: '#4CAF50',
      label: 'Excellent match',
      colorClass: 'excellent'
    };
  } else if (score >= 0.70) {
    return {
      percentage: `${percentage}%`,
      color: '#FF9800',
      label: 'Good match',
      colorClass: 'good'
    };
  } else {
    return {
      percentage: `${percentage}%`,
      color: '#9E9E9E',
      label: 'Weak match',
      colorClass: 'weak'
    };
  }
}
```

### 6.5 Loading States

#### Search Loading
```scss
.loading-container {
  text-align: center;
  padding: $spacing-2xl;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid $neutral-200;
    border-top-color: $primary-red;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  .loading-text {
    margin-top: $spacing-md;
    font-size: $font-size-base;
    color: $neutral-500;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Placeholders (Alternative)
```scss
.skeleton-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 8px;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  
  .skeleton-line {
    height: 20px;
    background: linear-gradient(
      90deg,
      $neutral-100 25%,
      $neutral-200 50%,
      $neutral-100 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    
    &.avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    
    &.name { width: 200px; margin-bottom: 8px; }
    &.title { width: 150px; height: 16px; }
    &.skills { width: 300px; height: 24px; margin-top: 16px; }
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 6.6 Error Handling & Notifications

#### Toast Service
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  showSuccess(message: string): void {
    // Material Snackbar with success styling
  }
  
  showError(message: string): void {
    // Material Snackbar with error styling
  }
  
  showInfo(message: string): void {
    // Material Snackbar with info styling
  }
}
```

#### Error Scenarios
```typescript
// Network error
if (error.status === 0) {
  this.notificationService.showError(
    'Unable to connect to server. Please check your connection.'
  );
}

// Server error (500)
if (error.status >= 500) {
  this.notificationService.showError(
    'Server error. Please try again later.'
  );
}

// Bad request (400)
if (error.status === 400) {
  this.notificationService.showError(
    'Invalid search query. Please try a different phrase.'
  );
}

// No results
if (results.totalCount === 0) {
  this.notificationService.showInfo(
    'No candidates found. Try adjusting your search or lowering the match quality threshold.'
  );
}
```

---

## 7. User Experience Flow

### 7.1 Initial Load
1. User arrives at application
2. **Header** displays with Pythia+ branding
3. **Empty state** shows:
   - Large search icon
   - Instructions: "Start by describing the talent you're looking for"
   - Subtitle: "Try natural language like 'Senior developer with Spring Boot experience'"
4. **Example queries** displayed as clickable pills below search box

### 7.2 Search Interaction
1. User clicks example query OR types in search box
2. After 500ms debounce, search triggers automatically
3. **Loading state** appears (spinner + "Searching..." text)
4. API request sent: `GET /api/v1/search?query=...&topK=10&minScore=0.7`
5. Results received and displayed

### 7.3 Results Display
1. **Results header** shows: "6 candidates found • Sorted by relevance"
2. **Candidate cards** display in descending order by match score
3. Each card shows:
   - Colored avatar with initials
   - Name (bold) + Title + Location
   - Technology badges (max 4 visible)
   - Match score (large percentage + label + color)
4. User can scroll through results

### 7.4 Advanced Options
1. User clicks **"⚙️ Advanced options"** button
2. Panel expands with smooth animation
3. **"Show me" dropdown** allows selecting result count:
   - Top 5 matches
   - Top 10 matches (default)
   - Top 20 matches
   - All matches (50)
4. **"Minimum match quality" slider** with visual zones:
   - 50-70%: Orange zone ("Cast a wide net")
   - 70-85%: Green zone ("Good matches") ← default
   - 85-100%: Dark green zone ("Only excellent matches")
5. Changes trigger new search automatically (with debounce)

### 7.5 Refinement Flow
1. User modifies query or adjusts options
2. Previous results fade out
3. New search executes
4. Fresh results fade in
5. Scroll position resets to top

---

## 8. Performance Optimization

### 8.1 Frontend Strategies (Angular 20)

#### Request Optimization with Signals
```typescript
// Debounce with effect
export class SearchBarComponent {
  searchQuery = signal<string>('');

  constructor() {
    effect(() => {
      const query = this.searchQuery();

      // Debounce using setTimeout
      const timeoutId = setTimeout(() => {
        if (query.length >= 3) {
          this.performSearch(query);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    });
  }
}

// Cancel previous requests with switchMap (still useful with RxJS)
private searchSubject = new Subject<string>();

constructor() {
  this.searchSubject.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(query => this.searchService.search({ query })),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe();
}

// Cache with signals
export class SearchService {
  private cache = new Map<string, SearchResponse>();

  search(params: SearchParams): Observable<SearchResponse> {
    const cacheKey = JSON.stringify(params);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      this.searchResults.set(cached);
      return of(cached);
    }

    return this.http.get<SearchResponse>('/api/v1/search', { params })
      .pipe(
        tap(results => {
          this.cache.set(cacheKey, results);
          this.searchResults.set(results);
        })
      );
  }
}
```

#### Rendering Optimization (Angular 20)
```typescript
// OnPush change detection with signals (automatic optimization)
@Component({
  selector: 'app-candidate-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Native control flow with @defer for lazy loading -->
    @defer (on viewport) {
      <div class="candidate-card">
        <div class="card-header">
          <div class="avatar" [style.background]="avatarColor()">
            {{ initials() }}
          </div>
          <div class="candidate-info">
            <h3 class="name">{{ candidate().name }}</h3>
            <p class="title">{{ candidate().title }}</p>
            <p class="location">📍 {{ candidate().location }}</p>
          </div>
          <app-match-score-badge [score]="candidate().matchScore.matched" />
        </div>

        <div class="skills-section">
          @for (skill of candidate().technologies; track skill) {
            <app-skill-badge [skill]="skill" />
          }
        </div>
      </div>
    } @placeholder {
      <app-skeleton-card />
    } @loading (minimum 100ms) {
      <app-skeleton-card />
    }
  `
})
export class CandidateCardComponent {
  // Signal input (Angular 20)
  candidate = input.required<Candidate>();

  // Computed signals for derived state
  initials = computed(() => {
    const name = this.candidate().name;
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  });

  avatarColor = computed(() => {
    const colors = ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0'];
    const index = this.candidate().id.charCodeAt(0) % colors.length;
    return colors[index];
  });
}

// Virtual scrolling for large result sets (future)
<cdk-virtual-scroll-viewport itemSize="120">
  @for (candidate of candidates(); track candidate.id) {
    @defer (on viewport) {
      <app-candidate-card [candidate]="candidate" />
    } @placeholder {
      <app-skeleton-card />
    }
  }
</cdk-virtual-scroll-viewport>
```

### 8.2 Backend Considerations

* **Database indexing** on embedding vectors (pgvector IVFFlat or HNSW)
* **Prepared statements** for query parameter binding
* **Connection pooling** configured in Spring Boot
* **Response caching** for popular queries (optional)

### 8.3 Lighthouse Targets
* **Performance**: 90+ (fast page load, optimized assets)
* **Accessibility**: 95+ (semantic HTML, ARIA labels, keyboard navigation)
* **Best Practices**: 90+ (HTTPS, proper error handling)
* **SEO**: 85+ (meta tags, semantic structure)

---

## 9. Accessibility (WCAG AA Compliance)

### 9.1 Requirements
* **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
* **Keyboard Navigation**: Full keyboard accessibility (Tab, Enter, Escape)
* **Screen Readers**: Proper ARIA labels and live regions
* **Focus Management**: Visible focus indicators on all interactive elements

### 9.2 Implementation

#### Search Input (Angular 20 with Signals)
```html
<!-- Two-way binding with signals -->
<input
  type="search"
  [(ngModel)]="searchQuery"
  (ngModelChange)="onSearchChange($event)"
  aria-label="Search for candidates using natural language"
  aria-describedby="search-instructions"
  placeholder="Find React developers in Zurich"
/>
<p id="search-instructions" class="sr-only">
  Enter a natural language query to search for candidates.
  For example: Senior Python developer with 5+ years experience.
</p>

<!-- Component TypeScript -->
export class SearchBarComponent {
  searchQuery = model<string>(''); // Two-way binding signal

  onSearchChange(value: string): void {
    // Signal automatically updates, effect handles debouncing
  }
}
```

#### Results Announcement (Angular 20)
```html
<!-- Announce results to screen readers using signals -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  @if (searchService.hasResults()) {
    {{ searchService.resultCount() }} candidates found for "{{ searchQuery() }}"
  }
</div>
```

#### Match Score (Angular 20 with Computed Signals)
```typescript
// Component
export class MatchScoreBadgeComponent {
  score = input.required<number>();

  // Computed signal for match score display
  matchScore = computed(() => formatMatchScore(this.score()));

  // Computed signal for aria label
  ariaLabel = computed(() =>
    `Match score: ${this.matchScore().percentage}, ${this.matchScore().label}`
  );
}
```

```html
<!-- Template -->
<div
  class="match-badge"
  [attr.aria-label]="ariaLabel()"
>
  <span class="score" [class]="matchScore().colorClass">
    {{ matchScore().percentage }}
  </span>
  <span class="label" [class]="matchScore().colorClass">
    {{ matchScore().label }}
  </span>
</div>
```

#### Keyboard Shortcuts
* **Enter** in search input → Execute search
* **Escape** in search input → Clear search
* **Tab** → Navigate through results
* **Enter** on candidate card → View details (future feature)

---

## 10. Testing Strategy

### 10.1 Unit Tests (Angular 20 with Signals)

```typescript
// SearchService tests with signals
describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should update signal state on successful search', () => {
    const params = { query: 'React developer', topK: 10, minScore: 0.7 };
    const mockResponse: SearchResponse = {
      results: [],
      totalCount: 2,
      query: 'React developer'
    };

    service.search(params).subscribe();

    const req = httpMock.expectOne(req =>
      req.url.includes('/api/v1/search')
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    // Test signal state
    expect(service.searchResults()).toEqual(mockResponse);
    expect(service.loading()).toBe(false);
    expect(service.hasResults()).toBe(true);
    expect(service.resultCount()).toBe(2);
  });

  it('should handle errors and update error signal', () => {
    service.search({ query: 'test' }).subscribe({
      error: () => {
        expect(service.error()).toBeTruthy();
        expect(service.loading()).toBe(false);
      }
    });

    const req = httpMock.expectOne(req => req.url.includes('/api/v1/search'));
    req.error(new ProgressEvent('error'));
  });
});

// Component tests with signals
describe('MatchScoreBadgeComponent', () => {
  it('should compute match score display correctly', () => {
    const fixture = TestBed.createComponent(MatchScoreBadgeComponent);
    fixture.componentRef.setInput('score', 0.89);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.matchScore().percentage).toBe('89%');
    expect(component.matchScore().label).toBe('Excellent match');
    expect(component.matchScore().colorClass).toBe('excellent');
  });
});
```

### 10.2 Integration Tests

```typescript
describe('Search Flow Integration', () => {
  it('should complete full search flow', fakeAsync(() => {
    // Type in search box
    component.searchControl.setValue('React developer');
    tick(500); // Debounce delay
    
    // Verify API call
    const req = httpMock.expectOne(/api\/v1\/search/);
    req.flush(mockSearchResponse);
    tick();
    
    // Verify results displayed
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.candidate-card');
    expect(cards.length).toBe(2);
  }));
});
```

### 10.3 E2E Tests (Cypress - Future)

```typescript
describe('Pythia+ Search', () => {
  it('should search and display results', () => {
    cy.visit('/search');
    
    // Click example query
    cy.contains('Senior Python developers').click();
    
    // Wait for results
    cy.get('.candidate-card').should('have.length.greaterThan', 0);
    
    // Verify first result
    cy.get('.candidate-card').first().within(() => {
      cy.get('.name').should('be.visible');
      cy.get('.match-badge .score').should('contain', '%');
    });
  });
});
```

---

## 11. Deployment Strategy

### 11.1 Development Environment
```bash
# Frontend (Angular)
ng serve --port 4200

# Backend (Kotlin Spring Boot)
./gradlew bootRun --args='--server.port=8080'

# Database (PostgreSQL + pgvector)
docker-compose up -d postgres
```

### 11.2 Production Build
```bash
# Build Angular app
ng build --configuration production

# Outputs to: dist/pythia-plus/
# Deploy to: AWS S3 + CloudFront OR GitHub Pages OR Netlify
```

### 11.3 Environment Configuration

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.pythia.example.com/api/v1'
};

// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

### 11.4 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Pythia+ Frontend
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist/pythia-plus'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 12. Future Enhancements (Post-MVP)

### 12.1 Phase 2 Features
* **Candidate details view**: Click card to see full profile, CV, projects
* **Comparison mode**: Select multiple candidates and compare side-by-side
* **Export functionality**: Download results as CSV or PDF
* **Save searches**: Bookmark queries and get alerts for new matches
* **Filter panel**: Additional filters (location, years of experience, availability)

### 12.2 Advanced Features
* **Real-time updates**: WebSocket integration for live candidate updates
* **Multi-language support**: Interface in EN/DE/FR/IT
* **Advanced analytics**: Search history, popular queries, conversion tracking
* **AI-powered suggestions**: Query refinement recommendations
* **Candidate engagement**: Direct messaging, interview scheduling

### 12.3 Backend Enhancements
* **Hybrid search**: Combine semantic search with traditional filters
* **Query optimization**: Analyze slow queries and optimize indexes
* **A/B testing**: Test different embedding models and similarity thresholds
* **Caching layer**: Redis for frequent query caching
* **Rate limiting**: Protect API from abuse

---

## 13. Example Queries for Testing

### 13.1 General Queries
```
"Senior backend developer"
"React developer with TypeScript"
"Machine learning engineer"
"DevOps engineer with Kubernetes"
"Full stack developer with cloud experience"
```

### 13.2 Specific Skill Queries
```
"Spring Boot backend developer"
"Frontend developer with Angular and RxJS"
"Data engineer with Spark and Airflow"
"iOS developer with SwiftUI"
"Python developer with Django"
```

### 13.3 Semantic Queries (No Exact Keywords)
```
"Someone who can build user interfaces"
"Expert in container orchestration"
"Person skilled in data pipelines"
"Developer who knows reactive programming"
"Engineer with microservices experience"
```

### 13.4 Location-Based Queries
```
"React developers in Zurich"
"Backend engineers in Switzerland"
"Remote frontend developers"
"Senior developers in Berlin"
"Machine learning engineers in Valencia"
```

---

## 14. Success Metrics

### 14.1 Technical Metrics
* **Search latency**: < 500ms for 95th percentile
* **API availability**: > 99.5% uptime
* **Error rate**: < 1% of requests
* **Cache hit ratio**: > 60% for popular queries

### 14.2 User Experience Metrics
* **Time to first result**: < 1 second
* **Match quality**: Average match score > 0.75
* **Search refinement rate**: < 30% (users finding results on first try)
* **Empty results rate**: < 10%

### 14.3 Business Metrics
* **Search usage**: Track daily active users and searches per user
* **Candidate engagement**: Click-through rate on results
* **Feature adoption**: Usage of advanced options (topK, minScore)
* **User satisfaction**: Feedback and ratings

---

## 15. Angular 20 Best Practices Summary

### 15.1 Signal-First Development

**DO:**
- ✅ Use signals for all component state
- ✅ Use `computed()` for derived state
- ✅ Use `effect()` for side effects
- ✅ Use `input()` and `output()` for component APIs
- ✅ Use `model()` for two-way binding

**DON'T:**
- ❌ Use BehaviorSubject for component state
- ❌ Use `@Input()` and `@Output()` decorators
- ❌ Use `[(ngModel)]` without signal backing
- ❌ Manually call `detectChanges()`

### 15.2 Template Syntax

**DO:**
- ✅ Use `@if`, `@else if`, `@else` for conditionals
- ✅ Use `@for` with `track` for loops
- ✅ Use `@switch`, `@case`, `@default` for switches
- ✅ Use `@defer` for lazy loading
- ✅ Use `@empty` for empty states in loops

**DON'T:**
- ❌ Use `*ngIf`, `*ngFor`, `*ngSwitch`
- ❌ Use `trackBy` functions (use `track` expression instead)
- ❌ Load all components eagerly

### 15.3 Component Architecture

**DO:**
- ✅ Use standalone components (default in Angular 20)
- ✅ Use `inject()` for dependency injection
- ✅ Use `OnPush` change detection
- ✅ Use `DestroyRef` with `takeUntilDestroyed()`
- ✅ Import only what you need in component `imports`

**DON'T:**
- ❌ Create NgModules for new code
- ❌ Use constructor injection
- ❌ Use `OnDestroy` lifecycle hook
- ❌ Import entire modules when you need one component

### 15.4 Performance Optimization

**DO:**
- ✅ Use `@defer` for below-the-fold content
- ✅ Use `@defer (on viewport)` for lazy loading
- ✅ Use `@defer (on idle)` for non-critical features
- ✅ Use `track` in `@for` loops
- ✅ Use `OnPush` change detection everywhere

**DON'T:**
- ❌ Load everything on initial page load
- ❌ Use default change detection
- ❌ Forget to track items in loops
- ❌ Create unnecessary computed signals

### 15.5 Type Safety

**DO:**
- ✅ Enable TypeScript strict mode
- ✅ Use `input.required<T>()` for required inputs
- ✅ Use proper generic types for signals
- ✅ Use discriminated unions for state
- ✅ Enable all strict compiler options

**DON'T:**
- ❌ Use `any` type
- ❌ Disable strict null checks
- ❌ Use type assertions without validation
- ❌ Ignore TypeScript errors

### 15.6 Testing

**DO:**
- ✅ Test signal state changes
- ✅ Use `fixture.componentRef.setInput()` for inputs
- ✅ Test computed signal values
- ✅ Test effects and side effects
- ✅ Use `TestBed.runInInjectionContext()` for signals

**DON'T:**
- ❌ Test implementation details
- ❌ Forget to test signal reactivity
- ❌ Skip testing computed signals
- ❌ Use deprecated testing APIs

### 15.7 Code Organization

```
src/app/
├── core/                           # Singleton services
│   ├── services/
│   │   ├── search.service.ts      # Signal-based state
│   │   └── notification.service.ts
│   └── interceptors/
│       └── error.interceptor.ts
│
├── features/                       # Feature modules
│   └── search/
│       ├── pages/
│       │   └── search-page/
│       │       ├── search-page.component.ts
│       │       ├── search-page.component.html
│       │       └── search-page.component.scss
│       ├── components/
│       │   ├── search-bar/
│       │   ├── candidate-card/
│       │   └── match-score-badge/
│       └── models/
│           ├── search-params.model.ts
│           └── candidate.model.ts
│
├── shared/                         # Reusable components
│   ├── components/
│   │   ├── header/
│   │   ├── empty-state/
│   │   └── skeleton-card/
│   └── utils/
│       └── format-match-score.ts
│
└── app.ts                          # Root component
```

### 15.8 Complete Example: Modern Angular 20 Component

```typescript
import { Component, signal, computed, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '@core/services/search.service';
import { Candidate } from '@features/search/models/candidate.model';

@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    CandidateListComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-page">
      <div class="search-container">
        <input
          type="search"
          [(ngModel)]="searchQuery"
          [placeholder]="'Search for candidates...'"
          class="search-input"
        />

        @if (showExamples()) {
          <div class="examples">
            @for (example of exampleQueries; track example) {
              <button
                mat-stroked-button
                (click)="selectExample(example)"
              >
                {{ example }}
              </button>
            }
          </div>
        }
      </div>

      @if (loading()) {
        <div class="loading">
          <mat-spinner />
          <p>Searching for candidates...</p>
        </div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
          <button mat-raised-button (click)="retry()">Retry</button>
        </div>
      } @else if (hasResults()) {
        <app-candidate-list [candidates]="results()" />
      } @else {
        <app-empty-state />
      }
    </div>
  `,
  styles: [`
    .search-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .search-container {
      margin-bottom: var(--spacing-xl);
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-md);
      font-size: var(--font-size-lg);
      border: 2px solid var(--color-border-light);
      border-radius: var(--border-radius-md);

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    .examples {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
      flex-wrap: wrap;
    }
  `]
})
export class SearchPageComponent {
  // Inject services
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  // Local state (signals)
  searchQuery = model<string>('');
  showExamples = signal(true);

  // Example queries
  exampleQueries = [
    'Senior React developers in Zurich',
    'Backend engineers with Spring Boot',
    'Machine learning engineers'
  ];

  // Access service state
  results = this.searchService.searchResults;
  loading = this.searchService.loading;
  error = this.searchService.error;

  // Computed state
  hasResults = computed(() =>
    (this.results()?.totalCount ?? 0) > 0
  );

  constructor() {
    // Effect to trigger search when query changes
    effect(() => {
      const query = this.searchQuery();

      if (query.length < 3) {
        this.searchService.clearResults();
        this.showExamples.set(true);
        return;
      }

      this.showExamples.set(false);

      // Debounce
      const timeoutId = setTimeout(() => {
        this.performSearch(query);
      }, 500);

      return () => clearTimeout(timeoutId);
    });
  }

  selectExample(example: string): void {
    this.searchQuery.set(example);
  }

  retry(): void {
    const query = this.searchQuery();
    if (query) {
      this.performSearch(query);
    }
  }

  private performSearch(query: string): void {
    this.searchService.search({ query, topK: 10, minScore: 0.7 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```

### 15.9 World-Class Quality Checklist

**Architecture:**
- ✅ Signal-based state management
- ✅ Standalone components
- ✅ OnPush change detection
- ✅ Lazy loading with @defer
- ✅ Proper dependency injection

**Performance:**
- ✅ Bundle size < 500KB initial
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Lighthouse score > 90
- ✅ Core Web Vitals passing

**Accessibility:**
- ✅ WCAG AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels

**Code Quality:**
- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ Prettier configured
- ✅ 80%+ test coverage
- ✅ No console errors/warnings

**User Experience:**
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Responsive design
- ✅ Smooth animations

---

**End of Document**

**Document Version:** 2.0 (Updated for Angular 20)
**Last Updated:** 2025-11-14
**Author:** Pythia+ Development Team

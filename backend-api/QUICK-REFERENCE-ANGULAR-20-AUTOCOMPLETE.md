# Quick Reference: Angular 20 Autocomplete Patterns

**For:** Backend Developer revising autocomplete integration guide  
**Goal:** Convert deprecated patterns to Angular 20 modern patterns  
**Time:** 2-3 days

---

## Pattern Conversion Cheat Sheet

### 1. Dependency Injection

```typescript
// ❌ DEPRECATED (Angular < 14)
constructor(
  private http: HttpClient,
  private router: Router
) {}

// ✅ ANGULAR 20 (Use inject() function)
private readonly http = inject(HttpClient);
private readonly router = inject(Router);
```

---

### 2. Component Lifecycle

```typescript
// ❌ DEPRECATED (Class-based lifecycle)
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(...);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ ANGULAR 20 (Signal-based with effects)
export class SearchComponent {
  private readonly searchService = inject(SearchService);
  
  constructor() {
    // Effect automatically cleans up
    effect(() => {
      const query = this.query();
      if (query.length >= 2) {
        this.searchService.getAutocompleteSuggestions(query);
      }
    });
  }
}
```

---

### 3. State Management

```typescript
// ❌ DEPRECATED (Observables for state)
suggestions: Suggestion[] = [];
showSuggestions = false;
selectedIndex = -1;

// ✅ ANGULAR 20 (Signals for state)
readonly suggestions = signal<Suggestion[]>([]);
readonly showSuggestions = signal(false);
readonly selectedIndex = signal(-1);

// Computed signals for derived state
readonly hasSuggestions = computed(() => this.suggestions().length > 0);
readonly selectedSuggestion = computed(() => {
  const index = this.selectedIndex();
  return index >= 0 ? this.suggestions()[index] : null;
});
```

---

### 4. Template Syntax

```html
<!-- ❌ DEPRECATED (Structural directives) -->
<div *ngIf="showSuggestions" class="dropdown">
  <div *ngFor="let suggestion of suggestions; let i = index">
    {{ suggestion.value }}
  </div>
</div>

<!-- ✅ ANGULAR 20 (Control flow syntax) -->
@if (showSuggestions()) {
  <div class="dropdown">
    @for (suggestion of suggestions(); track suggestion.value; let i = $index) {
      <div>{{ suggestion.value }}</div>
    } @empty {
      <div>No suggestions found</div>
    }
  </div>
}
```

---

### 5. Component Inputs/Outputs

```typescript
// ❌ DEPRECATED (Decorator-based)
@Input() placeholder: string = 'Search...';
@Output() search = new EventEmitter<string>();

// ✅ ANGULAR 20 (Signal-based)
readonly placeholder = input<string>('Search...');
readonly search = output<string>();

// Required input
readonly candidate = input.required<Candidate>();
```

---

### 6. Service with Signals

```typescript
// ❌ DEPRECATED (BehaviorSubject)
export class AutocompleteService {
  private suggestionsSubject = new BehaviorSubject<Suggestion[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();
  
  getSuggestions(query: string): void {
    this.http.get<AutocompleteResponse>('/api/autocomplete', { params: { query } })
      .subscribe(response => {
        this.suggestionsSubject.next(response.suggestions);
      });
  }
}

// ✅ ANGULAR 20 (Signals)
export class SearchService {
  private readonly http = inject(HttpClient);
  
  readonly autocompleteSuggestions = signal<Suggestion[]>([]);
  readonly autocompleteLoading = signal(false);
  readonly autocompleteError = signal<string | null>(null);
  
  getAutocompleteSuggestions(query: string, limit: number = 10): void {
    this.autocompleteLoading.set(true);
    this.autocompleteError.set(null);
    
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('limit', limit.toString());
    
    this.http.get<AutocompleteResponse>(`${this.apiUrl}/autocomplete?${params}`)
      .pipe(
        tap(response => {
          this.autocompleteSuggestions.set(response.suggestions);
          this.autocompleteLoading.set(false);
        }),
        catchError(err => {
          this.autocompleteError.set('Failed to load suggestions');
          this.autocompleteLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}
```

---

### 7. Debouncing with Signals

```typescript
// ❌ DEPRECATED (RxJS in component)
searchControl = new FormControl('');

ngOnInit(): void {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.service.getSuggestions(query))
    )
    .subscribe(response => {
      this.suggestions = response.suggestions;
    });
}

// ✅ ANGULAR 20 (Effect with debounce)
readonly query = signal('');
private debounceTimeout: any;

constructor() {
  effect(() => {
    const currentQuery = this.query();
    
    // Clear previous timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    // Debounce search
    this.debounceTimeout = setTimeout(() => {
      if (currentQuery.length >= 2) {
        this.searchService.getAutocompleteSuggestions(currentQuery);
      }
    }, 300);
  });
}
```

---

## Accessibility Checklist

### ARIA Attributes (Required)

```html
<input
  type="text"
  role="combobox"
  [attr.aria-expanded]="showAutocomplete()"
  [attr.aria-controls]="'autocomplete-listbox'"
  [attr.aria-activedescendant]="selectedIndex() >= 0 ? 'suggestion-' + selectedIndex() : null"
  [attr.aria-autocomplete]="'list'"
  aria-label="Search candidates by skills, location, or experience"
  [(ngModel)]="query"
/>

<div
  id="autocomplete-listbox"
  role="listbox"
  [attr.aria-label]="'Search suggestions'"
>
  @for (suggestion of suggestions(); track suggestion.value; let i = $index) {
    <div
      [id]="'suggestion-' + i"
      role="option"
      [attr.aria-selected]="i === selectedIndex()"
    >
      {{ suggestion.value }}
    </div>
  }
</div>

<!-- Screen reader announcements -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  @if (autocompleteLoading()) {
    Loading suggestions...
  } @else if (suggestions().length > 0) {
    {{ suggestions().length }} suggestions available
  }
</div>
```

### Keyboard Navigation (Required)

```typescript
onKeyDown(event: KeyboardEvent): void {
  if (!this.showAutocomplete()) return;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      this.selectedIndex.update(i => 
        Math.min(i + 1, this.suggestions().length - 1)
      );
      break;
    
    case 'ArrowUp':
      event.preventDefault();
      this.selectedIndex.update(i => Math.max(i - 1, -1));
      break;
    
    case 'Home':
      event.preventDefault();
      this.selectedIndex.set(0);
      break;
    
    case 'End':
      event.preventDefault();
      this.selectedIndex.set(this.suggestions().length - 1);
      break;
    
    case 'Enter':
      event.preventDefault();
      const selected = this.selectedSuggestion();
      if (selected) {
        this.selectSuggestion(selected);
      }
      break;
    
    case 'Escape':
      event.preventDefault();
      this.showAutocomplete.set(false);
      this.selectedIndex.set(-1);
      break;
  }
}
```

---

## Pythia Theme System

### CSS Custom Properties (Use These!)

```scss
// Colors
--color-primary-50: #ffebee;        // Light red background
--color-primary-500: #d32f2f;       // Pythia red
--color-border-light: #e0e0e0;      // Light borders
--color-text-primary: #212121;      // Primary text
--color-text-secondary: #757575;    // Secondary text
--color-background-primary: #ffffff; // White background

// Spacing (8px grid)
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;

// Elevation (Material Design shadows)
--elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
--elevation-2: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

// Border Radius
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;

// Typography
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-md: 16px;
--font-weight-medium: 500;
```

### Example Usage

```scss
.autocomplete-dropdown {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  box-shadow: var(--elevation-2);
  padding: var(--spacing-sm) 0;
}

.suggestion-item {
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: var(--color-primary-50);
  }
}
```

---

## Loading/Error/Empty States

```typescript
// Loading state (skeleton UI)
@if (autocompleteLoading()) {
  <div class="autocomplete-dropdown">
    @for (i of [1, 2, 3]; track i) {
      <div class="suggestion-skeleton">
        <div class="skeleton-icon"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    }
  </div>
}

// Error state
@if (autocompleteError()) {
  <div class="autocomplete-error">
    <span class="error-icon">⚠️</span>
    <span class="error-message">{{ autocompleteError() }}</span>
    <button (click)="retryAutocomplete()">Retry</button>
  </div>
}

// Empty state
@if (!autocompleteLoading() && suggestions().length === 0 && query().length >= 2) {
  <div class="autocomplete-empty">
    <span class="empty-icon">🔍</span>
    <p>No suggestions found for "{{ query() }}"</p>
  </div>
}

// Results
@if (!autocompleteLoading() && suggestions().length > 0) {
  <div class="autocomplete-dropdown">
    @for (suggestion of suggestions(); track suggestion.value) {
      <div class="suggestion-item">{{ suggestion.value }}</div>
    }
  </div>
}
```

---

## Key Files to Reference

1. **SearchService** - `pythia-frontend/src/app/services/search.service.ts`
   - Signal-based state management
   - HTTP client usage
   - Error handling patterns

2. **SearchBar Component** - `pythia-frontend/src/app/components/search-bar/search-bar.component.ts`
   - Signal inputs
   - Effect-based debouncing
   - Component structure

3. **Pythia Theme** - `pythia-frontend/src/styles/themes/_pythia-theme.scss`
   - CSS custom properties
   - Color palette
   - Spacing system

4. **CLAUDE.md** - Angular 20 best practices
   - Section 2: Code Conventions
   - Section 6.6: Accessibility Standards

---

**Quick Start:** Copy patterns from this reference, replace deprecated code in integration guide, test examples compile correctly.


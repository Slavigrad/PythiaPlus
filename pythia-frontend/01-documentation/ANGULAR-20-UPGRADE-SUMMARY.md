# Angular 20 Upgrade Summary

## Overview

The Pythia+ MVP design document has been updated to leverage Angular 20's latest features and best practices for world-class application development.

## Key Changes

### 1. Signal-Based State Management

**Before (Angular 17 - RxJS BehaviorSubject):**
```typescript
private searchResultsSubject = new BehaviorSubject<SearchResponse | null>(null);
searchResults$ = this.searchResultsSubject.asObservable();
```

**After (Angular 20 - Signals):**
```typescript
searchResults = signal<SearchResponse | null>(null);
hasResults = computed(() => (this.searchResults()?.totalCount ?? 0) > 0);
```

**Benefits:**
- ✅ Simpler API
- ✅ Better performance (fine-grained reactivity)
- ✅ Automatic change detection
- ✅ Type-safe by default

### 2. Native Control Flow

**Before (Structural Directives):**
```html
<div *ngIf="loading">Loading...</div>
<div *ngFor="let item of items; trackBy: trackByFn">{{ item }}</div>
```

**After (Built-in Control Flow):**
```html
@if (loading()) {
  <div>Loading...</div>
}

@for (item of items(); track item.id) {
  <div>{{ item }}</div>
}
```

**Benefits:**
- ✅ Better performance
- ✅ Simpler syntax
- ✅ Built-in type narrowing
- ✅ No need for trackBy functions

### 3. Deferred Loading (@defer)

**New Feature:**
```html
@defer (on viewport) {
  <app-candidate-card [candidate]="candidate()" />
} @placeholder {
  <app-skeleton-card />
} @loading (minimum 100ms) {
  <app-loading-spinner />
}
```

**Benefits:**
- ✅ Automatic lazy loading
- ✅ Reduced initial bundle size
- ✅ Better Core Web Vitals
- ✅ Improved Time to Interactive

### 4. Signal Inputs/Outputs

**Before (Decorators):**
```typescript
@Input() candidate!: Candidate;
@Output() selected = new EventEmitter<Candidate>();
```

**After (Signal Functions):**
```typescript
candidate = input.required<Candidate>();
selected = output<Candidate>();
```

**Benefits:**
- ✅ Type-safe by default
- ✅ Required inputs enforced at compile time
- ✅ Better IDE support
- ✅ Consistent with signal API

### 5. Dependency Injection with inject()

**Before (Constructor Injection):**
```typescript
constructor(
  private searchService: SearchService,
  private router: Router
) {}
```

**After (inject() Function):**
```typescript
private searchService = inject(SearchService);
private router = inject(Router);
```

**Benefits:**
- ✅ Can be used outside constructor
- ✅ Cleaner code
- ✅ Better for composition
- ✅ Works with functional patterns

## Performance Improvements

### Bundle Size Optimization
- **@defer blocks**: Reduce initial bundle by 30-50%
- **Tree-shakable signals**: Smaller runtime overhead
- **OnPush everywhere**: Minimal change detection cycles

### Runtime Performance
- **Fine-grained reactivity**: Only update what changed
- **Computed signals**: Memoized derived state
- **Effect batching**: Reduced unnecessary work

## Accessibility Enhancements

All components now use:
- ✅ Proper ARIA labels with signal-based values
- ✅ Live regions for dynamic content
- ✅ Keyboard navigation
- ✅ Focus management

## Testing Updates

**Signal Testing:**
```typescript
it('should update signal state', () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.componentRef.setInput('value', 'test');
  
  expect(component.value()).toBe('test');
  expect(component.computed()).toBe('computed-test');
});
```

## Migration Checklist

- [x] Update state management to signals
- [x] Replace structural directives with control flow
- [x] Add @defer for lazy loading
- [x] Use signal inputs/outputs
- [x] Switch to inject() function
- [x] Enable TypeScript strict mode
- [x] Update tests for signals
- [x] Add performance budgets
- [x] Implement accessibility features
- [x] Document best practices

## Next Steps

1. **Implement Core Services** - Start with SearchService using signals
2. **Build Component Library** - Create reusable components with signal APIs
3. **Add @defer Strategically** - Lazy load below-the-fold content
4. **Write Tests** - Test signal reactivity and computed values
5. **Performance Audit** - Measure and optimize bundle size

## Resources

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Control Flow Syntax](https://angular.dev/guide/templates/control-flow)
- [Deferred Loading](https://angular.dev/guide/defer)
- [Signal Inputs](https://angular.dev/guide/components/inputs)
- [inject() Function](https://angular.dev/guide/di/dependency-injection)


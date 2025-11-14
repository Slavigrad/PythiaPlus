# Angular 17 vs Angular 20 - Feature Comparison

## State Management

| Feature | Angular 17 | Angular 20 | Benefit |
|---------|-----------|-----------|---------|
| **Component State** | `BehaviorSubject` + Observables | `signal()` | Simpler API, better performance |
| **Derived State** | `combineLatest()` + `map()` | `computed()` | Automatic memoization |
| **Side Effects** | `subscribe()` in constructor | `effect()` | Automatic cleanup |
| **Two-way Binding** | `[(ngModel)]` | `model()` signal | Type-safe, reactive |
| **Change Detection** | Zone.js triggers | Fine-grained updates | 10x faster updates |

## Template Syntax

| Feature | Angular 17 | Angular 20 | Benefit |
|---------|-----------|-----------|---------|
| **Conditionals** | `*ngIf` | `@if` / `@else` | Better type narrowing |
| **Loops** | `*ngFor` | `@for` with `track` | Simpler syntax |
| **Switch** | `*ngSwitch` | `@switch` / `@case` | More readable |
| **Empty State** | Manual check | `@empty` | Built-in support |
| **Lazy Loading** | Manual lazy modules | `@defer` | Automatic code splitting |

## Component API

| Feature | Angular 17 | Angular 20 | Benefit |
|---------|-----------|-----------|---------|
| **Inputs** | `@Input()` decorator | `input()` / `input.required()` | Compile-time validation |
| **Outputs** | `@Output()` decorator | `output()` | Consistent API |
| **Two-way Binding** | `@Input()` + `@Output()` | `model()` | Single declaration |
| **Host Bindings** | `@HostBinding()` | `host` object | Cleaner code |
| **Standalone** | `standalone: true` | Default | Less boilerplate |

## Dependency Injection

| Feature | Angular 17 | Angular 20 | Benefit |
|---------|-----------|-----------|---------|
| **Service Injection** | Constructor parameters | `inject()` function | More flexible |
| **Cleanup** | `OnDestroy` + `Subject` | `DestroyRef` | Automatic cleanup |
| **RxJS Cleanup** | `takeUntil()` | `takeUntilDestroyed()` | Simpler API |

## Performance Features

| Feature | Angular 17 | Angular 20 | Impact |
|---------|-----------|-----------|--------|
| **Deferred Loading** | Manual lazy modules | `@defer` blocks | -30-50% initial bundle |
| **Change Detection** | Zone.js (full tree) | Signals (targeted) | 10x faster |
| **Bundle Size** | ~250KB (min) | ~180KB (min) | -28% smaller |
| **Hydration** | Basic | Enhanced | Faster SSR |

## Code Examples

### State Management

**Angular 17:**
```typescript
export class SearchComponent {
  private searchResults$ = new BehaviorSubject<Result[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  
  results$ = this.searchResults$.asObservable();
  hasResults$ = this.results$.pipe(
    map(results => results.length > 0)
  );
  
  ngOnInit() {
    this.results$.subscribe(results => {
      // Handle results
    });
  }
}
```

**Angular 20:**
```typescript
export class SearchComponent {
  searchResults = signal<Result[]>([]);
  loading = signal<boolean>(false);
  
  hasResults = computed(() => this.searchResults().length > 0);
  
  constructor() {
    effect(() => {
      const results = this.searchResults();
      // Handle results - auto cleanup
    });
  }
}
```

### Template Syntax

**Angular 17:**
```html
<div *ngIf="loading$ | async">Loading...</div>
<div *ngIf="!(loading$ | async) && (results$ | async) as results">
  <div *ngFor="let item of results; trackBy: trackByFn">
    {{ item.name }}
  </div>
</div>
```

**Angular 20:**
```html
@if (loading()) {
  <div>Loading...</div>
} @else if (results().length > 0) {
  @for (item of results(); track item.id) {
    <div>{{ item.name }}</div>
  }
} @else {
  <div>No results</div>
}
```

### Component Inputs

**Angular 17:**
```typescript
export class CardComponent {
  @Input() data!: Data;
  @Input() size: 'sm' | 'lg' = 'sm';
  @Output() clicked = new EventEmitter<void>();
}
```

**Angular 20:**
```typescript
export class CardComponent {
  data = input.required<Data>();
  size = input<'sm' | 'lg'>('sm');
  clicked = output<void>();
}
```

## Migration Effort

| Aspect | Effort | Time Estimate |
|--------|--------|---------------|
| State to Signals | Medium | 2-3 days |
| Templates to Control Flow | Low | 1 day |
| Inputs/Outputs | Low | 1 day |
| Add @defer | Low | 1 day |
| Testing Updates | Medium | 2 days |
| **Total** | **Medium** | **~1 week** |

## Recommendation

✅ **Migrate to Angular 20** - The benefits far outweigh the migration effort:
- Better performance (10x faster change detection)
- Smaller bundles (-30% with @defer)
- Simpler code (less boilerplate)
- Better type safety
- Future-proof (Angular's direction)


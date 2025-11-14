# Angular 20 Quick Reference Guide

## Signals Cheat Sheet

### Creating Signals
```typescript
// Writable signal
const count = signal(0);
const name = signal<string>('');
const user = signal<User | null>(null);

// Read value
console.log(count());  // 0

// Update value
count.set(5);
count.update(n => n + 1);

// Computed signal (read-only, memoized)
const doubled = computed(() => count() * 2);

// Effect (side effects)
effect(() => {
  console.log('Count changed:', count());
});
```

### Signal Inputs/Outputs
```typescript
export class MyComponent {
  // Required input
  data = input.required<Data>();
  
  // Optional input with default
  size = input<'sm' | 'md' | 'lg'>('md');
  
  // Two-way binding
  value = model<string>('');
  
  // Output
  clicked = output<void>();
  valueChanged = output<string>();
  
  handleClick() {
    this.clicked.emit();
  }
}
```

## Control Flow Cheat Sheet

### @if / @else
```html
@if (condition()) {
  <div>True</div>
} @else if (otherCondition()) {
  <div>Other</div>
} @else {
  <div>False</div>
}
```

### @for
```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>No items</div>
}
```

### @switch
```html
@switch (status()) {
  @case ('loading') {
    <app-spinner />
  }
  @case ('error') {
    <app-error />
  }
  @case ('success') {
    <app-content />
  }
  @default {
    <app-empty />
  }
}
```

### @defer
```html
<!-- Defer on viewport -->
@defer (on viewport) {
  <app-heavy-component />
} @placeholder {
  <div>Placeholder</div>
} @loading (minimum 100ms) {
  <app-spinner />
} @error {
  <div>Failed to load</div>
}

<!-- Other triggers -->
@defer (on idle) { }           // When browser is idle
@defer (on immediate) { }      // Immediately
@defer (on timer(2s)) { }      // After 2 seconds
@defer (on interaction) { }    // On user interaction
@defer (on hover) { }          // On hover
```

## Dependency Injection

```typescript
export class MyComponent {
  // Inject services
  private http = inject(HttpClient);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  // Use in methods
  loadData() {
    this.http.get('/api/data')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```

## Component Template

```typescript
import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  imports: [CommonModule],  // Direct imports
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      @if (loading()) {
        <app-spinner />
      } @else {
        @for (item of items(); track item.id) {
          <div>{{ item.name }}</div>
        }
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
    }
  `]
})
export class MyComponent {
  // Inputs
  items = input.required<Item[]>();
  
  // Local state
  loading = signal(false);
  
  // Computed
  itemCount = computed(() => this.items().length);
  
  // Outputs
  itemClicked = output<Item>();
}
```

## Common Patterns

### Search with Debounce
```typescript
export class SearchComponent {
  searchQuery = signal('');
  
  constructor() {
    effect(() => {
      const query = this.searchQuery();
      
      const timeoutId = setTimeout(() => {
        this.performSearch(query);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    });
  }
}
```

### Loading State
```typescript
export class DataComponent {
  data = signal<Data | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<Data>('/api/data')
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      });
  }
}
```

## Testing

```typescript
describe('MyComponent', () => {
  it('should update signal', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    
    // Set input
    fixture.componentRef.setInput('value', 'test');
    
    // Check signal value
    expect(component.value()).toBe('test');
  });
  
  it('should compute correctly', () => {
    const component = fixture.componentInstance;
    component.count.set(5);
    
    expect(component.doubled()).toBe(10);
  });
});
```


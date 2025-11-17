# Pythia+ Talent Intelligence Dashboard - Implementation Plan

> **Created**: 2025-11-17
> **Status**: In Development
> **Sprint**: Dashboard MVP
> **Design Reference**: Swiss Bank+ Dashboard Aesthetic

---

## 🎯 Vision

Create a world-class HR dashboard that provides instant insights into the talent pool with Swiss corporate elegance and Angular 20 technical excellence.

**Design Philosophy:**
- **Swiss Precision**: Clean, minimalist, professional
- **Data-Driven**: Actionable insights at a glance
- **Interactive**: Click-to-drill-down functionality
- **Performant**: Fast loading, smooth animations, optimized bundle

---

## 🎨 Design System

### Visual Inspiration: Swiss Bank+ Dashboard

The reference dashboard exemplifies:
- **Card-based layout**: White cards with subtle elevation
- **Generous spacing**: 24px padding, clean margins
- **Professional typography**: Clear hierarchies, readable sizes
- **Color psychology**: Red for branding, blue/purple for data, green/yellow/red for status
- **Interactive charts**: Hover states, click handlers, smooth transitions

### Pythia+ Adaptations

```
Swiss Bank+ Style              →  Pythia+ Implementation
──────────────────────────────────────────────────────────
Red header with logo           →  Pythia red (#d32f2f) accent
Account overview cards         →  Talent pool summary cards
Financial insights             →  Talent insights
Spending categories (pie)      →  Availability snapshot (donut)
Ticket usage (bars)            →  Top skills/locations (bars)
```

---

## 📐 Dashboard Layout

### Desktop Layout (1440px+)

```
┌──────────────────────────────────────────────────────────────────┐
│  🏛️ Dashboard Header                                             │
│  "Talent Pool Intelligence"                                      │
│  Subtitle: "Real-time insights into your talent pipeline"       │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬────────────┐
│ 📊 Total        │ ✅ Available    │ 🔔 On Notice    │ 🌍 Cities  │
│ Profiles        │ Now             │ Period          │ Covered    │
│                 │                 │                 │            │
│    142          │     87          │      31         │    18      │
│ +12 this month  │ Ready to hire   │ 2-3 months     │ Global     │
└─────────────────┴─────────────────┴─────────────────┴────────────┘

┌──────────────────────────────┬──────────────────────────────────┐
│ 🎯 Availability Snapshot     │ 📍 Top Locations                 │
│                              │ [Cities ● Countries]              │
│   [Donut Chart]              │                                   │
│                              │ [Horizontal Bar Chart]            │
│   ● Available: 87 (61%)      │                                   │
│   ● Notice: 31 (22%)         │ Zurich          ████████ 24      │
│   ● Unavailable: 24 (17%)    │ Prague          ██████   18      │
│                              │ Berlin          ████     12      │
│   142 Total                  │ Valencia        ███      9       │
│                              │ London          ██       6       │
└──────────────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🚀 Top Skills in Talent Pool                                    │
│ [Skills ● Technologies]                                          │
│                                                                  │
│ [Horizontal Bar Chart - Full Width]                            │
│                                                                  │
│ TypeScript      ███████████████████████████████ 89             │
│ React           ████████████████████████ 67                     │
│ Node.js         ███████████████████████ 65                      │
│ PostgreSQL      ████████████████████ 58                         │
│ Angular         ██████████████████ 52                           │
│ Kubernetes      ████████████████ 48                             │
│ AWS             ███████████████ 45                              │
│ Python          ██████████████ 42                               │
│ GraphQL         ████████████ 38                                 │
│ Docker          ███████████ 35                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1439px)

- Summary cards: 2x2 grid
- Charts: Stacked vertically
- Full width for all widgets

### Mobile Layout (< 768px)

- Summary cards: Vertical stack
- Charts: Full width, reduced height
- Simplified legends (below charts)

---

## 🏗️ Component Architecture

### Component Hierarchy

```
DashboardPage (Container)
├── DashboardHeader (Presentation)
│   └── Page title + subtitle
├── DashboardSummaryCards (Presentation)
│   └── SummaryCard × 4
├── DashboardChartsGrid (Layout)
│   ├── AvailabilityDonutCard (Smart)
│   │   ├── CardHeader
│   │   └── DonutChart
│   ├── LocationsBarCard (Smart)
│   │   ├── CardHeader (with toggle)
│   │   └── HorizontalBarChart
│   └── SkillsBarCard (Smart)
│       ├── CardHeader (with toggle)
│       └── HorizontalBarChart
└── LoadingState / ErrorState
```

### Component Specifications

#### 1. DashboardPage (Container)

**Responsibility**: Data fetching, state management, routing

**Signals:**
```typescript
protected readonly facetsData = signal<FacetsResponse | null>(null);
protected readonly loading = signal(true);
protected readonly error = signal<string | null>(null);

// Computed signals
protected readonly summaryStats = computed(() => this.calculateSummary());
protected readonly availabilityData = computed(() => this.facetsData()?.facets.availability);
protected readonly skillsData = computed(() => this.facetsData()?.facets.skills);
protected readonly citiesData = computed(() => this.facetsData()?.facets.cities);
protected readonly countriesData = computed(() => this.facetsData()?.facets.countries);
```

**Lifecycle:**
```typescript
ngOnInit() {
  this.loadDashboardData();
}

private loadDashboardData() {
  this.dashboardService.getDashboardFacets()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.facetsData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
}
```

#### 2. SummaryCard (Presentation)

**Props:**
```typescript
readonly title = input.required<string>();
readonly value = input.required<number>();
readonly subtitle = input<string>('');
readonly icon = input<string>('');
readonly trend = input<'up' | 'down' | 'neutral'>('neutral');
readonly trendValue = input<string>('');
```

**Template:**
```html
<mat-card class="summary-card">
  <mat-card-content>
    <div class="summary-icon">{{ icon() }}</div>
    <div class="summary-value">{{ value() }}</div>
    <div class="summary-title">{{ title() }}</div>
    @if (subtitle()) {
      <div class="summary-subtitle">{{ subtitle() }}</div>
    }
    @if (trendValue()) {
      <div class="summary-trend" [class.trend-up]="trend() === 'up'">
        {{ trendValue() }}
      </div>
    }
  </mat-card-content>
</mat-card>
```

#### 3. DonutChart (Presentation)

**Props:**
```typescript
readonly data = input.required<ChartData>();
readonly title = input<string>('');
readonly centerText = input<string>('');
readonly clickable = input(true);
readonly chartClick = output<string>();
```

**Chart.js Configuration:**
```typescript
private readonly chartConfig = computed<ChartConfiguration<'doughnut'>>(() => ({
  type: 'doughnut',
  data: this.data(),
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%', // Donut hole size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: {
            size: 14,
            family: 'Roboto'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && this.clickable()) {
        const index = elements[0].index;
        const label = this.data().labels?.[index];
        if (label) {
          this.chartClick.emit(label.toString());
        }
      }
    }
  }
}));
```

#### 4. HorizontalBarChart (Presentation)

**Props:**
```typescript
readonly data = input.required<ChartData>();
readonly title = input<string>('');
readonly maxItems = input(10);
readonly clickable = input(true);
readonly chartClick = output<string>();
readonly colorScheme = input<'blue' | 'purple'>('blue');
```

**Chart.js Configuration:**
```typescript
private readonly chartConfig = computed<ChartConfiguration<'bar'>>(() => {
  const limitedData = this.limitData(this.data(), this.maxItems());
  const colors = this.getColorGradient(this.colorScheme());

  return {
    type: 'bar',
    data: {
      ...limitedData,
      datasets: [{
        ...limitedData.datasets[0],
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y', // Horizontal bars
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Count: ${context.parsed.x}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: { size: 12 }
          }
        },
        y: {
          ticks: {
            font: { size: 13 }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0 && this.clickable()) {
          const index = elements[0].index;
          const label = limitedData.labels?.[index];
          if (label) {
            this.chartClick.emit(label.toString());
          }
        }
      }
    }
  };
});
```

---

## 🔌 Services Architecture

### DashboardService

**Responsibility**: Fetch dashboard data, transform for charts, cache results

```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  // Signal-based cache (5-minute TTL)
  private readonly cachedData = signal<FacetsResponse | null>(null);
  private readonly cacheTimestamp = signal<number>(0);
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get dashboard facets data
   * Uses cache if available and not expired
   */
  getDashboardFacets(): Observable<FacetsResponse> {
    const now = Date.now();
    const cached = this.cachedData();
    const cacheAge = now - this.cacheTimestamp();

    // Return cached data if valid
    if (cached && cacheAge < this.CACHE_TTL) {
      return of(cached);
    }

    // Fetch fresh data
    return this.http.get<FacetsResponse>('/api/v1/search', {
      params: {
        query: '',
        topK: '100'
      }
    }).pipe(
      tap(data => {
        this.cachedData.set(data);
        this.cacheTimestamp.set(now);
      })
    );
  }

  /**
   * Transform facets for donut chart
   */
  transformForDonut(facets: Facet[], colorMap: Record<string, string>): ChartData {
    return {
      labels: facets.map(f => this.capitalizeFirst(f.value)),
      datasets: [{
        data: facets.map(f => f.count),
        backgroundColor: facets.map(f => colorMap[f.value] || '#9e9e9e'),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  /**
   * Transform facets for horizontal bar chart
   */
  transformForHorizontalBar(
    facets: Facet[],
    maxItems: number = 10
  ): ChartData {
    const limited = facets.slice(0, maxItems);

    return {
      labels: limited.map(f => this.capitalizeFirst(f.value)),
      datasets: [{
        label: 'Count',
        data: limited.map(f => f.count)
      }]
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

---

## 🎨 Color Schemes

### Availability Status Colors

```typescript
const AVAILABILITY_COLORS = {
  available: '#10b981',    // Green (success)
  notice: '#f59e0b',       // Amber (warning)
  unavailable: '#ef4444'   // Red (error)
};
```

### Chart Color Gradients

```typescript
// Blue gradient for locations
const BLUE_GRADIENT = {
  background: 'rgba(59, 130, 246, 0.8)',  // #3b82f6 with 80% opacity
  border: 'rgba(59, 130, 246, 1)'
};

// Purple gradient for skills
const PURPLE_GRADIENT = {
  background: 'rgba(139, 92, 246, 0.8)',  // #8b5cf6 with 80% opacity
  border: 'rgba(139, 92, 246, 1)'
};
```

---

## 🎭 Interactions & Navigation

### Chart Click Handlers

**Availability Donut Click:**
```typescript
onAvailabilityClick(status: string): void {
  this.router.navigate(['/search'], {
    queryParams: { availability: status.toLowerCase() }
  });
}
```

**Location Bar Click:**
```typescript
onLocationClick(location: string): void {
  const viewMode = this.locationViewMode(); // 'cities' or 'countries'
  const paramKey = viewMode === 'cities' ? 'city' : 'country';

  this.router.navigate(['/search'], {
    queryParams: { [paramKey]: location }
  });
}
```

**Skill Bar Click:**
```typescript
onSkillClick(skill: string): void {
  const viewMode = this.skillViewMode(); // 'skills' or 'technologies'

  this.router.navigate(['/search'], {
    queryParams: { [viewMode]: skill }
  });
}
```

### Toggle Switches

```html
<!-- Location toggle -->
<mat-button-toggle-group
  [value]="locationViewMode()"
  (change)="locationViewMode.set($event.value)"
>
  <mat-button-toggle value="cities">Cities</mat-button-toggle>
  <mat-button-toggle value="countries">Countries</mat-button-toggle>
</mat-button-toggle-group>

<!-- Skills toggle -->
<mat-button-toggle-group
  [value]="skillViewMode()"
  (change)="skillViewMode.set($event.value)"
>
  <mat-button-toggle value="skills">Skills</mat-button-toggle>
  <mat-button-toggle value="technologies">Technologies</mat-button-toggle>
</mat-button-toggle-group>
```

---

## 🎬 Animations & Transitions

### Card Entry Animations

```scss
.dashboard-card {
  animation: fadeInUp 400ms ease-out;

  @for $i from 1 through 4 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 100}ms;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Chart Animations

```typescript
// Chart.js animation config
animation: {
  duration: 750,
  easing: 'easeInOutQuart',
  onComplete: () => {
    // Animation complete callback
  }
}
```

### Skeleton Loaders

```html
@if (loading()) {
  <div class="skeleton-grid">
    <app-skeleton-card />
    <app-skeleton-card />
    <app-skeleton-card />
    <app-skeleton-card />
  </div>
} @else {
  <app-dashboard-summary-cards [data]="summaryStats()" />
}
```

---

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1440px;

.dashboard-grid {
  display: grid;
  gap: var(--spacing-lg);

  // Mobile: Single column
  grid-template-columns: 1fr;

  // Tablet: 2 columns
  @media (min-width: $breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop: Auto layout based on content
  @media (min-width: $breakpoint-desktop) {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  }
}

// Summary cards grid
.summary-cards {
  display: grid;
  gap: var(--spacing-md);

  // Mobile: 1 column
  grid-template-columns: 1fr;

  // Tablet: 2x2 grid
  @media (min-width: $breakpoint-mobile) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop: 4 columns
  @media (min-width: $breakpoint-desktop) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## ♿ Accessibility

### WCAG AA Compliance

**Color Contrast:**
- Text on white background: #212121 (15:1 contrast)
- Secondary text: #757575 (4.5:1 contrast)
- Chart colors: All meet 4.5:1 minimum

**Keyboard Navigation:**
```html
<mat-card
  tabindex="0"
  role="button"
  [attr.aria-label]="'View ' + title() + ' details'"
  (click)="handleClick()"
  (keydown.enter)="handleClick()"
  (keydown.space)="handleClick()"
>
```

**Screen Reader Support:**
```html
<div role="region" aria-label="Talent pool dashboard">
  <h1 id="dashboard-title">Talent Pool Intelligence</h1>

  <div role="list" aria-labelledby="summary-heading">
    <h2 id="summary-heading" class="sr-only">Summary Statistics</h2>
    <!-- Summary cards -->
  </div>

  <div role="region" aria-label="Availability distribution chart">
    <canvas
      role="img"
      [attr.aria-label]="getChartAriaLabel()"
    ></canvas>
  </div>
</div>
```

---

## 🚀 Performance Optimization

### Bundle Size Targets

- **Dashboard Module**: < 50kb (gzipped)
- **Chart.js**: ~ 60kb (already in bundle)
- **Total Dashboard Impact**: < 110kb

### Lazy Loading

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-page.component')
      .then(m => m.DashboardPage)
  }
];
```

### Image Optimization

- Use SVG for icons (scalable, small)
- No raster images in dashboard
- Icon fonts from Material Icons

### Caching Strategy

- **Facets data**: 5-minute client-side cache
- **HTTP Cache**: Use If-None-Match headers
- **Service Worker**: Cache dashboard assets (future)

---

## 🧪 Testing Strategy

### Unit Tests (53 tests planned)

**Service Tests (12):**
- ✅ DashboardService.getDashboardFacets() fetches data
- ✅ DashboardService.getDashboardFacets() uses cache when valid
- ✅ DashboardService.getDashboardFacets() refreshes when cache expired
- ✅ DashboardService.transformForDonut() creates correct structure
- ✅ DashboardService.transformForHorizontalBar() limits items
- ✅ Error handling for network failures
- ... 6 more

**Component Tests (41):**

*DashboardPage (10):*
- ✅ Loads facets data on init
- ✅ Displays loading state while fetching
- ✅ Displays error state on failure
- ✅ Computes summary stats correctly
- ✅ Navigates on chart click
- ... 5 more

*SummaryCard (6):*
- ✅ Displays title and value
- ✅ Shows optional subtitle
- ✅ Renders trend indicator
- ✅ Applies correct trend class
- ... 2 more

*DonutChart (12):*
- ✅ Renders chart with data
- ✅ Shows center text
- ✅ Emits click event with label
- ✅ Displays legend below chart
- ✅ Calculates percentages correctly
- ... 7 more

*HorizontalBarChart (13):*
- ✅ Renders horizontal bars
- ✅ Limits to maxItems
- ✅ Applies color scheme
- ✅ Shows counts at bar end
- ✅ Emits click event
- ... 8 more

### Integration Tests (5)

- ✅ Full dashboard load flow
- ✅ Chart click navigates to search
- ✅ Toggle switches update charts
- ✅ Responsive layout on mobile
- ✅ Accessibility with screen reader

### E2E Tests (3)

- ✅ Dashboard loads and displays data
- ✅ Click availability donut → search page with filter
- ✅ Toggle cities/countries → chart updates

---

## 📋 Implementation Checklist

### Phase 1: Foundation (Hours 1-3)

- [ ] Create dashboard route and navigation
- [ ] Set up DashboardService with signal-based state
- [ ] Create TypeScript interfaces for facets data
- [ ] Implement data fetching and caching
- [ ] Write service tests

### Phase 2: Core Components (Hours 4-8)

- [ ] Create DashboardPage container
- [ ] Implement SummaryCard component
- [ ] Create DonutChart component with Chart.js
- [ ] Create HorizontalBarChart component
- [ ] Wire up data flow from service to components
- [ ] Write component tests

### Phase 3: Interactivity (Hours 9-12)

- [ ] Add chart click handlers
- [ ] Implement navigation to search page
- [ ] Create toggle switches for views
- [ ] Add hover states and tooltips
- [ ] Test all interactions

### Phase 4: Styling (Hours 13-16)

- [ ] Apply Pythia theme to cards
- [ ] Style charts with brand colors
- [ ] Add card shadows and borders
- [ ] Implement responsive grid layout
- [ ] Add animations and transitions

### Phase 5: Polish (Hours 17-20)

- [ ] Create skeleton loaders
- [ ] Implement error states
- [ ] Add empty state handling
- [ ] Test accessibility (AXE, keyboard)
- [ ] Mobile/tablet responsive testing
- [ ] Performance audit
- [ ] Final QA and bug fixes

---

## 🎯 Success Metrics

### Functional Requirements
- ✅ Displays 3 interactive widgets (availability, locations, skills)
- ✅ Fetches data from existing backend API
- ✅ Click on chart navigates to search with filter
- ✅ Toggle switches work correctly
- ✅ Shows loading and error states

### Performance Requirements
- ✅ Dashboard loads in < 2 seconds
- ✅ Bundle size < 110kb (gzipped)
- ✅ Lighthouse score 90+
- ✅ First Contentful Paint < 1.5s

### Quality Requirements
- ✅ 80%+ test coverage
- ✅ WCAG AA compliant
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Responsive on mobile/tablet/desktop
- ✅ No console errors or warnings

### Design Requirements
- ✅ Matches Swiss Bank+ aesthetic quality
- ✅ Uses Pythia theme colors consistently
- ✅ Professional typography and spacing
- ✅ Smooth animations and transitions
- ✅ Clean, minimalist, elegant

---

## 🔄 Future Enhancements (Phase 2)

**Advanced Analytics:**
- Experience distribution histogram
- Growth trend line chart (requires new API)
- Department/Seniority breakdown
- Certification distribution

**Advanced Features:**
- Export to PDF/Excel
- Date range filters
- Custom chart configuration
- Real-time updates (WebSocket)
- Dashboard customization (drag-and-drop widgets)

**Integration:**
- Email reports (scheduled)
- Slack notifications for insights
- Integration with ATS systems

---

## 📚 References

**Design:**
- Swiss Bank+ Dashboard (reference screenshot)
- [Material Design Data Visualization](https://m3.material.io/foundations/data-visualization)
- [Pythia Theme Specification](../src/styles/themes/_pythia-theme.scss)

**Technical:**
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular 20 AI Development Guide](https://angular.dev/ai/develop-with-ai)

**Accessibility:**
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Chart Accessibility Best Practices](https://www.w3.org/WAI/tutorials/images/complex/)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-17
**Author**: Claude (AI Assistant)
**Status**: Ready for Implementation 🚀

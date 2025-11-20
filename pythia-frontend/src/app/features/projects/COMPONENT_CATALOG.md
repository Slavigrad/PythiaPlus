# 🧩 Projects Feature - Component Catalog

**Quick Reference Guide for All Project Components**

---

## 📋 Component Index

| Component | Status | LOC | Purpose |
|-----------|--------|-----|---------|
| [ProjectCard](#projectcard) | ✅ Complete | 1,170 | Rich project display card |
| [AdvancedFilters](#advancedfilters) | ✅ Complete | 1,130 | 9-type filtering system |
| [ProjectSearch](#projectsearch) | ✅ Complete | 436 | Debounced search input |
| [ProjectDetailPanel](#projectdetailpanel) | ⏳ Pending | - | Sliding detail drawer |
| [ProjectControls](#projectcontrols) | ⏳ Pending | - | Sort & pagination |
| [ProjectsPage](#projectspage) | ✅ Complete | - | Main orchestrator |

---

## ProjectCard

### Overview
Premium project card component with rich visual features and interactive elements.

### Import
```typescript
import { ProjectCardComponent } from './components/project-card/project-card.component';
```

### Signature
```typescript
@Component({ selector: 'app-project-card' })
export class ProjectCardComponent {
  // Inputs
  readonly project = input.required<Project>();
  readonly variant = input<'compact' | 'detailed' | 'mini'>('compact');
  readonly showActions = input(true);

  // Outputs
  readonly cardClick = output<Project>();
  readonly edit = output<Project>();
  readonly delete = output<Project>();
  readonly viewDetails = output<Project>();
}
```

### Usage

**Basic:**
```html
<app-project-card [project]="project" />
```

**Full:**
```html
<app-project-card
  [project]="project"
  variant="compact"
  [showActions]="true"
  (cardClick)="handleClick($event)"
  (viewDetails)="handleView($event)"
  (edit)="handleEdit($event)"
  (delete)="handleDelete($event)" />
```

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `project` | `Project` | *required* | Project data to display |
| `variant` | `'compact' \| 'detailed' \| 'mini'` | `'compact'` | Display variant |
| `showActions` | `boolean` | `true` | Show quick action buttons |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `cardClick` | `Project` | Emitted when card is clicked |
| `viewDetails` | `Project` | Emitted when view details button clicked |
| `edit` | `Project` | Emitted when edit button clicked |
| `delete` | `Project` | Emitted when delete button clicked |

### Features

- ✅ Complexity-based project icons with color coding
- ✅ Team member avatars (up to 4 + overflow)
- ✅ Technology badges with category colors
- ✅ Priority indicators (pulse animation on CRITICAL)
- ✅ Status badges with contextual colors
- ✅ Progress bars with gradient and shimmer
- ✅ Next milestone with urgency styling
- ✅ Success and satisfaction ratings
- ✅ Quick action buttons
- ✅ Hover effects and animations
- ✅ Fully accessible (WCAG AA)
- ✅ Responsive design

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│ 🎯 Icon  Project Name          [STATUS] │
│          PROJECT-CODE          [⚡ HIGH] │
├─────────────────────────────────────────┤
│ 🏢 Company     📊 Industry              │
│                                          │
│ Description text goes here...            │
│                                          │
│ 👥 12 members  📅 16 months              │
│                                          │
│ 👤 👤 👤 +9  (team avatars)             │
│                                          │
│ [React] [Node.js] [PostgreSQL] +2       │
│                                          │
│ 📅 Next: Payment Gateway (25 days)      │
│                                          │
│ ⭐ 4.8  😊 4.9                          │
├─────────────────────────────────────────┤
│ Progress: 75%                            │
│ ████████████████░░░░░░                  │
│ 6/8 milestones                           │
│                         [👁] [✏️] [🔗]  │
└─────────────────────────────────────────┘
```

### Styling

Uses Pythia theme variables. Key classes:
- `.project-card` - Main container
- `.project-icon[data-complexity]` - Complexity-based icon
- `.status-badge` - Status indicator
- `.priority-badge` - Priority indicator
- `.tech-badge[data-category]` - Technology badge
- `.progress-fill` - Animated progress bar

### Accessibility

- Semantic HTML structure
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators (2px solid outline)
- Color contrast WCAG AA compliant
- Screen reader support

---

## AdvancedFilters

### Overview
Comprehensive filtering panel with 9 filter types and collapsible interface.

### Import
```typescript
import { AdvancedFiltersComponent } from './components/advanced-filters/advanced-filters.component';
```

### Signature
```typescript
@Component({ selector: 'app-advanced-filters' })
export class AdvancedFiltersComponent {
  // Outputs
  readonly filtersChange = output<ProjectQueryParams>();

  // Public computed
  protected readonly activeFilterCount = computed(() => number);
  protected readonly hasFilters = computed(() => boolean);
}
```

### Usage

```html
<app-advanced-filters (filtersChange)="handleFiltersChange($event)" />
```

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `filtersChange` | `ProjectQueryParams` | Emitted when any filter changes |

### Filter Types (9 Total)

1. **Status** - Multi-select chips (ACTIVE, COMPLETED, etc.)
2. **Industry** - Multi-select chips (dynamic from analytics)
3. **Technology** - Multi-select chips (dynamic from analytics)
4. **Company** - Text input
5. **Date Range** - From/To date pickers
6. **Complexity** - Multi-select chips (SIMPLE → ENTERPRISE)
7. **Priority** - Multi-select chips (LOW → CRITICAL)
8. **Open Positions** - Toggle switch (3-state)
9. **Clear All** - Action button

### Filter Object

```typescript
interface ProjectQueryParams {
  status?: ProjectStatus[];
  industry?: string[];
  technology?: string[];
  company?: string;
  startDateFrom?: string;
  startDateTo?: string;
  complexity?: ProjectComplexity[];
  priority?: ProjectPriority[];
  hasOpenPositions?: boolean;
  page?: number;  // Reset to 1 on filter change
}
```

### Features

- ✅ Collapsible panel with smooth animation
- ✅ Active filter count badge
- ✅ Real-time filter application
- ✅ Clear all filters button
- ✅ Chip-based multi-select
- ✅ iOS-style toggle switch
- ✅ Color-coded chips by type
- ✅ CRITICAL priority pulse animation
- ✅ Fully accessible

### Visual Layout

```
┌─────────────────────────────────────────┐
│ 🎛️ Advanced Filters [3]   [Clear All]  │
│ ▼                                        │
├─────────────────────────────────────────┤
│ Status                                   │
│ [ACTIVE✓] [COMPLETED] [PLANNING]        │
│                                          │
│ Industry                                 │
│ [FinTech✓] [E-Commerce] [Healthcare]    │
│                                          │
│ Technology                               │
│ [TypeScript✓] [React✓] [Node.js]        │
│                                          │
│ Company                                  │
│ [Search by company...             ]     │
│                                          │
│ Start Date Range                         │
│ From: [2024-01-01]  To: [2024-12-31]    │
│                                          │
│ Complexity                               │
│ [SIMPLE] [MODERATE] [COMPLEX✓] [ENTERPRISE] │
│                                          │
│ Priority                                 │
│ [LOW] [MEDIUM] [HIGH] [CRITICAL⚡]      │
│                                          │
│ ○──────● Projects with open positions   │
└─────────────────────────────────────────┘
```

### Chip Colors

**Status:**
- ACTIVE: Pythia Red (#DC2626)
- COMPLETED: Green (#059669)
- PLANNING: Indigo (#4F46E5)
- ON_HOLD: Blue (#2563EB)
- CANCELLED: Gray (#4B5563)

**Complexity:**
- SIMPLE: Green (#059669)
- MODERATE: Orange (#D97706)
- COMPLEX: Red (#DC2626)
- ENTERPRISE: Gradient Red

**Priority:**
- LOW: Gray (#6B7280)
- MEDIUM: Orange (#D97706)
- HIGH: Red (#DC2626)
- CRITICAL: Gradient Red + Pulse

### Methods

```typescript
// Toggle filters
toggleStatus(status: ProjectStatus): void
toggleIndustry(industry: string): void
toggleTechnology(tech: string): void
toggleComplexity(complexity: ProjectComplexity): void
togglePriority(priority: ProjectPriority): void
toggleOpenPositions(): void

// Check selection
isStatusSelected(status: ProjectStatus): boolean
// ... similar for other types

// Clear all
clearAllFilters(): void
```

---

## ProjectSearch

### Overview
Debounced search input for filtering projects by text query.

### Import
```typescript
import { ProjectSearchComponent } from './components/project-search/project-search.component';
```

### Signature
```typescript
@Component({ selector: 'app-project-search' })
export class ProjectSearchComponent {
  protected readonly searchQuery = signal('');
  protected readonly isSearching = signal(false);
}
```

### Usage

```html
<app-project-search />
```

**No inputs or outputs** - Component manages its own state and communicates directly with ProjectsService.

### Features

- ✅ 500ms debounce delay
- ✅ Search across names, descriptions, companies
- ✅ Loading spinner during search
- ✅ Clear button (X) when query exists
- ✅ Keyboard shortcut (Escape to clear)
- ✅ Focus ring with Pythia red
- ✅ Smooth animations
- ✅ Fully accessible

### Visual States

**Empty:**
```
┌─────────────────────────────────────────┐
│ 🔍  Search projects...                  │
└─────────────────────────────────────────┘
```

**Typing (Loading):**
```
┌─────────────────────────────────────────┐
│ ⚙️  React projects...              [⊗] │
└─────────────────────────────────────────┘
```

**With Results:**
```
┌─────────────────────────────────────────┐
│ 🔍  React projects...              [⊗] │
└─────────────────────────────────────────┘
```

### Animations

1. **Loading Spinner** - Rotating with dash animation
2. **Clear Button** - Scale and fade-in
3. **Focus Ring** - Border color transition

### Keyboard Shortcuts

- **Escape** - Clear search and blur input
- **Tab** - Standard navigation

### Accessibility

- `aria-label="Search projects"`
- `aria-describedby="search-help"`
- `aria-busy` during loading
- Screen reader help text
- Semantic `<input type="search">`

### Debounce Logic

```typescript
constructor() {
  effect(() => {
    const query = this.searchQuery();

    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Empty query: search immediately
    if (query.length === 0) {
      this.performSearch(query);
      return;
    }

    // Set loading and debounce
    this.isSearching.set(true);
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
      this.isSearching.set(false);
    }, 500);
  });
}
```

---

## ProjectDetailPanel

### Overview
*(Coming Soon)* Sliding drawer showing full project details.

### Planned Features

- Slides in from right (800px wide)
- Full team composition
- Milestone timeline
- Technology stack breakdown
- Analytics cards
- External links
- Edit/delete actions
- Backdrop overlay

---

## ProjectControls

### Overview
*(Coming Soon)* Sorting and pagination controls for project list.

### Planned Features

**Sorting:**
- Sort dropdown (startDate, endDate, name, etc.)
- Asc/desc toggle
- Visual current sort indicator

**Pagination:**
- Page size selector (10/20/50/100)
- Page navigation buttons
- "Showing X-Y of Z" display

---

## ProjectsPage

### Overview
Main orchestrator component for the Projects feature.

### Import
```typescript
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
```

### Signature
```typescript
@Component({ selector: 'app-projects-page' })
export class ProjectsPageComponent implements OnInit {
  protected readonly projectsService = inject(ProjectsService);
  protected readonly viewMode = signal<'constellation' | 'command' | 'analytics'>('command');

  ngOnInit(): void
  protected loadProjects(): void
  protected switchViewMode(mode): void
  protected handleProjectClick(project: Project): void
  protected handleViewDetails(project: Project): void
  protected handleEditProject(project: Project): void
  protected handleDeleteProject(project: Project): void
  protected handleFiltersChange(filters: ProjectQueryParams): void
}
```

### Component Integration

```html
<!-- Command Center View -->
<div class="command-center-view">
  <!-- Summary -->
  <div class="projects-summary">...</div>

  <!-- Search -->
  <app-project-search />

  <!-- Filters -->
  <app-advanced-filters (filtersChange)="handleFiltersChange($event)" />

  <!-- Project Grid -->
  <div class="projects-grid">
    @for (project of projectsService.projects(); track project.id) {
      <app-project-card
        [project]="project"
        (cardClick)="handleProjectClick($event)"
        (viewDetails)="handleViewDetails($event)"
        (edit)="handleEditProject($event)"
        (delete)="handleDeleteProject($event)" />
    }
  </div>
</div>
```

---

## Common Patterns

### Signal Inputs (Angular 20)

```typescript
// Required input
readonly project = input.required<Project>();

// Optional with default
readonly variant = input<string>('compact');

// Access in template
{{ project().name }}

// Access in code
this.project().status
```

### Signal Outputs (Angular 20)

```typescript
// Define output
readonly cardClick = output<Project>();

// Emit event
this.cardClick.emit(project);

// Listen in template
(cardClick)="handleClick($event)"
```

### Computed Signals

```typescript
// Define computed
protected readonly statusClass = computed(() => {
  return `status-${this.project().status.toLowerCase()}`;
});

// Use in template
[class]="statusClass()"
```

### OnPush Change Detection

All components use `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

Benefits:
- ⚡ Better performance
- 🎯 Predictable updates
- 🔄 Works seamlessly with signals

---

## Styling Guidelines

### Use Pythia Theme Variables

```scss
// Colors
color: var(--color-primary-500);
background: var(--color-neutral-50);

// Spacing
padding: var(--spacing-md);
gap: var(--spacing-lg);

// Radius
border-radius: var(--radius-lg);

// Shadows
box-shadow: var(--shadow-md);
```

### Host Binding

```typescript
@Component({
  host: {
    '[class.variant-compact]': 'variant() === "compact"',
    '[attr.data-status]': 'project().status'
  }
})
```

### Animation Patterns

```scss
// Smooth transitions
transition: all 0.3s ease;

// Hover elevate
&:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

// Pulse animation
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

---

## Accessibility Checklist

For all components:

- [ ] Semantic HTML elements
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (Tab, Enter, Space, Escape)
- [ ] Focus indicators (2px solid, visible)
- [ ] Color contrast ratios (WCAG AA: 4.5:1)
- [ ] Screen reader support
- [ ] Role attributes where needed
- [ ] aria-label for icons
- [ ] aria-describedby for help text
- [ ] aria-busy for loading states

---

## Testing Patterns

### Component Testing

```typescript
describe('ProjectCard', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
  });

  it('should display project name', () => {
    expect(fixture.nativeElement.textContent)
      .toContain('E-Commerce Platform');
  });

  it('should emit cardClick on click', () => {
    let emittedProject: Project | undefined;
    component.cardClick.subscribe(p => emittedProject = p);

    fixture.nativeElement.querySelector('.project-card').click();

    expect(emittedProject).toBeDefined();
  });
});
```

---

**Last Updated**: 2025-11-20
**Components**: 3 Complete, 3 Pending
**Total LOC**: 2,736+

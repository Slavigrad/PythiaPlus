# Employee Profile - Swiss UX/UI Design Specification

> **Last Updated**: 2025-11-15
> **Designer**: Swiss Cutting-Edge UX/UI Standards
> **Status**: Ready for Implementation
> **Component**: `EmployeeProfileComponent`

---

## 🎯 Design Philosophy

### Swiss Design Principles Applied
1. **Clarity over Decoration**: Every element serves a purpose
2. **Grid-Based Layout**: Precise alignment and spacing
3. **High Information Density**: Efficient use of space without clutter
4. **Functional Typography**: Clear hierarchy, excellent readability
5. **Purposeful Color**: Color communicates meaning, not just aesthetics
6. **Precision Engineering**: Pixel-perfect implementation

### User Experience Goals
- **Scannable**: Find key information in < 3 seconds
- **Trustworthy**: Professional, credible presentation
- **Actionable**: Clear next steps (export, contact, compare)
- **Comprehensive**: All relevant data without overwhelming
- **Accessible**: WCAG AA compliant, keyboard navigable

---

## 📐 Layout Architecture

### Grid System
```
┌─────────────────────────────────────────────────────────────────────┐
│                        HEADER SECTION                               │
│  [Avatar] Name, Title, Status          [Contact Info]    [Actions]  │
│           Summary                                                    │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                        QUICK STATS BAR                              │
│  📍 Location  •  💼 10.5y Experience  •  🏢 Engineering  •  ⭐ Senior│
└─────────────────────────────────────────────────────────────────────┘
┌────────────────────────────┬────────────────────────────────────────┐
│   LEFT COLUMN (40%)        │   RIGHT COLUMN (60%)                   │
│                            │                                        │
│   📋 PROJECT HISTORY       │   💻 TECHNOLOGIES                      │
│   (Visual Timeline)        │   (Visual Proficiency Bars)            │
│                            │                                        │
│   🎓 EDUCATION             │   🛠️ SKILLS                            │
│   (Degree Cards)           │   (Categorized Badges)                 │
│                            │                                        │
│   🌐 LANGUAGES             │   📜 CERTIFICATIONS                    │
│   (Proficiency Indicators) │   (Status Cards with Expiry)           │
│                            │                                        │
└────────────────────────────┴────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (1200px+)**: 2-column layout (40/60 split)
- **Tablet (768px-1199px)**: 2-column layout (50/50 split)
- **Mobile (<768px)**: Single column, stacked sections

---

## 🎨 Visual Design Improvements

### 1. **Header Section** - Hero Area
**Current Issues**:
- Too sparse, wastes vertical space
- Contact info not visually distinct
- Actions (Export CV) feel disconnected

**Swiss UX Solution**:
```
┌──────────────────────────────────────────────────────────────┐
│  [DP]  Daniel Park                               [Export CV] │
│        Full Stack Engineer                                   │
│        [🟢 Available]                                        │
│                                                               │
│  📧 daniel.park@company.com    📞 +49 30 12345678            │
│                                                               │
│  Experienced full-stack engineer with expertise in React,    │
│  TypeScript, and Node.js. Passionate about building          │
│  scalable web applications and mentoring junior developers.  │
│  Strong background in modern JavaScript frameworks and       │
│  cloud technologies.                                          │
└──────────────────────────────────────────────────────────────┘
```

**Visual Enhancements**:
- ✅ **Larger avatar** (120px) with subtle shadow and border
- ✅ **Status badge** with color coding (green=available, yellow=notice period, red=busy)
- ✅ **Contact info grid** (email & phone only) - location/department shown in stats bar to avoid duplication
- ✅ **Action buttons** grouped in top-right (Export CV)
- ✅ **Summary** with readable line-length (max 80ch)
- ✅ **Background**: Subtle gradient or pattern for depth

---

### 2. **Quick Stats Bar** - At-a-Glance Metrics
**NEW ADDITION** (Not in original design):
```
┌──────────────────────────────────────────────────────────────┐
│  📍 Berlin, Germany  •  💼 10.5 years  •  🏢 Engineering     │
│  ⭐ Senior Level  •  🎯 8 Technologies  •  🌐 3 Languages    │
└──────────────────────────────────────────────────────────────┘
```

**Purpose**:
- Surface key metrics without scrolling
- Quick comparison between candidates
- Visual rhythm break between sections

---

### 3. **Technologies Section** - Visual Proficiency System

**Current Issues**:
- Just badges with "7y" text
- No visual representation of proficiency
- Hard to compare skill levels quickly

**Swiss UX Solution**:
```
Technologies                                           [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│  Kotlin                                    8.5y    ████████░░ │
│  Spring Boot                              10.0y    ██████████ │
│  PostgreSQL                                9.0y    █████████░ │
│  Docker                                    7.5y    ███████░░░ │
│  Kubernetes                                5.0y    █████░░░░░ │
│  AWS                                       6.0y    ██████░░░░ │
│  Angular                                   3.0y    ███░░░░░░░ │
└──────────────────────────────────────────────────────────────┘

Legend: ░░░░░░░░░░ (10y = 100% bar)
Color coding by category:
• Backend (Purple): Kotlin, Spring Boot
• Database (Orange): PostgreSQL
• DevOps (Teal): Docker, Kubernetes
• Cloud (Blue): AWS
• Frontend (Red): Angular
```

**Visual Enhancements**:
- ✅ **Horizontal bar charts** showing years of experience (max 10y = 100%)
- ✅ **Category color coding** (backend=purple, frontend=red, devops=teal)
- ✅ **Proficiency badges** (Beginner/Intermediate/Advanced/Expert)
- ✅ **Sortable** (by proficiency, years, name)
- ✅ **Visual legend** explaining bar scale

---

### 4. **Skills Section** - Categorized & Prioritized

**Current Issues**:
- Flat list of green badges
- No categories or hierarchy
- Hard to understand skill relationships

**Swiss UX Solution**:
```
Skills                                                 [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│  Technical Skills                                             │
│  [API Design]advanced [Microservices]advanced                │
│  [Database Design]advanced [Performance Tuning]intermediate  │
│                                                               │
│  Soft Skills                                                  │
│  [Team Leadership]advanced [Mentoring]expert                 │
│  [Agile/Scrum]advanced [Code Review]advanced                 │
│                                                               │
│  Methodologies                                                │
│  [TDD]advanced [CI/CD]advanced [Design Patterns]expert       │
└──────────────────────────────────────────────────────────────┘
```

**Visual Enhancements**:
- ✅ **Category grouping** (Technical, Soft Skills, Methodologies)
- ✅ **Proficiency labels** on badges (beginner/intermediate/advanced/expert)
- ✅ **Color intensity** matching proficiency level (lighter → darker)
- ✅ **Badge size** reflects proficiency (expert = larger)

---

### 5. **Project History** - Visual Timeline

**Current Issues**:
- Simple list, dates not prominent
- No visual timeline representation
- Hard to see career progression

**Swiss UX Solution**:
```
Project History                                        [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ● ─────────────────────────────────────────────── Present   │
│  │  Lead Full Stack Developer                     Jan 2024   │
│  │  AI Innovations Corp.                                     │
│  │  E-Commerce Platform                                      │
│  │  [React] [Node.js] [AWS]                                  │
│  │                                                            │
│  │  3 years, 10 months                                       │
│  ● ───────────────────────────────────────────────── 2020    │
│  │  Senior Java Developer                         Mar 2020   │
│  │  Tech Solutions AG                                        │
│  │  Banking Platform Modernization                           │
│  │  [Java] [Spring] [PostgreSQL]                             │
│  │                                                            │
│  │  4 years, 2 months                                        │
│  ● ───────────────────────────────────────────────── 2016    │
│     Junior Developer                              Jun 2016   │
│     StartupCo                                                 │
│     Mobile App Development                                   │
│     [Android] [Kotlin]                                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Visual Enhancements**:
- ✅ **Vertical timeline** with connecting line
- ✅ **Duration calculation** (automatic from dates)
- ✅ **Current position** highlighted differently
- ✅ **Technology tags** for each role
- ✅ **Company names** prominent
- ✅ **Year markers** on the right for quick scanning

---

### 6. **Certifications** - Status & Expiry Indicators

**Current Issues**:
- Simple bullet list
- No expiry information visible
- No status indicators (active/expired)

**Swiss UX Solution**:
```
Certifications                                         [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✓ AWS Certified Developer – Associate      [🟢 ACTIVE] │  │
│  │   Issued: Mar 2022  •  Expires: Mar 2025               │  │
│  │   Valid for 4 more months                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✓ Oracle Java SE 17 Developer (OCP)      [🟢 NO EXPIRY] │  │
│  │   Issued: Feb 2023  •  Lifetime certification           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ⚠ Spring Professional Certification     [🟡 EXPIRING]  │  │
│  │   Issued: Jan 2020  •  Expires: Jan 2024               │  │
│  │   Renewal recommended                                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

Color coding:
🟢 ACTIVE (>6 months until expiry)
🟡 EXPIRING (0-6 months until expiry)
🔴 EXPIRED (past expiry date)
⚪ NO EXPIRY (lifetime certification)
```

**Visual Enhancements**:
- ✅ **Status badges** with color coding (green/yellow/red)
- ✅ **Expiry countdown** ("4 months remaining")
- ✅ **Visual cards** instead of bullets
- ✅ **Warning states** for expiring certifications
- ✅ **Icons** for certification type (cloud, developer, etc.)

---

### 7. **Languages** - Proficiency Visualization

**Current Issues**:
- Just badges with level codes (C2, C1)
- No visual representation of proficiency

**Swiss UX Solution**:
```
Languages                                              [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│  English                                  C2   ████████████ │
│  Native proficiency                            Fluent        │
│                                                               │
│  German                                   C1   ██████████░░ │
│  Professional working proficiency              Advanced      │
│                                                               │
│  Korean                                   B2   ████████░░░░ │
│  Limited working proficiency                   Intermediate  │
└──────────────────────────────────────────────────────────────┘

CEFR Scale: A1 A2 | B1 B2 | C1 C2
            ────────────────────────>
            Beginner  Intermediate  Advanced  Native
```

**Visual Enhancements**:
- ✅ **Proficiency bars** (CEFR scale visualization)
- ✅ **Descriptive labels** (Native, Fluent, Advanced, Intermediate, Basic)
- ✅ **CEFR level badges** (A1, A2, B1, B2, C1, C2, Native)
- ✅ **Visual scale legend**

---

### 8. **Education** - Degree Cards

**Swiss UX Solution**:
```
Education                                              [Edit ✏️]
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐  │
│  │  🎓 MSc Computer Science                              │  │
│  │     Comenius University, Bratislava                    │  │
│  │     2012 - 2017  •  5 years                            │  │
│  │                                                         │  │
│  │     Specialization: Machine Learning & AI              │  │
│  │     Thesis: "Neural Networks for NLP"                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  🎓 BSc Information Technology                         │  │
│  │     Technical University of Vienna                      │  │
│  │     2008 - 2012  •  4 years                            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Visual Enhancements**:
- ✅ **Card-based layout** for each degree
- ✅ **Degree type icons** (🎓 for all, could be customized)
- ✅ **Duration calculation** (automatic)
- ✅ **Optional details** (specialization, thesis, honors)

---

## 🎨 Color System & Visual Language

### Pythia+ Theme Colors

```scss
// Primary (Pythia Red)
--color-primary-500: #DC3545      // Main red
--color-primary-600: #C82333      // Darker red for hover

// Status Colors
--color-success-500: #28A745      // Green (Available, Active)
--color-warning-500: #FFC107      // Yellow (Expiring, Notice Period)
--color-danger-500: #DC3545       // Red (Expired, Unavailable)
--color-info-500: #17A2B8         // Blue (Information)

// Technology Category Colors
--color-purple-500: #6F42C1       // Backend
--color-orange-500: #FD7E14       // Database
--color-teal-500: #20C997         // DevOps/Cloud
--color-cyan-500: #17A2B8         // Frontend (secondary)

// Neutral Grays
--color-neutral-50: #F8F9FA       // Lightest background
--color-neutral-100: #E9ECEF      // Card background
--color-neutral-200: #DEE2E6      // Borders
--color-neutral-300: #CED4DA      // Disabled elements
--color-neutral-500: #6C757D      // Secondary text
--color-neutral-700: #495057      // Body text
--color-neutral-900: #212529      // Headings
```

### Category Color Mapping

```typescript
// Technology Categories
const TECH_CATEGORIES = {
  backend: { color: 'purple', label: 'Backend', icon: '🔧' },
  frontend: { color: 'red', label: 'Frontend', icon: '🎨' },
  database: { color: 'orange', label: 'Database', icon: '🗄️' },
  cloud: { color: 'teal', label: 'Cloud', icon: '☁️' },
  devops: { color: 'cyan', label: 'DevOps', icon: '⚙️' },
  mobile: { color: 'indigo', label: 'Mobile', icon: '📱' },
  language: { color: 'neutral', label: 'Language', icon: '💬' }
};

// Proficiency Levels
const PROFICIENCY = {
  expert: { color: 'success', intensity: 100, label: 'Expert' },
  advanced: { color: 'info', intensity: 80, label: 'Advanced' },
  intermediate: { color: 'warning', intensity: 60, label: 'Intermediate' },
  beginner: { color: 'neutral', intensity: 40, label: 'Beginner' }
};

// Availability Status
const AVAILABILITY = {
  available: { color: 'success', icon: '🟢', label: 'Available' },
  notice_period: { color: 'warning', icon: '🟡', label: 'Notice Period' },
  busy: { color: 'neutral', icon: '⚪', label: 'Busy' },
  unavailable: { color: 'danger', icon: '🔴', label: 'Unavailable' }
};
```

---

## 🎭 Micro-Interactions & Animations

### Hover States
```scss
// Card hover
.profile-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

// Button hover
.action-button {
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: var(--color-primary-600);
    transform: scale(1.02);
  }
}

// Technology badge hover
.tech-badge {
  cursor: help;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
}
```

### Loading States
```typescript
// Skeleton loaders while data fetches
<div class="skeleton-profile">
  <div class="skeleton-header"></div>
  <div class="skeleton-content"></div>
</div>

// Smooth content fade-in
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

.profile-section {
  animation: fadeInUp 0.4s ease-out;
}
```

### Scroll Animations
```typescript
// Sections fade in as you scroll
@defer (on viewport) {
  <app-work-experience />
} @placeholder {
  <app-skeleton-card />
}
```

---

## ♿ Accessibility (WCAG AA)

### Semantic HTML
```html
<!-- ✅ CORRECT: Semantic structure -->
<article class="employee-profile">
  <header class="profile-header">
    <img alt="Daniel Park profile picture" />
    <h1>Daniel Park</h1>
    <p role="doc-subtitle">Full Stack Engineer</p>
  </header>

  <section aria-labelledby="work-experience-heading">
    <h2 id="project-history-heading">Project History</h2>
    ...
  </section>
</article>

<!-- ❌ WRONG: Div soup -->
<div class="profile">
  <div class="header">
    <div class="name">Daniel Park</div>
  </div>
</div>
```

### ARIA Labels
```html
<!-- Status badge -->
<span
  class="status-badge status-available"
  role="status"
  aria-label="Employment status: Available for new opportunities">
  🟢 Available
</span>

<!-- Proficiency bar -->
<div
  class="proficiency-bar"
  role="img"
  aria-label="Kotlin proficiency: Advanced level with 8.5 years of experience">
  <div class="bar-fill" style="width: 85%"></div>
</div>

<!-- Certification expiry -->
<div
  role="alert"
  aria-live="polite"
  class="cert-expiring">
  ⚠️ Certificate expires in 2 months
</div>
```

### Keyboard Navigation
```typescript
// All interactive elements keyboard accessible
<button
  (click)="exportCV()"
  (keydown.enter)="exportCV()"
  (keydown.space)="exportCV()"
  tabindex="0">
  Export CV
</button>

// Skip links for screen readers
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### Color Contrast
All text must meet WCAG AA:
- **Normal text**: 4.5:1 minimum contrast
- **Large text (18pt+)**: 3:1 minimum contrast
- **UI components**: 3:1 minimum contrast

Use Pythia theme colors (pre-tested for WCAG AA).

---

## 📱 Responsive Design

### Breakpoint Strategy
```scss
// Mobile-first approach
.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);

  // Tablet (768px+)
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  // Desktop (1200px+)
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
    gap: var(--spacing-lg);
  }
}
```

### Mobile Optimizations
- **Collapsible sections** (expand/collapse on mobile)
- **Sticky header** (name + avatar visible while scrolling)
- **Touch-friendly targets** (min 44x44px tap areas)
- **Optimized images** (responsive srcset)

---

## 🔧 Technical Implementation

### Component Structure
```
features/employee/
├── pages/
│   └── employee-profile/
│       ├── employee-profile.component.ts
│       ├── employee-profile.component.html
│       └── employee-profile.component.scss
├── components/
│   ├── profile-header/
│   │   ├── profile-header.component.ts
│   │   └── profile-header.component.html
│   ├── quick-stats-bar/
│   ├── technology-list/
│   │   ├── technology-list.component.ts
│   │   ├── technology-item/
│   │   │   └── technology-item.component.ts
│   │   └── proficiency-bar/
│   ├── work-experience-timeline/
│   ├── certification-card/
│   ├── language-proficiency/
│   └── education-card/
└── services/
    └── employee.service.ts
```

### Signal-Based Architecture
```typescript
@Component({
  selector: 'app-employee-profile',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfile {
  readonly employeeService = inject(EmployeeService);
  readonly route = inject(ActivatedRoute);

  // Signal state
  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly yearsOfExperience = computed(() =>
    this.employee()?.yearsExperience ?? 0
  );

  readonly topTechnologies = computed(() =>
    this.employee()?.technologies
      .sort((a, b) => b.years - a.years)
      .slice(0, 5) ?? []
  );

  readonly activeCertifications = computed(() =>
    this.employee()?.certifications
      .filter(cert => !cert.expiresOn || new Date(cert.expiresOn) > new Date()) ?? []
  );
}
```

---

## 📊 Data Visualization Examples

### Technology Proficiency Bar
```html
<div class="tech-item">
  <div class="tech-header">
    <span class="tech-name">Kotlin</span>
    <span class="tech-years">8.5y</span>
    <span class="tech-proficiency">Advanced</span>
  </div>
  <div class="proficiency-bar">
    <div
      class="bar-fill bar-backend"
      [style.width.%]="(years / 10) * 100"
      role="img"
      [attr.aria-label]="'Proficiency: ' + years + ' years'">
    </div>
  </div>
</div>
```

### Timeline Item
```html
<div class="timeline-item">
  <div class="timeline-marker">●</div>
  <div class="timeline-line"></div>
  <div class="timeline-content">
    <h3>{{ experience.role }}</h3>
    <p class="company">{{ experience.company }}</p>
    <p class="dates">
      {{ experience.startDate | date:'MMM yyyy' }} -
      {{ experience.endDate ? (experience.endDate | date:'MMM yyyy') : 'Present' }}
    </p>
    <p class="duration">{{ calculateDuration(experience) }}</p>
  </div>
</div>
```

### Certification Status Badge
```html
<div class="cert-card" [class.expiring]="isExpiringSoon(cert)">
  <div class="cert-header">
    <h4>{{ cert.name }}</h4>
    <span class="cert-status" [class]="getStatusClass(cert)">
      {{ getStatusLabel(cert) }}
    </span>
  </div>
  <div class="cert-dates">
    <span>Issued: {{ cert.issuedOn | date:'MMM yyyy' }}</span>
    @if (cert.expiresOn) {
      <span>Expires: {{ cert.expiresOn | date:'MMM yyyy' }}</span>
      <span class="expiry-warning">
        {{ getExpiryWarning(cert) }}
      </span>
    } @else {
      <span class="no-expiry">No expiry</span>
    }
  </div>
</div>
```

---

## 🎯 Key Improvements Summary

| Aspect | Original Design | Swiss UX Enhancement |
|--------|----------------|---------------------|
| **Header** | Sparse layout, disconnected actions | Compact hero area, grouped actions, status badge |
| **Technologies** | Simple badges with years | Visual proficiency bars, color categories, sortable |
| **Skills** | Flat list | Categorized (Technical/Soft/Methods), proficiency labels |
| **Project History** | Text list | Visual timeline with duration calculation |
| **Certifications** | Bullet list | Status cards with expiry warnings, color coding |
| **Languages** | CEFR badges only | Proficiency bars + descriptive labels |
| **Education** | Simple list | Rich degree cards with optional details |
| **Overall Layout** | Single column | 2-column responsive grid (40/60 split) |
| **Information Density** | Low | High (Swiss precision) |
| **Visual Hierarchy** | Flat | Clear hierarchy with typography + spacing |
| **Interactivity** | Static | Hover states, animations, tooltips |
| **Accessibility** | Basic | WCAG AA compliant, semantic HTML, ARIA |

---

## 🚀 Implementation Checklist

### Phase 1: Core Structure
- [ ] Create EmployeeProfile page component
- [ ] Set up routing (`/employees/:id`)
- [ ] Create EmployeeService with API integration
- [ ] Implement loading/error states
- [ ] Build responsive grid layout

### Phase 2: Header & Stats
- [ ] ProfileHeader component (avatar, name, contact, actions)
- [ ] QuickStatsBar component (key metrics)
- [ ] Status badge with color coding
- [ ] Action buttons (Export CV, Contact, Compare)

### Phase 3: Data Visualization
- [ ] TechnologyList with proficiency bars
- [ ] WorkExperienceTimeline with visual timeline
- [ ] CertificationCard with status indicators
- [ ] LanguageProficiency with CEFR visualization
- [ ] EducationCard component

### Phase 4: Polish & Interactions
- [ ] Hover states and transitions
- [ ] Smooth scroll animations (@defer)
- [ ] Skeleton loading states
- [ ] Tooltips for additional context
- [ ] Mobile responsive optimizations

### Phase 5: Accessibility & Testing
- [ ] Semantic HTML structure
- [ ] ARIA labels and roles
- [ ] Keyboard navigation
- [ ] Color contrast checks (AXE DevTools)
- [ ] Screen reader testing
- [ ] Unit tests (80%+ coverage)

---

## 📚 References

- [Material Design 3 - Data Visualization](https://m3.material.io/components/data-visualization)
- [Swiss Design Principles](https://www.swissdesignawards.ch/)
- [WCAG AA Guidelines](https://www.w3.org/WAI/WCAG2AA-Conformance)
- [Angular Material Components](https://material.angular.io/components)
- [Pythia+ Design Specification](./design-pythia-mvp.md)

---

**Last Updated**: 2025-11-15
**Status**: ✅ Ready for implementation
**Quality Standard**: 🇨🇭 Swiss cutting-edge UX/UI

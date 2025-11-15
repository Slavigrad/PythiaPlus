# Pythia+ Comparison Feature Implementation Plan
## Post-MVP Enhancement: Multi-Candidate Comparison

> **Document Version**: 1.0
> **Created**: 2025-11-15
> **Status**: Ready for implementation (POST-MVP)
> **Technology**: Angular 20.3 + Material Design 3 + Signals
> **Quality Standard**: Swiss corporate grade (WCAG AA, Lighthouse 90+)
> **Prerequisites**: MVP Phase 1-5 complete

---

## 🎯 Feature Overview

### What is the Comparison Feature?

The **Comparison Feature** allows recruiters to select multiple candidates from search results and view them side-by-side in a detailed comparison table. This enables quick decision-making by highlighting differences in skills, experience, and qualifications.

### Key User Stories

1. **As a recruiter**, I want to select multiple candidates from search results so that I can compare them side-by-side
2. **As a recruiter**, I want to see detailed comparisons of skills, experience, and certifications to make informed hiring decisions
3. **As a recruiter**, I want to export selected candidates for sharing with stakeholders
4. **As a recruiter**, I want to limit comparisons to 3 candidates to avoid cognitive overload

### Design References

- **Screenshot**: `screenshot-ideas/Comparison-feature.png` - Selection interface
- **Screenshot**: `screenshot-ideas/Comparison-profiles-feature.png` - Comparison modal
- **Design Analysis**: `screenshot-ideas/DESIGN-ANALYSIS.md` (lines 276, 103, 119, 276)

---

## 📋 Technical Requirements

### 1. Data Model Extensions

```typescript
// Extended Candidate interface with detailed profile data
export interface CandidateProfile extends Candidate {
  // Basic info (already exists in Candidate)
  id: string;
  name: string;
  title: string;
  location: string;
  skills: string[];
  matchScore: MatchScore;

  // New fields for comparison
  experience: {
    totalYears: number;  // "6 years"
    level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  };

  availability: {
    status: 'Available' | 'Busy' | 'Not Available';
    startDate?: string;  // ISO date string
  };

  technologies: Technology[];
  trainings: Training[];
  certifications: Certification[];
  currentProject?: CurrentProject;
}

export interface Technology {
  name: string;            // "Node.js"
  yearsExperience: number; // 7
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Training {
  name: string;            // "Angular"
  provider?: string;       // "Google", "Coursera"
  completedYear?: number;
}

export interface Certification {
  name: string;            // "AWS Solutions Architect"
  issuer: string;          // "Amazon Web Services"
  issuedDate?: string;     // "2023-05"
  expiryDate?: string;
}

export interface CurrentProject {
  name: string;            // "E-Commerce Platform"
  company: string;         // "Tech Corp"
  role: string;            // "Lead Developer"
  startDate?: string;
}

// Comparison state management
export interface ComparisonState {
  selectedIds: Set<string>;
  candidates: CandidateProfile[];
  maxSelections: number;  // 3
  isComparing: boolean;
}
```

### 2. API Extensions

```typescript
// New endpoint for detailed candidate profile
GET /api/v1/candidates/{id}/profile

Response:
{
  "candidate": CandidateProfile,
  "success": true
}

// Batch endpoint for multiple profiles (optimization)
POST /api/v1/candidates/batch-profiles
Request: { "ids": ["id1", "id2", "id3"] }
Response: { "candidates": CandidateProfile[], "success": true }
```

### 3. State Management Pattern

```typescript
// ComparisonService with signals
@Injectable({ providedIn: 'root' })
export class ComparisonService {
  // Signal state
  private readonly selectedIdsSignal = signal<Set<string>>(new Set());
  private readonly candidatesSignal = signal<CandidateProfile[]>([]);
  private readonly isComparingSignal = signal(false);
  private readonly loadingSignal = signal(false);

  // Computed signals
  readonly selectedIds = this.selectedIdsSignal.asReadonly();
  readonly candidates = this.candidatesSignal.asReadonly();
  readonly isComparing = this.isComparingSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly selectionCount = computed(() => this.selectedIds().size);
  readonly hasSelections = computed(() => this.selectionCount() > 0);
  readonly canCompare = computed(() =>
    this.selectionCount() >= 2 && this.selectionCount() <= 3
  );
  readonly isMaxReached = computed(() => this.selectionCount() >= 3);

  // Actions
  toggleSelection(id: string): void { }
  clearSelections(): void { }
  async loadProfiles(): Promise<void> { }
  openComparison(): void { }
  closeComparison(): void { }
}
```

---

## 📐 Implementation Phases

### Phase 1: Selection Interface (2 days)

**Goal**: Add multi-select capability to search results

#### Task 1.1: Add selection state to CandidateListComponent

- [ ] Create ComparisonService with signal-based state
- [ ] Inject ComparisonService into SearchPageComponent
- [ ] Add computed signals: selectionCount, hasSelections, canCompare, isMaxReached
- [ ] Test service state changes with Jasmine

**Requirements**:
- Service must prevent selection beyond 3 candidates
- Service must persist selections when search results change
- _Deliverable: Working ComparisonService with tests_

#### Task 1.2: Add checkboxes to CandidateCardComponent

- [ ] Add optional `selectable` signal input to CandidateCardComponent
- [ ] Add signal output `selectionChange` event emitter
- [ ] Add checkbox to left side of card (Material checkbox)
- [ ] Style checkbox with Pythia theme (red accent when checked)
- [ ] Disable checkbox when max selections reached (3)
- [ ] Add aria-label: "Select [candidate name] for comparison"
- [ ] Add hover effect on card when selectable

**Requirements**:
- Checkbox must be keyboard accessible (Space to toggle)
- Visual indicator when card is selected (border highlight)
- Disabled state with tooltip when max reached
- _Deliverable: Selectable candidate cards_

#### Task 1.3: Create ComparisonToolbarComponent

- [ ] Build toolbar component that floats above results
- [ ] Show "Compare (X)" button with selection count
- [ ] Show "Export (X)" button (placeholder for now)
- [ ] Disable "Compare" button when count < 2 or > 3
- [ ] Position in top-right corner of results area
- [ ] Add fade-in animation when selections > 0
- [ ] Style with Pythia theme (red "Export" button, gray "Compare")

**Requirements**:
- Toolbar appears only when hasSelections() is true
- Button text updates reactively with selection count
- ARIA live region announces selection changes
- _Deliverable: Comparison toolbar UI_

#### Task 1.4: Implement selection persistence

- [ ] Store selected IDs in ComparisonService signal
- [ ] Persist selections when user performs new search
- [ ] Clear selections when user explicitly clicks "Clear"
- [ ] Add "Clear selections (X)" link in toolbar
- [ ] Show selection count in results header: "6 results • 2 selected"

**Requirements**:
- Selections survive search result updates
- Clear visual feedback when selections change
- _Deliverable: Persistent selection state_

#### Task 1.5: Add keyboard shortcuts for selection

- [ ] Implement Shift+Click for range selection (select multiple in sequence)
- [ ] Add "Select All" checkbox in results header (max 3)
- [ ] Add Cmd/Ctrl+A keyboard shortcut (select up to 3)
- [ ] Show keyboard hints in UI ("Tip: Shift+click to select range")

**Requirements**:
- Keyboard shortcuts must respect 3-candidate limit
- Accessible via screen readers
- _Deliverable: Enhanced selection UX_

---

### Phase 2: Comparison View (3 days)

**Goal**: Build side-by-side comparison modal with detailed candidate data

#### Task 2.1: Create ComparisonModalComponent structure

- [ ] Generate ComparisonModalComponent using Angular Material Dialog
- [ ] Design modal layout: full-screen overlay with centered content panel
- [ ] Add dark background overlay (rgba(0,0,0,0.7))
- [ ] Create modal header: "Compare Talents (X)" with close button
- [ ] Add responsive design (stacked on mobile, side-by-side on desktop)
- [ ] Implement close on Escape key
- [ ] Add slide-in animation (300ms cubic-bezier)

**Requirements**:
- Modal must trap keyboard focus (WCAG 2.1.2)
- Close button must be keyboard accessible
- Overlay click closes modal
- _Deliverable: Modal shell component_

#### Task 2.2: Build ComparisonTableComponent

- [ ] Create table with fixed left column (attribute names)
- [ ] Add dynamic columns for each selected candidate (2-3 columns)
- [ ] Implement sticky header with candidate avatars and names
- [ ] Add close "X" button above each candidate column
- [ ] Style table with Pythia theme (neutral backgrounds, red accents)
- [ ] Make table horizontally scrollable on small screens

**Requirements**:
- Table must be semantically correct (`<table>` with proper headers)
- Sticky header must work on scroll
- _Deliverable: Comparison table layout_

#### Task 2.3: Implement ComparisonHeaderComponent

- [ ] Display candidate avatar (colored circle with initials)
- [ ] Show candidate name below avatar
- [ ] Show title (smaller, gray text)
- [ ] Add individual close button (X) for each candidate
- [ ] Add remove animation (fade out, slide remaining candidates left)

**Requirements**:
- Removing a candidate updates comparison in real-time
- Avatars use same color scheme as CandidateCard
- _Deliverable: Comparison header row_

#### Task 2.4: Create ComparisonRowComponent (reusable)

- [ ] Build row component with signal inputs: `attribute`, `values[]`
- [ ] Implement different row types:
  - **Text**: Simple text display (Role, Location)
  - **Badge**: Colored badge for status (Availability - green/yellow/red)
  - **List**: Bulleted list for arrays (Trainings, Certifications)
  - **Tech**: Technology chips with years (Node.js - 7 years)
  - **Project**: Project name (red text) + company (gray text below)
- [ ] Add visual comparison highlighting (highlight differences vs similarities)
- [ ] Style rows with alternating backgrounds (zebra striping)

**Requirements**:
- Row types must be extensible for future attributes
- Responsive design for mobile (stack values vertically)
- _Deliverable: Dynamic comparison rows_

#### Task 2.5: Implement comparison data loading

- [ ] Create `loadCandidateProfiles()` method in ComparisonService
- [ ] Call POST /api/v1/candidates/batch-profiles with selected IDs
- [ ] Show loading spinner while fetching profiles
- [ ] Handle errors (network failure, invalid IDs)
- [ ] Cache loaded profiles to avoid re-fetching
- [ ] Add retry button for failed loads

**Requirements**:
- Show skeleton loader during load (preserve layout)
- Error state with retry option
- _Deliverable: Working data loading_

#### Task 2.6: Build comparison attribute rows

- [ ] **Role**: Display job title
- [ ] **Location**: Display location (with flag emoji if available)
- [ ] **Experience**: Display "X years" with level badge (Senior, Mid, etc.)
- [ ] **Availability**: Show status with colored badge (Available = green)
- [ ] **Technologies**: List tech with years of experience (Node.js - 7 years, React - 5 years)
- [ ] **Trainings**: Bulleted list of courses/certifications
- [ ] **Certifications**: Professional certifications with issuer
- [ ] **Current Project**: Project name (red) + company name (gray)

**Requirements**:
- Missing data shows "—" placeholder
- Consistent formatting across all rows
- _Deliverable: Complete comparison view_

---

### Phase 3: Export Functionality (2 days)

**Goal**: Enable exporting selected candidates in multiple formats

#### Task 3.1: Create ExportService

- [ ] Generate ExportService with signal state
- [ ] Implement export formats: CSV, JSON, PDF (optional)
- [ ] Create methods: `exportCSV()`, `exportJSON()`, `exportPDF()`
- [ ] Add loading state during export
- [ ] Handle errors (insufficient data, browser compatibility)

**Requirements**:
- CSV must include all candidate data
- JSON must be properly formatted
- _Deliverable: Export service with CSV/JSON support_

#### Task 3.2: Implement CSV export

- [ ] Convert CandidateProfile[] to CSV format
- [ ] Include all fields: name, title, location, skills, experience, etc.
- [ ] Add headers row
- [ ] Handle special characters (commas, quotes) properly
- [ ] Trigger browser download with filename: `pythia-candidates-{date}.csv`
- [ ] Add "Export started" notification

**Requirements**:
- CSV must be valid and open in Excel/Google Sheets
- Filename includes timestamp for uniqueness
- _Deliverable: Working CSV export_

#### Task 3.3: Implement JSON export

- [ ] Convert CandidateProfile[] to formatted JSON
- [ ] Pretty-print with 2-space indentation
- [ ] Include metadata: export date, query, total selected
- [ ] Trigger browser download with filename: `pythia-candidates-{date}.json`

**Requirements**:
- JSON must be valid and parseable
- Include schema version for future compatibility
- _Deliverable: Working JSON export_

#### Task 3.4: Add PDF export (optional)

- [ ] Integrate jsPDF or similar library
- [ ] Create PDF layout matching comparison modal design
- [ ] Include Pythia+ branding (logo, colors)
- [ ] Support multi-page PDFs (if data exceeds one page)
- [ ] Add page numbers and footer

**Requirements**:
- PDF should be print-friendly
- Include timestamp and query info
- _Deliverable: Working PDF export (optional)_

#### Task 3.5: Build ExportModalComponent

- [ ] Create modal for export format selection
- [ ] Show options: CSV, JSON, PDF
- [ ] Add preview of data to be exported
- [ ] Show file size estimate
- [ ] Add "Cancel" and "Export" buttons
- [ ] Show progress indicator during export

**Requirements**:
- Modal accessible via keyboard
- Clear messaging about what will be exported
- _Deliverable: Export format selector_

#### Task 3.6: Connect Export button to ExportService

- [ ] Wire "Export (X)" button in ComparisonToolbarComponent
- [ ] Open ExportModalComponent on click
- [ ] Trigger appropriate export method based on user selection
- [ ] Show success notification after export
- [ ] Add error handling for failed exports

**Requirements**:
- Export works from both toolbar and comparison modal
- Analytics tracking for export events (optional)
- _Deliverable: End-to-end export flow_

---

### Phase 4: Polish & Accessibility (2 days)

**Goal**: Ensure WCAG AA compliance and smooth UX

#### Task 4.1: Accessibility audit for comparison feature

- [ ] Add ARIA labels to all comparison UI elements
- [ ] Implement aria-live region for selection announcements
- [ ] Add keyboard navigation for comparison table
- [ ] Test with screen readers (NVDA, VoiceOver)
- [ ] Ensure 4.5:1 color contrast in comparison modal
- [ ] Add visible focus indicators on all interactive elements
- [ ] Test keyboard-only navigation (Tab, Enter, Escape)

**Requirements**:
- MUST pass AXE DevTools audit (0 violations)
- Full keyboard navigation support
- _Deliverable: WCAG AA compliant comparison feature_

#### Task 4.2: Add animations and micro-interactions

- [ ] Fade-in animation for ComparisonToolbarComponent
- [ ] Slide-in animation for ComparisonModalComponent
- [ ] Remove animation when closing individual candidate in modal
- [ ] Checkbox check/uncheck animation
- [ ] Button hover effects (elevation + scale)
- [ ] Loading skeleton for profile data

**Requirements**:
- All animations respect prefers-reduced-motion
- Smooth transitions (300ms ease)
- _Deliverable: Polished UI with animations_

#### Task 4.3: Responsive design for comparison modal

- [ ] Desktop (>1024px): Side-by-side columns (3 candidates)
- [ ] Tablet (768-1024px): Horizontal scroll for 3 candidates
- [ ] Mobile (<768px): Stack candidates vertically or horizontal carousel
- [ ] Ensure table remains readable on all screen sizes
- [ ] Add pinch-to-zoom support for mobile

**Requirements**:
- Test on real devices (iOS, Android)
- Maintain usability on small screens
- _Deliverable: Fully responsive comparison view_

#### Task 4.4: Error states and edge cases

- [ ] Handle empty selection (disable Compare button)
- [ ] Handle single selection (show message: "Select at least 2 candidates")
- [ ] Handle max selections (3) - disable further checkboxes
- [ ] Handle profile load failure (show error + retry)
- [ ] Handle missing data fields (show "—" placeholder)
- [ ] Handle network timeout (show retry option)

**Requirements**:
- Clear error messages
- Actionable recovery options
- _Deliverable: Robust error handling_

#### Task 4.5: Performance optimization

- [ ] Lazy load ComparisonModalComponent with @defer
- [ ] Implement virtual scrolling for large comparison tables (if >10 attributes)
- [ ] Optimize batch profile API call (single request for all IDs)
- [ ] Cache loaded profiles to avoid re-fetching
- [ ] Minimize bundle size impact (<30kb additional)

**Requirements**:
- Modal opens in <200ms
- Smooth scrolling performance
- _Deliverable: Optimized comparison feature_

---

### Phase 5: Testing & Documentation (2 days)

**Goal**: Comprehensive testing and documentation

#### Task 5.1: Unit tests for ComparisonService

- [ ] Test signal state changes (selectedIds, candidates, isComparing)
- [ ] Test computed signals (selectionCount, hasSelections, canCompare, isMaxReached)
- [ ] Test toggleSelection() with edge cases (max 3, duplicate toggles)
- [ ] Test clearSelections()
- [ ] Test loadProfiles() with mock API
- [ ] Test error handling (network failures, invalid IDs)
- [ ] Achieve 90%+ code coverage for ComparisonService

**Requirements**:
- Use Jasmine + TestBed
- Mock HttpClient with HttpClientTestingModule
- _Deliverable: Comprehensive service tests_

#### Task 5.2: Component tests for comparison UI

- [ ] Test ComparisonToolbarComponent visibility and button states
- [ ] Test CandidateCardComponent checkbox interactions
- [ ] Test ComparisonModalComponent open/close behavior
- [ ] Test ComparisonTableComponent rendering with 2-3 candidates
- [ ] Test ComparisonRowComponent different row types
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test screen reader announcements (aria-live)

**Requirements**:
- Test signal inputs with fixture.componentRef.setInput()
- Verify ARIA attributes
- _Deliverable: Component test suite (25+ tests)_

#### Task 5.3: Integration tests for export flow

- [ ] Test CSV export generates valid file
- [ ] Test JSON export generates valid JSON
- [ ] Test PDF export (if implemented)
- [ ] Test export button states (enabled/disabled)
- [ ] Test export modal interactions
- [ ] Test error handling (export failures)

**Requirements**:
- Mock FileSaver API
- Verify file content and format
- _Deliverable: Export integration tests_

#### Task 5.4: E2E tests for comparison feature (optional)

- [ ] Test full user flow: search → select → compare → close
- [ ] Test multi-select with checkboxes
- [ ] Test opening comparison modal
- [ ] Test removing candidates from comparison
- [ ] Test export flow
- [ ] Test keyboard navigation

**Requirements**:
- Use Cypress or Playwright
- Test on multiple browsers
- _Deliverable: E2E test suite (optional)_

#### Task 5.5: Update documentation

- [ ] Update `design-pythia-mvp.md` with comparison feature specs
- [ ] Update `MVP-Task-Plan.md` to mark comparison as complete
- [ ] Create `COMPARISON-FEATURE.md` with user guide
- [ ] Add comparison feature to `README.md`
- [ ] Document API requirements for backend team
- [ ] Create visual changelog with before/after screenshots

**Requirements**:
- Clear documentation for developers and users
- Include code examples and screenshots
- _Deliverable: Complete feature documentation_

---

## 📊 Success Metrics

| Phase | Duration | Components | Tests | Bundle Impact | Key Features |
|-------|----------|------------|-------|---------------|--------------|
| **Phase 1** | 2 days | 2 | 8 | +10kb | Selection interface |
| **Phase 2** | 3 days | 5 | 15 | +25kb | Comparison modal |
| **Phase 3** | 2 days | 2 | 8 | +15kb (jsPDF) | Export functionality |
| **Phase 4** | 2 days | 0 | 5 | Optimized | Accessibility & polish |
| **Phase 5** | 2 days | 0 | 25+ | - | Testing & docs |
| **Total** | **11 days** | **9** | **61+** | **~50kb** | **Complete comparison feature** |

### Bundle Size Impact

- **ComparisonService**: ~2kb
- **Selection UI**: ~8kb (checkboxes, toolbar)
- **ComparisonModal**: ~20kb (table, rows, animations)
- **ExportService + jsPDF**: ~15kb (or ~200kb if using full jsPDF library)
- **Total**: ~45-50kb (or ~230kb with PDF support)

**Optimization**:
- Use @defer for ComparisonModalComponent (loads only when Compare button clicked)
- Use @defer for ExportModalComponent (loads only when Export button clicked)
- **Effective initial bundle increase**: ~10kb (only selection UI in initial bundle)

---

## 🎯 Deliverables Checklist

### By End of Phase 1:
- [ ] ComparisonService with signal-based state
- [ ] Selectable candidate cards with checkboxes
- [ ] Comparison toolbar with "Compare (X)" button
- [ ] Selection persistence across searches
- [ ] Keyboard shortcuts for selection

### By End of Phase 2:
- [ ] Full-screen comparison modal
- [ ] Side-by-side candidate comparison table
- [ ] Dynamic attribute rows (8 attributes)
- [ ] Profile data loading from API
- [ ] Remove individual candidates from comparison

### By End of Phase 3:
- [ ] Export to CSV
- [ ] Export to JSON
- [ ] Export format selector modal
- [ ] Success/error notifications for exports
- [ ] Optional: PDF export

### By End of Phase 4:
- [ ] WCAG AA compliant
- [ ] Smooth animations and transitions
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Robust error handling
- [ ] Performance optimized (<200ms modal open)

### By End of Phase 5:
- [ ] 90%+ test coverage
- [ ] Integration tests for export
- [ ] E2E tests (optional)
- [ ] Complete documentation
- [ ] User guide for comparison feature

---

## 🚀 Quick Start Commands

```bash
# Phase 1 - Selection Interface
ng generate service core/services/comparison
ng generate component features/search/components/comparison-toolbar

# Phase 2 - Comparison Modal
ng generate component features/comparison/comparison-modal
ng generate component features/comparison/comparison-table
ng generate component features/comparison/comparison-header
ng generate component features/comparison/comparison-row

# Phase 3 - Export
ng generate service core/services/export
ng generate component features/comparison/export-modal

# Install dependencies
npm install file-saver @types/file-saver  # For CSV/JSON export
npm install jspdf jspdf-autotable          # For PDF export (optional)

# Run tests
npm run test:coverage

# Build with comparison feature
npm run build:prod
```

---

## 📝 Backend API Requirements

### New Endpoints Required

```typescript
// 1. Get detailed candidate profile
GET /api/v1/candidates/{id}/profile
Response: {
  "candidate": {
    "id": "123",
    "name": "Daniel Park",
    "title": "Full Stack Engineer",
    "location": "Berlin",
    "skills": ["Node.js", "PostgreSQL", "Angular"],
    "matchScore": { "matched": 0.95, "total": 1 },
    "experience": {
      "totalYears": 6,
      "level": "Senior"
    },
    "availability": {
      "status": "Available",
      "startDate": "2025-12-01"
    },
    "technologies": [
      { "name": "Node.js", "yearsExperience": 7, "proficiency": "Expert" },
      { "name": "PostgreSQL", "yearsExperience": 4, "proficiency": "Intermediate" },
      { "name": "React", "yearsExperience": 5, "proficiency": "Expert" }
    ],
    "trainings": [
      { "name": "Angular", "provider": "Google" },
      { "name": "React", "provider": null },
      { "name": "Vue.js", "provider": null }
    ],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon Web Services",
        "issuedDate": "2023-05",
        "expiryDate": null
      },
      {
        "name": "Node.js Certification",
        "issuer": "OpenJS Foundation",
        "issuedDate": "2022-11",
        "expiryDate": null
      }
    ],
    "currentProject": {
      "name": "E-Commerce Platform",
      "company": "Tech Corp",
      "role": "Lead Developer",
      "startDate": "2024-01"
    }
  },
  "success": true
}

// 2. Batch get candidate profiles (optimization)
POST /api/v1/candidates/batch-profiles
Request: {
  "ids": ["123", "456", "789"]
}
Response: {
  "candidates": [ /* Array of CandidateProfile */ ],
  "success": true,
  "errors": [] // IDs that failed to load
}
```

### Database Schema Extensions

```sql
-- Extend candidates table
ALTER TABLE candidates ADD COLUMN experience_years INTEGER;
ALTER TABLE candidates ADD COLUMN experience_level VARCHAR(20);
ALTER TABLE candidates ADD COLUMN availability_status VARCHAR(20);
ALTER TABLE candidates ADD COLUMN availability_start_date DATE;

-- New table: candidate_technologies
CREATE TABLE candidate_technologies (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id),
  technology_name VARCHAR(100),
  years_experience INTEGER,
  proficiency VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New table: candidate_trainings
CREATE TABLE candidate_trainings (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id),
  training_name VARCHAR(200),
  provider VARCHAR(100),
  completed_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New table: candidate_certifications
CREATE TABLE candidate_certifications (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id),
  certification_name VARCHAR(200),
  issuer VARCHAR(100),
  issued_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New table: candidate_projects
CREATE TABLE candidate_projects (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id),
  project_name VARCHAR(200),
  company VARCHAR(100),
  role VARCHAR(100),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Design Tokens for Comparison Feature

### Colors

```scss
// Pythia theme extensions for comparison
:root {
  // Comparison status colors
  --color-available: #4CAF50;      // Green for "Available"
  --color-busy: #FFC107;           // Yellow for "Busy"
  --color-unavailable: #9E9E9E;    // Gray for "Not Available"

  // Comparison modal
  --color-modal-overlay: rgba(0, 0, 0, 0.7);
  --color-modal-bg: #FFFFFF;
  --color-table-header-bg: #F5F5F5;
  --color-table-row-alt: #FAFAFA;  // Zebra striping

  // Selection highlight
  --color-selected-border: #D32F2F;
  --color-selected-bg: rgba(211, 47, 47, 0.05);
}
```

### Spacing

```scss
// Comparison-specific spacing
:root {
  --comparison-modal-padding: var(--spacing-xl);    // 32px
  --comparison-table-cell-padding: var(--spacing-md); // 16px
  --comparison-header-height: 120px;
  --comparison-row-height: 60px;
}
```

---

## 🔍 UX Considerations

### Selection Limits

- **Maximum 3 candidates**: Cognitive load research shows 3 is optimal for side-by-side comparison
- **Minimum 2 candidates**: Comparison requires at least 2 subjects
- **Visual feedback**: Disable checkboxes when max reached, show tooltip

### Modal Behavior

- **Close triggers**: Click overlay, press Escape, click X button, click "Done" button
- **Focus trap**: Keyboard focus stays within modal when open
- **Scroll behavior**: Body scroll disabled when modal open (prevent background scroll)

### Mobile Optimization

- **Stacked layout**: On mobile (<768px), show candidates stacked vertically
- **Horizontal scroll**: On tablet, allow horizontal scroll for 3 candidates
- **Touch gestures**: Swipe left/right to navigate between candidates on mobile

### Accessibility

- **Screen reader announcements**: "2 candidates selected. Compare button enabled."
- **Keyboard navigation**: Tab through checkboxes, Enter to toggle, Space for actions
- **Focus indicators**: Visible focus ring on all interactive elements
- **Semantic HTML**: Use proper `<table>` with `<th>` and `<td>` for comparison

---

## 📚 Related Documentation

- [MVP Task Plan](./MVP-Task-Plan.md) - Prerequisites for this feature
- [Design Specification](../01-documentation/design-pythia-mvp.md) - Core design patterns
- [Angular 20 Reference](../01-documentation/ANGULAR-20-QUICK-REFERENCE.md) - Angular patterns
- [Design Analysis](../../screenshot-ideas/DESIGN-ANALYSIS.md) - Why comparison is POST-MVP

---

## ✅ Definition of Done

### Feature is complete when:

1. ✅ **Selection Interface**:
   - Users can select up to 3 candidates via checkboxes
   - "Compare (X)" button shows selection count
   - Selection persists across searches
   - Keyboard shortcuts work

2. ✅ **Comparison Modal**:
   - Modal opens with selected candidates
   - Side-by-side table shows 8 attribute rows
   - Data loads from backend API
   - Users can remove candidates from comparison
   - Modal closes properly with all triggers

3. ✅ **Export Functionality**:
   - CSV export works and downloads valid file
   - JSON export works and downloads valid file
   - PDF export works (optional)
   - Export button states correct (enabled/disabled)

4. ✅ **Accessibility**:
   - WCAG AA compliant (0 AXE violations)
   - Keyboard navigation fully functional
   - Screen reader tested (NVDA/VoiceOver)
   - 4.5:1 color contrast verified

5. ✅ **Testing**:
   - 90%+ code coverage
   - All unit tests pass
   - Integration tests for export pass
   - E2E tests pass (if implemented)

6. ✅ **Performance**:
   - Modal opens in <200ms
   - Bundle size increase <50kb (with @defer)
   - Lighthouse score remains 90+

7. ✅ **Documentation**:
   - User guide written
   - API requirements documented
   - Code documented with TSDoc comments
   - README updated

---

**Total Effort**: ~11 working days (2.5 weeks)
**Team Size**: 1 developer (full-stack)
**Risk Level**: Medium (requires backend API extensions)
**Dependencies**: MVP Phase 1-5 complete, backend API updates
**Quality Level**: Swiss corporate standard (WCAG AA, Lighthouse 90+, production-ready)

---

**Document Status**: ✅ Complete and ready for implementation
**Next Steps**:
1. Review and approve plan with stakeholders
2. Coordinate backend API development
3. Begin Phase 1 implementation
4. Track progress in this document (update checkboxes)

**Last Updated**: 2025-11-15

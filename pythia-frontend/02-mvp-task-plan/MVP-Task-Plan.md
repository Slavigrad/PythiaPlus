# Pythia+ MVP Implementation Plan
## 5-Phase Delivery Strategy

> **Document Version**: 2.0 (Updated 2025-11-14)
> **Status**: Ready for implementation
> **Technology**: Angular 20.3 + Material Design 3 + Signals
> **Quality Standard**: Swiss corporate grade (WCAG AA, Lighthouse 90+)

---

## Phase 1: Foundation & Pythia Branding 🎨

**Goal**: Set up Angular 20 project with Pythia+ identity and core infrastructure

- [x] **Task 1.1: Verify Angular 20 project configuration**
  - ✅ Project already initialized with Angular 20.3
  - Verify TypeScript strict mode is enabled in tsconfig.json
  - Confirm Angular Material 20.2 is installed
  - Review existing TypeScript interfaces (SearchParams, SearchResponse, Candidate, MatchScore)
  - Verify standalone components configuration (default in Angular 20)
  - Configure single-route architecture (/search) with future lazy loading hooks
  - _Requirements: 4.1, 4.2, 5.6_
  - _Deliverable: Verified project configuration_

- [ ] **Task 1.2: Replace ALL Angular defaults with Pythia+ enterprise identity**
  - Completely rewrite app.component (remove Angular logo, welcome content)
  - Create professional header: "👥 Pythia+ | Talent manager" with red background
  - Implement Material toolbar with Pythia colors (#D32F2F primary, neutral grays)
  - Add user avatar placeholder (white circle, top right)
  - Remove all boilerplate routes and placeholder content
  - _Requirements: 6.3 (HeaderComponent), 6.1 (Pythia Theme)_
  - _Deliverable: Clean branded app shell_

- [ ] **Task 1.3: Integrate existing Pythia theme system**
  - ✅ `_pythia-theme.scss` already exists with complete color palette
  - Verify Material theme configuration with Pythia red primary (#D32F2F)
  - Ensure CSS custom properties are properly exported (--color-*, --spacing-*, --font-*)
  - Test theme in components (verify colors, spacing, typography)
  - Verify 8px spacing system ($spacing-xs through $spacing-2xl)
  - Confirm Inter font family is loaded and applied
  - Add any missing design tokens if needed
  - _Requirements: 6.1 (Color Palette), 6.1 (Typography)_
  - _Deliverable: Verified and tested design system_

- [ ] **Task 1.4: Create mock search API structure**
  - Set up JSON Server or MSW (Mock Service Worker) for `/api/v1/search`
  - Create mock candidate data (10-15 realistic profiles with embeddings)
  - Implement GET endpoint with query, topK, minScore parameters
  - Generate realistic match scores (0.65-0.95 range) based on query
  - Add response delays (200-500ms) for realistic API simulation
  - Configure CORS and error scenarios (empty results, network errors)
  - _Requirements: 3.1 (API Endpoint), 3.3 (Response Model)_
  - _Deliverable: Working mock API at localhost:3000_

- [ ] **Task 1.5: Implement signal-based service architecture**
  - Create SearchService with signal-based state (searchResults, loading, error)
  - Implement computed signals (hasResults, resultCount, isEmpty)
  - Create NotificationService for toast messages (success, error, info)
  - Set up HttpClient with proper typing and error handling
  - Add retry logic (2 attempts) for failed requests
  - Implement automatic cleanup with DestroyRef and takeUntilDestroyed
  - _Requirements: 4.5 (SearchService), 5.1 (Signal APIs)_
  - _Deliverable: Core services with signals_

---

## Phase 2: Search Interface & Control Flow 🔍

**Goal**: Build main search interface with modern Angular 20 control flow

- [ ] **Task 2.1: Create SearchBarComponent with signal inputs**
  - Build search input with placeholder "Find React developers in Zurich"
  - Implement signal-based form state (searchQuery signal)
  - Add search icon (🔍) positioned left inside input
  - Style with pythia-theme: rounded corners, focus state with red border
  - Add keyboard handling (Enter to search, Escape to clear)
  - _Requirements: 6.3 (SearchBarComponent), 5.4 (Signal Inputs)_
  - _Deliverable: Functional search input component_

- [ ] **Task 2.2: Implement ExampleQueriesComponent with clickable pills**
  - Create 3 example query pills below search bar
  - Pills: "Senior Python developers with 5+ years", "DevOps engineer with Kubernetes", "Frontend with React and TypeScript"
  - Style as rounded pills with hover effects (gray → red tint)
  - Make clickable to auto-populate search query
  - Use signal outputs to emit selected query
  - _Requirements: 6.3 (ExampleQueriesComponent), UI/UX flow 7.1_
  - _Deliverable: Interactive example queries_

- [ ] **Task 2.3: Build search flow with effect() and debouncing**
  - Implement effect() in SearchBarComponent to trigger search
  - Add 500ms debounce using setTimeout cleanup pattern
  - Validate minimum 3 characters before searching
  - Cancel previous search if new query arrives (using takeUntilDestroyed)
  - Clear results when query is too short
  - _Requirements: 4.5 (Search Flow), 5.1 (Effects)_
  - _Deliverable: Working debounced search_

- [ ] **Task 2.4: Create result states with @if/@else control flow**
  - Implement EmptyStateComponent (before first search)
  - Create LoadingSpinnerComponent with animation
  - Build ErrorMessageComponent with retry button
  - Use @if/@else to switch between states based on signals
  - Add smooth transitions between states
  - _Requirements: 5.2 (Control Flow), 6.3 (EmptyStateComponent)_
  - _Deliverable: All search states handled_

- [ ] **Task 2.5: Build CandidateListComponent with @for and track**
  - Create results header: "6 candidates found • Sorted by relevance"
  - Implement @for loop with track candidate.id
  - Add @empty block for zero results case
  - Use computed signal for result count
  - Style container with proper spacing and max-width
  - _Requirements: 5.2 (@for Control Flow), 7.3 (Results Display)_
  - _Deliverable: Dynamic candidate list_

- [ ] **Task 2.6: Implement recent searches (optional enhancement)**
  - Store last 5 searches in localStorage
  - Display below search bar when input is focused
  - Make clickable to re-run previous search
  - Add "Clear history" button
  - Style as subtle gray pills
  - _Requirements: Enhanced UX_
  - _Deliverable: Search history feature_

---

## Phase 3: Candidate Cards & Match Scores 🎯

**Goal**: Build reusable components with signal inputs and sophisticated styling

- [ ] **Task 3.1: Create CandidateCardComponent with signal inputs**
  - Implement input.required<Candidate>() for candidate data
  - Build card layout: avatar | info | match score
  - Style with hover effects and box shadows
  - Add computed signals for initials and avatar color
  - Use output() for selection events (future feature)
  - _Requirements: 6.3 (CandidateCardComponent), 5.1 (Signal Inputs)_
  - _Deliverable: Beautiful candidate card_

- [ ] **Task 3.2: Implement dynamic avatar with colored circles**
  - Generate initials from candidate name (first letters)
  - Create avatar color selection based on candidate ID
  - Use 4 color variants: orange, green, blue, purple
  - Style as 48px circle with centered text
  - Make colors deterministic (same ID = same color)
  - _Requirements: 6.3 (Avatar Styling)_
  - _Deliverable: Colorful avatar system_

- [ ] **Task 3.3: Build SkillBadgeComponent for technologies**
  - Create pill-shaped badges with light blue background
  - Display up to 4 skills, show "+N more" if excess
  - Use @for with track for badge list
  - Style with proper spacing and wrap behavior
  - Make badges visually distinct but not overwhelming
  - _Requirements: 6.3 (SkillBadgeComponent)_
  - _Deliverable: Skill badge display_

- [ ] **Task 3.4: Create MatchScoreBadgeComponent with color zones**
  - Implement computed signal for score formatting (percentage)
  - Add computed signal for color class (excellent/good/weak)
  - Show large percentage (89%) with color coding
  - Display label below: "Excellent match" / "Good match" / "Weak match"
  - Color zones: 85-100% green, 70-85% orange, <70% gray
  - _Requirements: 6.3 (MatchScoreBadgeComponent), 6.4 (Match Score Logic)_
  - _Deliverable: Visual match score indicator_

- [ ] **Task 3.5: Add candidate info section (name, title, location)**
  - Display name in bold, larger font (font-size-lg)
  - Show title below name in regular weight
  - Add location with 📍 emoji icon
  - Style with proper typography hierarchy
  - Use Pythia theme colors for text (neutral-900, neutral-700, neutral-500)
  - _Requirements: 6.3 (Candidate Info Styling)_
  - _Deliverable: Complete candidate info display_

- [ ] **Task 3.6: Prepare for candidate details view (future enhancement)**
  - Add click handler to candidate cards
  - Create output() event for card selection
  - Add hover cursor pointer styling
  - Document API requirements for full candidate profile
  - Add placeholder comment for future detail modal
  - _Requirements: Future enhancement_
  - _Deliverable: Click handling infrastructure ready_

- [ ] **Task 3.7: Add micro-interactions and animations**
  - Card hover effects (elevation change from 2 to 8)
  - Smooth transitions between loading/error/results states (300ms ease)
  - Loading spinner animation (Material spinner)
  - Fade-in animation for search results (stagger 50ms per card)
  - Ripple effects on buttons and clickable elements
  - Smooth collapse/expand for advanced options
  - _Requirements: Polish, Swiss quality standards_
  - _Deliverable: Polished UI with smooth animations_

---

## Phase 4: Advanced Options & Deferred Loading ⚙️

**Goal**: Add search refinement controls with @defer for performance

- [ ] **Task 4.1: Create SearchOptionsComponent with collapsible panel**
  - Build collapsible panel (default: collapsed)
  - Add "⚙️ Advanced options" toggle button
  - Implement expand/collapse animation with CSS transitions
  - Style panel with light gray background (neutral-50)
  - Position below search bar with proper spacing
  - _Requirements: 6.3 (SearchOptionsComponent), 7.4 (Advanced Options)_
  - _Deliverable: Collapsible options panel_

- [ ] **Task 4.2: Implement "Show me" dropdown for topK**
  - Create Material select dropdown
  - Options: "Top 5 matches", "Top 10 matches" (default), "Top 20 matches", "All matches (50)"
  - Map UI labels to API values (5, 10, 20, 50)
  - Use signal with model() for two-way binding
  - Trigger new search when value changes (via effect)
  - _Requirements: 7.4 (TopK Selector)_
  - _Deliverable: Working result count selector_

- [ ] **Task 4.3: Build minScore slider with visual zones**
  - Create horizontal slider (50% to 100%)
  - Add gradient background: orange (50-70%) → green (70-85%) → dark green (85-100%)
  - Display current percentage value (e.g., "70%")
  - Show zone labels: "Cast a wide net" | "Good matches" | "Only excellent"
  - Use signal for value, trigger search on change
  - Style slider thumb with red border
  - _Requirements: 6.3 (Score Slider), 7.4 (MinScore Control)_
  - _Deliverable: Visual match quality slider_

- [ ] **Task 4.4: Implement @defer for SearchOptionsComponent**
  - Wrap SearchOptionsComponent in @defer (on interaction)
  - Show simple button in @placeholder state
  - Load component only when user clicks "Advanced options"
  - Reduce initial bundle by ~10-15kb
  - Test lazy loading behavior in dev tools
  - _Requirements: 5.3 (Deferred Loading)_
  - _Deliverable: Lazy-loaded advanced options_

- [ ] **Task 4.5: Add @defer for below-the-fold candidate cards**
  - Wrap candidate cards in @defer (on viewport)
  - Create SkeletonCardComponent for @placeholder
  - Show skeleton loader while component loads
  - Add @loading state with minimum 100ms
  - Prefetch on idle for better UX
  - _Requirements: 5.3 (@defer patterns), 6.6 (Skeleton Placeholders)_
  - _Deliverable: Optimized lazy loading_

- [ ] **Task 4.6: Add search state persistence with URL**
  - Save search query to URL query parameters (?q=...)
  - Save topK and minScore to URL (?topK=10&minScore=0.7)
  - Restore search state on page reload
  - Enable browser back/forward navigation
  - Use Angular Router queryParams with signal integration
  - Update URL without triggering page reload
  - _Requirements: Better UX, shareable search URLs_
  - _Deliverable: Persistent and shareable search state_

---

## Phase 5: Polish, Testing & Deployment 🚀

**Goal**: Add accessibility, testing, and prepare for production

- [ ] **Task 5.1: Implement accessibility features (WCAG AA)**
  - Add proper ARIA labels to search input and controls
  - Implement aria-live region for result announcements
  - Add keyboard navigation (Tab, Enter, Escape)
  - Ensure 4.5:1 color contrast for all text
  - Add visible focus indicators on interactive elements
  - Test with screen reader (NVDA or VoiceOver)
  - _Requirements: 9.1, 9.2 (Accessibility)_
  - _Deliverable: WCAG AA compliant UI_

- [ ] **Task 5.2: Write unit tests for signals and components**
  - Test SearchService signal state changes (loading, error, results)
  - Test computed signals (hasResults, resultCount, isEmpty)
  - Test component inputs with fixture.componentRef.setInput()
  - Test MatchScoreBadgeComponent score formatting logic
  - Test effect() debouncing behavior with fakeAsync
  - Test signal reactivity chains (query change → effect → service → results)
  - Test @defer loading states and triggers
  - Test model() two-way binding signals
  - Achieve 80%+ code coverage
  - _Requirements: 10.1, 10.2 (Testing Strategy)_
  - _Deliverable: Comprehensive test suite with signal patterns_

- [ ] **Task 5.3: Add loading states and error handling**
  - Implement toast notifications for errors
  - Add retry button for failed searches
  - Show friendly error messages ("Search failed. Please try again.")
  - Handle empty results gracefully ("No candidates found. Try lowering match quality.")
  - Add network error detection
  - _Requirements: 6.7 (Error Handling), 8.3 (Error Scenarios)_
  - _Deliverable: Robust error handling_

- [ ] **Task 5.4: Performance optimization and bundle analysis**
  - Run Lighthouse audit (target: 90+ performance score)
  - Analyze bundle size with webpack-bundle-analyzer
  - Verify @defer blocks reduce initial bundle by 30-40%
  - Enable OnPush change detection on all components
  - Add performance budgets in angular.json (max 500kb initial)
  - _Requirements: 11.1, 11.2 (Performance Optimization)_
  - _Deliverable: Optimized production build_

- [ ] **Task 5.5: Production build and deployment setup**
  - Configure environment.prod.ts with production API URL
  - Set up GitHub Actions workflow for CI/CD
  - Build production bundle: `ng build --configuration production`
  - Deploy to Netlify/Vercel/GitHub Pages
  - Add custom domain configuration
  - Set up monitoring and error tracking (optional: Sentry)
  - _Requirements: 11.1, 11.2, 11.3 (Deployment Strategy)_
  - _Deliverable: Live production deployment_

- [ ] **Task 5.6: Backend integration with Kotlin Spring Boot**
  - Replace mock API with real Kotlin Spring Boot backend
  - Configure environment.ts with backend URL (http://localhost:8080)
  - Configure environment.prod.ts with production backend URL
  - Test /api/v1/search endpoint integration
  - Verify CORS configuration on backend
  - Add API error handling for backend-specific errors (400, 404, 500)
  - Test with real candidate data from PostgreSQL + pgvector
  - Verify embedding search results match expectations
  - _Requirements: 3.1 (API Integration), Backend connectivity_
  - _Deliverable: Working backend connection with real data_

- [ ] **Task 5.7: Add performance monitoring and budgets**
  - Implement Core Web Vitals tracking (LCP, FID, CLS)
  - Add bundle size monitoring with webpack-bundle-analyzer
  - Set up performance budgets in angular.json (max 500kb initial, 200kb per lazy chunk)
  - Monitor First Contentful Paint (target: < 1.5s)
  - Monitor Time to Interactive (target: < 3s)
  - Add Lighthouse CI to GitHub Actions
  - Create performance dashboard/report
  - _Requirements: 8.3 (Lighthouse Targets), Performance optimization_
  - _Deliverable: Performance monitoring system_

---

## 📊 Success Metrics

| Phase | Duration | Components | Tests | Bundle Impact | Key Features |
|-------|----------|------------|-------|---------------|--------------|
| **Phase 1** | 2 days | 0 | 0 | ~150kb (base) | Foundation & Services |
| **Phase 2** | 2 days | 5 | 8 | +30kb | Search UI & Flow |
| **Phase 3** | 2 days | 6 | 12 | +25kb | Cards & Animations |
| **Phase 4** | 2 days | 3 | 8 | +10kb (deferred) | Advanced Options |
| **Phase 5** | 2 days | 0 | 25 | Optimized | Testing & Deploy |
| **Total** | **10 days** | **14** | **53** | **~200kb** | **Complete MVP** |

### Updated Bundle Size Estimates (with Angular 20 + @defer)
- **Initial Bundle**: ~150kb (Angular 20 runtime + Material core)
- **Search Features**: +30kb (search components, control flow)
- **Candidate Cards**: +25kb (card components, animations)
- **Advanced Options**: +10kb (deferred loading - not in initial bundle)
- **Total Initial**: ~200kb (30% smaller than traditional Angular apps)
- **Total with Deferred**: ~215kb (loaded on-demand)

---

## 🎯 Deliverables Checklist

### By End of Phase 1:
- ✅ Branded Angular 20 project
- ✅ Pythia theme system
- ✅ Mock API running
- ✅ Core services with signals

### By End of Phase 2:
- ✅ Working search interface
- ✅ Debounced search flow
- ✅ All loading states
- ✅ Results display
- ✅ Search history (optional)

### By End of Phase 3:
- ✅ Beautiful candidate cards
- ✅ Match score visualization
- ✅ Skill badges
- ✅ Complete card layout
- ✅ Micro-interactions
- ✅ Click handling ready

### By End of Phase 4:
- ✅ Advanced options panel
- ✅ TopK and minScore controls
- ✅ @defer optimization
- ✅ Reduced initial bundle
- ✅ URL state persistence

### By End of Phase 5:
- ✅ WCAG AA accessible
- ✅ 80%+ test coverage
- ✅ Production deployed
- ✅ Performance optimized
- ✅ Backend integrated
- ✅ Performance monitoring

---

## 🚀 Quick Start Commands

```bash
# Phase 1 - Setup
ng new pythia-plus --standalone --style=scss --strict
cd pythia-plus
npm install @angular/material
ng add @angular/material --theme=custom

# Phase 2 - Components
ng generate component features/search/pages/search-page
ng generate component features/search/components/search-bar
ng generate component features/search/components/example-queries

# Phase 3 - Cards
ng generate component features/search/components/candidate-card
ng generate component features/search/components/match-score-badge
ng generate component features/search/components/skill-badge

# Phase 4 - Options
ng generate component features/search/components/search-options
ng generate component shared/components/skeleton-card

# Phase 5 - Deploy
ng build --configuration production
# Deploy to your platform of choice
```

---

## 📝 Summary of Updates

### New Tasks Added:
1. **Task 2.6**: Search history feature (optional)
2. **Task 3.6**: Candidate details preparation (future)
3. **Task 3.7**: Micro-interactions and animations
4. **Task 4.6**: URL state persistence
5. **Task 5.6**: Backend integration with Kotlin Spring Boot
6. **Task 5.7**: Performance monitoring and budgets

### Updated Tasks:
- **Task 1.1**: Changed to verification (project already exists)
- **Task 1.3**: Updated to integrate existing Pythia theme
- **Task 5.2**: Enhanced with signal-specific testing patterns

### Updated Metrics:
- **Components**: 10 → 14 (added optional features)
- **Tests**: 32 → 53 (more comprehensive coverage)
- **Bundle Size**: ~250kb → ~200kb (realistic with @defer)
- **New Features**: URL persistence, backend integration, performance monitoring

---

**Total Effort**: ~10 working days (2 weeks)
**Team Size**: 1 developer (full-stack)
**Risk Level**: Low (well-defined scope, proven patterns)
**Tech Debt**: Minimal (cutting-edge Angular 20, clean architecture)
**Quality Level**: Swiss corporate standard (WCAG AA, 90+ Lighthouse, production-ready)

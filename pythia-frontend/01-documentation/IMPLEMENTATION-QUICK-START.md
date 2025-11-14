# Pythia+ Implementation Quick Start Guide

## 🚀 Getting Started

### Prerequisites Checklist
- [x] Angular 20.3 installed
- [x] Angular Material 20.2 installed
- [x] Pythia theme (`_pythia-theme.scss`) exists
- [x] TypeScript 5.9 configured
- [ ] Node.js 18+ installed
- [ ] npm/yarn/pnpm package manager

### Project Structure
```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services
│   │   │   └── services/
│   │   │       ├── search.service.ts
│   │   │       └── notification.service.ts
│   │   ├── features/                # Feature modules
│   │   │   └── search/
│   │   │       ├── pages/
│   │   │       ├── components/
│   │   │       └── models/
│   │   ├── shared/                  # Reusable components
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── app.component.ts
│   └── styles/
│       └── themes/
│           └── _pythia-theme.scss
└── 01-documentation/
```

---

## 📋 Phase 1: Foundation (Days 1-2)

### Step 1: Verify Configuration
```bash
# Check Angular version
ng version

# Verify TypeScript strict mode
cat tsconfig.json | grep strict

# Check Material installation
npm list @angular/material
```

### Step 2: Create Core Services
```bash
# Create service directory
mkdir -p src/app/core/services

# Generate SearchService
ng generate service core/services/search --skip-tests

# Generate NotificationService
ng generate service core/services/notification --skip-tests
```

### Step 3: Define TypeScript Models
```bash
# Create models directory
mkdir -p src/app/features/search/models

# Create model files
touch src/app/features/search/models/search-params.model.ts
touch src/app/features/search/models/search-response.model.ts
touch src/app/features/search/models/candidate.model.ts
touch src/app/features/search/models/match-score.model.ts
```

### Step 4: Set Up Mock API
```bash
# Install JSON Server (for mock API)
npm install --save-dev json-server

# Create mock data
mkdir -p mock-api
touch mock-api/db.json
touch mock-api/routes.json

# Add script to package.json
# "mock-api": "json-server --watch mock-api/db.json --port 3000 --routes mock-api/routes.json"
```

### Step 5: Update App Component
```bash
# Remove Angular boilerplate
# Replace with Pythia+ branding
# Add Material toolbar with red theme
```

---

## 📋 Phase 2: Search Interface (Days 3-4)

### Step 1: Create Search Page
```bash
ng generate component features/search/pages/search-page --skip-tests
```

### Step 2: Create Search Components
```bash
ng generate component features/search/components/search-bar --skip-tests
ng generate component features/search/components/example-queries --skip-tests
ng generate component features/search/components/candidate-list --skip-tests
ng generate component shared/components/empty-state --skip-tests
ng generate component shared/components/loading-spinner --skip-tests
ng generate component shared/components/error-message --skip-tests
```

### Step 3: Implement Signal-Based Search Flow
- Add `searchQuery` signal in SearchBarComponent
- Implement `effect()` with 500ms debounce
- Connect to SearchService
- Handle loading/error/success states

---

## 📋 Phase 3: Candidate Cards (Days 5-6)

### Step 1: Create Card Components
```bash
ng generate component features/search/components/candidate-card --skip-tests
ng generate component features/search/components/match-score-badge --skip-tests
ng generate component features/search/components/skill-badge --skip-tests
```

### Step 2: Implement Card Layout
- Avatar with initials and color
- Candidate info (name, title, location)
- Skill badges (max 4 + "N more")
- Match score with color zones

### Step 3: Add Animations
- Hover effects (elevation 2 → 8)
- Fade-in transitions
- Smooth state changes

---

## 📋 Phase 4: Advanced Options (Days 7-8)

### Step 1: Create Options Components
```bash
ng generate component features/search/components/search-options --skip-tests
ng generate component shared/components/skeleton-card --skip-tests
```

### Step 2: Implement Controls
- TopK dropdown (5, 10, 20, 50)
- MinScore slider (50-100%)
- Collapsible panel

### Step 3: Add @defer Optimization
- Wrap SearchOptionsComponent in `@defer (on interaction)`
- Wrap candidate cards in `@defer (on viewport)`
- Add skeleton placeholders

---

## 📋 Phase 5: Testing & Deployment (Days 9-10)

### Step 1: Write Tests
```bash
# Generate test files
ng generate component features/search/components/candidate-card --skip-tests=false

# Run tests
ng test

# Check coverage
ng test --code-coverage
```

### Step 2: Accessibility Audit
```bash
# Install axe-core
npm install --save-dev @axe-core/cli

# Run accessibility tests
npx axe http://localhost:4200
```

### Step 3: Performance Optimization
```bash
# Build production bundle
ng build --configuration production

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Step 4: Backend Integration
```typescript
// Update environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};

// Update environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.pythia-plus.com/api/v1'
};
```

### Step 5: Deploy
```bash
# Build for production
ng build --configuration production

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist/pythia-plus

# Or deploy to Vercel
npx vercel --prod
```

---

## 🔧 Development Commands

```bash
# Start development server
ng serve

# Start with mock API
npm run mock-api & ng serve

# Run tests
ng test

# Run tests with coverage
ng test --code-coverage

# Build for production
ng build --configuration production

# Lint code
ng lint

# Format code
npx prettier --write "src/**/*.{ts,html,scss}"
```

---

## ✅ Daily Checklist

### Day 1-2: Foundation
- [ ] Verify Angular 20 configuration
- [ ] Create core services with signals
- [ ] Define TypeScript models
- [ ] Set up mock API
- [ ] Update app branding

### Day 3-4: Search
- [ ] Create search components
- [ ] Implement signal-based flow
- [ ] Add debouncing
- [ ] Handle all states

### Day 5-6: Cards
- [ ] Create card components
- [ ] Implement layouts
- [ ] Add animations
- [ ] Test responsiveness

### Day 7-8: Options
- [ ] Create options panel
- [ ] Add controls
- [ ] Implement @defer
- [ ] Test lazy loading

### Day 9-10: Polish
- [ ] Write tests (80%+ coverage)
- [ ] Run accessibility audit
- [ ] Optimize performance
- [ ] Integrate backend
- [ ] Deploy to production

---

## 🎯 Success Criteria

- ✅ All components use signals
- ✅ Native control flow (@if, @for, @switch)
- ✅ @defer for lazy loading
- ✅ WCAG AA compliant
- ✅ Lighthouse score 90+
- ✅ Bundle size < 200kb
- ✅ Test coverage > 80%
- ✅ Backend integrated
- ✅ Production deployed

---

**Ready to start? Begin with Phase 1, Task 1.1!**


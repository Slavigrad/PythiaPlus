# 📋 Employee Update Feature - Implementation Plan

> **Created**: 2025-11-15
> **Feature**: Employee Profile Update Functionality
> **Backend API Guide**: `backend-api/pythia-api-frontend-employee-update-integration-guide.md`
> **API Tests**: `backend-api/pythia-api-tests-employee-update.http`

---

## 🎯 Executive Summary

**Goal**: Enable inline editing of employee profiles with a clean, professional UX that follows Material Design principles and Angular 20 best practices.

**Approach**: Section-based inline editing with signal-driven state management, reactive forms, and optimistic UI updates.

**Timeline**: 3-4 days (14-18 tasks)

---

## 🏗️ Architecture Decisions (Frontend Master)

### ✅ What We WILL Implement

1. **Inline Section Editing**
   - Each section has its own edit mode
   - Click edit icon → section becomes editable
   - Save/Cancel actions per section
   - Only one section editable at a time

2. **Signal-Based State Management**
   - Use Angular 20 signals for reactive state
   - No BehaviorSubjects or complex RxJS
   - Computed signals for derived state

3. **Reactive Forms with Validation**
   - FormGroup per editable section
   - Frontend validation before API call
   - Clear validation error messages

4. **Material Icons (NO EMOJIS)**
   - `edit` - Edit button
   - `save` - Save button
   - `close` - Cancel button
   - `add` - Add item
   - `delete` - Remove item
   - `check_circle` - Success indicator

5. **Master Data Integration**
   - Autocomplete for technologies, skills, certifications, languages
   - Fetch from `/api/v1/master-data/*` endpoints
   - Cache in service

6. **Smart UI/UX Features**
   - Confirmation dialogs for destructive actions
   - Optimistic updates (show immediately, revert on error)
   - Loading states with disabled buttons
   - Success/Error snackbar notifications
   - Preserve scroll position during edits

### ❌ What We Will NOT Implement

1. Full-page edit mode (too clunky)
2. Emojis in UI (Material Icons only)
3. Template-driven forms (Reactive Forms only)
4. Multiple simultaneous edits (one section at a time)

---

## 🎨 UI/UX Design

### Visual Design Pattern

```
┌─────────────────────────────────────────────────────────┐
│ Basic Information                    [edit icon]        │
├─────────────────────────────────────────────────────────┤
│ Name: Lubomir Dobrovodsky                               │
│ Title: Senior Full-Stack Developer                      │
│ Email: lubomir.dobrovodsky@example.com                  │
│ Phone: +41 79 123 4567                                  │
└─────────────────────────────────────────────────────────┘

                    ↓ Click Edit Icon ↓

┌─────────────────────────────────────────────────────────┐
│ Basic Information (Editing)                             │
├─────────────────────────────────────────────────────────┤
│ [Full Name Input Field               ] ← mat-form-field│
│ [Title Input Field                   ]                  │
│ [Email Input Field                   ]                  │
│ [Phone Input Field                   ]                  │
│                                                          │
│ [SAVE Button (Primary)]  [CANCEL Button]                │
└─────────────────────────────────────────────────────────┘
```

### Interaction Flow

1. **View Mode (Default)**
   - Display read-only data
   - Edit icon visible on hover (desktop) or always (mobile)
   - Professional card-based layout

2. **Edit Mode Activation**
   - Click edit icon
   - Section background changes (subtle highlight)
   - Form fields appear with current values
   - Save/Cancel buttons appear
   - Other edit icons disabled (prevent multiple edits)

3. **Saving**
   - Validate form
   - Disable save button, show loading
   - Call API (PUT or PATCH)
   - On success: Update signal, show snackbar, exit edit mode
   - On error: Show error message, keep in edit mode

4. **Canceling**
   - Confirm if changes made
   - Reset form to original values
   - Exit edit mode

### Sections to Implement

| Section | Edit Complexity | Priority | Icons |
|---------|----------------|----------|-------|
| Basic Information | Simple (8 fields) | P0 (High) | `edit`, `save`, `close` |
| Technologies | Complex (autocomplete + array) | P1 (High) | `edit`, `add`, `delete` |
| Skills | Complex (autocomplete + array) | P1 (High) | `edit`, `add`, `delete` |
| Certifications | Complex (autocomplete + dates) | P2 (Medium) | `edit`, `add`, `delete` |
| Languages | Medium (autocomplete + dropdown) | P2 (Medium) | `edit`, `add`, `delete` |
| Project History | Complex (multi-field array) | P2 (Medium) | `edit`, `add`, `delete` |
| Education | Complex (multi-field array) | P2 (Medium) | `edit`, `add`, `delete` |

---

## 🧩 Component Structure

### New Components to Create

```
features/employee/
├── components/
│   ├── edit-sections/
│   │   ├── basic-info-edit/           ← P0
│   │   │   ├── basic-info-edit.component.ts
│   │   │   ├── basic-info-edit.component.html
│   │   │   └── basic-info-edit.component.scss
│   │   ├── technologies-edit/         ← P1
│   │   ├── skills-edit/               ← P1
│   │   ├── certifications-edit/       ← P2
│   │   ├── languages-edit/            ← P2
│   │   ├── work-experience-edit/      ← P2
│   │   └── education-edit/            ← P2
│   └── shared/
│       ├── section-edit-wrapper/      ← Reusable wrapper component
│       └── array-item-editor/         ← Reusable array item component
├── services/
│   ├── employee.service.ts            ← Extend existing
│   └── master-data.service.ts         ← NEW (fetch technologies, skills, etc.)
└── models/
    └── employee-update.model.ts       ← NEW (request DTOs)
```

### Service Extensions

**EmployeeService** (extend existing):
```typescript
// Add these methods
updateEmployee(id: number, data: EmployeeUpdateRequest): Observable<Employee>
patchEmployee(id: number, data: Partial<EmployeeUpdateRequest>): Observable<Employee>
```

**MasterDataService** (new):
```typescript
getTechnologies(): Observable<MasterTechnology[]>
getSkills(): Observable<MasterSkill[]>
getCertifications(): Observable<MasterCertification[]>
getLanguages(): Observable<MasterLanguage[]>
```

---

## ✅ Implementation Tasks

### Phase 1: Foundation (Priority 0) - Days 1-2

#### Task 1.1: Create Update Models
- [ ] Create `employee-update.model.ts` with request DTOs
- [ ] Match backend API structure exactly
- [ ] Add TypeScript strict validation

**Files**: `models/employee-update.model.ts`

#### Task 1.2: Extend Employee Service
- [ ] Add `updateEmployee()` method (PUT)
- [ ] Add `patchEmployee()` method (PATCH)
- [ ] Add error handling with proper status codes
- [ ] Add `updateLoading` and `updateError` signals

**Files**: `services/employee.service.ts`

#### Task 1.3: Create Master Data Service
- [ ] Implement `MasterDataService`
- [ ] Add methods: `getTechnologies()`, `getSkills()`, `getCertifications()`, `getLanguages()`
- [ ] Add caching (store in signals)
- [ ] Add error handling

**Files**: `services/master-data.service.ts`

#### Task 1.4: Create Section Edit Wrapper Component
- [ ] Reusable wrapper for all edit sections
- [ ] Props: `title`, `isEditing`, `loading`
- [ ] Slots: view content, edit content
- [ ] Emits: `edit`, `save`, `cancel`
- [ ] Material Icons integration

**Files**: `components/shared/section-edit-wrapper/`

#### Task 1.5: Implement Basic Info Edit
- [ ] Create `BasicInfoEditComponent`
- [ ] Reactive form with 8 fields
- [ ] Validation (email format, required fields)
- [ ] Integration with section wrapper
- [ ] Save/Cancel logic

**Files**: `components/edit-sections/basic-info-edit/`

#### Task 1.6: Integrate into Employee Profile
- [ ] Add edit mode signals to `EmployeeProfileComponent`
- [ ] Add basic info edit section
- [ ] Wire up save/cancel handlers
- [ ] Add success/error snackbar notifications
- [ ] Test with API

**Files**: `pages/employee-profile/employee-profile.component.ts`

---

### Phase 2: Array-Based Sections (Priority 1) - Days 2-3

#### Task 2.1: Create Array Item Editor Component
- [ ] Reusable component for editing array items (technologies, skills, etc.)
- [ ] Props: `item`, `masterData`, `fields`
- [ ] Emits: `save`, `delete`, `cancel`
- [ ] Material autocomplete integration

**Files**: `components/shared/array-item-editor/`

#### Task 2.2: Implement Technologies Edit
- [ ] Create `TechnologiesEditComponent`
- [ ] Fetch master data from `MasterDataService`
- [ ] Autocomplete for technology selection
- [ ] Proficiency dropdown + years input
- [ ] Add/Remove items
- [ ] Array management (remember: send complete list)
- [ ] Confirmation dialog for "Clear All"

**Files**: `components/edit-sections/technologies-edit/`

#### Task 2.3: Implement Skills Edit
- [ ] Similar to technologies
- [ ] Skills autocomplete
- [ ] Proficiency + years
- [ ] Add/Remove/Clear all

**Files**: `components/edit-sections/skills-edit/`

#### Task 2.4: Integrate Array Sections into Profile
- [ ] Add to employee profile template
- [ ] Wire up save handlers
- [ ] Test add/remove/clear functionality

**Files**: `pages/employee-profile/employee-profile.component.html`

---

### Phase 3: Advanced Sections (Priority 2) - Days 3-4

#### Task 3.1: Implement Certifications Edit
- [ ] Autocomplete for certification
- [ ] Date pickers (issue date, expiry date)
- [ ] Validation (expiry > issue)
- [ ] Visual indicators for expired certs

**Files**: `components/edit-sections/certifications-edit/`

#### Task 3.2: Implement Languages Edit
- [ ] Autocomplete for language
- [ ] Proficiency dropdown (A1-C2, Native)
- [ ] Simple array management

**Files**: `components/edit-sections/languages-edit/`

#### Task 3.3: Implement Work Experience Edit
- [ ] Multi-field form (company, role, dates, description)
- [ ] Date pickers with validation
- [ ] "Current position" checkbox (sets endDate to null)
- [ ] Add/Remove experiences

**Files**: `components/edit-sections/work-experience-edit/`

#### Task 3.4: Implement Education Edit
- [ ] Multi-field form (institution, degree, field, years)
- [ ] Year pickers (start/end)
- [ ] "Ongoing" checkbox
- [ ] Add/Remove educations

**Files**: `components/edit-sections/education-edit/`

---

### Phase 4: Polish & Testing - Day 4

#### Task 4.1: Add Confirmation Dialogs
- [ ] Create `ConfirmDialogComponent`
- [ ] Use for destructive actions (clear all, delete items)
- [ ] Material Dialog integration

**Files**: `components/shared/confirm-dialog/`

#### Task 4.2: Add Loading States
- [ ] Skeleton loaders during save
- [ ] Disabled states for buttons
- [ ] Loading spinners

#### Task 4.3: Add Snackbar Notifications
- [ ] Success notifications
- [ ] Error notifications
- [ ] Material Snackbar service

#### Task 4.4: Accessibility Audit
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels for all interactive elements
- [ ] Focus management
- [ ] Screen reader testing
- [ ] Color contrast verification

#### Task 4.5: Responsive Design
- [ ] Mobile layout for edit forms
- [ ] Touch-friendly buttons
- [ ] Stack form fields vertically on mobile

#### Task 4.6: Testing
- [ ] Unit tests for services (update methods)
- [ ] Component tests for edit sections
- [ ] Integration tests for save/cancel flows
- [ ] E2E test for complete update workflow

---

## 🎨 Design Specifications

### Colors (Pythia Theme)

```scss
// Edit mode highlight
--edit-mode-bg: var(--color-neutral-50);
--edit-mode-border: var(--color-primary-500);

// Buttons
--btn-primary: var(--color-primary-600);
--btn-secondary: var(--color-neutral-600);

// States
--success: var(--color-success-600);
--error: var(--color-error-600);
--warning: var(--color-warning-600);
```

### Typography

- Section titles: `--font-size-lg` (18px), `--font-weight-semibold` (600)
- Form labels: `--font-size-sm` (14px), `--font-weight-medium` (500)
- Input text: `--font-size-base` (16px), `--font-weight-regular` (400)

### Spacing

- Section padding: `var(--spacing-lg)` (24px)
- Form field gap: `var(--spacing-md)` (16px)
- Button gap: `var(--spacing-sm)` (8px)

### Icons (Material Icons)

| Action | Icon Name | Usage |
|--------|-----------|-------|
| Edit section | `edit` | Edit button |
| Save changes | `save` | Save button |
| Cancel edit | `close` | Cancel button |
| Add item | `add_circle` | Add to array |
| Remove item | `delete` | Remove from array |
| Confirm | `check_circle` | Success state |
| Error | `error` | Error state |
| Warning | `warning` | Warning state |

---

## 📦 Sample Code Snippets

### Employee Update Request Model

```typescript
// models/employee-update.model.ts
export interface EmployeeUpdateRequest {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability?: 'available' | 'notice' | 'unavailable';
  technologies?: TechnologyUpdateItem[];
  skills?: SkillUpdateItem[];
  certifications?: CertificationUpdateItem[];
  languages?: LanguageUpdateItem[];
  workExperiences?: WorkExperienceUpdateItem[];
  educations?: EducationUpdateItem[];
}

export interface TechnologyUpdateItem {
  technologyId: number;
  proficiency?: string;
  years?: number;
}

export interface SkillUpdateItem {
  skillId: number;
  proficiency?: string;
  years?: number;
}

export interface CertificationUpdateItem {
  certificationId: number;
  issuedOn?: string;     // ISO date format: "2023-01-15"
  expiresOn?: string;    // ISO date format: "2026-01-15"
}

export interface LanguageUpdateItem {
  languageId: number;
  level?: string;        // e.g., "A1", "A2", "B1", "B2", "C1", "C2", "native"
}

export interface WorkExperienceUpdateItem {
  company: string;
  role: string;
  startDate: string;     // ISO date format: "2020-01-01"
  endDate?: string;      // ISO date format or null for current
  description?: string;
}

export interface EducationUpdateItem {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;      // null for ongoing
}
```

### Service Methods

```typescript
// services/employee.service.ts

/**
 * Update employee (PUT - send only changed fields, preserve omitted fields)
 */
updateEmployee(id: number, data: EmployeeUpdateRequest): Observable<Employee> {
  this.loading.set(true);
  this.error.set(null);

  return this.http.put<{ message: string; employee: Employee }>(
    `${this.API_BASE_URL}/employees/${id}`,
    data
  ).pipe(
    tap(response => {
      this.employee.set(response.employee);
      this.loading.set(false);
    }),
    map(response => response.employee),
    catchError(error => {
      this.error.set(this.getErrorMessage(error));
      this.loading.set(false);
      throw error;
    })
  );
}

/**
 * Partial update employee (PATCH - same behavior as PUT in our API)
 */
patchEmployee(id: number, data: Partial<EmployeeUpdateRequest>): Observable<Employee> {
  this.loading.set(true);
  this.error.set(null);

  return this.http.patch<{ message: string; employee: Employee }>(
    `${this.API_BASE_URL}/employees/${id}`,
    data
  ).pipe(
    tap(response => {
      this.employee.set(response.employee);
      this.loading.set(false);
    }),
    map(response => response.employee),
    catchError(error => {
      this.error.set(this.getErrorMessage(error));
      this.loading.set(false);
      throw error;
    })
  );
}
```

### Master Data Service

```typescript
// services/master-data.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface MasterTechnology {
  id: number;
  name: string;
}

export interface MasterSkill {
  id: number;
  name: string;
}

export interface MasterCertification {
  id: number;
  name: string;
}

export interface MasterLanguage {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1/master-data';

  // Cached master data signals
  readonly technologies = signal<MasterTechnology[]>([]);
  readonly skills = signal<MasterSkill[]>([]);
  readonly certifications = signal<MasterCertification[]>([]);
  readonly languages = signal<MasterLanguage[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Fetch all technologies
   */
  getTechnologies(): Observable<MasterTechnology[]> {
    if (this.technologies().length > 0) {
      // Return cached data
      return new Observable(observer => {
        observer.next(this.technologies());
        observer.complete();
      });
    }

    this.loading.set(true);
    return this.http.get<MasterTechnology[]>(`${this.API_BASE_URL}/technologies`)
      .pipe(
        tap(data => {
          this.technologies.set(data);
          this.loading.set(false);
        })
      );
  }

  /**
   * Fetch all skills
   */
  getSkills(): Observable<MasterSkill[]> {
    if (this.skills().length > 0) {
      return new Observable(observer => {
        observer.next(this.skills());
        observer.complete();
      });
    }

    this.loading.set(true);
    return this.http.get<MasterSkill[]>(`${this.API_BASE_URL}/skills`)
      .pipe(
        tap(data => {
          this.skills.set(data);
          this.loading.set(false);
        })
      );
  }

  /**
   * Fetch all certifications
   */
  getCertifications(): Observable<MasterCertification[]> {
    if (this.certifications().length > 0) {
      return new Observable(observer => {
        observer.next(this.certifications());
        observer.complete();
      });
    }

    this.loading.set(true);
    return this.http.get<MasterCertification[]>(`${this.API_BASE_URL}/certifications`)
      .pipe(
        tap(data => {
          this.certifications.set(data);
          this.loading.set(false);
        })
      );
  }

  /**
   * Fetch all languages
   */
  getLanguages(): Observable<MasterLanguage[]> {
    if (this.languages().length > 0) {
      return new Observable(observer => {
        observer.next(this.languages());
        observer.complete();
      });
    }

    this.loading.set(true);
    return this.http.get<MasterLanguage[]>(`${this.API_BASE_URL}/languages`)
      .pipe(
        tap(data => {
          this.languages.set(data);
          this.loading.set(false);
        })
      );
  }
}
```

### Section Edit Wrapper Component

```typescript
// components/shared/section-edit-wrapper/section-edit-wrapper.component.ts
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-edit-wrapper',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './section-edit-wrapper.component.html',
  styleUrl: './section-edit-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionEditWrapperComponent {
  // Inputs
  readonly title = input.required<string>();
  readonly icon = input<string>(''); // Material icon name for section
  readonly isEditing = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly canEdit = input<boolean>(true);

  // Outputs
  readonly edit = output<void>();
  readonly save = output<void>();
  readonly cancel = output<void>();

  protected onEdit(): void {
    this.edit.emit();
  }

  protected onSave(): void {
    this.save.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
```

```html
<!-- components/shared/section-edit-wrapper/section-edit-wrapper.component.html -->
<mat-card [class.editing-mode]="isEditing()">
  <mat-card-header>
    <mat-card-title>
      @if (icon()) {
        <mat-icon class="section-icon">{{ icon() }}</mat-icon>
      }
      {{ title() }}
      @if (isEditing()) {
        <span class="editing-label">(Editing)</span>
      }
    </mat-card-title>
    @if (!isEditing() && canEdit()) {
      <button
        mat-icon-button
        (click)="onEdit()"
        aria-label="Edit {{ title() }}">
        <mat-icon>edit</mat-icon>
      </button>
    }
  </mat-card-header>

  <mat-card-content>
    @if (isEditing()) {
      <ng-content select="[editMode]"></ng-content>
    } @else {
      <ng-content select="[viewMode]"></ng-content>
    }
  </mat-card-content>

  @if (isEditing()) {
    <mat-card-actions align="end">
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="loading()">
        <mat-icon>save</mat-icon>
        {{ loading() ? 'Saving...' : 'Save' }}
      </button>
      <button
        mat-button
        (click)="onCancel()"
        [disabled]="loading()">
        <mat-icon>close</mat-icon>
        Cancel
      </button>
    </mat-card-actions>
  }
</mat-card>
```

```scss
// components/shared/section-edit-wrapper/section-edit-wrapper.component.scss
:host {
  display: block;
  margin-bottom: var(--spacing-lg);
}

mat-card {
  transition: all 0.2s ease-in-out;

  &.editing-mode {
    background-color: var(--color-neutral-50);
    border-left: 4px solid var(--color-primary-500);
  }
}

mat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

mat-card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);

  .section-icon {
    color: var(--color-primary-600);
  }

  .editing-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-neutral-600);
  }
}

mat-card-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}
```

### Basic Info Edit Component Example

```typescript
// components/edit-sections/basic-info-edit/basic-info-edit.component.ts
import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../models/employee.model';
import { EmployeeUpdateRequest } from '../../../models/employee-update.model';

@Component({
  selector: 'app-basic-info-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './basic-info-edit.component.html',
  styleUrl: './basic-info-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicInfoEditComponent {
  // Inputs
  readonly employee = input.required<Employee>();
  readonly isEditing = input<boolean>(false);

  // Outputs
  readonly save = output<EmployeeUpdateRequest>();
  readonly cancel = output<void>();

  // Form
  protected form: FormGroup;

  // Availability options
  protected readonly availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'notice', label: 'Notice Period' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.maxLength(50)],
      location: ['', Validators.maxLength(255)],
      department: ['', Validators.maxLength(100)],
      seniority: ['', Validators.maxLength(50)],
      yearsExperience: [0, [Validators.min(0), Validators.max(50)]],
      availability: ['available', Validators.required]
    });

    // Reset form when employee changes
    effect(() => {
      if (this.employee()) {
        this.resetForm();
      }
    });
  }

  /**
   * Reset form to current employee values
   */
  protected resetForm(): void {
    const emp = this.employee();
    this.form.patchValue({
      fullName: emp.fullName,
      title: emp.title,
      email: emp.email,
      phone: emp.phone,
      location: emp.location,
      department: emp.department,
      seniority: emp.seniority,
      yearsExperience: emp.yearsExperience,
      availability: emp.availability
    });
  }

  /**
   * Handle save
   */
  protected onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  /**
   * Handle cancel
   */
  protected onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }
}
```

---

## 📊 Implementation Timeline

| Phase | Days | Tasks | Priority |
|-------|------|-------|----------|
| **Phase 1: Foundation** | 1-2 | 6 tasks | P0 |
| **Phase 2: Array Sections** | 2-3 | 4 tasks | P1 |
| **Phase 3: Advanced Sections** | 3-4 | 4 tasks | P2 |
| **Phase 4: Polish & Testing** | 4 | 6 tasks | P2 |

**Total**: 3-4 days, 20 tasks

---

## 🎯 Success Criteria

- ✅ All 7 sections are editable
- ✅ Form validation works correctly
- ✅ API integration successful (PUT/PATCH)
- ✅ Loading states and error handling
- ✅ Snackbar notifications
- ✅ Confirmation dialogs for destructive actions
- ✅ Accessibility (WCAG AA compliant)
- ✅ Mobile responsive
- ✅ Material Icons only (no emojis)
- ✅ Unit tests pass (80%+ coverage)

---

## 🚨 Important Backend API Notes

### Array Field Update Behavior

**CRITICAL**: When updating array fields (technologies, skills, certifications, languages, workExperiences, educations), the backend uses a **DELETE ALL + INSERT NEW** strategy.

| Action | Request | Backend Behavior |
|--------|---------|------------------|
| **Add/Update items** | `{ technologies: [{ technologyId: 1, ... }] }` | DELETE all existing + INSERT new |
| **Clear all items** | `{ technologies: [] }` | DELETE all existing |
| **No change** | Omit field entirely | No change to existing data |

**Example**:
```typescript
// ✅ CORRECT: Update technologies (replaces all)
updateEmployee(1, {
  technologies: [
    { technologyId: 1, proficiency: 'advanced', years: 5 }
  ]
});
// Result: Old technologies deleted, new one inserted

// ✅ CORRECT: Clear all technologies
updateEmployee(1, {
  technologies: []
});
// Result: All technologies deleted

// ✅ CORRECT: Don't touch technologies
updateEmployee(1, {
  fullName: 'New Name'
  // technologies field omitted
});
// Result: Technologies unchanged

// ❌ WRONG: Trying to "add" without including existing
updateEmployee(1, {
  technologies: [
    { technologyId: 5, proficiency: 'beginner', years: 1 }
  ]
});
// Result: ALL old technologies deleted, only new one remains!
```

**Frontend Implementation Strategy**:
When updating array fields, always fetch the current employee data and merge with new items:

```typescript
updateTechnologies(newTechnology: TechnologyUpdateItem) {
  // Get current technologies from employee data
  const currentTechnologies = this.employee().technologies.map(t => ({
    technologyId: t.id,
    proficiency: t.proficiency,
    years: t.years
  }));

  // Add new technology to the list
  const updatedTechnologies = [...currentTechnologies, newTechnology];

  // Send complete list
  this.employeeService.updateEmployee(this.employeeId, {
    technologies: updatedTechnologies
  }).subscribe(...);
}
```

---

## 🚀 Next Steps

1. **Review and approve this plan**
2. **Start with Phase 1, Task 1.1** (Create Update Models)
3. **Test each phase before moving to next**
4. **Iterate based on feedback**

---

## 📚 Related Documentation

- **Backend API Guide**: `backend-api/pythia-api-frontend-employee-update-integration-guide.md`
- **API Test Cases**: `backend-api/pythia-api-tests-employee-update.http`
- **Angular 20 Reference**: `01-documentation/ANGULAR-20-QUICK-REFERENCE.md`
- **CLAUDE.md**: Project conventions and best practices

---

**Document Status**: ✅ Ready for Implementation
**Last Updated**: 2025-11-15
**Quality Standard**: 🇨🇭 Swiss corporate grade

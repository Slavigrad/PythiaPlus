# 🚀 Employee CREATE Endpoint - Frontend Integration Guide

> **✅ Angular 20+ Compliant**: This guide follows Angular 20+ best practices including:
> - Signals for state management
> - `inject()` function instead of constructor injection
> - `@if/@for` control flow instead of `*ngIf/*ngFor`
> - OnPush change detection
> - Standalone components
> - Pythia theme system
>
> **Reference**: [Angular AI Development Guide](https://angular.dev/ai/develop-with-ai) | [CLAUDE.md](../../../03-frontend-guidelines/CLAUDE.md)

## 📋 Table of Contents
- [API Overview](#api-overview)
- [TypeScript Models](#typescript-models)
- [Angular Service Implementation](#angular-service-implementation)
- [Form Validation](#form-validation)
- [Error Handling](#error-handling)
- [Multi-Step Form Example](#multi-step-form-example)
- [Testing](#testing)

---

## 🎯 API Overview

### Endpoint
```
POST /api/v1/employees
```

### Request Headers
```
Content-Type: application/json
```

### Response Status Codes
- **201 Created** - Employee successfully created
- **400 Bad Request** - Validation error (missing required fields, invalid format, etc.)
- **404 Not Found** - Invalid master data reference (technology, skill, certification, language)
- **409 Conflict** - Duplicate email address
- **500 Internal Server Error** - Server error

---

## 📦 TypeScript Models

### Request Model

```typescript
// employee-creation.model.ts

export interface EmployeeCreationRequest {
  // Required fields
  fullName: string;
  email: string;

  // Optional basic fields
  title?: string;
  phone?: string;
  city?: string;
  country?: string;
  profilePicture?: string;
  summary?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability?: 'available' | 'notice' | 'unavailable';

  // Optional related data
  technologies?: TechnologyCreationItem[];
  skills?: SkillCreationItem[];
  certifications?: CertificationCreationItem[];
  languages?: LanguageCreationItem[];
  workExperiences?: WorkExperienceCreationItem[];
  educations?: EducationCreationItem[];
}

export interface TechnologyCreationItem {
  technologyId: number;
  proficiency?: string;
  years?: number;
}

export interface SkillCreationItem {
  skillId: number;
  proficiency?: string;
  years?: number;
}

export interface CertificationCreationItem {
  certificationId: number;
  issuedOn?: string; // ISO date format: "YYYY-MM-DD"
  expiresOn?: string; // ISO date format: "YYYY-MM-DD"
}

export interface LanguageCreationItem {
  languageId: number;
  level?: string;
}

export interface WorkExperienceCreationItem {
  company: string;
  role?: string;
  startDate?: string; // ISO date format: "YYYY-MM-DD"
  endDate?: string; // ISO date format: "YYYY-MM-DD"
  description?: string;
}

export interface EducationCreationItem {
  institution: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}
```

### Response Model

```typescript
// employee-creation-response.model.ts

export interface EmployeeCreationResponse {
  id: number;
  message: string;
  employee: EmployeeDetail;
}

export interface EmployeeDetail {
  id: number;
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string; // Combined "city, country"
  profilePicture?: string;
  summary?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability: string;
  technologies: TechnologyDetail[];
  skills: SkillDetail[];
  certifications: CertificationDetail[];
  languages: LanguageDetail[];
  workExperiences: WorkExperienceDetail[];
  educations: EducationDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TechnologyDetail {
  id: number;
  name: string;
  proficiency?: string;
  years?: number;
}

export interface SkillDetail {
  id: number;
  name: string;
  proficiency?: string;
  years?: number;
}

export interface CertificationDetail {
  id: number;
  name: string;
  issuedOn?: string;
  expiresOn?: string;
}

export interface LanguageDetail {
  id: number;
  name: string;
  level?: string;
}

export interface WorkExperienceDetail {
  id: number;
  company: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface EducationDetail {
  id: number;
  institution: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}
```

---

## 🔧 Angular Service Implementation

> **Note**: This implementation follows Angular 20+ best practices with signals and `inject()` function.
> See [Angular AI Development Guide](https://angular.dev/ai/develop-with-ai) for official recommendations.

```typescript
// employee.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EmployeeCreationRequest, EmployeeCreationResponse } from './models/employee-creation.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // ✅ Use inject() function instead of constructor injection (Angular 20+ best practice)
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/employees';

  // ✅ Use signals for reactive state management
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastCreatedEmployee = signal<EmployeeCreationResponse | null>(null);

  /**
   * Create a new employee
   * @param request Employee creation request
   * @returns Observable of creation response
   */
  createEmployee(request: EmployeeCreationRequest): Observable<EmployeeCreationResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<EmployeeCreationResponse>(this.apiUrl, request).pipe(
      tap(response => {
        this.lastCreatedEmployee.set(response);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Validation error: Please check your input';
          break;
        case 404:
          errorMessage = 'Invalid reference: Technology, skill, certification, or language not found';
          break;
        case 409:
          errorMessage = 'Email already exists: Please use a different email address';
          break;
        case 500:
          errorMessage = 'Server error: Please try again later';
          break;
        default:
          errorMessage = `Server returned code ${error.status}`;
      }
    }

    this.error.set(errorMessage);
    console.error('Employee creation error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
```

---

## ✅ Form Validation

> **Note**: Angular 20+ recommends Reactive Forms over Template-driven forms.
> This example uses signals for state management with OnPush change detection.

### Component with Signal-Based Form

```typescript
// employee-create.component.ts

import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './services/employee.service';
import { EmployeeCreationRequest } from './models/employee-creation.model';

@Component({
  selector: 'app-employee-create',
  imports: [ReactiveFormsModule],  // ✅ Direct imports (standalone component)
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅ ALWAYS use OnPush
})
export class EmployeeCreateComponent {
  // ✅ Use inject() function instead of constructor injection
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  // ✅ Use signals for component state
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Reactive form (still recommended for complex forms)
  protected readonly employeeForm: FormGroup;

  constructor() {
    this.employeeForm = this.fb.group({
      // Required fields
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],

      // Optional fields
      title: [''],
      phone: [''],
      city: [''],
      country: [''],
      profilePicture: [''],
      summary: [''],
      department: [''],
      seniority: [''],
      yearsExperience: [null, [Validators.min(0)]],
      availability: ['available']
    });
  }

  // ✅ Computed signals for form validation state
  protected readonly isFormValid = computed(() => this.employeeForm.valid);
  protected readonly canSubmit = computed(() =>
    this.isFormValid() && !this.isSubmitting()
  );

  // Form field getters for template access
  get fullName() { return this.employeeForm.get('fullName'); }
  get email() { return this.employeeForm.get('email'); }

  /**
   * Submit the form
   */
  protected onSubmit(): void {
    if (!this.canSubmit()) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: EmployeeCreationRequest = this.buildRequest();

    this.employeeService.createEmployee(request).subscribe({
      next: (response) => {
        console.log('Employee created successfully:', response);
        this.router.navigate(['/employees', response.id]);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  /**
   * Build request from form values
   */
  private buildRequest(): EmployeeCreationRequest {
    const formValue = this.employeeForm.value;
    return {
      fullName: formValue.fullName,
      email: formValue.email,
      title: formValue.title || undefined,
      phone: formValue.phone || undefined,
      city: formValue.city || undefined,
      country: formValue.country || undefined,
      profilePicture: formValue.profilePicture || undefined,
      summary: formValue.summary || undefined,
      department: formValue.department || undefined,
      seniority: formValue.seniority || undefined,
      yearsExperience: formValue.yearsExperience || undefined,
      availability: formValue.availability || undefined
    };
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
```

### Custom Validators

```typescript
// custom-validators.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validate that start date is before end date
   */
  static dateRange(startDateField: string, endDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateField)?.value;
      const endDate = control.get(endDateField)?.value;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { dateRange: true };
      }

      return null;
    };
  }

  /**
   * Validate that years is non-negative
   */
  static nonNegative(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value < 0) {
        return { nonNegative: true };
      }
      return null;
    };
  }
}
```

---

## 🚨 Error Handling

### Template with Error Display

> **Note**: Use Angular 20+ control flow syntax (`@if`) instead of `*ngIf`.

```html
<!-- employee-create.component.html -->

<form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
  <!-- Error message display -->
  @if (errorMessage()) {
    <div class="error-banner" role="alert" aria-live="polite">
      {{ errorMessage() }}
    </div>
  }

  <!-- Form fields -->
  <div class="form-field">
    <label for="fullName">Full Name *</label>
    <input
      id="fullName"
      type="text"
      formControlName="fullName"
      [attr.aria-invalid]="fullName?.invalid && fullName?.touched"
      [attr.aria-describedby]="fullName?.invalid && fullName?.touched ? 'fullName-error' : null"
    />
    @if (fullName?.invalid && fullName?.touched) {
      <span id="fullName-error" class="error-message">
        @if (fullName?.errors?.['required']) {
          Full name is required
        }
        @if (fullName?.errors?.['minlength']) {
          Full name must be at least 2 characters
        }
      </span>
    }
  </div>

  <div class="form-field">
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"
      formControlName="email"
      [attr.aria-invalid]="email?.invalid && email?.touched"
      [attr.aria-describedby]="email?.invalid && email?.touched ? 'email-error' : null"
    />
    @if (email?.invalid && email?.touched) {
      <span id="email-error" class="error-message">
        @if (email?.errors?.['required']) {
          Email is required
        }
        @if (email?.errors?.['email']) {
          Please enter a valid email address
        }
      </span>
    }
  </div>

  <!-- Submit button -->
  <button
    type="submit"
    [disabled]="!canSubmit()"
    [attr.aria-busy]="isSubmitting()"
  >
    @if (isSubmitting()) {
      Creating...
    } @else {
      Create Employee
    }
  </button>
</form>
```

### Styling with Pythia Theme

```scss
// employee-create.component.scss

:host {
  display: block;
  padding: var(--spacing-lg);
}

.error-banner {
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-500);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  color: var(--color-error-700);
}

.form-field {
  margin-bottom: var(--spacing-md);

  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: var(--font-weight-medium);
  }

  input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-sm);

    &:focus {
      outline: 2px solid var(--color-primary-500);
      outline-offset: 2px;
    }

    &[aria-invalid="true"] {
      border-color: var(--color-error-500);
    }
  }
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--color-error-600);
  font-size: var(--font-size-sm);
}

button {
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-600);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}
```

---

## 📝 Multi-Step Form Example

See the full implementation plan in `01-documentation/10-employee-create/IMPLEMENTATION_PLAN.md` for a complete multi-step form design with:

1. **Step 1: Basic Information** - Name, email, title, contact
2. **Step 2: Professional Details** - Department, seniority, experience, availability
3. **Step 3: Technologies & Skills** - Select from master data catalogs
4. **Step 4: Certifications & Languages** - Add certifications and language proficiency
5. **Step 5: Work Experience** - Add work history
6. **Step 6: Education** - Add educational background
7. **Step 7: Review & Submit** - Review all data before submission

---

## 🧪 Testing

> **Note**: Angular 20+ testing with signals - test signal reactivity and state changes.

### Service Unit Test

```typescript
// employee.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { EmployeeCreationRequest } from './models/employee-creation.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create employee successfully', () => {
    const mockRequest: EmployeeCreationRequest = {
      fullName: 'Test User',
      email: 'test@example.com'
    };

    const mockResponse = {
      id: 1,
      message: 'Employee created successfully',
      employee: {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        availability: 'available',
        technologies: [],
        skills: [],
        certifications: [],
        languages: [],
        workExperiences: [],
        educations: []
      }
    };

    service.createEmployee(mockRequest).subscribe(response => {
      expect(response.id).toBe(1);
      expect(response.message).toBe('Employee created successfully');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/employees');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // ✅ Test signal state changes
  it('should update loading signal during creation', () => {
    const mockRequest: EmployeeCreationRequest = {
      fullName: 'Test User',
      email: 'test@example.com'
    };

    expect(service.loading()).toBe(false);

    service.createEmployee(mockRequest).subscribe();
    expect(service.loading()).toBe(true);

    const req = httpMock.expectOne('http://localhost:8080/api/v1/employees');
    req.flush({ id: 1, message: 'Success', employee: {} });

    expect(service.loading()).toBe(false);
  });

  // ✅ Test error handling
  it('should set error signal on failure', () => {
    const mockRequest: EmployeeCreationRequest = {
      fullName: 'Test User',
      email: 'test@example.com'
    };

    service.createEmployee(mockRequest).subscribe({
      error: () => {
        expect(service.error()).toBeTruthy();
        expect(service.loading()).toBe(false);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/employees');
    req.error(new ProgressEvent('Network error'), { status: 500 });
  });
});
```

### Component Unit Test

```typescript
// employee-create.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeCreateComponent } from './employee-create.component';
import { EmployeeService } from './services/employee.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmployeeCreateComponent', () => {
  let component: EmployeeCreateComponent;
  let fixture: ComponentFixture<EmployeeCreateComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['createEmployee']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EmployeeCreateComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(EmployeeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Test form validation
  it('should invalidate form when required fields are empty', () => {
    expect(component.isFormValid()).toBe(false);
    expect(component.canSubmit()).toBe(false);
  });

  it('should validate form when required fields are filled', () => {
    component.employeeForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com'
    });

    expect(component.isFormValid()).toBe(true);
    expect(component.canSubmit()).toBe(true);
  });

  // ✅ Test submission
  it('should call service and navigate on successful submission', () => {
    const mockResponse = {
      id: 1,
      message: 'Success',
      employee: { id: 1, fullName: 'John Doe', email: 'john@example.com' }
    };

    mockEmployeeService.createEmployee.and.returnValue(of(mockResponse));

    component.employeeForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com'
    });

    component.onSubmit();

    expect(mockEmployeeService.createEmployee).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees', 1]);
  });

  // ✅ Test error handling
  it('should set error message on submission failure', () => {
    mockEmployeeService.createEmployee.and.returnValue(
      throwError(() => new Error('Email already exists'))
    );

    component.employeeForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Email already exists');
    expect(component.isSubmitting()).toBe(false);
  });
});
```

---

## 🎨 UI/UX Recommendations

1. **Progressive Disclosure**: Use a multi-step form to avoid overwhelming users
2. **Auto-save**: Save draft data to localStorage to prevent data loss
3. **Master Data Dropdowns**: Fetch technologies, skills, certifications, and languages from their respective endpoints
4. **Validation Feedback**: Show real-time validation errors as users type
5. **Success Feedback**: Show success message and redirect to employee detail page
6. **Loading States**: Disable submit button and show spinner during submission
7. **Error Recovery**: Allow users to fix errors without losing entered data

---

## 📚 Related Documentation

- **Implementation Plan**: `01-documentation/10-employee-create/IMPLEMENTATION_PLAN.md`
- **Quick Reference**: `01-documentation/10-employee-create/QUICK_REFERENCE.md`
- **Task Breakdown**: `01-documentation/10-employee-create/TASK_BREAKDOWN.md`
- **HTTP Tests**: `02-api-testing/pythia-api-rest-endpoints-http-test/employee-create/pythia-api-tests-employee-create.http`

---

**Ready to build the "Add New Profile" page? Start with the Angular service and basic form!** 🚀


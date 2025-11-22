# 📝 Frontend Developer Guide: Employee Update Integration

## 🎯 Overview

This guide explains how to integrate the **Employee Update API** into your Angular frontend application. The API supports both **full updates (PUT)** and **partial updates (PATCH)** for employee profiles.

---

## 📋 Table of Contents

1. [API Endpoints](#api-endpoints)
2. [UI/UX Design Recommendations](#uiux-design-recommendations)
3. [Request/Response Models](#requestresponse-models)
4. [Implementation Examples](#implementation-examples)
5. [Error Handling](#error-handling)
6. [Validation Rules](#validation-rules)
7. [Best Practices](#best-practices)

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints

#### 1. **PUT** `/employees/{id}` - Full Update
- **Purpose:** Update employee with provided fields (omitted fields are preserved)
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Response:** Updated employee details

#### 2. **PATCH** `/employees/{id}` - Partial Update
- **Purpose:** Same as PUT (both preserve omitted fields)
- **Method:** `PATCH`
- **Content-Type:** `application/json`
- **Response:** Updated employee details

> **Note:** Both PUT and PATCH behave identically - omitted fields preserve existing values.

---

## 🎨 UI/UX Design Recommendations

### 1. **Edit Icons & Buttons**

Add edit icons to each section of the employee profile to indicate updateability:

```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Basic Information                            [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ Name: Lubomir Dobrovodsky                                   │
│ Title: Senior Full-Stack Developer                          │
│ Email: lubomir.dobrovodsky@example.com                      │
│ Phone: +41 79 123 4567                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 💻 Technologies                                 [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ Kotlin         8.5y  ADVANCED                               │
│ React          5.0y  ADVANCED                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🔧 Skills                                       [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ API Design     10y   ADVANCED                               │
│ System Design  6y    ADVANCED                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🎓 Certifications                               [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ AWS Certified Developer - Associate                         │
│ Issued: Mar 2022  |  Expires: Mar 2025  |  EXPIRED          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🌍 Languages                                    [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ English - Native                                            │
│ German - C1                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 💼 Project History                              [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ Senior Java Developer                                       │
│ Mimacom AG  |  Jan 2022 - Present  |  3y 10m                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🎓 Education                                    [✏️ Edit]   │
├─────────────────────────────────────────────────────────────┤
│ MSc Computer Science                                        │
│ Comenius University  |  2012 - 2017  |  5 years             │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Icon Recommendations**

Use these Material Icons or similar:

| Section | Icon | Material Icon Name |
|---------|------|-------------------|
| Basic Info | ✏️ | `edit` |
| Technologies | ⚙️ | `settings` or `edit` |
| Skills | 🔧 | `build` or `edit` |
| Certifications | 🏆 | `workspace_premium` or `edit` |
| Languages | 🌍 | `language` or `edit` |
| Work Experience | 💼 | `work` or `edit` |
| Education | 🎓 | `school` or `edit` |

### 3. **Edit Mode UI States**

**View Mode:**
```html
<div class="section-header">
  <h3>Technologies</h3>
  <button mat-icon-button (click)="enableEditMode('technologies')">
    <mat-icon>edit</mat-icon>
  </button>
</div>
```

**Edit Mode:**
```html
<div class="section-header">
  <h3>Technologies (Editing)</h3>
  <button mat-raised-button color="primary" (click)="saveChanges()">
    <mat-icon>save</mat-icon> Save
  </button>
  <button mat-button (click)="cancelEdit()">
    <mat-icon>cancel</mat-icon> Cancel
  </button>
</div>
```

### 4. **Visual Indicators**

- **Editable sections:** Show edit icon on hover
- **Edit mode:** Highlight section with border/background color
- **Unsaved changes:** Show warning indicator
- **Saving:** Show loading spinner
- **Success:** Show success toast/snackbar
- **Error:** Show error message inline

---

## 📦 Request/Response Models

### Request Model (TypeScript)

```typescript
export interface EmployeeUpdateRequest {
  // Basic Information
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability?: 'available' | 'notice' | 'unavailable';

  // Technologies
  technologies?: TechnologyUpdate[];

  // Skills
  skills?: SkillUpdate[];

  // Certifications
  certifications?: CertificationUpdate[];

  // Languages
  languages?: LanguageUpdate[];

  // Work Experiences
  workExperiences?: WorkExperienceUpdate[];

  // Educations
  educations?: EducationUpdate[];
}

export interface TechnologyUpdate {
  technologyId: number;
  proficiency?: string;  // e.g., "beginner", "intermediate", "advanced", "expert"
  years?: number;
}

export interface SkillUpdate {
  skillId: number;
  proficiency?: string;
  years?: number;
}

export interface CertificationUpdate {
  certificationId: number;
  issuedOn?: string;     // ISO date format: "2023-01-15"
  expiresOn?: string;    // ISO date format: "2026-01-15"
}

export interface LanguageUpdate {
  languageId: number;
  level?: string;        // e.g., "A1", "A2", "B1", "B2", "C1", "C2", "native"
}

export interface WorkExperienceUpdate {
  company: string;
  role: string;
  startDate: string;     // ISO date format: "2020-01-01"
  endDate?: string;      // ISO date format or null for current
  description?: string;
}

export interface EducationUpdate {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;      // null for ongoing
}
```

### Response Model (TypeScript)

```typescript
export interface EmployeeUpdateResponse {
  message: string;
  employee: EmployeeDetail;
}

export interface EmployeeDetail {
  id: number;
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  department?: string;
  seniority?: string;
  yearsExperience?: number;
  availability: string;
  technologies: Technology[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  workExperiences: WorkExperience[];
  educations: Education[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 💻 Implementation Examples

### 1. **Angular Service**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  updateEmployee(
    employeeId: number,
    updates: EmployeeUpdateRequest
  ): Observable<EmployeeUpdateResponse> {
    return this.http.put<EmployeeUpdateResponse>(
      `${this.apiUrl}/employees/${employeeId}`,
      updates
    );
  }

  patchEmployee(
    employeeId: number,
    updates: EmployeeUpdateRequest
  ): Observable<EmployeeUpdateResponse> {
    return this.http.patch<EmployeeUpdateResponse>(
      `${this.apiUrl}/employees/${employeeId}`,
      updates
    );
  }
}
```


### 2. **Component Example: Update Basic Information**

```typescript
import { Component } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html'
})
export class EmployeeProfileComponent {
  employeeId = 1;
  isEditingBasicInfo = false;
  isSaving = false;

  basicInfoForm = {
    fullName: 'Lubomir Dobrovodsky',
    title: 'Senior Full-Stack Developer',
    email: 'lubomir.dobrovodsky@example.com',
    phone: '+41 79 123 4567',
    location: 'Zurich, Switzerland',
    department: 'Engineering',
    seniority: 'Senior',
    yearsExperience: 10,
    availability: 'available' as const
  };

  constructor(private employeeService: EmployeeService) {}

  enableEditMode() {
    this.isEditingBasicInfo = true;
  }

  cancelEdit() {
    this.isEditingBasicInfo = false;
    // Reload original data
  }

  saveBasicInfo() {
    this.isSaving = true;

    this.employeeService.updateEmployee(this.employeeId, {
      fullName: this.basicInfoForm.fullName,
      title: this.basicInfoForm.title,
      email: this.basicInfoForm.email,
      phone: this.basicInfoForm.phone,
      location: this.basicInfoForm.location,
      department: this.basicInfoForm.department,
      seniority: this.basicInfoForm.seniority,
      yearsExperience: this.basicInfoForm.yearsExperience,
      availability: this.basicInfoForm.availability
    }).subscribe({
      next: (response) => {
        console.log('Update successful:', response.message);
        this.isEditingBasicInfo = false;
        this.isSaving = false;
        // Show success toast
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.isSaving = false;
        // Show error message
      }
    });
  }
}
```

### 3. **Component Example: Update Technologies**

```typescript
updateTechnologies() {
  this.isSaving = true;

  const technologiesUpdate: TechnologyUpdate[] = [
    { technologyId: 1, proficiency: 'advanced', years: 8.5 },
    { technologyId: 5, proficiency: 'advanced', years: 5.0 },
    { technologyId: 10, proficiency: 'intermediate', years: 3.0 }
  ];

  this.employeeService.updateEmployee(this.employeeId, {
    technologies: technologiesUpdate
  }).subscribe({
    next: (response) => {
      console.log('Technologies updated:', response.employee.technologies);
      this.isSaving = false;
      // Update UI with new data
    },
    error: (error) => {
      console.error('Failed to update technologies:', error);
      this.isSaving = false;
    }
  });
}
```

### 4. **Component Example: Clear Technologies**

```typescript
clearTechnologies() {
  if (!confirm('Are you sure you want to remove all technologies?')) {
    return;
  }

  this.employeeService.updateEmployee(this.employeeId, {
    technologies: []  // Empty array = delete all
  }).subscribe({
    next: (response) => {
      console.log('All technologies removed');
      // Update UI
    },
    error: (error) => {
      console.error('Failed to clear technologies:', error);
    }
  });
}
```

### 5. **Component Example: Update Work Experience**

```typescript
updateWorkExperience() {
  const workExperiences: WorkExperienceUpdate[] = [
    {
      company: 'Mimacom AG',
      role: 'Senior Java Developer',
      startDate: '2022-01-01',
      endDate: null,  // Current position
      description: 'Spring Boot microservices, modernization of legacy systems.'
    },
    {
      company: 'Tech Corp',
      role: 'Full-Stack Developer',
      startDate: '2020-01-01',
      endDate: '2021-12-31',
      description: 'React and Node.js development.'
    }
  ];

  this.employeeService.updateEmployee(this.employeeId, {
    workExperiences: workExperiences
  }).subscribe({
    next: (response) => {
      console.log('Work experience updated');
      // Update UI
    },
    error: (error) => {
      console.error('Failed to update work experience:', error);
    }
  });
}
```

### 6. **Component Example: Partial Update (Only Title)**

```typescript
updateTitle(newTitle: string) {
  this.employeeService.patchEmployee(this.employeeId, {
    title: newTitle
  }).subscribe({
    next: (response) => {
      console.log('Title updated to:', response.employee.title);
      // All other fields remain unchanged
    },
    error: (error) => {
      console.error('Failed to update title:', error);
    }
  });
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Meaning | Action |
|-------------|---------|--------|
| `200 OK` | Update successful | Show success message, update UI |
| `400 Bad Request` | Invalid data (validation error) | Show validation errors inline |
| `404 Not Found` | Employee not found | Show error message |
| `409 Conflict` | Email already exists | Show error: "Email already in use" |
| `500 Internal Server Error` | Server error | Show generic error, retry option |


### Error Response Format

```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
```

### Error Handling Example

```typescript
saveChanges() {
  this.employeeService.updateEmployee(this.employeeId, this.formData)
    .subscribe({
      next: (response) => {
        this.showSuccessToast('Employee updated successfully');
        this.refreshEmployeeData();
      },
      error: (error) => {
        if (error.status === 400) {
          this.showError('Invalid data. Please check your inputs.');
        } else if (error.status === 404) {
          this.showError('Employee not found.');
        } else if (error.status === 409) {
          this.showError('Email address already in use.');
        } else {
          this.showError('Failed to update employee. Please try again.');
        }
      }
    });
}
```

---

## ✅ Validation Rules

### Basic Information

| Field | Required | Validation |
|-------|----------|------------|
| `fullName` | No | Max 255 characters |
| `title` | No | Max 255 characters |
| `email` | No | Valid email format, unique |
| `phone` | No | Max 50 characters |
| `location` | No | Max 255 characters |
| `department` | No | Max 100 characters |
| `seniority` | No | Max 50 characters |
| `yearsExperience` | No | Positive number |
| `availability` | No | One of: `available`, `notice`, `unavailable` |

### Technologies, Skills, Certifications, Languages

| Field | Required | Validation |
|-------|----------|------------|
| `technologyId` | Yes | Must exist in `md_technologies` table |
| `skillId` | Yes | Must exist in `skills` table |
| `certificationId` | Yes | Must exist in `certifications` table |
| `languageId` | Yes | Must exist in `languages` table |
| `proficiency` | No | Max 20 characters |
| `years` | No | Positive number, max 99.9 |
| `level` | No | Max 20 characters |

### Work Experience

| Field | Required | Validation |
|-------|----------|------------|
| `company` | Yes | Max 255 characters |
| `role` | Yes | Max 255 characters |
| `startDate` | Yes | Valid ISO date (YYYY-MM-DD) |
| `endDate` | No | Valid ISO date, must be after startDate |
| `description` | No | Text |

### Education

| Field | Required | Validation |
|-------|----------|------------|
| `institution` | Yes | Max 255 characters |
| `degree` | Yes | Max 255 characters |
| `field` | Yes | Max 255 characters |
| `startYear` | Yes | Valid year (e.g., 2012) |
| `endYear` | No | Valid year, must be >= startYear |

---

## 🎯 Best Practices

### 1. **Update Strategy**

**✅ DO:**
- Update only the sections that changed
- Send only modified fields to minimize payload
- Use PATCH for semantic clarity when doing partial updates
- Validate data on frontend before sending

**❌ DON'T:**
- Send entire employee object if only one field changed
- Update without user confirmation for destructive actions (e.g., clearing all technologies)
- Ignore validation errors from backend

### 2. **User Experience**

**✅ DO:**
- Show loading indicators during save
- Provide clear success/error feedback
- Allow users to cancel edits
- Warn about unsaved changes before navigation
- Disable save button while saving
- Show which fields are required

**❌ DON'T:**
- Navigate away without saving changes
- Show generic error messages
- Allow multiple simultaneous saves
- Lose user input on error

### 3. **Data Handling**

**✅ DO:**
- Refresh employee data after successful update
- Keep a copy of original data for cancel functionality
- Use TypeScript interfaces for type safety
- Handle null/undefined values properly

**❌ DON'T:**
- Mutate original data directly
- Assume update succeeded without checking response
- Mix view and edit state

### 4. **Array Fields (Technologies, Skills, etc.)**

**Important Behavior:**

| Action | Request | Backend Behavior |
|--------|---------|------------------|
| **Add/Update items** | `{ technologies: [{ technologyId: 1, ... }] }` | DELETE all existing + INSERT new |
| **Clear all items** | `{ technologies: [] }` | DELETE all existing |
| **No change** | Omit field entirely | No change to existing data |

**Example:**

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


**Frontend Implementation:**

```typescript
// When updating technologies, always send the complete list
updateTechnologies(newTechnology: TechnologyUpdate) {
  // Get current technologies from employee data
  const currentTechnologies = this.employee.technologies.map(t => ({
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

### 5. **Master Data References**

Before allowing users to add technologies, skills, certifications, or languages, you need to fetch the available options from master data endpoints:

```typescript
// Fetch available technologies
GET /api/v1/master-data/technologies

// Fetch available skills
GET /api/v1/master-data/skills

// Fetch available certifications
GET /api/v1/master-data/certifications

// Fetch available languages
GET /api/v1/master-data/languages
```

Use these to populate dropdowns/autocomplete fields in your edit forms.

---

## 🧪 Testing Checklist

### Frontend Testing

- [ ] Edit icon appears on all editable sections
- [ ] Edit mode activates when clicking edit icon
- [ ] Form fields populate with current values
- [ ] Cancel button restores original values
- [ ] Save button is disabled while saving
- [ ] Loading spinner shows during save
- [ ] Success message appears after successful save
- [ ] Error message appears on failure
- [ ] Validation errors display inline
- [ ] Unsaved changes warning works
- [ ] Data refreshes after successful update

### Integration Testing

- [ ] Update basic information (PUT)
- [ ] Partial update (PATCH)
- [ ] Update technologies (add, remove, clear)
- [ ] Update skills (add, remove, clear)
- [ ] Update certifications (add, remove, clear)
- [ ] Update languages (add, remove, clear)
- [ ] Update work experiences (add, remove, clear)
- [ ] Update educations (add, remove, clear)
- [ ] Complete update (all fields at once)
- [ ] Email uniqueness validation
- [ ] Invalid data validation
- [ ] Non-existent employee (404 error)

---

## 📚 Additional Resources

### Related Documentation

1. **HTTP Test File:** `02-api-testing/pythia-api-rest-endpoints-http-test/employee-update/pythia-api-tests-employee-update.http`
   - Contains all test cases with example requests
   - Shows expected responses
   - Includes database verification queries

2. **Master Data Endpoints:** See master data documentation for fetching available technologies, skills, certifications, and languages

3. **Employee Detail Endpoint:** `GET /api/v1/employees/{id}` - Use this to fetch current employee data before editing

### Example Workflow

```
1. User clicks "Edit" icon on Technologies section
   ↓
2. Frontend fetches available technologies from master data
   GET /api/v1/master-data/technologies
   ↓
3. User adds/removes technologies in edit form
   ↓
4. User clicks "Save"
   ↓
5. Frontend sends complete technology list to backend
   PUT /api/v1/employees/1
   { technologies: [...] }
   ↓
6. Backend deletes old technologies, inserts new ones
   ↓
7. Backend returns updated employee data
   ↓
8. Frontend updates UI with new data
   ↓
9. Success message shown to user
```

---

## 🎨 UI Component Examples

### Material Angular Example

```html
<!-- Basic Information Section -->
<mat-card>
  <mat-card-header>
    <mat-card-title>
      <mat-icon>person</mat-icon>
      Basic Information
    </mat-card-title>
    <button mat-icon-button
            *ngIf="!isEditingBasicInfo"
            (click)="enableEditMode('basicInfo')"
            matTooltip="Edit basic information">
      <mat-icon>edit</mat-icon>
    </button>
  </mat-card-header>

  <mat-card-content>
    <!-- View Mode -->
    <div *ngIf="!isEditingBasicInfo">
      <p><strong>Name:</strong> {{ employee.fullName }}</p>
      <p><strong>Title:</strong> {{ employee.title }}</p>
      <p><strong>Email:</strong> {{ employee.email }}</p>
      <p><strong>Phone:</strong> {{ employee.phone }}</p>
    </div>

    <!-- Edit Mode -->
    <form *ngIf="isEditingBasicInfo" [formGroup]="basicInfoForm">
      <mat-form-field appearance="outline">
        <mat-label>Full Name</mat-label>
        <input matInput formControlName="fullName">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email">
        <mat-error *ngIf="basicInfoForm.get('email')?.hasError('email')">
          Please enter a valid email
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Phone</mat-label>
        <input matInput formControlName="phone">
      </mat-form-field>
    </form>
  </mat-card-content>

  <mat-card-actions *ngIf="isEditingBasicInfo">
    <button mat-raised-button
            color="primary"
            (click)="saveBasicInfo()"
            [disabled]="isSaving || basicInfoForm.invalid">
      <mat-icon>save</mat-icon>
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
    <button mat-button (click)="cancelEdit()">
      <mat-icon>cancel</mat-icon>
      Cancel
    </button>
  </mat-card-actions>
</mat-card>
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @angular/common @angular/forms rxjs
```

### 2. Create Service

```bash
ng generate service services/employee
```

### 3. Implement Service (see examples above)

### 4. Create/Update Component

```bash
ng generate component components/employee-profile
```

### 5. Add Edit Icons to Template

### 6. Implement Save/Cancel Logic

### 7. Test with HTTP Test File

Use the provided HTTP test file to verify backend behavior before implementing frontend.

---

## 📞 Support

For questions or issues:
- Check the HTTP test file for request/response examples
- Review backend documentation
- Test endpoints using the provided `.http` file
- Verify database changes using SQL queries in the HTTP test file

---

**Happy Coding! 🎉**





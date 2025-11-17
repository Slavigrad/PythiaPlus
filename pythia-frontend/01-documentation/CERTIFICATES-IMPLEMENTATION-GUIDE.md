# PythiaPlus Master Data Implementation Patterns Guide
## Replicating Roles & Trainings Tabs for Certificates

This guide documents the complete patterns used in the existing Roles and Trainings tabs, which can be directly replicated for the Certificates tab.

---

## 1. FILE STRUCTURE OVERVIEW

```
pythia-frontend/src/app/
├── models/
│   └── certificate.model.ts          # Certificate interfaces
├── services/
│   └── certificate.service.ts        # Certificate API service
├── pages/master-data/
│   ├── master-data.component.ts      # Main container component
│   ├── master-data.component.html    # Template with all tabs
│   ├── master-data.component.scss    # Shared styles
│   └── components/
│       └── certificate-edit-dialog/
│           ├── certificate-edit-dialog.component.ts
│           ├── certificate-edit-dialog.component.html
│           ├── certificate-edit-dialog.component.scss
│           └── certificate-edit-dialog.component.spec.ts
```

---

## 2. DATA MODEL PATTERN

All master data entities follow the same interface structure:

### 2.1 Entity Interface (e.g., role.model.ts)
```typescript
export interface Role {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
```

**For Certificates, create:** `/home/user/PythiaPlus/pythia-frontend/src/app/models/certificate.model.ts`

```typescript
export interface Certificate {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 API Response Interface
```typescript
export interface RoleResponse {
  items: Role[];
  total: number;
  category: string;
}
```

**For Certificates:**
```typescript
export interface CertificateResponse {
  items: Certificate[];
  total: number;
  category: string;
}
```

### 2.3 Request Interface for Create/Update
```typescript
export interface RoleRequest {
  name: string;
  description: string;
  category?: string; // Optional - defaults to "Roles" on backend
}
```

**For Certificates:**
```typescript
export interface CertificateRequest {
  name: string;
  description: string;
  category?: string; // Optional - defaults to "Certificates" on backend
}
```

---

## 3. SERVICE PATTERN

All master data services follow an identical structure with these characteristics:

### 3.1 Service Structure (e.g., role.service.ts)

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/services/role.service.ts`

**Key Components:**
- Injected HttpClient for HTTP operations
- Signal-based state management for reactive updates
- Observable-based CRUD operations
- Comprehensive error handling

### 3.2 Service Template

Create: `/home/user/PythiaPlus/pythia-frontend/src/app/services/certificate.service.ts`

**Structure:**
```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Certificate, CertificateResponse, CertificateRequest } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // State signals
  readonly certificates = signal<Certificate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  loadCertificates(): Observable<CertificateResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CertificateResponse>(`${this.API_BASE_URL}/certificates`).pipe(
      tap(response => {
        this.certificates.set(response.items);
        this.total.set(response.total);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  createCertificate(request: CertificateRequest): Observable<Certificate> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Certificate>(`${this.API_BASE_URL}/certificates`, request).pipe(
      tap(newCert => {
        this.certificates.update(certs => [...certs, newCert]);
        this.total.update(t => t + 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  updateCertificate(id: number, request: CertificateRequest): Observable<Certificate> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Certificate>(`${this.API_BASE_URL}/certificates/${id}`, request).pipe(
      tap(updatedCert => {
        this.certificates.update(certs =>
          certs.map(cert => cert.id === id ? updatedCert : cert)
        );
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  deleteCertificate(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/certificates/${id}`).pipe(
      tap(() => {
        this.certificates.update(certs => certs.filter(cert => cert.id !== id));
        this.total.update(t => t - 1);
        this.loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }

  private handleError(error: HttpErrorResponse): void {
    this.loading.set(false);

    if (error.status === 0) {
      this.error.set('Unable to connect to server. Please check your connection.');
    } else if (error.status === 404) {
      this.error.set('Certificate not found.');
    } else if (error.status === 409) {
      this.error.set('A certificate with this name already exists.');
    } else if (error.status >= 500) {
      this.error.set('Server error. Please try again later.');
    } else {
      this.error.set(error.error?.message || 'An unexpected error occurred.');
    }
  }
}
```

### 3.3 Service Testing Pattern

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/services/role.service.spec.ts`

**Test Coverage Includes:**
1. Service creation
2. `loadRoles()` - fetch and state update
3. `createRole()` - create new item
4. `updateRole()` - update existing item
5. `deleteRole()` - delete item
6. `clearError()` - error state clearing
7. Error handling for various HTTP status codes (0, 404, 409, 500+)

**For Certificates:** Create `certificate.service.spec.ts` following the same pattern.

---

## 4. EDIT DIALOG COMPONENT PATTERN

### 4.1 Component Class

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/role-edit-dialog/role-edit-dialog.component.ts`

**Key Features:**
- Reactive forms with FormBuilder
- Material Dialog integration
- Mode detection (create/edit)
- Form validation with min/max length
- Error message display

**For Certificates:** Create `certificate-edit-dialog.component.ts`

**Structure:**
```typescript
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Certificate, CertificateRequest } from '../../../../models/certificate.model';

export interface CertificateEditDialogData {
  mode: 'create' | 'edit';
  certificate?: Certificate;
}

@Component({
  selector: 'app-certificate-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './certificate-edit-dialog.component.html',
  styleUrl: './certificate-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateEditDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly dialogRef = inject(MatDialogRef<CertificateEditDialogComponent>);
  protected readonly data = inject<CertificateEditDialogData>(MAT_DIALOG_DATA);

  protected certificateForm!: FormGroup;
  protected readonly isEditMode = this.data.mode === 'edit';

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const certificate = this.data.certificate;

    this.certificateForm = this.fb.group({
      name: [
        certificate?.name || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      description: [
        certificate?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ]
    });
  }

  protected get dialogTitle(): string {
    return this.isEditMode ? 'Edit Certificate' : 'Add New Certificate';
  }

  protected get submitButtonText(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }

  protected onSubmit(): void {
    if (this.certificateForm.valid) {
      const request: CertificateRequest = {
        name: this.certificateForm.value.name.trim(),
        description: this.certificateForm.value.description.trim(),
        category: 'Certificates'
      };

      this.dialogRef.close(request);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected hasError(fieldName: string, errorType: string): boolean {
    const field = this.certificateForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  protected getErrorMessage(fieldName: string): string {
    const field = this.certificateForm.get(fieldName);

    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Must be at least ${minLength} characters`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Must not exceed ${maxLength} characters`;
    }

    return '';
  }
}
```

### 4.2 Edit Dialog Template

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/role-edit-dialog/role-edit-dialog.component.html`

**For Certificates:** Create `certificate-edit-dialog.component.html`

**Structure:**
- Dialog header with icon and title
- Form with name and description fields
- Character count hints
- Error messages
- Category display (read-only)
- Cancel and Submit buttons

**Template Pattern:**
```html
<div class="dialog-container">
  <div class="dialog-header">
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="title-icon">{{ isEditMode ? 'edit' : 'add_circle' }}</mat-icon>
      {{ dialogTitle }}
    </h2>
    <button
      mat-icon-button
      class="close-button"
      (click)="onCancel()"
      aria-label="Close dialog">
      <mat-icon>close</mat-icon>
    </button>
  </div>

  <form [formGroup]="certificateForm" (ngSubmit)="onSubmit()">
    <mat-dialog-content class="dialog-content">
      <!-- Name Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Certificate Name</mat-label>
        <input
          matInput
          formControlName="name"
          placeholder="e.g., AWS Solutions Architect, Kubernetes CKA"
          maxlength="100"
          required
          autocomplete="off"
          [attr.aria-label]="'Certificate name'"
          [attr.aria-describedby]="hasError('name', 'required') || hasError('name', 'minlength') ? 'name-error' : null"
          [attr.aria-invalid]="certificateForm.get('name')?.invalid && certificateForm.get('name')?.touched">
        <mat-icon matPrefix class="field-icon">verified</mat-icon>
        <mat-hint align="end">{{ certificateForm.get('name')?.value?.length || 0 }}/100</mat-hint>
        @if (getErrorMessage('name')) {
          <mat-error id="name-error">{{ getErrorMessage('name') }}</mat-error>
        }
      </mat-form-field>

      <!-- Description Field -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea
          matInput
          formControlName="description"
          placeholder="Brief description of the certificate and its value"
          rows="4"
          maxlength="500"
          required
          [attr.aria-label]="'Certificate description'"
          [attr.aria-describedby]="hasError('description', 'required') || hasError('description', 'minlength') ? 'description-error' : null"
          [attr.aria-invalid]="certificateForm.get('description')?.invalid && certificateForm.get('description')?.touched">
        </textarea>
        <mat-icon matPrefix class="field-icon">description</mat-icon>
        <mat-hint align="end">{{ certificateForm.get('description')?.value?.length || 0 }}/500</mat-hint>
        @if (getErrorMessage('description')) {
          <mat-error id="description-error">{{ getErrorMessage('description') }}</mat-error>
        }
      </mat-form-field>

      <!-- Category Display (Read-only) -->
      <div class="info-section">
        <mat-icon class="info-icon">label</mat-icon>
        <div class="info-content">
          <span class="info-label">Category</span>
          <span class="info-value">Certificates</span>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button
        mat-button
        type="button"
        class="cancel-button"
        (click)="onCancel()">
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        type="submit"
        class="submit-button"
        [disabled]="certificateForm.invalid">
        <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
        {{ submitButtonText }}
      </button>
    </mat-dialog-actions>
  </form>
</div>
```

### 4.3 Edit Dialog Styles

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/role-edit-dialog/role-edit-dialog.component.scss`

**For Certificates:** Create `certificate-edit-dialog.component.scss`

**Can be directly copied** - the styles are completely generic and work for any edit dialog component.

---

## 5. MASTER DATA COMPONENT INTEGRATION

### 5.1 Main Component Responsibilities

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/master-data.component.ts`

The master-data component currently handles:
- Technologies tab
- Roles tab
- Trainings tab
- (Currently disabled: Certificates, Languages & Skills)

### 5.2 Integration Steps for Certificates Tab

**In master-data.component.ts:**

1. **Import the service:**
   ```typescript
   import { CertificateService } from '../../services/certificate.service';
   ```

2. **Inject the service:**
   ```typescript
   protected readonly certificateService = inject(CertificateService);
   ```

3. **Load data in ngOnInit:**
   ```typescript
   ngOnInit(): void {
     this.loadTechnologies();
     this.loadRoles();
     this.loadTrainings();
     this.loadCertificates();  // ADD THIS
   }
   ```

4. **Add CRUD method implementations** (following the exact same pattern as roles/trainings):
   ```typescript
   // Load certificates from API
   protected loadCertificates(): void {
     this.certificateService.loadCertificates().subscribe({
       error: (error) => {
         this.showError('Failed to load certificates');
         console.error('Error loading certificates:', error);
       }
     });
   }

   // Open dialog to add new certificate
   protected addCertificate(): void {
     const dialogRef = this.dialog.open(CertificateEditDialogComponent, {
       width: '600px',
       data: { mode: 'create' }
     });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.certificateService.createCertificate(result).subscribe({
           next: () => {
             this.showSuccess('Certificate added successfully');
           },
           error: (error) => {
             this.showError('Failed to add certificate');
             console.error('Error creating certificate:', error);
           }
         });
       }
     });
   }

   // Open dialog to edit existing certificate
   protected editCertificate(certificate: Certificate): void {
     const dialogRef = this.dialog.open(CertificateEditDialogComponent, {
       width: '600px',
       data: { mode: 'edit', certificate }
     });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.certificateService.updateCertificate(certificate.id, result).subscribe({
           next: () => {
             this.showSuccess('Certificate updated successfully');
           },
           error: (error) => {
             this.showError('Failed to update certificate');
             console.error('Error updating certificate:', error);
           }
         });
       }
     });
   }

   // Delete certificate with confirmation
   protected deleteCertificate(certificate: Certificate): void {
     const confirmed = confirm(
       `Are you sure you want to delete "${certificate.name}"?\n\nThis action cannot be undone.`
     );

     if (confirmed) {
       this.certificateService.deleteCertificate(certificate.id).subscribe({
         next: () => {
           this.showSuccess('Certificate deleted successfully');
         },
         error: (error) => {
           this.showError('Failed to delete certificate');
           console.error('Error deleting certificate:', error);
         }
       });
     }
   }
   ```

5. **Import the edit dialog component:**
   ```typescript
   import { CertificateEditDialogComponent } from './components/certificate-edit-dialog/certificate-edit-dialog.component';
   ```

6. **Add component to imports array:**
   ```typescript
   @Component({
     imports: [
       CommonModule,
       MatTabsModule,
       MatButtonModule,
       MatIconModule,
       MatCardModule,
       MatChipsModule,
       MatProgressSpinnerModule,
       MatSnackBarModule,
       MatDialogModule,
       MatTooltipModule,
       CertificateEditDialogComponent  // ADD THIS
     ],
   })
   ```

### 5.3 Master Data Template

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/master-data.component.html`

**Current state:** Line 361-367 has a disabled Certificates tab placeholder.

**Replace with active tab implementation:**

```html
<!-- Certificates Tab -->
<mat-tab label="Certificates">
  <ng-template mat-tab-label>
    <mat-icon class="tab-icon">verified</mat-icon>
    Certificates
    <span class="item-count">{{ certificateService.total() }}</span>
  </ng-template>

  <div class="tab-content">
    <!-- Header with Add Button -->
    <div class="tab-header">
      <h2 class="tab-title">Certificates</h2>
      <button
        mat-raised-button
        color="primary"
        class="add-button"
        (click)="addCertificate()"
        aria-label="Add new certificate">
        <mat-icon>add</mat-icon>
        Add Certificate
      </button>
    </div>

    <!-- Loading State -->
    @if (certificateService.loading()) {
      <div class="loading-container">
        <mat-spinner diameter="48"></mat-spinner>
        <p class="loading-text">Loading certificates...</p>
      </div>
    }

    <!-- Error State -->
    @if (certificateService.error()) {
      <div class="error-container" role="alert">
        <mat-icon class="error-icon">error</mat-icon>
        <p class="error-text">{{ certificateService.error() }}</p>
        <button
          mat-raised-button
          color="accent"
          (click)="loadCertificates()">
          Retry
        </button>
      </div>
    }

    <!-- Certificate Cards Grid -->
    @if (!certificateService.loading() && !certificateService.error()) {
      <div class="cards-grid" role="list">
        @for (cert of certificateService.certificates(); track cert.id) {
          <mat-card class="mdm-card" role="listitem">
            <mat-card-header>
              <div class="card-header-content">
                <div class="card-title-section">
                  <mat-card-title class="card-title">
                    {{ cert.name }}
                  </mat-card-title>
                  <mat-chip class="category-chip" [highlighted]="true">
                    <mat-icon class="chip-icon">label</mat-icon>
                    {{ cert.category }}
                  </mat-chip>
                </div>
                <div class="card-actions">
                  <button
                    mat-icon-button
                    class="action-button edit-button"
                    (click)="editCertificate(cert)"
                    [attr.aria-label]="'Edit ' + cert.name"
                    matTooltip="Edit certificate"
                    matTooltipPosition="above">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    class="action-button delete-button"
                    (click)="deleteCertificate(cert)"
                    [attr.aria-label]="'Delete ' + cert.name"
                    matTooltip="Delete certificate"
                    matTooltipPosition="above">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card-header>
            <mat-card-content class="card-content">
              <p class="description">{{ cert.description }}</p>
              <div class="metadata">
                <span class="metadata-item">
                  <mat-icon class="metadata-icon">access_time</mat-icon>
                  Updated {{ cert.updatedAt | date: 'MMM d, y' }}
                </span>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon class="empty-icon">verified</mat-icon>
            <h3>No certificates found</h3>
            <p>Get started by adding your first certificate.</p>
            <button
              mat-raised-button
              color="primary"
              (click)="addCertificate()">
              <mat-icon>add</mat-icon>
              Add Certificate
            </button>
          </div>
        }
      </div>
    }
  </div>
</mat-tab>
```

---

## 6. TESTING PATTERNS

### 6.1 Service Testing (certificate.service.spec.ts)

See section 3.3 for detailed testing pattern.

### 6.2 Edit Dialog Component Testing (certificate-edit-dialog.component.spec.ts)

The test structure mirrors the role edit dialog tests:
- Create Mode tests (empty form initialization, validation, submission)
- Edit Mode tests (form population, update submission)
- Dialog Actions tests (cancel, whitespace trimming)
- Error Messages tests (validation messages)

---

## 7. MATERIAL IMPORTS NEEDED

All the required Material modules are already imported in the master-data component. No additional imports needed for the Certificates tab.

**Verify these exist in master-data.component.ts imports:**
- `MatTabsModule` - Tab component
- `MatButtonModule` - Button components
- `MatIconModule` - Icon component
- `MatCardModule` - Card component
- `MatChipsModule` - Chip component
- `MatProgressSpinnerModule` - Loading spinner
- `MatSnackBarModule` - Notification snackbar
- `MatDialogModule` - Dialog framework
- `MatTooltipModule` - Tooltip directive

---

## 8. ROUTING CONFIGURATION

**Location:** `/home/user/PythiaPlus/pythia-frontend/src/app/app.routes.ts`

The master-data component is already routed:
```typescript
{ path: 'master-data', component: MasterDataComponent }
```

No routing changes needed - accessing `/master-data` will show all tabs including Certificates once implemented.

---

## 9. STYLING

All styles are shared through `master-data.component.scss` which includes:
- Tab styling
- Card grid layout
- Loading/Error/Empty states
- Responsive design (mobile breakpoints)
- Accessibility focus styles

The SCSS file applies to all tabs including:
- `.mdm-tabs` - Tab container
- `.mdm-card` - Master data cards
- `.cards-grid` - Grid layout
- `.loading-container`, `.error-container`, `.empty-state`

No additional SCSS files needed beyond the edit dialog's component-scoped styles.

---

## 10. SUMMARY OF FILES TO CREATE

### Required Files:
1. `/home/user/PythiaPlus/pythia-frontend/src/app/models/certificate.model.ts`
2. `/home/user/PythiaPlus/pythia-frontend/src/app/services/certificate.service.ts`
3. `/home/user/PythiaPlus/pythia-frontend/src/app/services/certificate.service.spec.ts`
4. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/certificate-edit-dialog/certificate-edit-dialog.component.ts`
5. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/certificate-edit-dialog/certificate-edit-dialog.component.html`
6. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/certificate-edit-dialog/certificate-edit-dialog.component.scss`
7. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/components/certificate-edit-dialog/certificate-edit-dialog.component.spec.ts`

### Files to Update:
1. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/master-data.component.ts` - Add service, methods, imports
2. `/home/user/PythiaPlus/pythia-frontend/src/app/pages/master-data/master-data.component.html` - Replace disabled tab with active content

---

## 11. KEY PATTERNS TO REMEMBER

### Signal State Management
- Use `signal<Type[]>()` for collections
- Use `signal<boolean>()` for loading/error flags
- Update with `.set()` or `.update()`
- Use `computed()` if needed for derived values

### API Endpoint Pattern
```
GET /api/v1/certificates         - Load all
POST /api/v1/certificates        - Create
PUT /api/v1/certificates/{id}    - Update
DELETE /api/v1/certificates/{id} - Delete
```

### Error Handling
```typescript
private handleError(error: HttpErrorResponse): void {
  this.loading.set(false);
  
  if (error.status === 0) {
    this.error.set('Connection error');
  } else if (error.status === 404) {
    this.error.set('Certificate not found.');
  } else if (error.status === 409) {
    this.error.set('A certificate with this name already exists.');
  } else if (error.status >= 500) {
    this.error.set('Server error. Please try again later.');
  } else {
    this.error.set(error.error?.message || 'An unexpected error occurred.');
  }
}
```

### Form Validation Pattern
- All master data entities use: required, minLength(2-10), maxLength(100-500)
- Always trim whitespace on submit
- Always display helpful error messages
- Use WCAG AA compliant form patterns

### Dialog Pattern
- Always use `MatDialog.open()` with width: '600px'
- Pass data with mode ('create' | 'edit') and optional entity
- Close with result (the request object) or undefined (cancelled)
- Subscribe to afterClosed() for handling result

---

## ANGULAR 20 SPECIFIC PATTERNS USED

1. **Standalone Components**: All components use `imports` array directly
2. **New Control Flow**: `@if`, `@for`, `@empty` syntax (not *ngIf, *ngFor)
3. **Signal Inputs**: (potential future enhancement) `input()` and `output()`
4. **OnPush Change Detection**: All components use `changeDetection: ChangeDetectionStrategy.OnPush`
5. **inject() Function**: Services injected via `inject()`, not constructor

---

**This guide provides complete blueprint for implementing Certificates tab with 100% consistency with existing Roles and Trainings tabs.**

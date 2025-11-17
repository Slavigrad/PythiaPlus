# PythiaPlus Master Data Architecture Diagram

## 1. COMPONENT HIERARCHY & DATA FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    MasterDataComponent                          │
│         (master-data.component.ts/.html/.scss)                  │
│                                                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Technologies │    Roles     │  Trainings   │ Certificates │  │
│  │     Tab      │     Tab      │     Tab      │     Tab      │  │
│  └──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘  │
│         │              │              │              │           │
│         v              v              v              v           │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │  Technology  │     Role     │   Training   │  Certificate │  │
│  │  Service     │   Service    │   Service    │   Service    │  │
│  └──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘  │
│         │              │              │              │           │
│  All Services Follow Same Pattern                    │           │
│  - Signal state (items, loading, error, total)       │           │
│  - CRUD operations (load, create, update, delete)    │           │
│  - Error handling with status codes                  │           │
└─────────────────────────────────────────────────────────────────┘
        │              │              │              │
        v              v              v              v
  ┌──────────────────────────────────────────────────────┐
  │      HTTP Client (HttpClient from @angular/common)   │
  │                                                       │
  │  GET /api/v1/technologies                           │
  │  GET /api/v1/roles                                  │
  │  GET /api/v1/trainings                              │
  │  GET /api/v1/certificates    (NEW)                  │
  └──────────────────────────────────────────────────────┘
        │              │              │              │
        v              v              v              v
  ┌──────────────────────────────────────────────────────┐
  │              Backend API (Port 8080)                 │
  │              (Kotlin Spring Boot 4)                  │
  └──────────────────────────────────────────────────────┘
```

---

## 2. SERVICE ARCHITECTURE PATTERN

```
┌─────────────────────────────────────────────────────┐
│         RoleService / TrainingService / etc.        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SIGNALS (State Management):                        │
│  ├── items:   signal<Item[]>([])                   │
│  ├── loading: signal<boolean>(false)               │
│  ├── error:   signal<string | null>(null)          │
│  └── total:   signal<number>(0)                    │
│                                                     │
│  METHODS (API Operations):                          │
│  ├── loadItems(): Observable<ItemResponse>         │
│  ├── createItem(req): Observable<Item>             │
│  ├── updateItem(id, req): Observable<Item>         │
│  └── deleteItem(id): Observable<void>              │
│                                                     │
│  UTILITIES:                                         │
│  ├── clearError(): void                            │
│  └── handleError(error): void                      │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↓ Uses (via inject)
┌─────────────────────────────────────────────────────┐
│      HttpClient                                    │
│  (Provided in app.config.ts)                       │
└─────────────────────────────────────────────────────┘
```

---

## 3. DIALOG FLOW ARCHITECTURE

```
User Click "Add/Edit"
        │
        v
MasterDataComponent.addItem() / editItem()
        │
        ├─ dialog.open(CertificateEditDialogComponent)
        │      ├─ data: { mode: 'create' | 'edit', item?: Item }
        │      └─ width: '600px'
        │
        v
CertificateEditDialogComponent
        │
        ├─ Initialize FormGroup from data
        │  ├─ name:        [required, min(2), max(100)]
        │  └─ description: [required, min(10), max(500)]
        │
        ├─ Display form fields
        │  ├─ Input with character count
        │  ├─ Textarea with character count
        │  ├─ Error messages (if invalid & touched)
        │  └─ Read-only category display
        │
        ├─ User submits form
        │  ├─ Validate form.valid
        │  ├─ Trim whitespace
        │  ├─ Add category
        │  └─ dialogRef.close(request)
        │
        v
MasterDataComponent.dialogRef.afterClosed()
        │
        ├─ result = null → cancelled, do nothing
        ├─ result = request → call service
        │
        v
CertificateService.createItem(request) / updateItem(id, request)
        │
        ├─ loading.set(true)
        ├─ error.set(null)
        ├─ HTTP POST/PUT request
        │  ├─ Success: update signals, loading.set(false)
        │  └─ Error: handleError()
        │
        v
showSuccess() / showError() Snackbar Notification
```

---

## 4. FILE STRUCTURE COMPARISON

### EXISTING PATTERNS (Roles, Trainings, Technologies)

```
app/
├── models/
│   ├── role.model.ts
│   ├── training.model.ts
│   └── technology.model.ts
│
├── services/
│   ├── role.service.ts
│   ├── role.service.spec.ts
│   ├── training.service.ts
│   └── technology.service.ts
│
└── pages/master-data/
    ├── master-data.component.ts
    ├── master-data.component.html
    ├── master-data.component.scss
    │
    └── components/
        ├── role-edit-dialog/
        │   ├── role-edit-dialog.component.ts
        │   ├── role-edit-dialog.component.html
        │   ├── role-edit-dialog.component.scss
        │   └── role-edit-dialog.component.spec.ts
        │
        ├── training-edit-dialog/
        │   ├── training-edit-dialog.component.ts
        │   ├── training-edit-dialog.component.html
        │   ├── training-edit-dialog.component.scss
        │   └── training-edit-dialog.component.spec.ts
        │
        └── technology-edit-dialog/
            ├── technology-edit-dialog.component.ts
            ├── technology-edit-dialog.component.html
            ├── technology-edit-dialog.component.scss
            └── technology-edit-dialog.component.spec.ts
```

### NEW PATTERN (Certificates - ADD THESE)

```
app/
├── models/
│   └── certificate.model.ts                    ← NEW
│
├── services/
│   ├── certificate.service.ts                  ← NEW
│   └── certificate.service.spec.ts             ← NEW
│
└── pages/master-data/
    ├── master-data.component.ts                (UPDATE)
    ├── master-data.component.html              (UPDATE)
    │
    └── components/
        └── certificate-edit-dialog/            ← NEW
            ├── certificate-edit-dialog.component.ts
            ├── certificate-edit-dialog.component.html
            ├── certificate-edit-dialog.component.scss
            └── certificate-edit-dialog.component.spec.ts
```

---

## 5. TYPE SYSTEM ARCHITECTURE

```
┌────────────────────────────────────────────────────────────┐
│                    certificate.model.ts                     │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  export interface Certificate {                            │
│    id: number;              ←─ Backend assigned             │
│    name: string;            ←─ User input                   │
│    description: string;     ←─ User input                   │
│    category: string;        ←─ "Certificates" (hardcoded)   │
│    createdAt: string;       ←─ Backend timestamp            │
│    updatedAt: string;       ←─ Backend timestamp            │
│  }                                                          │
│                                                              │
│  export interface CertificateResponse {                    │
│    items: Certificate[];                                   │
│    total: number;                                          │
│    category: string;                                       │
│  }                                                          │
│                                                              │
│  export interface CertificateRequest {                     │
│    name: string;            ←─ Form input                   │
│    description: string;     ←─ Form input                   │
│    category?: string;       ←─ Defaults to backend          │
│  }                                                          │
│                                                              │
└────────────────────────────────────────────────────────────┘
         ↓                         ↓                      ↓
   Used by:                   Used by:              Used by:
   Service                    API Response           Form Dialog
   to fetch                   to parse               to send
   Items                       Results               Create/Update
```

---

## 6. STATE MANAGEMENT FLOW

```
Component Template (@if, @for)
         │
         ├─ certificateService.loading()
         ├─ certificateService.error()
         ├─ certificateService.total()
         └─ certificateService.certificates()
         │
         v
    Service Signals
         │
    ┌────┴────┬──────────┬──────────────┐
    │          │          │              │
    v          v          v              v
loading:    error:    total:       certificates:
 false     null       0            []
 (busy)    (errors)   (count)      (items)
    │          │          │              │
    ├─ Set on load()      │              │
    ├─ Set on create()    │              │
    ├─ Set on update()    │              ├─ Set/Update on CRUD
    └─ Set on delete()    │              └─ Filtered on delete
                          │
                          └─ Set on error()
                          └─ Clear on clearError()
```

---

## 7. FORM VALIDATION STATE MACHINE

```
FORM INITIALIZATION
        │
        v
┌──────────────────────────────────┐
│  name: ''                        │
│  description: ''                 │
│  form.invalid = true             │
└──────────────────────────────────┘
        │
        │ User types in name field
        v
┌──────────────────────────────────┐
│  name: 'A'                       │
│  error: minlength (min 2)        │
│  form.invalid = true             │
│  (Submit button disabled)        │
└──────────────────────────────────┘
        │
        │ User adds more characters
        v
┌──────────────────────────────────┐
│  name: 'AWS Solution Architect'  │
│  description: '...'              │
│  form.valid = true               │
│  (Submit button enabled)         │
└──────────────────────────────────┘
        │
        │ User clicks Submit
        v
┌──────────────────────────────────┐
│  Create CertificateRequest       │
│  {                               │
│    name: 'AWS Solution Arch...'  │
│    description: 'Validates...'   │
│    category: 'Certificates'      │
│  }                               │
└──────────────────────────────────┘
        │
        v
  Service.createCertificate(req)
```

---

## 8. ERROR HANDLING ARCHITECTURE

```
HTTP Request
        │
        v
    tap() {
      success logic
    }
        │
        v
  certifications.update()
  total.update()
  loading.set(false)
        │
        └─ Error occurs?
        │      │
        │      v
        │  catchError() {
        │    handleError(httpError)
        │  }
        │      │
        │      v
        │  ┌─ Status 0: Connection error
        │  ├─ Status 404: Not found
        │  ├─ Status 409: Already exists
        │  ├─ Status 500+: Server error
        │  └─ Other: Custom message
        │      │
        │      v
        │  error.set(message)
        │  loading.set(false)
        │      │
        │      v
        └─ Component subscribes to error
             │
             v
         showError(message) ← snackbar
             │
             v
         User sees error notification
             │
             v
         User clicks Retry button
             │
             v
         clearError() + loadCertificates()
             │
             v
         Retry request
```

---

## 9. LIFECYCLE HOOKS

### MasterDataComponent
```
new MasterDataComponent()
        │
        v
ngOnInit()
        ├─ loadTechnologies()     ← subscribe
        ├─ loadRoles()            ← subscribe
        ├─ loadTrainings()        ← subscribe
        └─ loadCertificates()     ← subscribe (NEW)
        │
        v
Component renders with tabs
        │
        ├─ Tab 1: Technologies (loaded from service)
        ├─ Tab 2: Roles         (loaded from service)
        ├─ Tab 3: Trainings     (loaded from service)
        └─ Tab 4: Certificates  (loaded from service) ← NEW
        │
        v
User clicks Add/Edit/Delete
        │
        ├─ Dialog opens
        ├─ User submits form
        ├─ Service CRUD operation
        ├─ Service signals update
        ├─ Component template re-renders
        └─ User sees changes immediately
```

### CertificateEditDialogComponent
```
new CertificateEditDialogComponent()
        │
        v
ngOnInit()
        │
        ├─ data.mode === 'create'
        │  └─ Initialize empty form
        │
        └─ data.mode === 'edit'
           └─ Initialize form with data
        │
        v
User fills form
        │
        ├─ Validation happens in real-time
        ├─ Error messages appear
        ├─ Submit button enables/disables
        │
        v
User clicks Submit
        │
        ├─ Form validation check
        ├─ Whitespace trimming
        ├─ dialogRef.close(request)
        │
        v
Dialog closes
        │
        v
Parent component handles result
```

---

## 10. COMPARISON TABLE: ALL MASTER DATA TABS

| Feature | Technologies | Roles | Trainings | Certificates |
|---------|--------------|-------|-----------|--------------|
| Model File | technology.model.ts | role.model.ts | training.model.ts | certificate.model.ts |
| Service | TechnologyService | RoleService | TrainingService | CertificateService |
| Edit Dialog | TechnologyEditDialogComponent | RoleEditDialogComponent | TrainingEditDialogComponent | CertificateEditDialogComponent |
| API Endpoint | /api/v1/technologies | /api/v1/roles | /api/v1/trainings | /api/v1/certificates |
| Tab Icon | code | work | school | verified |
| Default Category | "Technologies" | "Roles" | "Trainings" | "Certificates" |
| Form Fields | name, description | name, description | name, description | name, description |
| Status | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | IMPLEMENTATION NEEDED |

---

## KEY TAKEAWAYS

1. **100% Pattern Consistency**: All master data tabs follow identical architecture
2. **No Duplication**: Edit dialog SCSS can be reused (generic)
3. **Service Pattern**: Each service has 6 methods (load, create, update, delete, clearError, handleError)
4. **State Signals**: Every service has 4 signals (items, loading, error, total)
5. **Reactive Forms**: All dialogs use same form validation pattern
6. **Error Handling**: Consistent HTTP error mapping (0, 404, 409, 500+)
7. **Material Design**: Uses existing Material components (no new imports needed)
8. **Accessibility**: WCAG AA compliant (aria labels, focus states, semantic HTML)
9. **Testing**: Each service and dialog has comprehensive test coverage


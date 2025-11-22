# 🔄 Backend API Pagination Specification

> **Document Version**: 1.0
> **Date**: 2025-11-22
> **Author**: Angular Frontend Team
> **Target**: Spring Boot Backend Team
> **Priority**: HIGH - Breaking Change Required

---

## 📊 Executive Summary

**Current State**: Backend returns incomplete pagination metadata, causing the frontend to guess pagination state.

**Required Change**: Backend must return complete pagination object in all list endpoints.

**Impact**: Breaking change for `/api/v1/projects` endpoint (and potentially `/api/v1/employees`).

**Timeline**: Required for MVP completion.

---

## 🔍 Current State Analysis

### **What Backend Currently Returns**

**Endpoint**: `GET /api/v1/projects?page=1&size=10`

**Current Response Structure**:
```json
{
  "projects": [
    { "id": 59, "name": "QuantumTrade AI Platform", ... },
    { "id": 60, "name": "MediConnect Telemedicine", ... }
    // ... more projects
  ],
  "total": 15,
  "filters": {
    "status": "all",
    "industry": "all",
    "company": "all"
  }
}
```

### **Problems with Current Implementation**

| Missing Field | Impact | Example |
|---------------|--------|---------|
| `page` number | Frontend doesn't know which page it's viewing | User on page 3 sees "Page 1" |
| `size` (page size) | Frontend guesses page size (defaults to 20) | User requested 10 items, sees 20 in UI |
| `totalPages` | Frontend calculates incorrectly if sizes don't match | Shows "3 pages" when there are actually 5 |

### **Example Failure Scenario**

**User Action**: Clicks "Page 2" with 10 items per page

**Request**: `GET /api/v1/projects?page=2&size=10`

**Backend Returns**:
```json
{
  "projects": [10 items],  // Items 11-20
  "total": 42              // Only total count
}
```

**Frontend State**:
```typescript
{
  page: 1,           // ❌ Wrong! Should be 2
  size: 20,          // ❌ Wrong! Should be 10
  totalElements: 42, // ✅ Correct
  totalPages: 3      // ❌ Wrong! Should be 5 (42 ÷ 10 = 4.2 → 5)
}
```

**UI Shows**: "Page 1 of 3" instead of "Page 2 of 5"

---

## ✅ Required Solution

### **Updated Response Structure**

**Endpoint**: `GET /api/v1/projects?page=0&size=10`

**Required Response Structure**:
```json
{
  "projects": [
    { "id": 59, "name": "QuantumTrade AI Platform", ... },
    { "id": 60, "name": "MediConnect Telemedicine", ... }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  },
  "filters": {
    "status": "all",
    "industry": "all",
    "company": "all"
  },
  "analytics": {
    "totalProjects": 42,
    "activeProjects": 15,
    // ... other analytics
  }
}
```

### **Pagination Object Specification**

| Field | Type | Description | Example | Required |
|-------|------|-------------|---------|----------|
| `page` | `number` | Current page number (0-indexed) | `0` for first page, `1` for second | ✅ Yes |
| `size` | `number` | Number of items per page | `10`, `20`, `50` | ✅ Yes |
| `totalElements` | `number` | Total number of items across ALL pages | `42` | ✅ Yes |
| `totalPages` | `number` | Total number of pages (calculated) | `Math.ceil(42 / 10) = 5` | ✅ Yes |

### **Important Notes**

1. **Page Indexing**: Use **0-based indexing** (Spring Boot default)
   - Page 0 = First page
   - Page 1 = Second page
   - Frontend will convert to 1-based for display

2. **Consistent Naming**: Use `totalElements` (Spring Boot standard), NOT `total`

3. **Always Include All Fields**: Even if there are 0 results, return complete pagination object

---

## 🔧 Spring Boot Implementation Guide

### **Option 1: Using Spring Data's Page<T> (RECOMMENDED)**

If you're already using Spring Data JPA, this is the easiest approach:

```kotlin
// Controller
@GetMapping("/projects")
fun getProjects(
    @RequestParam(defaultValue = "0") page: Int,
    @RequestParam(defaultValue = "20") size: Int,
    @RequestParam(required = false) status: String?,
    @RequestParam(required = false) industry: String?,
    // ... other filters
): ProjectListResponse {
    val pageable = PageRequest.of(page, size, Sort.by("startDate").descending())
    val projectPage: Page<Project> = projectRepository.findAll(pageable)

    return ProjectListResponse(
        projects = projectPage.content.map { it.toDTO() },
        pagination = PaginationMetadata(
            page = projectPage.number,              // 0-indexed page
            size = projectPage.size,                // Items per page
            totalElements = projectPage.totalElements.toInt(),  // Total items
            totalPages = projectPage.totalPages     // Total pages
        ),
        filters = buildFiltersResponse(status, industry),
        analytics = calculateAnalytics(projectPage.content)
    )
}

// Response DTO
data class ProjectListResponse(
    val projects: List<ProjectDTO>,
    val pagination: PaginationMetadata,
    val filters: FiltersResponse? = null,
    val analytics: ProjectListAnalytics? = null
)

data class PaginationMetadata(
    val page: Int,          // Current page (0-indexed)
    val size: Int,          // Items per page
    val totalElements: Int, // Total items
    val totalPages: Int     // Total pages
)
```

### **Option 2: Manual Pagination**

If not using Spring Data Page:

```kotlin
@GetMapping("/projects")
fun getProjects(
    @RequestParam(defaultValue = "0") page: Int,
    @RequestParam(defaultValue = "20") size: Int
): ProjectListResponse {

    // Get total count
    val totalElements = projectRepository.count()

    // Calculate total pages
    val totalPages = Math.ceil(totalElements.toDouble() / size).toInt()

    // Get paginated results
    val offset = page * size
    val projects = projectRepository.findAll(offset, size)

    return ProjectListResponse(
        projects = projects.map { it.toDTO() },
        pagination = PaginationMetadata(
            page = page,
            size = size,
            totalElements = totalElements,
            totalPages = totalPages
        )
    )
}
```

### **Option 3: Wrapper Around Existing Code**

If you want to minimize changes to existing repository layer:

```kotlin
@GetMapping("/projects")
fun getProjects(
    @RequestParam(defaultValue = "0") page: Int,
    @RequestParam(defaultValue = "20") size: Int
): ProjectListResponse {

    // Your existing code (assume it returns projects + total)
    val result = projectService.findProjects(page, size)

    return ProjectListResponse(
        projects = result.projects,
        pagination = PaginationMetadata(
            page = page,
            size = size,
            totalElements = result.total,
            totalPages = Math.ceil(result.total.toDouble() / size).toInt()
        )
    )
}
```

---

## 🎯 Endpoints Requiring Changes

### **Priority 1: Immediate Changes Required**

| Endpoint | Current State | Action Required |
|----------|---------------|-----------------|
| `GET /api/v1/projects` | Returns `total` only | Add complete `pagination` object |

### **Priority 2: Future Endpoints**

| Endpoint | Status | Action Required |
|----------|--------|-----------------|
| `GET /api/v1/employees` | Not yet implemented | Implement with pagination from start |
| `GET /api/v1/search` | Existing | Maintain current structure (if different) |

---

## ✅ Acceptance Criteria

### **1. Response Structure**

- [ ] Response includes `pagination` object
- [ ] `pagination.page` matches requested page parameter
- [ ] `pagination.size` matches requested size parameter
- [ ] `pagination.totalElements` reflects total count across all pages
- [ ] `pagination.totalPages` is correctly calculated
- [ ] All pagination fields are present even when `totalElements = 0`

### **2. Edge Cases**

- [ ] **Empty Results**: Returns `pagination: { page: 0, size: 20, totalElements: 0, totalPages: 0 }`
- [ ] **Last Page**: Returns correct page number even if page has fewer items than size
- [ ] **Invalid Page**: Returns empty results (not error) if page > totalPages
- [ ] **Large Datasets**: Handles pagination efficiently (indexed queries)

### **3. Performance**

- [ ] Total count query is optimized (uses COUNT query, not full fetch)
- [ ] Pagination uses LIMIT/OFFSET or equivalent
- [ ] Response time < 200ms for typical queries
- [ ] Database queries use proper indexes

---

## 🧪 Testing Requirements

### **Test Case 1: Standard Pagination**

**Request**: `GET /api/v1/projects?page=0&size=10`

**Expected Response**:
```json
{
  "projects": [10 items],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

### **Test Case 2: Last Page (Partial)**

**Request**: `GET /api/v1/projects?page=4&size=10` (last page with 42 total items)

**Expected Response**:
```json
{
  "projects": [2 items],  // Only items 41-42
  "pagination": {
    "page": 4,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

### **Test Case 3: Empty Results**

**Request**: `GET /api/v1/projects?page=0&size=10&status=INVALID`

**Expected Response**:
```json
{
  "projects": [],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

### **Test Case 4: Page Beyond Range**

**Request**: `GET /api/v1/projects?page=99&size=10` (page doesn't exist)

**Expected Response**:
```json
{
  "projects": [],
  "pagination": {
    "page": 99,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

---

## 📋 Frontend Contract

### **What Angular 20 Frontend Expects**

The frontend will consume the API response as follows:

```typescript
// TypeScript interface (frontend contract)
export interface ProjectListResponseBackend {
  projects: ProjectBackend[];

  pagination: {
    page: number;          // 0-indexed (backend) → converts to 1-indexed (UI)
    size: number;          // Items per page
    totalElements: number; // Total items across all pages
    totalPages: number;    // Total number of pages
  };

  filters?: {
    status: string;
    industry: string;
    company: string;
  };

  analytics?: ProjectListAnalytics;
}
```

### **Frontend Validation**

Frontend will **fail fast** if:
- `pagination` object is missing
- Any required pagination field is `null` or `undefined`
- `totalPages` doesn't match calculation (`Math.ceil(totalElements / size)`)

**Error Example**:
```typescript
if (!response.pagination) {
  throw new Error('Backend API error: missing pagination data');
}
```

---

## 🔄 Migration Strategy

### **Phase 1: Add Pagination Object (Non-Breaking)**

1. Add `pagination` object to response (keep `total` field for backward compatibility)
2. Frontend updates to use `pagination.totalElements` instead of `total`
3. Deploy backend + frontend together

**Response During Migration**:
```json
{
  "projects": [...],
  "total": 42,          // ⚠️ Deprecated (keep for compatibility)
  "pagination": {       // ✅ New structure
    "page": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

### **Phase 2: Remove Legacy Field (Breaking Change)**

1. Remove `total` field from response
2. Update API version (if using versioning)
3. Update frontend to expect only `pagination` object

---

## 📞 Communication

### **Backend Team Contact**

- **Slack Channel**: #backend-dev
- **Lead Developer**: [Backend Lead Name]
- **Questions**: Tag @angular-team in Slack or create GitHub issue

### **Timeline**

- **Spec Review**: 2025-11-22 (today)
- **Backend Implementation**: 2025-11-23 to 2025-11-25 (3 days)
- **Testing**: 2025-11-26 (1 day)
- **Deployment**: 2025-11-27
- **Frontend Integration**: 2025-11-27 to 2025-11-28

---

## ❓ FAQ

### **Q: Why not use Spring Boot's default PageImpl structure?**

**A**: We can! The `pagination` object maps perfectly to Spring's `Page<T>`:

```kotlin
// Spring Boot's Page<T> provides:
page.number         → pagination.page
page.size           → pagination.size
page.totalElements  → pagination.totalElements
page.totalPages     → pagination.totalPages
```

### **Q: Should we use 0-based or 1-based page indexing?**

**A**: Use **0-based** (Spring Boot default). Frontend will handle conversion for display.

### **Q: What about cursor-based pagination for large datasets?**

**A**: For MVP, offset-based pagination is sufficient. We can discuss cursor-based pagination for future optimization.

### **Q: Should `analytics` be included in every response?**

**A**: Yes, if available. Analytics provide valuable summary data for the UI dashboard.

### **Q: What if calculating `totalElements` is expensive?**

**A**: Use database COUNT queries with proper indexes. If still slow, we can discuss alternatives (approximate counts, caching).

---

## 📚 References

- [Spring Data Pagination Docs](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.pagination-and-sorting)
- [Angular HTTP Client](https://angular.dev/guide/http)
- [RESTful API Pagination Best Practices](https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api)

---

**Document Status**: ✅ Ready for Backend Team Review
**Next Steps**: Backend team implements, creates PR, tags @angular-team for review

# 🚀 Quick Start Guide for Backend Team

> **TL;DR**: Frontend needs backend to return complete pagination object. Here's what to change.

---

## ⚡ What You Need to Do

Update `GET /api/v1/projects` endpoint to return:

```json
{
  "projects": [...],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

---

## 📝 Spring Boot Implementation

### **Option 1: Using Spring Data Page (RECOMMENDED)**

```kotlin
@GetMapping("/projects")
fun getProjects(
    @RequestParam(defaultValue = "0") page: Int,
    @RequestParam(defaultValue = "20") size: Int
): ProjectListResponse {
    val pageable = PageRequest.of(page, size)
    val projectPage: Page<Project> = projectRepository.findAll(pageable)

    return ProjectListResponse(
        projects = projectPage.content.map { it.toDTO() },
        pagination = PaginationMetadata(
            page = projectPage.number,              // 0-indexed
            size = projectPage.size,
            totalElements = projectPage.totalElements.toInt(),
            totalPages = projectPage.totalPages
        )
    )
}

data class ProjectListResponse(
    val projects: List<ProjectDTO>,
    val pagination: PaginationMetadata
)

data class PaginationMetadata(
    val page: Int,
    val size: Int,
    val totalElements: Int,
    val totalPages: Int
)
```

---

## ✅ Checklist

- [ ] Remove `total` field from root level (if exists)
- [ ] Add `pagination` object with all 4 fields
- [ ] Ensure `page` is 0-indexed (0 = first page)
- [ ] Test with `page=0&size=10` and `page=2&size=5`
- [ ] Verify empty results return `pagination: { page: 0, size: 10, totalElements: 0, totalPages: 0 }`
- [ ] Deploy to dev environment
- [ ] Tag @angular-team when ready for integration testing

---

## 📚 Full Documentation

See `BACKEND-PAGINATION-SPEC.md` for:
- Complete API specification
- Edge case handling
- Test scenarios
- Performance requirements

---

**Questions?** Ping @angular-team in Slack

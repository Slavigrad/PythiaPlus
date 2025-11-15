# Comparison Feature - Backend API Requirements

## Overview

The comparison feature requires a **batch profile endpoint** that returns extended candidate data for multiple candidates in a single request. This is different from the standard employee detail endpoints for performance and data consistency reasons.

---

## Why Batch Endpoint vs. Multiple Individual Requests?

### Standard Approach (NOT Recommended)
```typescript
// ❌ Multiple sequential requests (slow, inefficient)
const candidate1 = await fetch('/api/v1/employees/1');
const candidate2 = await fetch('/api/v1/employees/2');
const candidate3 = await fetch('/api/v1/employees/3');
```

**Problems:**
- 3 separate HTTP requests (high latency)
- 3x network overhead
- No transaction consistency (data might change between requests)
- Frontend complexity (parallel request handling)

### Batch Endpoint (✅ Recommended)
```typescript
// ✅ Single batch request (fast, efficient)
const response = await fetch('/api/v1/candidates/batch-profiles', {
  method: 'POST',
  body: JSON.stringify({ ids: ['1', '2', '3'] })
});
```

**Benefits:**
- Single HTTP request (low latency)
- Reduced network overhead
- Transactional consistency (all data fetched at same moment)
- Easier frontend caching
- Backend can optimize database queries (single JOIN vs. multiple)

---

## API Endpoint Specification

### Endpoint
```
POST /api/v1/candidates/batch-profiles
```

### Request Format

#### Headers
```http
Content-Type: application/json
Authorization: Bearer {token}  // If authentication required
```

#### Request Body
```json
{
  "ids": ["1", "2", "3"]
}
```

**Field Descriptions:**
- `ids` (required): Array of candidate/employee IDs (strings)
- Min: 2 IDs
- Max: 3 IDs (enforced by frontend, but backend should validate)

---

### Response Format

#### Success Response (200 OK)
```json
{
  "success": true,
  "candidates": [
    {
      "id": "1",
      "name": "John Smith",
      "title": "Senior Full-Stack Engineer",
      "location": "Zurich, Switzerland",
      "experience": "8 years",
      "availability": "Available",
      "matchScore": {
        "matched": 0.92,
        "embedding": [0.123, -0.456, ...]  // Optional 1024-dim vector
      },
      "technologies": ["TypeScript", "Angular", "Node.js", "PostgreSQL"],
      "skills": ["TypeScript", "Angular 20", "RxJS", "Signals"],
      "certifications": ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator"],
      "currentProject": {
        "name": "E-Commerce Platform Redesign",
        "company": "Tech Corp",
        "role": "Lead Developer",
        "startDate": "2024-01-15"
      },
      "experienceDetails": {
        "totalYears": 8,
        "level": "Senior",
        "positions": [
          {
            "title": "Senior Full-Stack Engineer",
            "company": "Tech Corp",
            "startDate": "2022-01-01",
            "endDate": null,
            "description": "Leading development of microservices architecture"
          }
        ]
      },
      "availabilityDetails": {
        "status": "Available",
        "startDate": "2025-02-01",
        "noticePeriod": "1 month"
      },
      "detailedTechnologies": [
        {
          "name": "TypeScript",
          "yearsExperience": 7,
          "proficiency": "Expert"
        },
        {
          "name": "Angular",
          "yearsExperience": 6,
          "proficiency": "Expert"
        }
      ],
      "trainings": [
        {
          "name": "Advanced Angular Patterns",
          "provider": "Angular University",
          "completionDate": "2024-06-15",
          "certificateUrl": "https://example.com/cert/123"
        }
      ],
      "detailedCertifications": [
        {
          "name": "AWS Certified Solutions Architect",
          "issuer": "Amazon Web Services",
          "issueDate": "2023-03-15",
          "expiryDate": "2026-03-15",
          "credentialId": "AWS-SA-123456",
          "verificationUrl": "https://aws.amazon.com/verify/123456"
        }
      ]
    },
    // ... more candidates (up to 3 total)
  ],
  "metadata": {
    "requestedCount": 3,
    "returnedCount": 3,
    "timestamp": "2025-11-15T12:00:00Z"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid candidate IDs provided",
    "details": {
      "invalidIds": ["999"],
      "validIds": ["1", "2"]
    }
  },
  "candidates": []
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "One or more candidates not found",
    "details": {
      "missingIds": ["3"],
      "foundIds": ["1", "2"]
    }
  },
  "candidates": [
    // Partial results (only found candidates)
  ]
}
```

#### Error Response (500 Internal Server Error)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to fetch candidate profiles",
    "details": {
      "reason": "Database connection timeout"
    }
  },
  "candidates": []
}
```

---

## Data Model: CandidateProfile

### TypeScript Interface (Frontend)
```typescript
export interface CandidateProfile extends Candidate {
  // Extended fields for comparison view
  experienceDetails: ExperienceDetails;
  availabilityDetails: AvailabilityDetails;
  detailedTechnologies: Technology[];
  trainings: Training[];
  detailedCertifications: Certification[];
  currentProject?: CurrentProject;
}

export interface Candidate {
  // Basic fields (already in search results)
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  availability: string;
  matchScore: MatchScore;
  technologies?: string[];
  skills?: string[];
  certifications?: string[];
}

export interface ExperienceDetails {
  totalYears: number;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  positions: Position[];
}

export interface Position {
  title: string;
  company: string;
  startDate: string;  // ISO 8601 date
  endDate: string | null;  // null = current position
  description: string;
  technologies?: string[];
}

export interface AvailabilityDetails {
  status: 'Available' | 'Notice Period' | 'Not Available';
  startDate?: string;  // ISO 8601 date
  noticePeriod?: string;  // e.g., "1 month", "3 months"
}

export interface Technology {
  name: string;
  yearsExperience: number;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Training {
  name: string;
  provider: string;
  completionDate: string;  // ISO 8601 date
  certificateUrl?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;  // ISO 8601 date
  expiryDate?: string;  // ISO 8601 date (null = no expiry)
  credentialId?: string;
  verificationUrl?: string;
}

export interface CurrentProject {
  name: string;
  company: string;
  role: string;
  startDate: string;  // ISO 8601 date
  description?: string;
}

export interface MatchScore {
  matched: number;  // 0.0 to 1.0 (e.g., 0.92 = 92% match)
  embedding?: number[];  // Optional: 1024-dim embedding vector
}
```

---

## Database Schema Recommendations

### Kotlin Spring Boot 4 + PostgreSQL + pgvector

```kotlin
// Candidate entity
@Entity
@Table(name = "candidates")
data class Candidate(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String,

    val name: String,
    val title: String,
    val location: String,
    val experience: String,  // e.g., "8 years"
    val availability: String,  // e.g., "Available"

    @OneToMany(mappedBy = "candidate", fetch = FetchType.LAZY)
    val positions: List<Position> = listOf(),

    @OneToMany(mappedBy = "candidate", fetch = FetchType.LAZY)
    val technologies: List<CandidateTechnology> = listOf(),

    @OneToMany(mappedBy = "candidate", fetch = FetchType.LAZY)
    val certifications: List<CandidateCertification> = listOf(),

    @OneToMany(mappedBy = "candidate", fetch = FetchType.LAZY)
    val trainings: List<Training> = listOf(),

    @OneToOne(mappedBy = "candidate", fetch = FetchType.LAZY)
    val currentProject: CurrentProject? = null,

    @Column(columnDefinition = "vector(1024)")
    val embedding: FloatArray? = null  // pgvector for semantic search
)
```

### Optimized Batch Query (JPA + Kotlin)

```kotlin
@Repository
interface CandidateRepository : JpaRepository<Candidate, String> {

    @Query("""
        SELECT DISTINCT c FROM Candidate c
        LEFT JOIN FETCH c.positions p
        LEFT JOIN FETCH c.technologies t
        LEFT JOIN FETCH c.certifications cert
        LEFT JOIN FETCH c.trainings train
        LEFT JOIN FETCH c.currentProject proj
        WHERE c.id IN :ids
    """)
    fun findByIdInWithDetails(ids: List<String>): List<Candidate>
}
```

**Why this is better:**
- Single database query (vs. 3 separate queries)
- `LEFT JOIN FETCH` eagerly loads associations (avoids N+1 problem)
- `DISTINCT` prevents duplicate rows from multiple joins
- All data fetched in one transaction (consistency)

---

## Service Layer Implementation

```kotlin
@Service
class ComparisonService(
    private val candidateRepository: CandidateRepository,
    private val candidateMapper: CandidateMapper
) {

    fun getBatchProfiles(ids: List<String>): BatchProfileResponse {
        // Validation
        if (ids.isEmpty()) {
            throw IllegalArgumentException("At least one candidate ID required")
        }
        if (ids.size > 3) {
            throw IllegalArgumentException("Maximum 3 candidates allowed")
        }

        // Fetch candidates with all associations in single query
        val candidates = candidateRepository.findByIdInWithDetails(ids)

        // Check if any IDs were not found
        val foundIds = candidates.map { it.id }
        val missingIds = ids.filter { it !in foundIds }

        // Map to DTOs
        val candidateProfiles = candidates.map {
            candidateMapper.toProfileDTO(it)
        }

        return BatchProfileResponse(
            success = missingIds.isEmpty(),
            candidates = candidateProfiles,
            metadata = BatchMetadata(
                requestedCount = ids.size,
                returnedCount = candidateProfiles.size,
                timestamp = Instant.now()
            ),
            error = if (missingIds.isNotEmpty()) {
                ErrorDetails(
                    code = "PARTIAL_RESULTS",
                    message = "Some candidates not found",
                    details = mapOf(
                        "missingIds" to missingIds,
                        "foundIds" to foundIds
                    )
                )
            } else null
        )
    }
}
```

---

## Controller Implementation

```kotlin
@RestController
@RequestMapping("/api/v1/candidates")
class CandidateComparisonController(
    private val comparisonService: ComparisonService
) {

    @PostMapping("/batch-profiles")
    fun getBatchProfiles(
        @RequestBody @Valid request: BatchProfileRequest
    ): ResponseEntity<BatchProfileResponse> {
        return try {
            val response = comparisonService.getBatchProfiles(request.ids)

            if (response.success) {
                ResponseEntity.ok(response)
            } else {
                // Partial results (some IDs not found)
                ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(response)
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(
                BatchProfileResponse(
                    success = false,
                    candidates = emptyList(),
                    error = ErrorDetails(
                        code = "INVALID_REQUEST",
                        message = e.message ?: "Invalid request"
                    )
                )
            )
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(
                BatchProfileResponse(
                    success = false,
                    candidates = emptyList(),
                    error = ErrorDetails(
                        code = "INTERNAL_ERROR",
                        message = "Failed to fetch candidate profiles"
                    )
                )
            )
        }
    }
}

data class BatchProfileRequest(
    @field:NotEmpty(message = "At least one candidate ID required")
    @field:Size(min = 1, max = 3, message = "Between 1 and 3 candidate IDs allowed")
    val ids: List<String>
)
```

---

## Performance Considerations

### 1. Database Query Optimization

**Bad (N+1 Problem):**
```kotlin
// ❌ Causes 1 + N queries (1 for candidates + N for each association)
val candidates = candidateRepository.findAllById(ids)
// Each access to lazy associations triggers new query
candidates.forEach {
    it.positions.size  // Query 1
    it.technologies.size  // Query 2
    it.certifications.size  // Query 3
}
```

**Good (Single Query):**
```kotlin
// ✅ Single query with JOIN FETCH
val candidates = candidateRepository.findByIdInWithDetails(ids)
// All associations already loaded, no additional queries
```

### 2. Caching Strategy

```kotlin
@Service
class ComparisonService(
    private val candidateRepository: CandidateRepository,
    @Cacheable("candidate-profiles")
    private val cache: Cache
) {

    @Cacheable(
        value = ["candidate-profiles"],
        key = "#id",
        unless = "#result == null"
    )
    fun getCandidateProfile(id: String): CandidateProfile? {
        return candidateRepository.findByIdWithDetails(id)
            ?.let { candidateMapper.toProfileDTO(it) }
    }

    fun getBatchProfiles(ids: List<String>): BatchProfileResponse {
        // Check cache first
        val cached = ids.mapNotNull { cache.get(it) }
        val uncachedIds = ids.filter { it !in cached.map { c -> c.id } }

        // Fetch only uncached
        val fresh = if (uncachedIds.isNotEmpty()) {
            candidateRepository.findByIdInWithDetails(uncachedIds)
                .map { candidateMapper.toProfileDTO(it) }
                .also { profiles ->
                    // Update cache
                    profiles.forEach { cache.put(it.id, it) }
                }
        } else emptyList()

        val allProfiles = cached + fresh

        return BatchProfileResponse(
            success = true,
            candidates = allProfiles,
            metadata = BatchMetadata(
                requestedCount = ids.size,
                returnedCount = allProfiles.size,
                timestamp = Instant.now()
            )
        )
    }
}
```

### 3. Response Time Targets

| Scenario | Target Response Time |
|----------|---------------------|
| All profiles cached | < 50ms |
| 1 cache miss | < 150ms |
| All cache misses (3 profiles) | < 300ms |
| Database timeout | 5000ms (5s) |

---

## Error Handling

### Validation Errors
- Empty `ids` array → 400 Bad Request
- More than 3 IDs → 400 Bad Request
- Invalid ID format → 400 Bad Request

### Data Errors
- Some IDs not found → 206 Partial Content (return found candidates)
- All IDs not found → 404 Not Found
- Missing required fields → 500 Internal Server Error

### Example Error Response
```json
{
  "success": false,
  "error": {
    "code": "PARTIAL_RESULTS",
    "message": "Some candidates not found",
    "details": {
      "missingIds": ["999"],
      "foundIds": ["1", "2"],
      "suggestion": "Verify candidate IDs are correct"
    }
  },
  "candidates": [
    // Return partial results for found candidates
  ],
  "metadata": {
    "requestedCount": 3,
    "returnedCount": 2,
    "timestamp": "2025-11-15T12:00:00Z"
  }
}
```

---

## Testing the Endpoint

### cURL Example
```bash
curl -X POST http://localhost:8080/api/v1/candidates/batch-profiles \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["1", "2", "3"]
  }'
```

### HTTPie Example
```bash
http POST localhost:8080/api/v1/candidates/batch-profiles \
  ids:='["1", "2", "3"]'
```

### Postman Collection
```json
{
  "name": "Batch Profiles",
  "request": {
    "method": "POST",
    "url": "http://localhost:8080/api/v1/candidates/batch-profiles",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"ids\": [\"1\", \"2\", \"3\"]\n}"
    }
  }
}
```

---

## Differences from Standard Employee Endpoint

### Standard Employee Endpoint
```
GET /api/v1/employees/{id}
```
- Single candidate
- Used for detail views
- May have different permissions/visibility
- Lighter response (search result level)

### Batch Profiles Endpoint
```
POST /api/v1/candidates/batch-profiles
```
- Multiple candidates (2-3)
- Used for comparison view
- Requires all extended fields
- Heavier response (full profile details)
- Optimized for performance (single query, caching)
- Returns partial results if some IDs not found

---

## Security Considerations

1. **Authorization**: Ensure user has permission to view all requested candidates
2. **Rate Limiting**: Limit to 10 requests per minute per user
3. **Input Validation**: Sanitize and validate all IDs
4. **CORS**: Configure appropriate CORS headers for frontend origin

```kotlin
@Configuration
class SecurityConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration().apply {
            allowedOrigins = listOf("http://localhost:4200", "https://pythia.example.com")
            allowedMethods = listOf("GET", "POST", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }

        val source = UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", config)
        }

        return CorsFilter(source)
    }
}
```

---

## Migration Path

### Phase 1: Basic Implementation (MVP)
- ✅ Create batch-profiles endpoint
- ✅ Return basic extended fields
- ✅ Single database query with JOINs
- ✅ Basic error handling

### Phase 2: Optimization
- Add Redis/Caffeine caching
- Implement response compression (Gzip)
- Add database query performance monitoring
- Implement rate limiting

### Phase 3: Advanced Features
- Add pagination for positions/trainings
- Support filtering by date ranges
- Add profile comparison analytics
- Implement field-level permissions

---

## Contact & Support

For questions or issues with the backend implementation:
- **Frontend Team**: pythia-frontend-team@example.com
- **API Documentation**: https://api.pythia.example.com/docs
- **Slack Channel**: #pythia-comparison-feature

---

## Appendix: Complete Example Response

```json
{
  "success": true,
  "candidates": [
    {
      "id": "1",
      "name": "Anna Müller",
      "title": "Senior Backend Engineer",
      "location": "Zurich, Switzerland",
      "experience": "10 years",
      "availability": "Available",
      "matchScore": {
        "matched": 0.95
      },
      "technologies": ["Kotlin", "Spring Boot", "PostgreSQL", "Kafka"],
      "skills": ["Kotlin", "Spring Boot 4", "Microservices", "Event-Driven Architecture"],
      "certifications": ["Oracle Certified Professional Java SE", "AWS Solutions Architect"],
      "currentProject": {
        "name": "Banking Platform Migration",
        "company": "Swiss Bank AG",
        "role": "Technical Lead",
        "startDate": "2024-03-01"
      },
      "experienceDetails": {
        "totalYears": 10,
        "level": "Senior",
        "positions": [
          {
            "title": "Senior Backend Engineer",
            "company": "Swiss Bank AG",
            "startDate": "2020-01-01",
            "endDate": null,
            "description": "Leading backend development for core banking platform"
          }
        ]
      },
      "availabilityDetails": {
        "status": "Available",
        "startDate": "2025-02-01",
        "noticePeriod": "2 months"
      },
      "detailedTechnologies": [
        {
          "name": "Kotlin",
          "yearsExperience": 6,
          "proficiency": "Expert"
        }
      ],
      "trainings": [
        {
          "name": "Advanced Spring Boot",
          "provider": "Spring Academy",
          "completionDate": "2024-05-10"
        }
      ],
      "detailedCertifications": [
        {
          "name": "AWS Solutions Architect",
          "issuer": "Amazon Web Services",
          "issueDate": "2023-06-15",
          "expiryDate": "2026-06-15"
        }
      ]
    }
  ],
  "metadata": {
    "requestedCount": 1,
    "returnedCount": 1,
    "timestamp": "2025-11-15T12:30:00Z"
  }
}
```

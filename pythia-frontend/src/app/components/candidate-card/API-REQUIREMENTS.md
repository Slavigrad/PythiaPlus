# Candidate Detail View - API Requirements

> **Status**: Future Enhancement (Task 3.6)
> **Last Updated**: 2025-11-14
> **Related Component**: CandidateCardComponent

---

## Overview

This document outlines the backend API requirements needed to support the candidate detail view functionality. Currently, the `CandidateCardComponent` emits a `candidateSelected` event when clicked, but the full detail modal is not yet implemented.

## Current State

- ✅ Candidate cards display basic information from search results
- ✅ Candidate cards are clickable and emit `candidateSelected` event
- ✅ Cursor pointer styling and hover effects implemented
- ✅ Keyboard navigation support (Enter/Space keys)
- ❌ Detail modal component not yet created
- ❌ Full candidate profile API endpoint not yet implemented

---

## Required API Endpoints

### 1. Get Full Candidate Profile

**Endpoint**: `GET /api/v1/candidates/{candidateId}`

**Purpose**: Fetch comprehensive candidate information for the detail view

**Path Parameters**:
- `candidateId` (string, required): Unique identifier for the candidate

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Sarah Johnson",
  "title": "Senior Kotlin Developer",
  "location": "Zurich, Switzerland",
  "profilePicture": "https://cdn.example.com/profiles/550e8400.jpg",
  "email": "sarah.johnson@example.com",
  "phone": "+41 76 123 45 67",
  "linkedin": "https://linkedin.com/in/sarahjohnson",
  "github": "https://github.com/sarahjohnson",
  "portfolio": "https://sarahjohnson.dev",

  "experience": "8+ years",
  "availability": "Available",
  "noticePeriod": null,
  "expectedSalary": {
    "min": 120000,
    "max": 150000,
    "currency": "CHF"
  },

  "summary": "Passionate Kotlin developer with 8+ years of experience building scalable backend systems. Expert in Spring Boot, microservices architecture, and cloud-native applications. Strong focus on clean code and test-driven development.",

  "technologies": [
    "Kotlin",
    "Spring Boot",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "GraphQL",
    "Redis"
  ],

  "skills": [
    "Microservices Architecture",
    "RESTful API Design",
    "Test-Driven Development",
    "CI/CD",
    "Agile/Scrum",
    "Technical Leadership"
  ],

  "languages": [
    {
      "language": "English",
      "proficiency": "C2 (Native)"
    },
    {
      "language": "German",
      "proficiency": "B2 (Upper Intermediate)"
    },
    {
      "language": "French",
      "proficiency": "A2 (Elementary)"
    }
  ],

  "certifications": [
    {
      "name": "AWS Certified Solutions Architect - Professional",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-06",
      "expiryDate": "2026-06",
      "credentialId": "AWS-PSA-12345"
    },
    {
      "name": "Certified Kubernetes Administrator (CKA)",
      "issuer": "Cloud Native Computing Foundation",
      "issueDate": "2022-09",
      "expiryDate": "2025-09",
      "credentialId": "LF-CKA-67890"
    }
  ],

  "education": [
    {
      "degree": "Master of Science in Computer Science",
      "institution": "ETH Zurich",
      "location": "Zurich, Switzerland",
      "graduationDate": "2016-06",
      "gpa": "5.5/6.0"
    },
    {
      "degree": "Bachelor of Science in Software Engineering",
      "institution": "University of Zurich",
      "location": "Zurich, Switzerland",
      "graduationDate": "2014-06",
      "gpa": "5.2/6.0"
    }
  ],

  "workHistory": [
    {
      "company": "SwissBank AG",
      "title": "Senior Kotlin Developer",
      "location": "Zurich, Switzerland",
      "startDate": "2020-03",
      "endDate": null,
      "isCurrent": true,
      "description": "Leading the development of a cloud-native banking platform using Kotlin and Spring Boot microservices.",
      "technologies": ["Kotlin", "Spring Boot", "PostgreSQL", "Kubernetes", "AWS"]
    },
    {
      "company": "FinTech Solutions GmbH",
      "title": "Kotlin Developer",
      "location": "Zurich, Switzerland",
      "startDate": "2017-06",
      "endDate": "2020-02",
      "isCurrent": false,
      "description": "Developed payment processing services and API integrations for European markets.",
      "technologies": ["Kotlin", "Spring Framework", "MySQL", "Docker", "RabbitMQ"]
    }
  ],

  "currentProject": {
    "name": "Cloud Banking Platform Migration",
    "company": "SwissBank AG",
    "description": "Migrating legacy monolithic banking system to microservices architecture",
    "role": "Technical Lead",
    "technologies": ["Kotlin", "Spring Boot", "PostgreSQL", "Kubernetes", "AWS"]
  },

  "matchScore": {
    "matched": 0.92,
    "total": 1,
    "breakdown": {
      "skills": 0.95,
      "experience": 0.90,
      "location": 1.0,
      "availability": 1.0
    }
  },

  "resume": {
    "url": "https://cdn.example.com/resumes/550e8400.pdf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "fileSize": 245000
  },

  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-11-10T14:20:00Z",
    "lastActive": "2024-11-12T09:15:00Z",
    "profileViews": 87,
    "isVerified": true
  }
}
```

**Error Responses**:

- `404 Not Found`: Candidate not found
```json
{
  "error": "CandidateNotFound",
  "message": "No candidate found with ID: 550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-11-14T10:30:00Z"
}
```

- `403 Forbidden`: User not authorized to view this candidate
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to view this candidate profile",
  "timestamp": "2024-11-14T10:30:00Z"
}
```

- `500 Internal Server Error`: Server error
```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred while fetching candidate details",
  "timestamp": "2024-11-14T10:30:00Z"
}
```

---

## Frontend Implementation Plan

### 1. Create CandidateDetailModal Component

**Location**: `src/app/components/candidate-detail-modal/`

**Features**:
- Modal dialog using Angular Material Dialog
- Tabbed interface for different information sections:
  - Overview (summary, contact, availability)
  - Experience (work history, current project)
  - Skills & Certifications
  - Education
- Download resume button
- Share candidate button
- Close/dismiss functionality

**Component Structure**:
```typescript
@Component({
  selector: 'app-candidate-detail-modal',
  imports: [
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './candidate-detail-modal.component.html',
  styleUrl: './candidate-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateDetailModalComponent {
  readonly candidateId = input.required<string>();
  readonly candidate = signal<FullCandidateProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly candidateService = inject(CandidateService);
  private readonly dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      this.loadCandidateDetails(this.candidateId());
    });
  }

  private async loadCandidateDetails(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const profile = await this.candidateService.getCandidateById(id);
      this.candidate.set(profile);
    } catch (err) {
      this.error.set('Failed to load candidate details');
    } finally {
      this.loading.set(false);
    }
  }

  protected downloadResume(): void {
    const resume = this.candidate()?.resume;
    if (resume?.url) {
      window.open(resume.url, '_blank');
    }
  }

  protected close(): void {
    this.dialog.closeAll();
  }
}
```

### 2. Create CandidateService Method

**Location**: `src/app/services/candidate.service.ts`

**Method**:
```typescript
/**
 * Fetches full candidate profile by ID
 * @param candidateId - Unique candidate identifier
 * @returns Promise resolving to full candidate profile
 */
async getCandidateById(candidateId: string): Promise<FullCandidateProfile> {
  const response = await this.http.get<FullCandidateProfile>(
    `${this.apiBaseUrl}/candidates/${candidateId}`
  ).toPromise();

  if (!response) {
    throw new Error('Failed to fetch candidate details');
  }

  return response;
}
```

### 3. Update Parent Component to Handle Click Event

**Example** (SearchResultsComponent or similar):
```typescript
protected handleCandidateSelected(candidateId: string): void {
  // Open modal with candidate details
  const dialogRef = this.dialog.open(CandidateDetailModalComponent, {
    width: '900px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    data: { candidateId },
    panelClass: 'candidate-detail-modal'
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle modal close if needed
  });
}
```

### 4. Create FullCandidateProfile Interface

**Location**: `src/app/models/full-candidate-profile.model.ts`

```typescript
/**
 * Full Candidate Profile Model
 * Extended version of Candidate with complete details
 */
export interface FullCandidateProfile extends Candidate {
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  noticePeriod: string | null;
  expectedSalary: {
    min: number;
    max: number;
    currency: string;
  } | null;
  summary: string;
  languages: Language[];
  education: Education[];
  workHistory: WorkHistory[];
  resume: Resume | null;
  metadata: CandidateMetadata;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string | null;
}

export interface WorkHistory {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface Resume {
  url: string;
  uploadDate: string;
  fileSize: number;
}

export interface CandidateMetadata {
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  profileViews: number;
  isVerified: boolean;
}
```

---

## Backend Implementation Requirements

### Database Schema Extensions

The backend will need to extend the current `candidates` table or create related tables:

**candidates_details** table:
- `candidate_id` (UUID, FK to candidates)
- `email` (VARCHAR)
- `phone` (VARCHAR, nullable)
- `linkedin` (VARCHAR, nullable)
- `github` (VARCHAR, nullable)
- `portfolio` (VARCHAR, nullable)
- `summary` (TEXT)
- `notice_period` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**candidate_certifications** table:
- `id` (UUID, PK)
- `candidate_id` (UUID, FK)
- `name` (VARCHAR)
- `issuer` (VARCHAR)
- `issue_date` (DATE)
- `expiry_date` (DATE, nullable)
- `credential_id` (VARCHAR, nullable)

**candidate_education** table:
- `id` (UUID, PK)
- `candidate_id` (UUID, FK)
- `degree` (VARCHAR)
- `institution` (VARCHAR)
- `location` (VARCHAR)
- `graduation_date` (DATE)
- `gpa` (VARCHAR, nullable)

**candidate_work_history** table:
- `id` (UUID, PK)
- `candidate_id` (UUID, FK)
- `company` (VARCHAR)
- `title` (VARCHAR)
- `location` (VARCHAR)
- `start_date` (DATE)
- `end_date` (DATE, nullable)
- `is_current` (BOOLEAN)
- `description` (TEXT)
- `technologies` (JSONB)

**candidate_languages** table:
- `id` (UUID, PK)
- `candidate_id` (UUID, FK)
- `language` (VARCHAR)
- `proficiency` (VARCHAR)

### Kotlin Service Implementation

```kotlin
@Service
class CandidateDetailService(
    private val candidateRepository: CandidateRepository,
    private val candidateDetailsRepository: CandidateDetailsRepository,
    private val certificationRepository: CertificationRepository,
    private val educationRepository: EducationRepository,
    private val workHistoryRepository: WorkHistoryRepository,
    private val languageRepository: LanguageRepository
) {
    fun getCandidateById(candidateId: UUID): FullCandidateProfileDTO {
        val candidate = candidateRepository.findById(candidateId)
            .orElseThrow { CandidateNotFoundException(candidateId) }

        val details = candidateDetailsRepository.findByCandidateId(candidateId)
        val certifications = certificationRepository.findByCandidateId(candidateId)
        val education = educationRepository.findByCandidateId(candidateId)
        val workHistory = workHistoryRepository.findByCandidateId(candidateId)
        val languages = languageRepository.findByCandidateId(candidateId)

        return FullCandidateProfileDTO(
            // Map all fields
            id = candidate.id,
            name = candidate.name,
            // ... other fields
            certifications = certifications.map { it.toDTO() },
            education = education.map { it.toDTO() },
            workHistory = workHistory.map { it.toDTO() },
            languages = languages.map { it.toDTO() }
        )
    }
}
```

---

## Performance Considerations

1. **Caching**: Implement Redis caching for frequently accessed candidate profiles
2. **Lazy Loading**: Only fetch detailed information when modal opens (current design)
3. **Pagination**: If work history is extensive, consider pagination
4. **Compression**: Enable GZIP compression for API responses
5. **CDN**: Store resumes and profile pictures on CDN (S3 + CloudFront)

---

## Security Considerations

1. **Authorization**: Verify user has permission to view candidate details
2. **Rate Limiting**: Limit API requests to prevent abuse
3. **PII Protection**: Encrypt sensitive data (email, phone) at rest
4. **Audit Logging**: Log all profile view events for compliance
5. **Resume Access**: Generate temporary signed URLs for resume downloads

---

## Testing Requirements

### Unit Tests
- ✅ CandidateCardComponent click handler emits correct ID
- ❌ CandidateDetailModalComponent fetches and displays data
- ❌ CandidateService.getCandidateById() handles errors correctly
- ❌ Resume download functionality works

### Integration Tests
- ❌ Full flow: Click card → Fetch data → Display modal → Download resume
- ❌ Error handling: 404, 403, 500 responses
- ❌ Loading states display correctly

### Accessibility Tests
- ❌ Modal is keyboard accessible (Escape to close)
- ❌ Screen reader announces modal content correctly
- ❌ Focus management when modal opens/closes

---

## Timeline Estimate

- **Backend API Development**: 2-3 days
- **Database Schema**: 1 day
- **Frontend Modal Component**: 2 days
- **Integration & Testing**: 1-2 days
- **Total**: ~6-8 days

---

## References

- [Angular Material Dialog](https://material.angular.io/components/dialog/overview)
- [Spring Boot REST API Best Practices](https://spring.io/guides/tutorials/rest/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [WCAG Modal Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

---

**Document Status**: ✅ Complete
**Ready for Implementation**: ⏳ Pending backend API development

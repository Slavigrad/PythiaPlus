# Project Management API Test Suite

## 📋 Overview

This directory contains comprehensive HTTP test files for the **Pythia Project Management System** REST API. The test suite is designed to work with the **Visionary Dataset** - a rich, realistic collection of 15 flagship projects across diverse industries.

## 🎯 Visionary Dataset Summary

The test suite leverages a comprehensive dataset that showcases the full power of the project management system:

- **15 Flagship Projects** across 10+ industries
- **37 Project Tags** (AI/ML, Cloud Native, FinTech, HealthTech, etc.)
- **47 Technology Assignments** (Python, Kubernetes, React, Node.js, etc.)
- **34 Skill Mappings** (Machine Learning, Microservices, Cloud Architecture, etc.)
- **20 Team Assignments** with leads and architects
- **21 Project Milestones** with various statuses

### Featured Projects

1. **QuantumTrade AI Platform** - FinTech + AI/ML (€500K-€1M, 4 team members)
2. **MediConnect Telemedicine** - HealthTech (€250K-€500K, COMPLETED)
3. **ArtisanMarket Platform** - E-Commerce (€100K-€250K)
4. **CityPulse IoT Network** - IoT + Analytics (€1M-€5M, 11-20 team size)
5. **ChainTrack Supply Network** - Blockchain (€250K-€500K)
6. **Legacy to Cloud Migration** - DevOps (€500K-€1M, COMPLETED)
7. **GameVerse Multiplayer** - Mobile Gaming (€100K-€250K)
8. **SafeSpace AI Moderator** - AI/ML + Security (COMPLETED)
9. **FreshBite Delivery MVP** - Startup MVP (<€100K)
10. **DevToolkit Open Source** - Open Source (<€100K)
11. **DataStream Analytics** - Analytics + Real-time (€250K-€500K)
12. **ShieldGuard Security Suite** - Security (€500K-€1M, COMPLETED)
13. **TalentHub HR Platform** - Internal Tool (€100K-€250K)
14. **Monolith to Microservices** - Modernization (€1M-€5M, COMPLETED)
15. **ConversaAI Chatbot** - AI/ML (€250K-€500K)

## 📁 Test Files

### 1. `pythia-api-tests-projects-visionary.http`
**Main project management API tests**

- **Sections:**
  - Project Listing & Filtering (by status, industry, company)
  - Project Details (get individual projects with full data)
  - Full-Text Search (search by keywords, technologies, skills)
  - Project Statistics (overall stats, counts, averages)
  - Create New Project (POST requests with validation)
  - Update Project (PUT requests for status, ratings, etc.)
  - Delete Project (DELETE with cascade)
  - Advanced Queries (budget ranges, success ratings, team sizes)

- **Key Endpoints:**
  - `GET /api/v1/projects` - List all projects
  - `GET /api/v1/projects?status=ACTIVE` - Filter by status
  - `GET /api/v1/projects/{id}` - Get project details
  - `GET /api/v1/projects/search?q=kubernetes` - Full-text search
  - `GET /api/v1/projects/stats` - Project statistics
  - `POST /api/v1/projects` - Create project
  - `PUT /api/v1/projects/{id}` - Update project
  - `DELETE /api/v1/projects/{id}` - Delete project

### 2. `pythia-api-tests-employee-projects.http`
**Employee-project assignment tests**

- **Sections:**
  - Get Employee Project Assignments
  - Get Project Leads and Architects
  - Current Assignments (active projects)
  - Create Employee Project Assignment
  - Update Assignment (achievements, roles, end dates)
  - Remove Employee from Project
  - Advanced Queries (by role, with achievements)
  - Validation Tests

- **Key Endpoints:**
  - `GET /api/v1/employee-projects` - All assignments
  - `GET /api/v1/employee-projects/employee/{id}` - Employee's projects
  - `GET /api/v1/employee-projects/project/{id}` - Project's team
  - `GET /api/v1/employee-projects/leads` - All project leads
  - `GET /api/v1/employee-projects/architects` - All architects
  - `POST /api/v1/employee-projects` - Assign employee to project
  - `PUT /api/v1/employee-projects/{employeeId}/{projectId}` - Update assignment
  - `DELETE /api/v1/employee-projects/{employeeId}/{projectId}` - Remove assignment

### 3. `pythia-api-tests-milestones.http`
**Project milestone management tests**

- **Sections:**
  - Get Milestones (all, by project, by ID)
  - Filter by Status (COMPLETED, IN_PROGRESS, PENDING)
  - Overdue and Upcoming Milestones
  - Create Milestones (planning, development, deployment, compliance)
  - Update Milestones (status, completion, deliverables)
  - Delete Milestones
  - Milestone Statistics
  - Advanced Queries (date ranges, critical milestones)
  - Validation Tests

- **Key Endpoints:**
  - `GET /api/v1/milestones` - All milestones
  - `GET /api/v1/milestones/project/{id}` - Project milestones
  - `GET /api/v1/milestones/overdue` - Overdue milestones
  - `GET /api/v1/milestones/upcoming?days=30` - Upcoming milestones
  - `POST /api/v1/milestones` - Create milestone
  - `PUT /api/v1/milestones/{id}` - Update milestone
  - `DELETE /api/v1/milestones/{id}` - Delete milestone

### 4. `pythia-api-tests-tags.http`
**Project tag and categorization tests**

- **Sections:**
  - Get Tags (all, by ID, by name)
  - Filter by Category (Technology, Industry, Infrastructure, etc.)
  - Get Projects by Tag
  - Create Tags (technology, industry, architecture, etc.)
  - Update Tags (name, color, category)
  - Assign Tags to Projects
  - Remove Tags from Projects
  - Tag Statistics (usage, popularity, distribution)
  - Search and Filter
  - Bulk Operations
  - Delete Tags
  - Tag Analytics (co-occurrence, trends, tag cloud)
  - Validation Tests
  - Visionary Dataset Verification

- **Key Endpoints:**
  - `GET /api/v1/tags` - All tags
  - `GET /api/v1/tags?category=Technology` - Filter by category
  - `GET /api/v1/tags/{id}/projects` - Projects with tag
  - `GET /api/v1/tags/stats` - Tag statistics
  - `POST /api/v1/tags` - Create tag
  - `PUT /api/v1/tags/{id}` - Update tag
  - `POST /api/v1/tags/{tagId}/projects/{projectId}` - Assign tag
  - `DELETE /api/v1/tags/{tagId}/projects/{projectId}` - Remove tag

## 🚀 Getting Started

### Prerequisites

1. **Backend Running**: Ensure the Pythia backend is running on `http://localhost:8080`
2. **Database**: PostgreSQL database `pythia-pgvector` with visionary dataset loaded
3. **Migrations**: Run migrations `006_visionary_project_dataset.sql` and `007_visionary_team_assignments.sql`

### Loading the Visionary Dataset

```bash
# From the Pythia root directory
docker exec -i pythia-pgvector psql -U pythia -d pythia < pythia-deployment/src/docker/pythia-runtime/migrations/006_visionary_project_dataset.sql

docker exec -i pythia-pgvector psql -U pythia -d pythia < pythia-deployment/src/docker/pythia-runtime/migrations/007_visionary_team_assignments.sql
```

### Running Tests

#### Using IntelliJ IDEA / VS Code

1. Install the **REST Client** extension (VS Code) or use built-in HTTP Client (IntelliJ)
2. Open any `.http` file
3. Click the **Run** button next to each request
4. View responses in the output panel

#### Using curl

You can convert any HTTP request to curl:

```bash
# Example: Get all projects
curl -X GET "http://localhost:8080/api/v1/projects" \
  -H "Accept: application/json"

# Example: Search for AI projects
curl -X GET "http://localhost:8080/api/v1/projects/search?q=machine%20learning" \
  -H "Accept: application/json"

# Example: Create a new project
curl -X POST "http://localhost:8080/api/v1/projects" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "New AI Project",
    "code": "NAI-2025",
    "description": "A new AI project",
    "company": "AI Corp",
    "industry": "Technology",
    "projectType": "Product Development",
    "budgetRange": "€100K-€250K",
    "teamSizeRange": "6-10",
    "startDate": "2025-01-01",
    "status": "PLANNING",
    "priority": "HIGH",
    "complexity": "HIGH"
  }'
```

## 📊 Test Coverage

### API Endpoints Tested

- ✅ **Projects**: 13 endpoints (CRUD, search, stats, filtering)
- ✅ **Employee Projects**: 10 endpoints (assignments, leads, architects)
- ✅ **Milestones**: 8 endpoints (CRUD, overdue, upcoming, stats)
- ✅ **Tags**: 15 endpoints (CRUD, categorization, analytics)

### Test Scenarios

- ✅ **Happy Path**: Standard CRUD operations
- ✅ **Filtering**: Status, industry, company, category filters
- ✅ **Search**: Full-text search across projects
- ✅ **Validation**: Invalid data, missing fields, non-existent IDs
- ✅ **Edge Cases**: Empty results, duplicate data, cascading deletes
- ✅ **Analytics**: Statistics, trends, distributions

## 🎨 Response Examples

### Project Details Response
```json
{
  "id": 1,
  "name": "QuantumTrade AI Platform",
  "code": "QT-AI-2024",
  "description": "Next-generation algorithmic trading platform...",
  "company": "QuantumTrade Financial",
  "industry": "Financial Technology",
  "projectType": "Product Development",
  "budgetRange": "€500K-€1M",
  "teamSizeRange": "6-10",
  "startDate": "2023-01-15",
  "endDate": null,
  "status": "ACTIVE",
  "priority": "CRITICAL",
  "complexity": "VERY_HIGH",
  "successRating": 4.8,
  "clientSatisfaction": 4.7,
  "websiteUrl": "https://quantumtrade.ai",
  "repositoryUrl": "https://github.com/quantumtrade/platform",
  "technologies": ["Python", "AWS", "Kubernetes", "PostgreSQL", "React"],
  "skills": ["Machine Learning", "Microservices", "Cloud Architecture"],
  "tags": ["AI/ML", "FinTech", "Cloud Native", "Real-time"],
  "teamMembers": 4,
  "milestones": 4
}
```

## 🔍 Tips for Testing

1. **Start with GET requests** to understand the data structure
2. **Use project IDs from responses** in subsequent requests
3. **Test filters incrementally** - start with one filter, then combine
4. **Verify cascade deletes** - check related data after deletions
5. **Test validation** - try invalid data to ensure proper error handling
6. **Check statistics** - verify counts match your expectations

## 📝 Notes

- All dates are in ISO 8601 format (`YYYY-MM-DD`)
- Project IDs are auto-generated (start from 1)
- Employee IDs range from 1-10 in the visionary dataset
- Tag IDs range from 1-15 in the visionary dataset
- Milestone statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `DELAYED`
- Project statuses: `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED`, `ARCHIVED`

## 🐛 Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Check backend logs
docker logs pythia-backend
```

### Empty results
```bash
# Verify dataset is loaded
docker exec -i pythia-pgvector psql -U pythia -d pythia -c "SELECT COUNT(*) FROM md_projects;"
```

### 404 errors
- Verify the endpoint path matches the controller mapping
- Check if the resource ID exists in the database

## 📚 Related Documentation

- [Project Management System Architecture](../../../../00-local-documentation/09-projects/)
- [Database Schema](../../../../pythia-deployment/src/docker/pythia-runtime/migrations/)
- [REST Controllers](../../../../pythia-backend/src/main/kotlin/net/slavigrad/pythia/adapters/web/v1/api/controller/)

## 🎉 Happy Testing!

This test suite demonstrates the **FULL POWER** of the Pythia Project Management System with realistic, comprehensive data across diverse industries and use cases.


# Project Management API - Quick Reference

## 🚀 Quick Start

```bash
# 1. Load the visionary dataset
docker exec -i pythia-pgvector psql -U pythia -d pythia < pythia-deployment/src/docker/pythia-runtime/migrations/006_visionary_project_dataset.sql
docker exec -i pythia-pgvector psql -U pythia -d pythia < pythia-deployment/src/docker/pythia-runtime/migrations/007_visionary_team_assignments.sql

# 2. Start the backend
cd pythia-backend
./gradlew bootRun

# 3. Open any .http file in IntelliJ/VS Code and start testing!
```

## 📋 API Endpoints Cheat Sheet

### Projects (`/api/v1/projects`)

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/projects` | Get all projects | `?status=ACTIVE&industry=FinTech` |
| GET | `/projects/{id}` | Get project by ID | `/projects/1` |
| GET | `/projects/search` | Full-text search | `?q=kubernetes` |
| GET | `/projects/stats` | Project statistics | - |
| POST | `/projects` | Create project | See JSON below |
| PUT | `/projects/{id}` | Update project | See JSON below |
| DELETE | `/projects/{id}` | Delete project | `/projects/1` |

### Employee Projects (`/api/v1/employee-projects`)

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/employee-projects` | All assignments | - |
| GET | `/employee-projects/employee/{id}` | Employee's projects | `/employee-projects/employee/1` |
| GET | `/employee-projects/project/{id}` | Project's team | `/employee-projects/project/1` |
| GET | `/employee-projects/leads` | All project leads | - |
| GET | `/employee-projects/architects` | All architects | - |
| POST | `/employee-projects` | Assign employee | See JSON below |
| PUT | `/employee-projects/{empId}/{projId}` | Update assignment | See JSON below |
| DELETE | `/employee-projects/{empId}/{projId}` | Remove assignment | - |

### Milestones (`/api/v1/milestones`)

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/milestones` | All milestones | `?status=COMPLETED` |
| GET | `/milestones/project/{id}` | Project milestones | `/milestones/project/1` |
| GET | `/milestones/overdue` | Overdue milestones | - |
| GET | `/milestones/upcoming` | Upcoming milestones | `?days=30` |
| POST | `/milestones` | Create milestone | See JSON below |
| PUT | `/milestones/{id}` | Update milestone | See JSON below |
| DELETE | `/milestones/{id}` | Delete milestone | - |

### Tags (`/api/v1/tags`)

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/tags` | All tags | `?category=Technology` |
| GET | `/tags/{id}/projects` | Projects with tag | `/tags/1/projects` |
| GET | `/tags/stats` | Tag statistics | - |
| POST | `/tags` | Create tag | See JSON below |
| PUT | `/tags/{id}` | Update tag | See JSON below |
| POST | `/tags/{tagId}/projects/{projId}` | Assign tag | - |
| DELETE | `/tags/{tagId}/projects/{projId}` | Remove tag | - |

## 📝 JSON Request Examples

### Create Project
```json
{
  "name": "AI Vision Platform",
  "code": "AIV-2025",
  "description": "Computer vision platform for image recognition",
  "company": "VisionTech AI",
  "industry": "Artificial Intelligence",
  "projectType": "Product Development",
  "budgetRange": "€250K-€500K",
  "teamSizeRange": "6-10",
  "startDate": "2025-01-15",
  "status": "PLANNING",
  "priority": "HIGH",
  "complexity": "VERY_HIGH"
}
```

### Update Project
```json
{
  "status": "ACTIVE",
  "priority": "CRITICAL",
  "successRating": 4.8,
  "clientSatisfaction": 4.9
}
```

### Assign Employee to Project
```json
{
  "employeeId": 1,
  "projectId": 5,
  "roleDescription": "Technical Lead & Backend Architect",
  "startDate": "2024-01-15",
  "isLead": true,
  "isArchitect": true,
  "responsibilities": "Leading backend development, architecture design, team mentoring",
  "achievements": null
}
```

### Create Milestone
```json
{
  "projectId": 1,
  "name": "MVP Launch",
  "description": "Launch minimum viable product",
  "dueDate": "2025-06-30",
  "status": "PENDING",
  "deliverables": "MVP release, API documentation, deployment guide"
}
```

### Create Tag
```json
{
  "name": "Quantum Computing",
  "category": "Technology",
  "color": "#9B59B6"
}
```

## 🎯 Common Use Cases

### 1. Find all AI/ML projects
```http
GET http://localhost:8080/api/v1/projects/search?q=machine learning
```

### 2. Get active FinTech projects
```http
GET http://localhost:8080/api/v1/projects?status=ACTIVE&industry=Financial Technology
```

### 3. Get project team with roles
```http
GET http://localhost:8080/api/v1/employee-projects/project/1
```

### 4. Find overdue milestones
```http
GET http://localhost:8080/api/v1/milestones/overdue
```

### 5. Get all projects tagged with "Cloud Native"
```http
GET http://localhost:8080/api/v1/tags/2/projects
```

### 6. Get project statistics
```http
GET http://localhost:8080/api/v1/projects/stats
```

### 7. Find all project leads
```http
GET http://localhost:8080/api/v1/employee-projects/leads
```

### 8. Get upcoming milestones (next 30 days)
```http
GET http://localhost:8080/api/v1/milestones/upcoming?days=30
```

## 🔍 Visionary Dataset Quick Facts

### Projects by Status
- **ACTIVE**: 9 projects (QuantumTrade, ArtisanMarket, CityPulse, ChainTrack, GameVerse, FreshBite, DataStream, TalentHub, ConversaAI)
- **COMPLETED**: 5 projects (MediConnect, Legacy to Cloud, ShieldGuard, SafeSpace, Monolith to Microservices)

### Projects by Budget Range
- **<€100K**: 2 projects (FreshBite, DevToolkit)
- **€100K-€250K**: 3 projects (ArtisanMarket, GameVerse, TalentHub)
- **€250K-€500K**: 5 projects (MediConnect, ChainTrack, SafeSpace, DataStream, ConversaAI)
- **€500K-€1M**: 3 projects (QuantumTrade, Legacy to Cloud, ShieldGuard)
- **€1M-€5M**: 2 projects (CityPulse, Monolith to Microservices)

### Top Tags
1. **AI/ML** - 3 projects (QuantumTrade, SafeSpace, ConversaAI)
2. **Cloud Native** - Multiple projects
3. **DevOps** - 2 projects (Legacy to Cloud, Monolith to Microservices)
4. **FinTech** - 1 project (QuantumTrade)
5. **HealthTech** - 1 project (MediConnect)

### Team Assignments
- **Total**: 20 assignments
- **Leads**: Multiple (Marcus Chen, Catalina Mora, etc.)
- **Architects**: Multiple on complex projects
- **Largest Team**: QuantumTrade (4 members)

### Milestones
- **Total**: 21 milestones
- **COMPLETED**: 17 milestones
- **IN_PROGRESS**: 1 milestone (Real-time Analytics Dashboard)
- **PENDING**: 1 milestone (Predictive Maintenance AI)

## 🎨 Project IDs Reference

| ID | Code | Name | Status | Budget |
|----|------|------|--------|--------|
| 1 | QT-AI-2024 | QuantumTrade AI Platform | ACTIVE | €500K-€1M |
| 2 | MC-TELE-2023 | MediConnect Telemedicine | COMPLETED | €250K-€500K |
| 3 | CP-IOT-2023 | CityPulse IoT Network | ACTIVE | €1M-€5M |
| 4 | AM-MARKET-2024 | ArtisanMarket Platform | ACTIVE | €100K-€250K |
| 5 | CT-CHAIN-2024 | ChainTrack Supply Network | ACTIVE | €250K-€500K |
| 6 | L2C-MIG-2023 | Legacy to Cloud Migration | COMPLETED | €500K-€1M |
| 7 | GV-GAME-2024 | GameVerse Multiplayer | ACTIVE | €100K-€250K |
| 8 | SS-AI-2023 | SafeSpace AI Moderator | COMPLETED | €250K-€500K |
| 9 | FB-MVP-2024 | FreshBite Delivery MVP | ACTIVE | <€100K |
| 10 | DT-OSS-2023 | DevToolkit Open Source | ACTIVE | <€100K |
| 11 | DS-ANALYTICS-2024 | DataStream Analytics | ACTIVE | €250K-€500K |
| 12 | SG-SEC-2023 | ShieldGuard Security Suite | COMPLETED | €500K-€1M |
| 13 | TH-HR-2024 | TalentHub HR Platform | ACTIVE | €100K-€250K |
| 14 | M2M-REFACTOR-2023 | Monolith to Microservices | COMPLETED | €1M-€5M |
| 15 | CA-BOT-2024 | ConversaAI Chatbot | ACTIVE | €250K-€500K |

## 🏷️ Tag IDs Reference

| ID | Name | Category | Color |
|----|------|----------|-------|
| 1 | AI/ML | Technology | #FF6B6B |
| 2 | Cloud Native | Infrastructure | #4ECDC4 |
| 3 | Mobile First | Platform | #45B7D1 |
| 4 | Enterprise | Scale | #96CEB4 |
| 5 | Startup MVP | Stage | #FFEAA7 |
| 6 | Open Source | Type | #DFE6E9 |
| 7 | FinTech | Industry | #74B9FF |
| 8 | HealthTech | Industry | #A29BFE |
| 9 | E-Commerce | Industry | #FD79A8 |
| 10 | DevOps | Practice | #FDCB6E |
| 11 | Real-time | Architecture | #E17055 |
| 12 | Blockchain | Technology | #00B894 |
| 13 | IoT | Technology | #00CEC9 |
| 14 | Security | Focus | #D63031 |
| 15 | Analytics | Focus | #6C5CE7 |

## 💡 Pro Tips

1. **Use project codes** for easy identification (e.g., `QT-AI-2024`)
2. **Filter by multiple criteria** to narrow down results
3. **Check team assignments** before deleting projects
4. **Use full-text search** for flexible queries
5. **Monitor milestones** to track project progress
6. **Tag projects** for better organization and discovery
7. **Document achievements** in employee assignments for CV generation

## 🔗 Quick Links

- [Full README](./README.md)
- [Projects Tests](./pythia-api-tests-projects-visionary.http)
- [Employee Projects Tests](./pythia-api-tests-employee-projects.http)
- [Milestones Tests](./pythia-api-tests-milestones.http)
- [Tags Tests](./pythia-api-tests-tags.http)


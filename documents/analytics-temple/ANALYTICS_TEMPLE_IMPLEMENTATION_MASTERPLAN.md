# Analytics Temple Implementation Masterplan
## 🏛️ Complete Roadmap for Backend API Enhancement & Integration

> **Created**: 2025-11-20
> **Project**: PythiaPlus Analytics Temple
> **Duration**: 6-8 weeks
> **Team**: Backend (Kotlin/Spring Boot) + Frontend (Angular 20) + QA
> **Status**: Planning Phase

---

## 🎯 Vision & Objectives

### Vision Statement
Transform the Analytics Temple from a visually stunning showcase into a **data-driven intelligence platform** that provides real-time insights, predictive analytics, and actionable recommendations for project portfolio management.

### Strategic Objectives
1. **Enable Real-Time Analytics**: All 4 chart components powered by live backend data
2. **Optimize Performance**: Single API call dashboard endpoint (< 500ms response time)
3. **Establish Foundation**: Historical data tracking for ML-powered insights
4. **Ensure Quality**: 85%+ test coverage, WCAG AA compliance, production-ready code

### Success Metrics
- ✅ 4/4 Analytics Temple charts displaying real data
- ✅ 8/8 KPI metrics live and accurate
- ✅ < 500ms dashboard load time (P95)
- ✅ 85%+ backend test coverage
- ✅ 90+ Lighthouse performance score
- ✅ Zero critical accessibility issues

---

## 📋 Phase Overview

| Phase | Duration | Focus | Deliverables | Status |
|-------|----------|-------|--------------|--------|
| **Phase 0: Discovery** | 3-5 days | Analysis & Planning | Technical specs, DB schema | 📝 Planning |
| **Phase 1: Foundation** | 1-2 weeks | Core Analytics API | Extended stats endpoint | 🎯 Priority |
| **Phase 2: Visualization** | 1-2 weeks | Chart Data Endpoints | Budget, Tech, Progress APIs | 🎯 Priority |
| **Phase 3: Integration** | 1 week | Frontend Connection | Service updates, testing | 🎯 Priority |
| **Phase 4: Optimization** | 1 week | Performance & Caching | Dashboard endpoint, Redis | ⚡ Enhancement |
| **Phase 5: Intelligence** | 2-3 weeks | Historical & ML | Snapshots, predictions | 🚀 Future |

**Total Duration**: 6-8 weeks for Phases 0-4 (MVP), +2-3 weeks for Phase 5 (Advanced)

---

## 📦 Phase 0: Discovery & Planning
### Duration: 3-5 days
### Goal: Understand current state, validate assumptions, finalize technical design

### Tasks

#### Backend Analysis
- [ ] **Task 0.1**: Database Schema Audit (Day 1)
  - **Owner**: Backend Lead
  - **Description**: Review existing `projects`, `employee_projects`, `project_technologies` tables
  - **Deliverable**: Schema documentation with field mappings
  - **Questions to Answer**:
    - Do `budget_allocated`, `budget_spent` columns exist?
    - Is `progress_percentage` tracked? (DECIMAL field?)
    - Are there audit tables for historical tracking?
    - How is technology data structured?
  - **Tools**: Database diagram tool, SQL queries
  - **Estimate**: 4 hours

- [ ] **Task 0.2**: API Endpoint Inventory (Day 1)
  - **Owner**: Backend Developer
  - **Description**: List all existing project-related endpoints
  - **Deliverable**: Endpoint matrix (URL, method, response schema, usage)
  - **Check**: `/projects/stats`, `/tags/stats`, `/milestones/*`
  - **Estimate**: 2 hours

- [ ] **Task 0.3**: Data Quality Assessment (Day 2)
  - **Owner**: Backend Developer + Data Analyst
  - **Description**: Analyze quality of existing project data
  - **Deliverable**: Data quality report
  - **Metrics to Check**:
    - % of projects with budget data
    - % with progress tracking
    - % with complete team assignments
    - Data freshness (last updated timestamps)
  - **SQL Queries**:
    ```sql
    -- Budget data completeness
    SELECT
      COUNT(*) as total_projects,
      COUNT(budget_allocated) as has_budget_allocated,
      COUNT(budget_spent) as has_budget_spent,
      ROUND(COUNT(budget_allocated)::decimal / COUNT(*) * 100, 2) as budget_coverage_pct
    FROM projects;

    -- Progress tracking completeness
    SELECT
      status,
      COUNT(*) as project_count,
      AVG(progress_percentage) as avg_progress,
      MIN(progress_percentage) as min_progress,
      MAX(progress_percentage) as max_progress
    FROM projects
    GROUP BY status;
    ```
  - **Estimate**: 4 hours

- [ ] **Task 0.4**: Performance Baseline (Day 2)
  - **Owner**: Backend Developer
  - **Description**: Measure current API response times
  - **Deliverable**: Performance baseline report
  - **Endpoints to Test**:
    - `GET /projects` (list)
    - `GET /projects/stats`
    - `GET /projects/{id}` (detail)
  - **Metrics**: P50, P95, P99 response times with 100, 500, 1000 projects
  - **Tools**: JMeter, Postman, k6
  - **Estimate**: 4 hours

#### Frontend Analysis
- [ ] **Task 0.5**: Component Inventory (Day 1)
  - **Owner**: Frontend Lead
  - **Description**: Document all Analytics Temple components
  - **Deliverable**: Component matrix (name, props, events, data needs)
  - **Components**:
    - AnalyticsOverviewComponent (8 KPI cards)
    - StatusDistributionChartComponent (doughnut)
    - BudgetTimelineChartComponent (line)
    - ProgressGaugeChartComponent (gauge)
    - TechnologyStackChartComponent (bar)
  - **Estimate**: 2 hours

- [ ] **Task 0.6**: Mock Data Analysis (Day 1)
  - **Owner**: Frontend Developer
  - **Description**: Document structure of current mock data
  - **Deliverable**: Mock data schemas (TypeScript interfaces)
  - **Purpose**: Ensure backend responses match frontend expectations
  - **Estimate**: 2 hours

#### Design & Architecture
- [ ] **Task 0.7**: API Schema Design Review (Day 3)
  - **Owner**: Backend Lead + Frontend Lead
  - **Description**: Review proposed OpenAPI schemas from enhancement doc
  - **Deliverable**: Finalized OpenAPI YAML updates
  - **Process**:
    1. Review each proposed endpoint
    2. Validate response schemas match frontend needs
    3. Adjust field names/types if needed
    4. Add validation rules
  - **Estimate**: 4 hours

- [ ] **Task 0.8**: Database Migration Planning (Day 3)
  - **Owner**: Backend Lead + DBA
  - **Description**: Plan database schema changes (if needed)
  - **Deliverable**: Migration scripts (Flyway/Liquibase)
  - **Changes Needed**:
    - Add missing columns (if any)
    - Create indexes for analytics queries
    - Create `project_snapshots` table (Phase 5)
  - **Estimate**: 4 hours

- [ ] **Task 0.9**: Caching Strategy Design (Day 4)
  - **Owner**: Backend Architect
  - **Description**: Design caching architecture
  - **Deliverable**: Caching design document
  - **Decisions**:
    - Redis vs. in-memory vs. database caching?
    - TTL values per endpoint
    - Cache invalidation strategy
    - Cache warming strategy
  - **Estimate**: 4 hours

- [ ] **Task 0.10**: Testing Strategy (Day 4)
  - **Owner**: QA Lead + Backend Lead
  - **Description**: Define testing approach
  - **Deliverable**: Test plan document
  - **Coverage**:
    - Unit tests (85%+ target)
    - Integration tests (API contract tests)
    - Performance tests (load testing)
    - E2E tests (frontend integration)
  - **Estimate**: 4 hours

- [ ] **Task 0.11**: Sprint Planning (Day 5)
  - **Owner**: Project Manager + Tech Leads
  - **Description**: Break down phases into 2-week sprints
  - **Deliverable**: Sprint backlog with story points
  - **Estimate**: 4 hours

#### Documentation
- [ ] **Task 0.12**: Technical Specification Document (Day 5)
  - **Owner**: Tech Lead
  - **Description**: Consolidate all findings into master tech spec
  - **Deliverable**: Tech spec PDF/Markdown
  - **Sections**:
    - Current state analysis
    - Target architecture
    - API specifications
    - Database schema
    - Caching design
    - Testing strategy
    - Deployment plan
  - **Estimate**: 4 hours

### Phase 0 Deliverables
- ✅ Database schema documentation
- ✅ Data quality report
- ✅ Performance baseline report
- ✅ Finalized OpenAPI specifications
- ✅ Migration scripts (if needed)
- ✅ Caching design document
- ✅ Test plan
- ✅ Technical specification document
- ✅ Sprint backlog

### Phase 0 Dependencies
- **Required**: Access to production/staging database
- **Required**: OpenAPI spec repository access
- **Required**: Frontend Analytics Temple code review

### Phase 0 Success Criteria
- [ ] All team members aligned on technical approach
- [ ] No blocking issues identified
- [ ] Database schema validated
- [ ] API contracts agreed between frontend/backend
- [ ] Sprint backlog estimated and prioritized

---

## 🏗️ Phase 1: Foundation - Core Analytics API
### Duration: 1-2 weeks (Sprint 1)
### Goal: Extend `/projects/stats` endpoint with comprehensive analytics

### Tasks

#### Backend Development
- [ ] **Task 1.1**: Create Analytics Service Layer (Day 1)
  - **Owner**: Backend Developer 1
  - **Description**: Create `ProjectAnalyticsService` in Kotlin
  - **File**: `com.pythiaplus.projects.service.ProjectAnalyticsService`
  - **Dependencies**: `ProjectRepository`, `EmployeeProjectRepository`, `ProjectTechnologyRepository`
  - **Methods to Implement**:
    ```kotlin
    fun calculateBudgetAnalytics(): BudgetAnalytics
    fun calculateProgressMetrics(): ProgressMetrics
    fun calculateTeamAnalytics(): TeamAnalytics
    fun calculateTechnologyStats(): TechnologyStats
    fun calculateTimelinePerformance(): TimelinePerformance
    ```
  - **Estimate**: 1 day

- [ ] **Task 1.2**: Budget Analytics Implementation (Day 2)
  - **Owner**: Backend Developer 1
  - **Description**: Implement budget aggregation logic
  - **Deliverable**: Budget calculation methods
  - **Calculations**:
    ```kotlin
    data class BudgetAnalytics(
        val totalBudgetAllocated: BigDecimal,
        val totalBudgetSpent: BigDecimal,
        val budgetUtilizationPercentage: Double,
        val averageProjectBudget: BigDecimal,
        val projectsOverBudget: Int,
        val projectsUnderBudget: Int
    )

    fun calculateBudgetAnalytics(): BudgetAnalytics {
        val projects = projectRepository.findAll()
        val totalAllocated = projects.sumOf { it.budgetAllocated ?: BigDecimal.ZERO }
        val totalSpent = projects.sumOf { it.budgetSpent ?: BigDecimal.ZERO }
        val utilization = if (totalAllocated > BigDecimal.ZERO) {
            (totalSpent.toDouble() / totalAllocated.toDouble()) * 100
        } else 0.0

        return BudgetAnalytics(
            totalBudgetAllocated = totalAllocated,
            totalBudgetSpent = totalSpent,
            budgetUtilizationPercentage = utilization,
            averageProjectBudget = totalAllocated / projects.size.toBigDecimal(),
            projectsOverBudget = projects.count {
                (it.budgetSpent ?: BigDecimal.ZERO) > (it.budgetAllocated ?: BigDecimal.ZERO)
            },
            projectsUnderBudget = projects.count {
                (it.budgetSpent ?: BigDecimal.ZERO) <= (it.budgetAllocated ?: BigDecimal.ZERO)
            }
        )
    }
    ```
  - **SQL Optimization**: Consider using native query for performance
  - **Estimate**: 1 day

- [ ] **Task 1.3**: Progress Metrics Implementation (Day 3)
  - **Owner**: Backend Developer 1
  - **Description**: Implement progress calculation and distribution
  - **Deliverable**: Progress metrics methods
  - **Calculations**:
    ```kotlin
    data class ProgressMetrics(
        val averageProgress: Double,
        val medianProgress: Double,
        val progressDistribution: ProgressDistribution
    )

    data class ProgressDistribution(
        val notStarted: Int,      // 0-10%
        val early: Int,            // 11-33%
        val midway: Int,           // 34-66%
        val advanced: Int,         // 67-90%
        val nearCompletion: Int    // 91-100%
    )

    fun calculateProgressMetrics(): ProgressMetrics {
        val activeProjects = projectRepository.findByStatus(ProjectStatus.ACTIVE)
        val progressValues = activeProjects.map { it.progressPercentage ?: 0.0 }

        return ProgressMetrics(
            averageProgress = progressValues.average(),
            medianProgress = progressValues.sorted()[progressValues.size / 2],
            progressDistribution = ProgressDistribution(
                notStarted = activeProjects.count { (it.progressPercentage ?: 0.0) <= 10.0 },
                early = activeProjects.count { (it.progressPercentage ?: 0.0) in 11.0..33.0 },
                midway = activeProjects.count { (it.progressPercentage ?: 0.0) in 34.0..66.0 },
                advanced = activeProjects.count { (it.progressPercentage ?: 0.0) in 67.0..90.0 },
                nearCompletion = activeProjects.count { (it.progressPercentage ?: 0.0) >= 91.0 }
            )
        )
    }
    ```
  - **Estimate**: 1 day

- [ ] **Task 1.4**: Team Analytics Implementation (Day 4)
  - **Owner**: Backend Developer 2
  - **Description**: Implement team size and role distribution
  - **Deliverable**: Team analytics methods
  - **Calculations**:
    ```kotlin
    data class TeamAnalytics(
        val totalEmployeesInvolved: Int,
        val averageTeamSize: Double,
        val teamRoleDistribution: Map<ProjectRole, Int>
    )

    fun calculateTeamAnalytics(): TeamAnalytics {
        val allEmployeeProjects = employeeProjectRepository.findAll()
        val uniqueEmployees = allEmployeeProjects.map { it.employeeId }.distinct().count()

        val teamSizeByProject = projectRepository.findAll().map { project ->
            employeeProjectRepository.countByProjectId(project.id)
        }

        val roleDistribution = allEmployeeProjects
            .groupBy { it.role }
            .mapValues { it.value.size }

        return TeamAnalytics(
            totalEmployeesInvolved = uniqueEmployees,
            averageTeamSize = teamSizeByProject.average(),
            teamRoleDistribution = roleDistribution
        )
    }
    ```
  - **Estimate**: 1 day

- [ ] **Task 1.5**: Technology Analytics Implementation (Day 5)
  - **Owner**: Backend Developer 2
  - **Description**: Implement technology usage statistics
  - **Deliverable**: Technology analytics methods
  - **Calculations**:
    ```kotlin
    data class TechnologyStats(
        val topTechnologies: List<TechnologyUsage>,
        val totalTechnologiesUsed: Int,
        val categoryDistribution: Map<TechnologyCategory, Int>
    )

    data class TechnologyUsage(
        val name: String,
        val category: TechnologyCategory,
        val projectCount: Int,
        val percentage: Double
    )

    fun calculateTechnologyStats(limit: Int = 15): TechnologyStats {
        val projectTechs = projectTechnologyRepository.findAll()
        val totalProjects = projectRepository.count()

        val techUsage = projectTechs
            .groupBy { it.technologyId }
            .map { (techId, usages) ->
                val tech = technologyRepository.findById(techId).orElseThrow()
                TechnologyUsage(
                    name = tech.name,
                    category = tech.category,
                    projectCount = usages.size,
                    percentage = (usages.size.toDouble() / totalProjects) * 100
                )
            }
            .sortedByDescending { it.projectCount }
            .take(limit)

        val categoryDist = techUsage
            .groupBy { it.category }
            .mapValues { it.value.sumOf { tech -> tech.projectCount } }

        return TechnologyStats(
            topTechnologies = techUsage,
            totalTechnologiesUsed = projectTechs.map { it.technologyId }.distinct().count(),
            categoryDistribution = categoryDist
        )
    }
    ```
  - **Estimate**: 1 day

- [ ] **Task 1.6**: Timeline Performance Implementation (Day 6)
  - **Owner**: Backend Developer 2
  - **Description**: Calculate on-time delivery metrics
  - **Deliverable**: Timeline performance methods
  - **Calculations**:
    ```kotlin
    data class TimelinePerformance(
        val onTimeDeliveryRate: Double,
        val overdueProjectsCount: Int,
        val averageDelayDays: Double
    )

    fun calculateTimelinePerformance(): TimelinePerformance {
        val completedProjects = projectRepository.findByStatus(ProjectStatus.COMPLETED)
        val onTimeProjects = completedProjects.count { project ->
            project.actualEndDate <= project.plannedEndDate
        }
        val onTimeRate = (onTimeProjects.toDouble() / completedProjects.size) * 100

        val activeProjects = projectRepository.findByStatus(ProjectStatus.ACTIVE)
        val now = LocalDate.now()
        val overdueProjects = activeProjects.filter {
            it.plannedEndDate < now
        }

        val averageDelay = if (overdueProjects.isNotEmpty()) {
            overdueProjects.map {
                ChronoUnit.DAYS.between(it.plannedEndDate, now)
            }.average()
        } else 0.0

        return TimelinePerformance(
            onTimeDeliveryRate = onTimeRate,
            overdueProjectsCount = overdueProjects.size,
            averageDelayDays = averageDelay
        )
    }
    ```
  - **Estimate**: 1 day

- [ ] **Task 1.7**: Update ProjectStatsResponse DTO (Day 7)
  - **Owner**: Backend Developer 1
  - **Description**: Add new fields to existing DTO
  - **File**: `com.pythiaplus.projects.dto.ProjectStatsResponse`
  - **Changes**:
    ```kotlin
    data class ProjectStatsResponse(
        // Existing fields
        val totalProjects: Int,
        val activeProjects: Int,
        val completedProjects: Int,
        val averageSuccessRating: Double,
        val averageClientSatisfaction: Double,
        val projectsByStatus: Map<ProjectStatus, Int>,
        val projectsByIndustry: Map<String, Int>,

        // NEW: Budget analytics
        val totalBudgetAllocated: BigDecimal,
        val totalBudgetSpent: BigDecimal,
        val budgetUtilizationPercentage: Double,
        val averageProjectBudget: BigDecimal,

        // NEW: Progress metrics
        val averageProgress: Double,
        val progressDistribution: ProgressDistributionDto,

        // NEW: Timeline performance
        val onTimeDeliveryRate: Double,
        val overdueProjectsCount: Int,
        val averageDelayDays: Double,

        // NEW: Team analytics
        val totalEmployeesInvolved: Int,
        val averageTeamSize: Double,
        val teamRoleDistribution: Map<ProjectRole, Int>,

        // NEW: Technology analytics
        val topTechnologies: List<TechnologyUsageDto>,
        val totalTechnologiesUsed: Int
    )
    ```
  - **Estimate**: 2 hours

- [ ] **Task 1.8**: Update ProjectStatsController (Day 7)
  - **Owner**: Backend Developer 1
  - **Description**: Wire service to controller
  - **File**: `com.pythiaplus.projects.controller.ProjectStatsController`
  - **Changes**:
    ```kotlin
    @RestController
    @RequestMapping("/api/v1/projects/stats")
    class ProjectStatsController(
        private val analyticsService: ProjectAnalyticsService
    ) {
        @GetMapping
        fun getProjectStats(): ResponseEntity<ProjectStatsResponse> {
            val budgetAnalytics = analyticsService.calculateBudgetAnalytics()
            val progressMetrics = analyticsService.calculateProgressMetrics()
            val teamAnalytics = analyticsService.calculateTeamAnalytics()
            val techStats = analyticsService.calculateTechnologyStats()
            val timelinePerf = analyticsService.calculateTimelinePerformance()

            val response = ProjectStatsResponse(
                // ... map all fields ...
            )

            return ResponseEntity.ok(response)
        }
    }
    ```
  - **Estimate**: 2 hours

- [ ] **Task 1.9**: Update OpenAPI Specification (Day 7)
  - **Owner**: Backend Developer 1
  - **Description**: Update YAML with new response schema
  - **File**: `backend-api/projects/openapi-project-management.yaml`
  - **Changes**: Add all new fields to `ProjectStatsResponse` schema
  - **Estimate**: 1 hour

#### Testing
- [ ] **Task 1.10**: Unit Tests - Analytics Service (Day 8-9)
  - **Owner**: Backend Developer 1 + 2
  - **Description**: Write comprehensive unit tests
  - **Coverage Target**: 90%+
  - **Test Cases**:
    - Budget calculations with various scenarios
    - Progress distribution edge cases
    - Team analytics with duplicate employees
    - Technology ranking correctness
    - Timeline performance with null dates
  - **Framework**: JUnit 5 + Mockito
  - **Estimate**: 2 days

- [ ] **Task 1.11**: Integration Tests - Stats Endpoint (Day 9)
  - **Owner**: Backend Developer 2
  - **Description**: Test full endpoint with test data
  - **Framework**: Spring Boot Test + REST Assured
  - **Test Cases**:
    - GET /projects/stats returns 200 OK
    - Response schema validation
    - Response contains all new fields
    - Calculations are correct with known test data
  - **Estimate**: 4 hours

- [ ] **Task 1.12**: Performance Testing (Day 10)
  - **Owner**: Backend Developer 2
  - **Description**: Load test the extended endpoint
  - **Tool**: JMeter or k6
  - **Scenarios**:
    - 10 concurrent users
    - 50 concurrent users
    - 100 concurrent users
  - **Metrics**: P50, P95, P99 response times
  - **Success Criteria**: P95 < 1000ms
  - **Estimate**: 4 hours

#### Documentation
- [ ] **Task 1.13**: API Documentation Update (Day 10)
  - **Owner**: Backend Developer 1
  - **Description**: Update API docs with examples
  - **Deliverable**: Updated OpenAPI spec with examples
  - **Include**: Sample request/response JSON
  - **Estimate**: 2 hours

- [ ] **Task 1.14**: Postman Collection Update (Day 10)
  - **Owner**: QA Engineer
  - **Description**: Update Postman collection
  - **Deliverable**: Importable Postman collection
  - **Include**: Example requests, tests, environment variables
  - **Estimate**: 2 hours

### Phase 1 Deliverables
- ✅ `ProjectAnalyticsService` implemented
- ✅ Extended `/projects/stats` endpoint with 20+ new fields
- ✅ 90%+ unit test coverage
- ✅ Integration tests passing
- ✅ Performance tests showing < 1s P95 response time
- ✅ Updated OpenAPI specification
- ✅ Updated Postman collection
- ✅ API documentation with examples

### Phase 1 Dependencies
- **Required**: Database schema finalized (Phase 0)
- **Required**: Test data available
- **Required**: Dev/staging environment access

### Phase 1 Success Criteria
- [ ] All 20+ new analytics fields returning correct data
- [ ] Unit tests achieving 90%+ coverage
- [ ] Integration tests passing 100%
- [ ] P95 response time < 1000ms with 1000 projects
- [ ] Code review approved
- [ ] Deployed to staging environment

---

## 📊 Phase 2: Visualization - Chart Data Endpoints
### Duration: 1-2 weeks (Sprint 2)
### Goal: Create specialized endpoints for chart visualizations

### Tasks

#### Backend Development - Budget Timeline Endpoint
- [ ] **Task 2.1**: Budget Timeline Service (Day 1-2)
  - **Owner**: Backend Developer 1
  - **Description**: Create budget timeline aggregation service
  - **File**: `ProjectBudgetTimelineService`
  - **Method**:
    ```kotlin
    fun getBudgetTimeline(months: Int = 6, projectIds: List<Long>?): BudgetTimelineResponse {
        val endDate = LocalDate.now()
        val startDate = endDate.minusMonths(months.toLong())

        val projects = if (projectIds != null) {
            projectRepository.findAllById(projectIds)
        } else {
            projectRepository.findAll()
        }

        val monthlyData = mutableListOf<MonthlyBudgetData>()
        var currentMonth = startDate.withDayOfMonth(1)

        while (currentMonth <= endDate) {
            val activeInMonth = projects.filter { project ->
                project.startDate <= currentMonth.withDayOfMonth(currentMonth.lengthOfMonth()) &&
                (project.endDate == null || project.endDate >= currentMonth)
            }

            val allocated = activeInMonth.sumOf { it.budgetAllocated ?: BigDecimal.ZERO }
            val spent = getSpentForMonth(activeInMonth, currentMonth)

            monthlyData.add(MonthlyBudgetData(
                month = currentMonth.format(DateTimeFormatter.ofPattern("yyyy-MM")),
                allocatedBudget = allocated,
                spentBudget = spent,
                utilizationPercentage = if (allocated > BigDecimal.ZERO) {
                    (spent.toDouble() / allocated.toDouble()) * 100
                } else 0.0,
                projectCount = activeInMonth.size
            ))

            currentMonth = currentMonth.plusMonths(1)
        }

        return BudgetTimelineResponse(
            period = PeriodDto(startDate, endDate),
            monthlyData = monthlyData,
            summary = calculateSummary(monthlyData)
        )
    }
    ```
  - **Challenge**: May need monthly snapshot data (if not available, use current state)
  - **Estimate**: 2 days

- [ ] **Task 2.2**: Budget Timeline Controller (Day 2)
  - **Owner**: Backend Developer 1
  - **Description**: Create REST endpoint
  - **File**: `ProjectAnalyticsController`
  - **Endpoint**: `GET /api/v1/projects/analytics/budget-timeline`
  - **Parameters**:
    - `months` (query, optional, default: 6)
    - `projectIds` (query, optional, array)
  - **Response**: `BudgetTimelineResponse`
  - **Estimate**: 4 hours

- [ ] **Task 2.3**: Budget Timeline Tests (Day 3)
  - **Owner**: Backend Developer 1
  - **Description**: Unit + integration tests
  - **Coverage**: 90%+
  - **Test Cases**:
    - Different month ranges (1, 6, 12, 24)
    - With/without project filter
    - Edge case: No active projects in month
    - Edge case: Projects with null budget
  - **Estimate**: 1 day

#### Backend Development - Technology Stack Endpoint
- [ ] **Task 2.4**: Technology Stack Service (Day 3-4)
  - **Owner**: Backend Developer 2
  - **Description**: Create technology analytics service
  - **File**: `TechnologyStackService`
  - **Method**:
    ```kotlin
    fun getTechnologyStack(
        category: TechnologyCategory? = null,
        limit: Int = 15,
        minUsage: Int = 1
    ): TechnologyStackResponse {
        val projectTechs = if (category != null) {
            projectTechnologyRepository.findByTechnologyCategory(category)
        } else {
            projectTechnologyRepository.findAll()
        }

        val techUsageMap = projectTechs
            .groupBy { it.technologyId }
            .mapValues { it.value.map { pt -> pt.projectId }.distinct() }
            .filter { it.value.size >= minUsage }

        val totalProjects = projectRepository.count()

        val technologies = techUsageMap.entries
            .map { (techId, projectIds) ->
                val tech = technologyRepository.findById(techId).orElseThrow()
                TechnologyUsageDto(
                    id = tech.id,
                    name = tech.name,
                    category = tech.category,
                    projectCount = projectIds.size,
                    percentage = (projectIds.size.toDouble() / totalProjects) * 100,
                    trend = calculateTrend(tech.id), // Optional: needs historical data
                    projects = projectIds.map { pid ->
                        val project = projectRepository.findById(pid).orElseThrow()
                        ProjectSummaryDto(project.id, project.name, project.status)
                    }
                )
            }
            .sortedByDescending { it.projectCount }
            .take(limit)

        val categoryDist = technologies
            .groupBy { it.category }
            .mapValues { it.value.size }

        return TechnologyStackResponse(
            totalTechnologies = techUsageMap.size,
            totalProjects = totalProjects.toInt(),
            technologies = technologies,
            categoryDistribution = categoryDist
        )
    }
    ```
  - **Estimate**: 1.5 days

- [ ] **Task 2.5**: Technology Stack Controller (Day 4)
  - **Owner**: Backend Developer 2
  - **Description**: Create REST endpoint
  - **Endpoint**: `GET /api/v1/projects/analytics/technology-stack`
  - **Parameters**:
    - `category` (query, optional, enum)
    - `limit` (query, optional, default: 15)
    - `minUsage` (query, optional, default: 1)
  - **Estimate**: 4 hours

- [ ] **Task 2.6**: Technology Stack Tests (Day 5)
  - **Owner**: Backend Developer 2
  - **Description**: Unit + integration tests
  - **Coverage**: 90%+
  - **Estimate**: 1 day

#### Backend Development - Progress Analytics Endpoint
- [ ] **Task 2.7**: Progress Analytics Service (Day 5-6)
  - **Owner**: Backend Developer 1
  - **Description**: Create progress analytics with risk assessment
  - **File**: `ProgressAnalyticsService`
  - **Method**:
    ```kotlin
    fun getProgressAnalytics(
        status: List<ProjectStatus> = listOf(ProjectStatus.ACTIVE),
        includeHistory: Boolean = false
    ): ProgressAnalyticsResponse {
        val projects = if (status.isEmpty()) {
            projectRepository.findAll()
        } else {
            projectRepository.findByStatusIn(status)
        }

        val progressValues = projects.map { it.progressPercentage ?: 0.0 }

        // Calculate distribution
        val distribution = ProgressDistributionDto(
            ranges = listOf(
                ProgressRangeDto(0, 25, projects.count { (it.progressPercentage ?: 0.0) in 0.0..25.0 }),
                ProgressRangeDto(26, 50, projects.count { (it.progressPercentage ?: 0.0) in 26.0..50.0 }),
                ProgressRangeDto(51, 75, projects.count { (it.progressPercentage ?: 0.0) in 51.0..75.0 }),
                ProgressRangeDto(76, 100, projects.count { (it.progressPercentage ?: 0.0) in 76.0..100.0 })
            ).map { range ->
                range.copy(percentage = (range.count.toDouble() / projects.size) * 100)
            }
        )

        // Identify at-risk projects
        val now = LocalDate.now()
        val projectsAtRisk = projects.filter { project ->
            val progress = project.progressPercentage ?: 0.0
            val timeElapsed = ChronoUnit.DAYS.between(project.startDate, now)
            val totalDuration = ChronoUnit.DAYS.between(project.startDate, project.plannedEndDate)
            val timeProgress = (timeElapsed.toDouble() / totalDuration) * 100

            progress < timeProgress - 20 // More than 20% behind schedule
        }.map { project ->
            ProjectRiskDto(
                projectId = project.id,
                projectName = project.name,
                progress = project.progressPercentage ?: 0.0,
                daysRemaining = ChronoUnit.DAYS.between(now, project.plannedEndDate).toInt(),
                riskLevel = calculateRiskLevel(project)
            )
        }

        // Calculate health score
        val healthScore = calculateHealthScore(
            averageProgress = progressValues.average(),
            onTimeRate = calculateOnTimeRate(),
            budgetUtilization = calculateBudgetUtilization()
        )

        return ProgressAnalyticsResponse(
            averageProgress = progressValues.average(),
            medianProgress = progressValues.sorted()[progressValues.size / 2],
            distribution = distribution,
            projectsAtRisk = projectsAtRisk,
            topPerformers = identifyTopPerformers(projects),
            healthScore = healthScore
        )
    }
    ```
  - **Estimate**: 1.5 days

- [ ] **Task 2.8**: Progress Analytics Controller (Day 6)
  - **Owner**: Backend Developer 1
  - **Description**: Create REST endpoint
  - **Endpoint**: `GET /api/v1/projects/analytics/progress`
  - **Estimate**: 4 hours

- [ ] **Task 2.9**: Progress Analytics Tests (Day 7)
  - **Owner**: Backend Developer 1
  - **Description**: Unit + integration tests
  - **Estimate**: 1 day

#### API Documentation
- [ ] **Task 2.10**: OpenAPI Spec Update (Day 8)
  - **Owner**: Backend Developer 1
  - **Description**: Add all 3 new endpoints to spec
  - **File**: `openapi-project-management.yaml`
  - **Sections to Add**:
    - `/projects/analytics/budget-timeline` path
    - `/projects/analytics/technology-stack` path
    - `/projects/analytics/progress` path
    - All request/response schemas
  - **Estimate**: 4 hours

- [ ] **Task 2.11**: Swagger UI Testing (Day 8)
  - **Owner**: QA Engineer
  - **Description**: Test all endpoints via Swagger UI
  - **Deliverable**: Test report
  - **Estimate**: 2 hours

- [ ] **Task 2.12**: Postman Collection (Day 8)
  - **Owner**: QA Engineer
  - **Description**: Add 3 new endpoints to collection
  - **Include**: Example requests, assertions
  - **Estimate**: 2 hours

#### Integration Testing
- [ ] **Task 2.13**: End-to-End API Tests (Day 9)
  - **Owner**: QA Engineer
  - **Description**: Test complete analytics flow
  - **Framework**: REST Assured or Postman Newman
  - **Scenarios**:
    1. Get extended stats
    2. Get budget timeline (6 months)
    3. Get technology stack (top 15)
    4. Get progress analytics
    5. Validate data consistency across endpoints
  - **Estimate**: 1 day

- [ ] **Task 2.14**: Performance Testing (Day 10)
  - **Owner**: Backend Developer 2
  - **Description**: Load test all 3 new endpoints
  - **Target**: P95 < 500ms for each endpoint
  - **Tool**: k6 or JMeter
  - **Estimate**: 4 hours

### Phase 2 Deliverables
- ✅ 3 new analytics endpoints implemented
- ✅ Budget Timeline API (`/projects/analytics/budget-timeline`)
- ✅ Technology Stack API (`/projects/analytics/technology-stack`)
- ✅ Progress Analytics API (`/projects/analytics/progress`)
- ✅ 90%+ test coverage
- ✅ Updated OpenAPI specification
- ✅ Postman collection updated
- ✅ Performance benchmarks documented

### Phase 2 Dependencies
- **Required**: Phase 1 complete (extended stats endpoint)
- **Required**: Test data with budget/progress/tech assignments

### Phase 2 Success Criteria
- [ ] All 3 endpoints returning correct data
- [ ] P95 response time < 500ms
- [ ] 100% integration test pass rate
- [ ] Code review approved
- [ ] Deployed to staging

---

## 🔗 Phase 3: Integration - Frontend Connection
### Duration: 1 week (Sprint 3)
### Goal: Connect Angular frontend to new backend APIs

### Tasks

#### Frontend Model Updates
- [ ] **Task 3.1**: Update TypeScript Models (Day 1)
  - **Owner**: Frontend Developer 1
  - **Description**: Add interfaces for all new API responses
  - **File**: `pythia-frontend/src/app/models/project.model.ts`
  - **Add Interfaces**:
    ```typescript
    export interface BudgetTimelineResponse {
      period: {
        startDate: string;
        endDate: string;
      };
      monthlyData: MonthlyBudgetData[];
      summary: BudgetTimelineSummary;
    }

    export interface MonthlyBudgetData {
      month: string;
      allocatedBudget: number;
      spentBudget: number;
      utilizationPercentage: number;
      projectCount: number;
    }

    export interface TechnologyStackResponse {
      totalTechnologies: number;
      totalProjects: number;
      technologies: TechnologyUsage[];
      categoryDistribution: Record<string, number>;
    }

    export interface TechnologyUsage {
      id: number;
      name: string;
      category: TechnologyCategory;
      projectCount: number;
      percentage: number;
      trend?: TrendType;
      projects?: ProjectSummary[];
    }

    export interface ProgressAnalyticsResponse {
      averageProgress: number;
      medianProgress: number;
      distribution: ProgressDistribution;
      projectsAtRisk: ProjectRisk[];
      topPerformers: ProjectPerformer[];
      healthScore: HealthScore;
    }

    export interface ProjectListAnalytics {
      // ... existing fields ...

      // NEW fields from extended /projects/stats
      totalBudgetAllocated: number;
      totalBudgetSpent: number;
      budgetUtilizationPercentage: number;
      averageProjectBudget: number;
      averageProgress: number;
      progressDistribution: ProgressDistribution;
      onTimeDeliveryRate: number;
      overdueProjectsCount: number;
      averageDelayDays: number;
      totalEmployeesInvolved: number;
      averageTeamSize: number;
      teamRoleDistribution: Record<string, number>;
      topTechnologies: TechnologyUsage[];
      totalTechnologiesUsed: number;
    }
    ```
  - **Estimate**: 4 hours

#### Service Layer Updates
- [ ] **Task 3.2**: Update ProjectsService - Add Signals (Day 1)
  - **Owner**: Frontend Developer 1
  - **Description**: Add signals for new analytics data
  - **File**: `projects.service.ts`
  - **Add Signals**:
    ```typescript
    // New signals for specialized analytics
    readonly budgetTimeline = signal<BudgetTimelineResponse | null>(null);
    readonly technologyStack = signal<TechnologyStackResponse | null>(null);
    readonly progressAnalytics = signal<ProgressAnalyticsResponse | null>(null);

    // Loading states
    readonly budgetTimelineLoading = signal(false);
    readonly technologyStackLoading = signal(false);
    readonly progressAnalyticsLoading = signal(false);

    // Error states
    readonly budgetTimelineError = signal<string | null>(null);
    readonly technologyStackError = signal<string | null>(null);
    readonly progressAnalyticsError = signal<string | null>(null);
    ```
  - **Estimate**: 1 hour

- [ ] **Task 3.3**: Update ProjectsService - Add API Methods (Day 2)
  - **Owner**: Frontend Developer 1
  - **Description**: Add methods for new endpoints
  - **File**: `projects.service.ts`
  - **Add Methods**:
    ```typescript
    /**
     * Load budget timeline for last N months
     */
    loadBudgetTimeline(months: number = 6, projectIds?: number[]): void {
      this.budgetTimelineLoading.set(true);
      this.budgetTimelineError.set(null);

      let params = new HttpParams().set('months', months.toString());
      if (projectIds && projectIds.length > 0) {
        params = params.set('projectIds', projectIds.join(','));
      }

      this.http.get<BudgetTimelineResponse>(
        `${this.API_BASE_URL}/projects/analytics/budget-timeline`,
        { params }
      ).pipe(
        tap(response => {
          this.budgetTimeline.set(response);
          this.budgetTimelineLoading.set(false);
        }),
        catchError(error => {
          this.budgetTimelineError.set(this.handleError(error));
          this.budgetTimelineLoading.set(false);
          return of(null);
        })
      ).subscribe();
    }

    /**
     * Load technology stack analytics
     */
    loadTechnologyStack(category?: string, limit: number = 15): void {
      this.technologyStackLoading.set(true);
      this.technologyStackError.set(null);

      let params = new HttpParams().set('limit', limit.toString());
      if (category) {
        params = params.set('category', category);
      }

      this.http.get<TechnologyStackResponse>(
        `${this.API_BASE_URL}/projects/analytics/technology-stack`,
        { params }
      ).pipe(
        tap(response => {
          this.technologyStack.set(response);
          this.technologyStackLoading.set(false);
        }),
        catchError(error => {
          this.technologyStackError.set(this.handleError(error));
          this.technologyStackLoading.set(false);
          return of(null);
        })
      ).subscribe();
    }

    /**
     * Load progress analytics
     */
    loadProgressAnalytics(status?: ProjectStatus[]): void {
      this.progressAnalyticsLoading.set(true);
      this.progressAnalyticsError.set(null);

      let params = new HttpParams();
      if (status && status.length > 0) {
        params = params.set('status', status.join(','));
      }

      this.http.get<ProgressAnalyticsResponse>(
        `${this.API_BASE_URL}/projects/analytics/progress`,
        { params }
      ).pipe(
        tap(response => {
          this.progressAnalytics.set(response);
          this.progressAnalyticsLoading.set(false);
        }),
        catchError(error => {
          this.progressAnalyticsError.set(this.handleError(error));
          this.progressAnalyticsLoading.set(false);
          return of(null);
        })
      ).subscribe();
    }

    /**
     * Load all analytics data for dashboard (convenience method)
     */
    loadAllAnalytics(): void {
      this.loadProjects(); // Loads extended stats
      this.loadBudgetTimeline();
      this.loadTechnologyStack();
      this.loadProgressAnalytics();
    }
    ```
  - **Estimate**: 1 day

#### Component Updates
- [ ] **Task 3.4**: Update AnalyticsOverviewComponent (Day 3)
  - **Owner**: Frontend Developer 2
  - **Description**: Connect KPI cards to real data
  - **File**: `analytics-overview.component.ts`
  - **Changes**:
    ```typescript
    // Remove client-side calculations, use backend data
    protected readonly budgetUtilization = computed(() =>
      this.analytics()?.budgetUtilizationPercentage ?? 0
    );

    protected readonly timelinePerformance = computed(() =>
      this.analytics()?.onTimeDeliveryRate ?? 0
    );

    protected readonly totalTeamMembers = computed(() =>
      this.analytics()?.totalEmployeesInvolved ?? 0
    );

    protected readonly technologiesUsed = computed(() =>
      this.analytics()?.totalTechnologiesUsed ?? 0
    );

    protected readonly averageProgress = computed(() =>
      this.analytics()?.averageProgress ?? 0
    );
    ```
  - **Estimate**: 4 hours

- [ ] **Task 3.5**: Update BudgetTimelineChartComponent (Day 3)
  - **Owner**: Frontend Developer 2
  - **Description**: Connect to backend API
  - **File**: `budget-timeline-chart.component.ts`
  - **Changes**:
    ```typescript
    // Replace mock data with real API data
    @Component({
      // ...
    })
    export class BudgetTimelineChartComponent implements AfterViewInit, OnDestroy {
      protected readonly projectsService = inject(ProjectsService);

      // Remove @Input() totalAllocated and totalSpent
      // Use data from service signal instead

      ngOnInit(): void {
        // Load budget timeline data
        this.projectsService.loadBudgetTimeline(6);

        // Watch for data changes
        effect(() => {
          const budgetData = this.projectsService.budgetTimeline();
          if (budgetData && this.chart) {
            this.updateChart(budgetData);
          }
        });
      }

      private updateChart(data: BudgetTimelineResponse): void {
        this.chart.data.labels = data.monthlyData.map(m => m.month);
        this.chart.data.datasets[0].data = data.monthlyData.map(m => m.allocatedBudget);
        this.chart.data.datasets[1].data = data.monthlyData.map(m => m.spentBudget);
        this.chart.update();
      }
    }
    ```
  - **Estimate**: 4 hours

- [ ] **Task 3.6**: Update ProgressGaugeChartComponent (Day 4)
  - **Owner**: Frontend Developer 2
  - **Description**: Connect to backend API
  - **File**: `progress-gauge-chart.component.ts`
  - **Changes**:
    ```typescript
    // Use progressAnalytics signal
    protected readonly projectsService = inject(ProjectsService);

    ngOnInit(): void {
      this.projectsService.loadProgressAnalytics(['ACTIVE']);

      effect(() => {
        const progressData = this.projectsService.progressAnalytics();
        if (progressData && this.chart) {
          this.updateChart(progressData.averageProgress);
        }
      });
    }
    ```
  - **Estimate**: 2 hours

- [ ] **Task 3.7**: Update TechnologyStackChartComponent (Day 4)
  - **Owner**: Frontend Developer 1
  - **Description**: Connect to backend API (remove client-side calculation)
  - **File**: `technology-stack-chart.component.ts`
  - **Changes**:
    ```typescript
    // Remove @Input() technologyData
    // Use service signal instead
    protected readonly projectsService = inject(ProjectsService);

    ngOnInit(): void {
      this.projectsService.loadTechnologyStack(undefined, 10);

      effect(() => {
        const techData = this.projectsService.technologyStack();
        if (techData && this.chart) {
          this.updateChart(techData);
        }
      });
    }

    private updateChart(data: TechnologyStackResponse): void {
      this.chart.data.labels = data.technologies.map(t => t.name);
      this.chart.data.datasets[0].data = data.technologies.map(t => t.projectCount);
      this.chart.update();
    }
    ```
  - **Estimate**: 2 hours

- [ ] **Task 3.8**: Update ProjectsPageComponent (Day 4)
  - **Owner**: Frontend Developer 1
  - **Description**: Initialize analytics loading
  - **File**: `projects-page.component.ts`
  - **Changes**:
    ```typescript
    ngOnInit(): void {
      // Load all analytics when Analytics Temple view is shown
      if (this.viewMode() === 'analytics') {
        this.projectsService.loadAllAnalytics();
      }
    }

    // Watch for view mode changes
    protected switchViewMode(mode: 'constellation' | 'command' | 'analytics'): void {
      this.viewMode.set(mode);

      // Load analytics data when switching to Analytics Temple
      if (mode === 'analytics') {
        this.projectsService.loadAllAnalytics();
      }
    }
    ```
  - **Estimate**: 1 hour

#### Testing
- [ ] **Task 3.9**: Frontend Unit Tests (Day 5)
  - **Owner**: Frontend Developer 1 + 2
  - **Description**: Update tests for all modified components
  - **Framework**: Jasmine + Karma
  - **Components to Test**:
    - ProjectsService (new methods)
    - AnalyticsOverviewComponent (updated computed signals)
    - BudgetTimelineChartComponent (API integration)
    - ProgressGaugeChartComponent (API integration)
    - TechnologyStackChartComponent (API integration)
  - **Coverage Target**: 80%+
  - **Estimate**: 1 day

- [ ] **Task 3.10**: Frontend Integration Tests (Day 6)
  - **Owner**: Frontend Developer 2
  - **Description**: Test component interactions
  - **Framework**: Angular Testing Library
  - **Scenarios**:
    - Load Analytics Temple → verify all charts load
    - Switch between view modes → verify data persists
    - Error handling → verify error messages display
  - **Estimate**: 4 hours

- [ ] **Task 3.11**: E2E Tests with Mock Backend (Day 6)
  - **Owner**: QA Engineer
  - **Description**: E2E tests with Cypress
  - **Framework**: Cypress
  - **Scenarios**:
    1. Navigate to Projects Page
    2. Switch to Analytics Temple view
    3. Verify all 4 charts render
    4. Verify all 8 KPI cards show data
    5. Verify loading states
    6. Verify error states
  - **Estimate**: 4 hours

#### Manual Testing
- [ ] **Task 3.12**: Manual QA - Analytics Temple (Day 7)
  - **Owner**: QA Engineer
  - **Description**: Comprehensive manual testing
  - **Test Cases**:
    - All charts display correctly
    - Data updates when filters change
    - Loading spinners show/hide correctly
    - Error messages display properly
    - Responsive design on mobile/tablet
    - Accessibility (keyboard nav, screen readers)
  - **Deliverable**: Test report with screenshots
  - **Estimate**: 1 day

- [ ] **Task 3.13**: Browser Compatibility Testing (Day 7)
  - **Owner**: QA Engineer
  - **Description**: Test on multiple browsers
  - **Browsers**: Chrome, Firefox, Safari, Edge
  - **Devices**: Desktop, Tablet, Mobile
  - **Deliverable**: Compatibility matrix
  - **Estimate**: 4 hours

### Phase 3 Deliverables
- ✅ All frontend components connected to backend APIs
- ✅ 4/4 chart components displaying real data
- ✅ 8/8 KPI metrics showing live data
- ✅ 80%+ frontend test coverage
- ✅ E2E tests passing
- ✅ Manual QA report
- ✅ Browser compatibility confirmed

### Phase 3 Dependencies
- **Required**: Phase 2 complete (all backend endpoints deployed to staging)
- **Required**: Backend staging environment accessible from frontend

### Phase 3 Success Criteria
- [ ] All charts render with real backend data
- [ ] No console errors
- [ ] Loading states work correctly
- [ ] Error handling works correctly
- [ ] Tests passing 100%
- [ ] Lighthouse score 90+
- [ ] AXE accessibility checks passing

---

## ⚡ Phase 4: Optimization - Performance & Caching
### Duration: 1 week (Sprint 4)
### Goal: Optimize performance with caching and dashboard endpoint

### Tasks

#### Backend - Caching Infrastructure
- [ ] **Task 4.1**: Redis Setup (Day 1)
  - **Owner**: DevOps Engineer
  - **Description**: Deploy Redis cache
  - **Environment**: Staging + Production
  - **Configuration**:
    - Max memory: 512MB
    - Eviction policy: allkeys-lru
    - Persistence: RDB snapshots
  - **Deliverable**: Redis connection string
  - **Estimate**: 4 hours

- [ ] **Task 4.2**: Spring Cache Configuration (Day 1)
  - **Owner**: Backend Developer 1
  - **Description**: Configure Spring Boot caching
  - **File**: `CacheConfiguration.kt`
  - **Configuration**:
    ```kotlin
    @Configuration
    @EnableCaching
    class CacheConfiguration {
        @Bean
        fun cacheManager(
            redisConnectionFactory: RedisConnectionFactory
        ): RedisCacheManager {
            val cacheConfigurations = mapOf(
                "projectStats" to cacheConfig(Duration.ofMinutes(5)),
                "budgetTimeline" to cacheConfig(Duration.ofHours(1)),
                "technologyStack" to cacheConfig(Duration.ofMinutes(30)),
                "progressAnalytics" to cacheConfig(Duration.ofMinutes(5)),
                "dashboard" to cacheConfig(Duration.ofMinutes(5))
            )

            return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(cacheConfig(Duration.ofMinutes(10)))
                .withInitialCacheConfigurations(cacheConfigurations)
                .build()
        }

        private fun cacheConfig(ttl: Duration): RedisCacheConfiguration {
            return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(ttl)
                .serializeKeysWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(
                        StringRedisSerializer()
                    )
                )
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(
                        GenericJackson2JsonRedisSerializer()
                    )
                )
        }
    }
    ```
  - **Estimate**: 4 hours

- [ ] **Task 4.3**: Add Cache Annotations (Day 2)
  - **Owner**: Backend Developer 1
  - **Description**: Add @Cacheable to service methods
  - **Changes**:
    ```kotlin
    @Service
    class ProjectAnalyticsService {
        @Cacheable("projectStats")
        fun getExtendedProjectStats(): ProjectStatsResponse {
            // ... existing implementation ...
        }

        @Cacheable("budgetTimeline", key = "#months")
        fun getBudgetTimeline(months: Int): BudgetTimelineResponse {
            // ... existing implementation ...
        }

        @Cacheable("technologyStack", key = "#limit")
        fun getTechnologyStack(limit: Int): TechnologyStackResponse {
            // ... existing implementation ...
        }

        @Cacheable("progressAnalytics")
        fun getProgressAnalytics(): ProgressAnalyticsResponse {
            // ... existing implementation ...
        }
    }
    ```
  - **Estimate**: 2 hours

- [ ] **Task 4.4**: Cache Invalidation Strategy (Day 2)
  - **Owner**: Backend Developer 1
  - **Description**: Add cache eviction on data changes
  - **Implementation**:
    ```kotlin
    @Service
    class ProjectService {
        @CacheEvict(
            value = ["projectStats", "budgetTimeline", "progressAnalytics", "dashboard"],
            allEntries = true
        )
        fun updateProject(id: Long, request: UpdateProjectRequest): Project {
            // ... update implementation ...
        }

        @CacheEvict(
            value = ["projectStats", "budgetTimeline", "progressAnalytics", "dashboard"],
            allEntries = true
        )
        fun deleteProject(id: Long) {
            // ... delete implementation ...
        }
    }
    ```
  - **Estimate**: 2 hours

#### Backend - Dashboard Endpoint
- [ ] **Task 4.5**: Dashboard Analytics Service (Day 3)
  - **Owner**: Backend Developer 2
  - **Description**: Create all-in-one dashboard service
  - **File**: `DashboardAnalyticsService.kt`
  - **Method**:
    ```kotlin
    @Service
    class DashboardAnalyticsService(
        private val analyticsService: ProjectAnalyticsService,
        private val budgetTimelineService: ProjectBudgetTimelineService,
        private val technologyStackService: TechnologyStackService,
        private val progressAnalyticsService: ProgressAnalyticsService
    ) {
        @Cacheable("dashboard")
        fun getDashboardAnalytics(): DashboardAnalyticsResponse {
            // Execute all analytics queries in parallel
            val kpis = CompletableFuture.supplyAsync {
                analyticsService.getExtendedProjectStats()
            }

            val budgetTimeline = CompletableFuture.supplyAsync {
                budgetTimelineService.getBudgetTimeline(6)
            }

            val technologyStack = CompletableFuture.supplyAsync {
                technologyStackService.getTechnologyStack(15)
            }

            val progressMetrics = CompletableFuture.supplyAsync {
                progressAnalyticsService.getProgressAnalytics()
            }

            // Wait for all to complete
            CompletableFuture.allOf(kpis, budgetTimeline, technologyStack, progressMetrics).join()

            return DashboardAnalyticsResponse(
                kpis = kpis.get(),
                budgetTimeline = budgetTimeline.get(),
                progressMetrics = progressMetrics.get(),
                technologyStack = technologyStack.get(),
                generatedAt = Instant.now(),
                cacheExpiry = Instant.now().plus(Duration.ofMinutes(5))
            )
        }
    }
    ```
  - **Estimate**: 1 day

- [ ] **Task 4.6**: Dashboard Controller (Day 3)
  - **Owner**: Backend Developer 2
  - **Description**: Create dashboard endpoint
  - **File**: `DashboardAnalyticsController.kt`
  - **Endpoint**: `GET /api/v1/projects/analytics/dashboard`
  - **Response**: `DashboardAnalyticsResponse`
  - **Headers**:
    ```kotlin
    @GetMapping("/dashboard")
    fun getDashboardAnalytics(): ResponseEntity<DashboardAnalyticsResponse> {
        val response = dashboardService.getDashboardAnalytics()

        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic())
            .eTag(generateETag(response))
            .body(response)
    }
    ```
  - **Estimate**: 4 hours

- [ ] **Task 4.7**: Dashboard Endpoint Tests (Day 4)
  - **Owner**: Backend Developer 2
  - **Description**: Unit + integration tests
  - **Test Cases**:
    - Dashboard returns all 4 data sections
    - Caching works (2nd request faster)
    - ETag validation works
    - Parallel execution doesn't cause issues
  - **Estimate**: 1 day

#### Frontend - Dashboard Optimization
- [ ] **Task 4.8**: Add Dashboard Method to Service (Day 5)
  - **Owner**: Frontend Developer 1
  - **Description**: Add single dashboard API call
  - **File**: `projects.service.ts`
  - **Method**:
    ```typescript
    /**
     * Load complete dashboard analytics (single API call)
     * More efficient than calling 4 separate endpoints
     */
    loadDashboardAnalytics(): void {
      this.loading.set(true);
      this.error.set(null);

      this.http.get<DashboardAnalyticsResponse>(
        `${this.API_BASE_URL}/projects/analytics/dashboard`
      ).pipe(
        tap(response => {
          // Populate all signals from single response
          this.analytics.set(response.kpis);
          this.budgetTimeline.set(response.budgetTimeline);
          this.progressAnalytics.set(response.progressMetrics);
          this.technologyStack.set(response.technologyStack);
          this.loading.set(false);
        }),
        catchError(error => {
          this.error.set(this.handleError(error));
          this.loading.set(false);
          return of(null);
        })
      ).subscribe();
    }
    ```
  - **Estimate**: 2 hours

- [ ] **Task 4.9**: Update ProjectsPage to Use Dashboard Endpoint (Day 5)
  - **Owner**: Frontend Developer 1
  - **Description**: Replace 4 API calls with 1
  - **File**: `projects-page.component.ts`
  - **Change**:
    ```typescript
    // OLD: 4 separate calls
    // this.projectsService.loadProjects();
    // this.projectsService.loadBudgetTimeline();
    // this.projectsService.loadTechnologyStack();
    // this.projectsService.loadProgressAnalytics();

    // NEW: Single optimized call
    this.projectsService.loadDashboardAnalytics();
    ```
  - **Estimate**: 1 hour

#### Performance Testing
- [ ] **Task 4.10**: Backend Performance Benchmarks (Day 6)
  - **Owner**: Backend Developer 1
  - **Description**: Measure performance improvements
  - **Tool**: k6 or JMeter
  - **Scenarios**:
    1. Before caching: 4 separate endpoint calls
    2. After caching: 4 separate endpoint calls (warm cache)
    3. Dashboard endpoint (cold cache)
    4. Dashboard endpoint (warm cache)
  - **Metrics**: Response time, throughput, CPU usage, memory usage
  - **Target**: Dashboard endpoint < 500ms P95 (warm cache)
  - **Deliverable**: Performance report with graphs
  - **Estimate**: 1 day

- [ ] **Task 4.11**: Frontend Performance Benchmarks (Day 6)
  - **Owner**: Frontend Developer 1
  - **Description**: Measure frontend load times
  - **Tool**: Lighthouse CI
  - **Metrics**:
    - Time to First Byte (TTFB)
    - First Contentful Paint (FCP)
    - Largest Contentful Paint (LCP)
    - Time to Interactive (TTI)
  - **Target**: LCP < 2.5s, TTI < 3.5s
  - **Deliverable**: Lighthouse report
  - **Estimate**: 4 hours

- [ ] **Task 4.12**: Load Testing (Day 7)
  - **Owner**: DevOps Engineer
  - **Description**: Stress test the system
  - **Tool**: k6 cloud or JMeter
  - **Scenarios**:
    - 100 concurrent users
    - 500 concurrent users
    - 1000 concurrent users
  - **Duration**: 5 minutes per scenario
  - **Metrics**: P50, P95, P99 response times, error rate
  - **Success Criteria**: < 1% error rate at 500 concurrent users
  - **Deliverable**: Load test report
  - **Estimate**: 1 day

#### Documentation
- [ ] **Task 4.13**: Performance Optimization Guide (Day 7)
  - **Owner**: Tech Lead
  - **Description**: Document caching strategy and optimizations
  - **Deliverable**: Performance guide document
  - **Sections**:
    - Caching architecture
    - TTL values and rationale
    - Cache invalidation strategy
    - Performance benchmarks
    - Troubleshooting guide
  - **Estimate**: 4 hours

### Phase 4 Deliverables
- ✅ Redis caching infrastructure deployed
- ✅ Backend caching implemented (Spring Cache + Redis)
- ✅ Dashboard all-in-one endpoint (`/projects/analytics/dashboard`)
- ✅ Frontend optimized (1 API call instead of 4)
- ✅ Performance benchmarks documented
- ✅ < 500ms P95 response time achieved
- ✅ Performance optimization guide

### Phase 4 Dependencies
- **Required**: Phase 3 complete (frontend integration working)
- **Required**: Redis infrastructure available

### Phase 4 Success Criteria
- [ ] Dashboard endpoint P95 < 500ms (warm cache)
- [ ] Frontend LCP < 2.5s
- [ ] Load test: < 1% error rate at 500 concurrent users
- [ ] Cache hit ratio > 80%
- [ ] Deployed to production

---

## 🚀 Phase 5: Intelligence - Historical Data & ML (FUTURE)
### Duration: 2-3 weeks (Future Sprint)
### Goal: Enable predictive analytics and time-series insights

### Overview
This phase is **optional** and intended for future enhancement. It establishes the foundation for machine learning-powered insights.

### Tasks

#### Database Schema
- [ ] **Task 5.1**: Create Project Snapshots Table
  - **Owner**: DBA
  - **Description**: Table for historical data tracking
  - **Migration**:
    ```sql
    CREATE TABLE project_snapshots (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      snapshot_date DATE NOT NULL,
      progress_percentage DECIMAL(5,2),
      budget_spent DECIMAL(15,2),
      team_size INTEGER,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(project_id, snapshot_date)
    );

    CREATE INDEX idx_project_snapshots_date ON project_snapshots(snapshot_date DESC);
    CREATE INDEX idx_project_snapshots_project ON project_snapshots(project_id, snapshot_date DESC);
    ```
  - **Estimate**: 2 hours

- [ ] **Task 5.2**: Materialized Views for Aggregates
  - **Owner**: DBA
  - **Description**: Pre-computed monthly analytics
  - **Migration**:
    ```sql
    CREATE MATERIALIZED VIEW mv_monthly_analytics AS
    SELECT
      DATE_TRUNC('month', snapshot_date) AS month,
      SUM(budget_spent) AS total_spent,
      AVG(progress_percentage) AS avg_progress,
      COUNT(DISTINCT project_id) AS active_projects
    FROM project_snapshots
    GROUP BY DATE_TRUNC('month', snapshot_date)
    ORDER BY month DESC;

    CREATE UNIQUE INDEX idx_mv_monthly_analytics_month
    ON mv_monthly_analytics(month);

    -- Refresh daily at 2 AM
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    SELECT cron.schedule('refresh-monthly-analytics', '0 2 * * *',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_analytics');
    ```
  - **Estimate**: 4 hours

#### Backend - Snapshot Service
- [ ] **Task 5.3**: Daily Snapshot Job
  - **Owner**: Backend Developer
  - **Description**: Scheduled job to capture daily snapshots
  - **Framework**: Spring Scheduler
  - **Implementation**:
    ```kotlin
    @Component
    class ProjectSnapshotScheduler(
        private val projectRepository: ProjectRepository,
        private val snapshotRepository: ProjectSnapshotRepository
    ) {
        @Scheduled(cron = "0 0 1 * * *") // 1 AM daily
        fun captureProjectSnapshots() {
            logger.info("Starting daily project snapshot capture")
            val projects = projectRepository.findAll()
            val today = LocalDate.now()

            projects.forEach { project ->
                val snapshot = ProjectSnapshot(
                    projectId = project.id,
                    snapshotDate = today,
                    progressPercentage = project.progressPercentage,
                    budgetSpent = project.budgetSpent,
                    teamSize = getTeamSize(project.id),
                    status = project.status
                )
                snapshotRepository.save(snapshot)
            }

            logger.info("Completed snapshot capture for ${projects.size} projects")
        }
    }
    ```
  - **Estimate**: 1 day

#### ML Pipeline (Optional)
- [ ] **Task 5.4**: Predictive Model - Delay Forecast
  - **Owner**: Data Scientist
  - **Description**: ML model to predict project delays
  - **Features**:
    - Current progress vs. timeline progress
    - Budget utilization rate
    - Team size changes
    - Historical project complexity
  - **Framework**: Python (scikit-learn or TensorFlow)
  - **Deliverable**: Trained model + prediction API
  - **Estimate**: 2 weeks

- [ ] **Task 5.5**: Recommendation Engine
  - **Owner**: Data Scientist
  - **Description**: Suggest optimal team size, budget, timeline
  - **Approach**: Collaborative filtering based on similar projects
  - **Deliverable**: Recommendation API
  - **Estimate**: 2 weeks

### Phase 5 Deliverables
- ✅ Project snapshots table created
- ✅ Daily snapshot job running
- ✅ Materialized views for fast aggregates
- ✅ ML models deployed (optional)
- ✅ Predictive insights in UI (optional)

### Phase 5 Success Criteria
- [ ] Historical data captured daily
- [ ] Budget timeline uses historical data
- [ ] Trend analysis available
- [ ] ML predictions accuracy > 80% (if implemented)

---

## 📊 Success Metrics & KPIs

### Technical Metrics

| Metric | Current | Target | Phase |
|--------|---------|--------|-------|
| **Backend Response Time (P95)** | ~1000ms | < 500ms | Phase 4 |
| **Frontend Load Time (LCP)** | ~4s | < 2.5s | Phase 4 |
| **API Calls for Dashboard** | 4-5 | 1 | Phase 4 |
| **Test Coverage (Backend)** | ~60% | 90%+ | Phase 1-2 |
| **Test Coverage (Frontend)** | ~70% | 80%+ | Phase 3 |
| **Charts with Real Data** | 1/4 | 4/4 | Phase 3 |
| **KPI Metrics Live** | 3/8 | 8/8 | Phase 3 |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Analytics Adoption Rate** | 80% of PM users | GA tracking |
| **Dashboard Load Frequency** | 5+ times/week per user | Usage analytics |
| **Time to Insight** | < 30 seconds | User testing |
| **Decision Support Value** | 4/5 satisfaction | User survey |

---

## 🛠️ Tools & Technologies

### Backend
- **Language**: Kotlin 1.9+
- **Framework**: Spring Boot 4.x
- **Database**: PostgreSQL 15+
- **Caching**: Redis 7.x
- **Testing**: JUnit 5, Mockito, Spring Boot Test, REST Assured
- **Performance**: k6, JMeter
- **API Docs**: SpringDoc OpenAPI

### Frontend
- **Language**: TypeScript 5.9+
- **Framework**: Angular 20.3+
- **Charts**: Chart.js 4.5.0
- **3D Graphics**: Three.js 0.170.0
- **Testing**: Jasmine, Karma, Cypress
- **Performance**: Lighthouse CI

### DevOps
- **CI/CD**: GitHub Actions
- **Containers**: Docker
- **Orchestration**: Kubernetes (optional)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

---

## 👥 Team Roles & Responsibilities

### Backend Team
- **Backend Lead** (Task 0.7, 1.1-1.7, 4.2-4.4)
  - Architecture decisions
  - Service layer implementation
  - Code review

- **Backend Developer 1** (Task 1.2-1.3, 1.7-1.9, 2.1-2.3, 2.7-2.9)
  - Budget analytics
  - Progress analytics
  - API endpoint creation

- **Backend Developer 2** (Task 1.4-1.6, 2.4-2.6, 4.5-4.7)
  - Team analytics
  - Technology analytics
  - Dashboard endpoint

### Frontend Team
- **Frontend Lead** (Task 0.5, 3.1-3.3, 4.8-4.9)
  - Architecture decisions
  - Service layer updates
  - Code review

- **Frontend Developer 1** (Task 3.4, 3.7-3.8, 4.11)
  - Component updates
  - Performance optimization

- **Frontend Developer 2** (Task 3.5-3.6, 3.10)
  - Chart component updates
  - Integration testing

### QA Team
- **QA Lead** (Task 0.10, 2.11-2.12)
  - Test strategy
  - Test plan creation

- **QA Engineer** (Task 2.13-2.14, 3.11-3.13)
  - API testing
  - E2E testing
  - Manual QA

### DevOps
- **DevOps Engineer** (Task 4.1, 4.12)
  - Infrastructure setup
  - Load testing
  - Deployment

### Optional Roles (Phase 5)
- **DBA** (Task 0.8, 5.1-5.2)
- **Data Scientist** (Task 5.4-5.5)

---

## 📅 Timeline & Milestones

```
Week 1: Phase 0 - Discovery
├── Days 1-2: Analysis (Tasks 0.1-0.4)
├── Days 3-4: Design (Tasks 0.7-0.10)
└── Day 5: Planning (Tasks 0.11-0.12)

Week 2-3: Phase 1 - Foundation
├── Days 1-7: Backend Development (Tasks 1.1-1.9)
└── Days 8-10: Testing & Documentation (Tasks 1.10-1.14)

Week 4-5: Phase 2 - Visualization Endpoints
├── Days 1-3: Budget Timeline (Tasks 2.1-2.3)
├── Days 3-5: Technology Stack (Tasks 2.4-2.6)
├── Days 5-7: Progress Analytics (Tasks 2.7-2.9)
└── Days 8-10: Testing & Documentation (Tasks 2.10-2.14)

Week 6: Phase 3 - Frontend Integration
├── Days 1-2: Models & Service (Tasks 3.1-3.3)
├── Days 3-4: Components (Tasks 3.4-3.8)
└── Days 5-7: Testing (Tasks 3.9-3.13)

Week 7: Phase 4 - Optimization
├── Days 1-2: Caching Infrastructure (Tasks 4.1-4.4)
├── Days 3-4: Dashboard Endpoint (Tasks 4.5-4.7)
├── Day 5: Frontend Optimization (Tasks 4.8-4.9)
└── Days 6-7: Performance Testing (Tasks 4.10-4.13)

Week 8+: Phase 5 - Intelligence (Optional)
└── 2-3 weeks: Historical data & ML (Tasks 5.1-5.5)
```

---

## 🚀 Deployment Strategy

### Staging Deployment
**After Each Phase**:
1. Merge feature branch to `develop`
2. Auto-deploy to staging environment
3. Run smoke tests
4. Manual QA verification
5. Stakeholder demo

### Production Deployment
**After Phase 4 Complete**:
1. Merge `develop` to `main`
2. Create release tag (`v2.0.0-analytics-temple`)
3. Deploy to production during maintenance window
4. Run health checks
5. Monitor for 48 hours
6. Rollback plan ready

### Rollback Plan
- **Database**: Migrations reversible
- **Backend**: Previous version container ready
- **Frontend**: Previous build deployed to CDN
- **Cache**: Redis flush if needed

---

## 🎯 Risk Management

### High Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Performance degradation with large datasets** | HIGH | MEDIUM | Implement pagination, caching, database indexes |
| **Historical data not available** | MEDIUM | HIGH | Design API to work with current state, add snapshots later |
| **Frontend-backend contract mismatch** | HIGH | MEDIUM | Early API contract validation, comprehensive testing |
| **Cache invalidation issues** | MEDIUM | MEDIUM | Conservative TTLs, manual cache clear capability |

### Medium Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Redis infrastructure delays** | MEDIUM | LOW | Have fallback to in-memory caching |
| **Chart library performance issues** | MEDIUM | LOW | Lazy loading, virtual scrolling for large datasets |
| **Browser compatibility** | LOW | MEDIUM | Comprehensive cross-browser testing |

---

## 📝 Change Management

### Communication Plan
- **Daily Standup**: 15min sync (all team members)
- **Weekly Demo**: Stakeholder presentation (Fridays)
- **Sprint Retrospective**: Continuous improvement (end of each sprint)
- **Status Updates**: Slack channel + project board

### Documentation Updates
- **API Docs**: Updated continuously (OpenAPI spec)
- **Frontend Docs**: Component Storybook
- **User Guide**: Updated after Phase 3
- **Admin Guide**: Updated after Phase 4

---

## ✅ Definition of Done

### For Each Task
- [ ] Code written and committed
- [ ] Unit tests written and passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Merged to feature branch

### For Each Phase
- [ ] All phase tasks complete
- [ ] Integration tests passing
- [ ] Performance benchmarks met
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Stakeholder demo completed

### For Full Project
- [ ] All 4 phases complete (Phases 0-4)
- [ ] 4/4 charts displaying real data
- [ ] 8/8 KPI metrics live
- [ ] Performance targets met
- [ ] Test coverage targets met
- [ ] Deployed to production
- [ ] User documentation complete
- [ ] Project retrospective completed

---

## 🎉 Conclusion

This masterplan provides a **comprehensive roadmap** for transforming the Analytics Temple from a beautiful mockup into a **fully functional, high-performance analytics platform**.

**Key Deliverables**:
- ✅ 4 specialized analytics endpoints
- ✅ 1 optimized dashboard endpoint
- ✅ Redis caching infrastructure
- ✅ Complete frontend-backend integration
- ✅ 90%+ backend test coverage
- ✅ 80%+ frontend test coverage
- ✅ < 500ms dashboard response time
- ✅ Foundation for ML-powered insights

**Total Effort Estimate**: 6-8 weeks for Phases 0-4 (MVP)

**Next Steps**:
1. Review and approve this masterplan
2. Allocate team resources
3. Set up project board (Jira/GitHub Projects)
4. Begin Phase 0: Discovery

**Let's build something extraordinary!** 🚀🏛️

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Status**: Ready for Team Review
**Approved By**: _Pending_

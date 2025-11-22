import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {
  Project,
  ProjectDetail,
  ProjectListResponse,
  ProjectQueryParams,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddProjectTeamMemberRequest,
  UpdateProjectTeamMemberRequest,
  AddProjectTechnologyRequest,
  ProjectListAnalytics
} from '../../../models';
import { ProjectListResponseBackend, ProjectBackend } from '../../../models/project-backend.model';
import { mapProjectListResponse, mapProjectDetail } from '../utils/project-mappers';
import { PaginationService } from '../../../core/services';
import { validateProjectListResponse } from '../utils/api-validators';

/**
 * Projects Service
 *
 * Manages project data with signal-based reactive state management
 * Features: filtering, pagination, analytics, CRUD operations
 *
 * Design Philosophy:
 * - Signal-based state for reactive UI updates
 * - Computed signals for derived state (filtered, sorted)
 * - Clean error handling with user-friendly messages
 * - Optimistic updates where appropriate
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly http = inject(HttpClient);

  // API configuration
  private readonly API_BASE_URL = 'http://localhost:8080/api/v1';

  // ============================================================================
  // PROJECT LIST STATE
  // ============================================================================

  /** All projects from the server */
  readonly projects = signal<Project[]>([]);

  /** Loading state for project list */
  readonly loading = signal(false);

  /** Error state for project list */
  readonly error = signal<string | null>(null);

  /** Analytics summary for current project list */
  readonly analytics = signal<ProjectListAnalytics | null>(null);

  // ============================================================================
  // PAGINATION SERVICE
  // ============================================================================

  /**
   * Pagination service instance for projects
   *
   * Provides reactive pagination state with computed properties.
   * Instantiated directly (not via DI) for type-safe, per-service pagination.
   */
  private readonly paginationService = new PaginationService<Project>();

  /**
   * Expose pagination state from pagination service
   *
   * Components should use these computed signals for pagination UI
   */
  readonly pagination = this.paginationService.state;
  readonly currentPage = this.paginationService.currentPage;
  readonly pageSize = this.paginationService.pageSize;
  readonly hasNextPage = this.paginationService.hasNext;
  readonly hasPreviousPage = this.paginationService.hasPrevious;
  readonly firstItem = this.paginationService.firstItem;
  readonly lastItem = this.paginationService.lastItem;

  // ============================================================================
  // SINGLE PROJECT STATE
  // ============================================================================

  /** Currently selected project (detail view) */
  readonly selectedProject = signal<ProjectDetail | null>(null);

  /** Loading state for single project */
  readonly projectLoading = signal(false);

  /** Error state for single project */
  readonly projectError = signal<string | null>(null);

  // ============================================================================
  // FILTER STATE
  // ============================================================================

  /**
   * Current filter parameters
   *
   * NOTE: page is 0-indexed for backend compatibility (OpenAPI spec)
   * PaginationService handles UI conversion (0→1 indexed display)
   */
  readonly filters = signal<ProjectQueryParams>({
    page: 0,        // 0-indexed (backend expects 0 for first page)
    size: 20,       // Default from OpenAPI spec
    order: 'desc',  // Will be combined with sort for backend
    sort: 'startDate'
  });

  /** Search query (for debouncing) */
  readonly searchQuery = signal<string>('');

  // ============================================================================
  // COMPUTED STATE
  // ============================================================================

  /** Total projects count */
  readonly totalProjects = this.paginationService.totalItems;

  /** Has any filters applied (excluding pagination) */
  readonly hasFilters = computed(() => {
    const f = this.filters();
    return !!(
      f.status?.length ||
      f.industry?.length ||
      f.technology?.length ||
      f.company ||
      f.employee ||
      f.complexity?.length ||
      f.priority?.length ||
      f.search ||
      f.hasOpenPositions
    );
  });

  /** Is data currently being fetched */
  readonly isLoading = computed(() => this.loading() || this.projectLoading());

  // ============================================================================
  // CRUD OPERATIONS STATE
  // ============================================================================

  /** Create operation state */
  readonly createLoading = signal(false);
  readonly createError = signal<string | null>(null);

  /** Update operation state */
  readonly updateLoading = signal(false);
  readonly updateError = signal<string | null>(null);

  /** Delete operation state */
  readonly deleteLoading = signal(false);
  readonly deleteError = signal<string | null>(null);

  // ============================================================================
  // PUBLIC METHODS - PROJECT LIST
  // ============================================================================

  /**
   * Load projects with current filters
   *
   * UPDATED: 2025-11-22
   * - Added validation pipeline for backend responses
   * - Integrated PaginationService for state management
   * - Fail-fast error handling for invalid responses
   *
   * Updates projects, analytics, and pagination signals
   */
  loadProjects(params?: Partial<ProjectQueryParams>): void {
    // Merge with existing filters
    if (params) {
      this.filters.update(current => ({ ...current, ...params }));
    }

    this.loading.set(true);
    this.error.set(null);

    const httpParams = this.buildHttpParams(this.filters());

    this.http.get<unknown>(`${this.API_BASE_URL}/projects`, { params: httpParams })
      .pipe(
        // ✅ Step 1: Validate backend response structure
        tap((response) => {
          try {
            validateProjectListResponse(response);
          } catch (err) {
            console.error('[ProjectsService] Backend response validation failed:', err);
            throw err;
          }
        }),

        // ✅ Step 2: Map to frontend model (now type-safe after validation)
        map((backendResponse) => mapProjectListResponse(backendResponse as ProjectListResponseBackend)),

        // ✅ Step 3: Update all state
        tap((response) => {
          this.projects.set(response.projects);
          this.analytics.set(response.analytics);

          // ✅ Update pagination service
          this.paginationService.setPage(response.pagination, response.projects);

          this.loading.set(false);
        }),

        // ✅ Step 4: Handle errors
        catchError((error: HttpErrorResponse) => {
          this.error.set(this.getErrorMessage(error));
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Update search query and reload projects
   * (Can be debounced externally if needed)
   */
  search(query: string): void {
    this.searchQuery.set(query);
    this.loadProjects({ search: query, page: 0 });  // Reset to first page (0-indexed)
  }

  /**
   * Clear all filters and reload
   */
  clearFilters(): void {
    this.filters.set({
      page: 0,        // 0-indexed (backend compatibility)
      size: 20,
      order: 'desc',
      sort: 'startDate'
    });
    this.searchQuery.set('');
    this.loadProjects();
  }

  /**
   * Go to specific page
   *
   * @param page - 0-indexed page number (backend format)
   *               First page = 0, Second page = 1, etc.
   */
  goToPage(page: number): void {
    this.loadProjects({ page });
  }

  /**
   * Change page size
   */
  changePageSize(size: number): void {
    this.loadProjects({ size, page: 0 });  // Reset to first page when changing size
  }

  /**
   * Sort projects
   */
  sortBy(sort: ProjectQueryParams['sort'], order: 'asc' | 'desc' = 'asc'): void {
    this.loadProjects({ sort, order });
  }

  /**
   * Apply filters and reload projects
   */
  applyFilters(filters: ProjectQueryParams): void {
    this.loadProjects(filters);
  }

  // ============================================================================
  // PUBLIC METHODS - SINGLE PROJECT
  // ============================================================================

  /**
   * Get project by ID with full details
   */
  getProjectById(id: number): Observable<ProjectDetail | null> {
    this.projectLoading.set(true);
    this.projectError.set(null);

    return this.http.get<ProjectBackend>(`${this.API_BASE_URL}/projects/${id}`)
      .pipe(
        map(backendProject => mapProjectDetail(backendProject)),
        tap((project) => {
          this.selectedProject.set(project);
          this.projectLoading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.projectError.set(this.getErrorMessage(error));
          this.projectLoading.set(false);
          return of(null);
        })
      );
  }

  /**
   * Clear selected project
   */
  clearSelectedProject(): void {
    this.selectedProject.set(null);
    this.projectError.set(null);
  }

  // ============================================================================
  // PUBLIC METHODS - CREATE
  // ============================================================================

  /**
   * Create a new project
   */
  createProject(data: CreateProjectRequest): Observable<ProjectDetail> {
    this.createLoading.set(true);
    this.createError.set(null);

    return this.http.post<ProjectBackend>(`${this.API_BASE_URL}/projects`, data)
      .pipe(
        map(backendProject => mapProjectDetail(backendProject)),
        tap((project) => {
          this.createLoading.set(false);
          // Optionally refresh the list
          this.loadProjects();
        }),
        catchError((error: HttpErrorResponse) => {
          this.createError.set(this.getErrorMessage(error));
          this.createLoading.set(false);
          throw error;
        })
      );
  }

  // ============================================================================
  // PUBLIC METHODS - UPDATE
  // ============================================================================

  /**
   * Update project details
   */
  updateProject(id: number, data: UpdateProjectRequest): Observable<ProjectDetail> {
    this.updateLoading.set(true);
    this.updateError.set(null);

    return this.http.put<ProjectBackend>(`${this.API_BASE_URL}/projects/${id}`, data)
      .pipe(
        map(backendProject => mapProjectDetail(backendProject)),
        tap((project) => {
          this.updateLoading.set(false);
          // Update selected project if it's the one being edited
          if (this.selectedProject()?.id === id) {
            this.selectedProject.set(project);
          }
          // Refresh list to reflect changes
          this.loadProjects();
        }),
        catchError((error: HttpErrorResponse) => {
          this.updateError.set(this.getErrorMessage(error));
          this.updateLoading.set(false);
          throw error;
        })
      );
  }

  // ============================================================================
  // PUBLIC METHODS - DELETE
  // ============================================================================

  /**
   * Delete a project
   */
  deleteProject(id: number): Observable<void> {
    this.deleteLoading.set(true);
    this.deleteError.set(null);

    return this.http.delete<void>(`${this.API_BASE_URL}/projects/${id}`)
      .pipe(
        tap(() => {
          this.deleteLoading.set(false);
          // Clear selected project if it was deleted
          if (this.selectedProject()?.id === id) {
            this.selectedProject.set(null);
          }
          // Refresh list
          this.loadProjects();
        }),
        catchError((error: HttpErrorResponse) => {
          this.deleteError.set(this.getErrorMessage(error));
          this.deleteLoading.set(false);
          throw error;
        })
      );
  }

  // ============================================================================
  // PUBLIC METHODS - TEAM MANAGEMENT
  // ============================================================================

  /**
   * Add team member to project
   */
  addTeamMember(projectId: number, data: AddProjectTeamMemberRequest): Observable<ProjectDetail> {
    return this.http.post<ProjectBackend>(`${this.API_BASE_URL}/projects/${projectId}/team`, data)
      .pipe(
        map(backendProject => mapProjectDetail(backendProject)),
        tap((project) => {
          if (this.selectedProject()?.id === projectId) {
            this.selectedProject.set(project);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  /**
   * Update team member assignment
   */
  updateTeamMember(
    projectId: number,
    employeeId: number,
    data: UpdateProjectTeamMemberRequest
  ): Observable<ProjectDetail> {
    return this.http.put<ProjectBackend>(
      `${this.API_BASE_URL}/projects/${projectId}/team/${employeeId}`,
      data
    ).pipe(
      map(backendProject => mapProjectDetail(backendProject)),
      tap((project) => {
        if (this.selectedProject()?.id === projectId) {
          this.selectedProject.set(project);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Remove team member from project
   */
  removeTeamMember(projectId: number, employeeId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_BASE_URL}/projects/${projectId}/team/${employeeId}`
    ).pipe(
      tap(() => {
        // Refresh project to get updated team
        if (this.selectedProject()?.id === projectId) {
          this.getProjectById(projectId);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  // ============================================================================
  // PUBLIC METHODS - TECHNOLOGY MANAGEMENT
  // ============================================================================

  /**
   * Add technology to project
   */
  addTechnology(projectId: number, data: AddProjectTechnologyRequest): Observable<ProjectDetail> {
    return this.http.post<ProjectBackend>(
      `${this.API_BASE_URL}/projects/${projectId}/technologies`,
      data
    ).pipe(
      map(backendProject => mapProjectDetail(backendProject)),
      tap((project) => {
        if (this.selectedProject()?.id === projectId) {
          this.selectedProject.set(project);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  // ============================================================================
  // PUBLIC METHODS - ANALYTICS
  // ============================================================================

  /**
   * Get analytics for filtered projects
   */
  getAnalytics(filters?: ProjectQueryParams): Observable<ProjectListAnalytics> {
    const params = filters ? this.buildHttpParams(filters) : undefined;
    return this.http.get<ProjectListAnalytics>(
      `${this.API_BASE_URL}/projects/analytics`,
      { params }
    );
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Build HTTP params from filter object
   */
  private buildHttpParams(filters: ProjectQueryParams): HttpParams {
    let params = new HttpParams();

    if (filters.status?.length) {
      params = params.set('status', filters.status.join(','));
    }
    if (filters.industry?.length) {
      params = params.set('industry', filters.industry.join(','));
    }
    if (filters.technology?.length) {
      params = params.set('technology', filters.technology.join(','));
    }
    if (filters.company) {
      params = params.set('company', filters.company);
    }
    if (filters.employee) {
      params = params.set('employee', filters.employee.toString());
    }
    if (filters.startDateFrom) {
      params = params.set('startDateFrom', filters.startDateFrom);
    }
    if (filters.startDateTo) {
      params = params.set('startDateTo', filters.startDateTo);
    }
    if (filters.complexity?.length) {
      params = params.set('complexity', filters.complexity.join(','));
    }
    if (filters.priority?.length) {
      params = params.set('priority', filters.priority.join(','));
    }
    if (filters.hasOpenPositions !== undefined) {
      params = params.set('hasOpenPositions', filters.hasOpenPositions.toString());
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    // ✅ OpenAPI spec: sort format is "field,direction" (e.g., "startDate,desc")
    if (filters.sort) {
      const sortValue = filters.order
        ? `${filters.sort},${filters.order}`  // Combine: "startDate,desc"
        : filters.sort;                       // Fallback: just field name
      params = params.set('sort', sortValue);
    }

    // ✅ Page is 0-indexed (OpenAPI spec requirement)
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size) {
      params = params.set('size', filters.size.toString());
    }

    return params;
  }

  /**
   * Get human-readable error message
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'Project not found';
    } else if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else if (error.status === 400) {
      return error.error?.message || 'Invalid request. Please check your input.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else {
      return error.error?.message || error.message || 'An unexpected error occurred';
    }
  }
}

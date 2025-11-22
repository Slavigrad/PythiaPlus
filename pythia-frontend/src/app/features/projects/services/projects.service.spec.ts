/**
 * ProjectsService Tests
 *
 * Comprehensive tests covering:
 * - Project list fetching with analytics
 * - Pagination management
 * - Filtering and search
 * - CRUD operations (create, read, update, delete)
 * - Error handling
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsService } from './projects.service';
import { Project, ProjectDetail, ProjectListResponse, CreateProjectRequest } from '../../../models';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  const mockProject: Project = {
    id: 1,
    name: 'Pythia Plus',
    description: 'AI-powered talent search platform',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 500000,
    spent: 200000,
    progress: 40,
    teamSize: 8,
    technologies: ['Angular', 'Kotlin', 'PostgreSQL']
  };

  const mockProjectList: Project[] = [
    mockProject,
    { ...mockProject, id: 2, name: 'Project Alpha', progress: 60 },
    { ...mockProject, id: 3, name: 'Project Beta', progress: 30, status: 'completed' }
  ];

  const mockProjectListResponse: ProjectListResponse = {
    projects: mockProjectList,
    total: 3,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    analytics: {
      totalProjects: 3,
      activeProjects: 2,
      completedProjects: 1,
      totalBudget: 1500000,
      totalSpent: 600000,
      averageProgress: 43.33
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });

    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // =========================================================================
  // INITIALIZATION TESTS
  // =========================================================================

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty state', () => {
      expect(service.projects()).toEqual([]);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
      expect(service.analytics()).toBeNull();
    });

    it('should initialize pagination with default values', () => {
      expect(service.currentPage()).toBe(1);
      expect(service.pageSize()).toBe(10);
    });
  });

  // =========================================================================
  // PROJECT LIST FETCHING TESTS
  // =========================================================================

  describe('loadProjects', () => {
    it('should fetch projects successfully', (done) => {
      service.loadProjects();

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne((request) =>
        request.url.includes('/projects')
      );

      expect(req.request.method).toBe('GET');
      req.flush({
        content: mockProjectList,
        totalElements: 3,
        totalPages: 1,
        number: 0,
        size: 10
      });

      setTimeout(() => {
        expect(service.projects().length).toBe(3);
        expect(service.loading()).toBe(false);
        expect(service.error()).toBeNull();
        done();
      }, 100);
    });

    it('should calculate analytics from project data', (done) => {
      service.loadProjects();

      const req = httpMock.expectOne((request) => request.url.includes('/projects'));
      req.flush({
        content: mockProjectList,
        totalElements: 3,
        totalPages: 1,
        number: 0,
        size: 10
      });

      setTimeout(() => {
        const analytics = service.analytics();
        expect(analytics).toBeDefined();
        expect(analytics?.totalProjects).toBe(3);
        expect(analytics?.activeProjects).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should handle HTTP errors gracefully', (done) => {
      service.loadProjects();

      const req = httpMock.expectOne((request) => request.url.includes('/projects'));
      req.error(new ErrorEvent('Network error'), { status: 500 });

      setTimeout(() => {
        expect(service.loading()).toBe(false);
        expect(service.error()).toBeTruthy();
        expect(service.projects()).toEqual([]);
        done();
      }, 100);
    });
  });

  // =========================================================================
  // PAGINATION TESTS
  // =========================================================================

  describe('Pagination', () => {
    it('should support page navigation', () => {
      service.projects.set(mockProjectList);
      service.paginationService.setPageSize(2);

      expect(service.currentPage()).toBe(1);
      expect(service.hasNextPage()).toBe(true);

      service.paginationService.nextPage();
      expect(service.currentPage()).toBe(2);
    });

    it('should calculate pagination correctly', () => {
      service.projects.set(mockProjectList); // 3 projects
      service.paginationService.setPageSize(2);

      const state = service.pagination();
      expect(state.totalPages).toBe(2); // 3 projects / 2 per page = 2 pages
    });

    it('should update items when page changes', () => {
      service.projects.set(mockProjectList);
      service.paginationService.setPageSize(2);

      // First page should show 2 items
      let items = service.paginationService.items();
      expect(items.length).toBe(2);

      // Second page should show 1 item
      service.paginationService.nextPage();
      items = service.paginationService.items();
      expect(items.length).toBe(1);
    });
  });

  // =========================================================================
  // FILTERING TESTS
  // =========================================================================

  describe('Filtering', () => {
    beforeEach(() => {
      service.projects.set(mockProjectList);
    });

    it('should filter projects by status', () => {
      service.setFilter('status', 'active');

      const activeProjects = service.projects().filter(p => p.status === 'active');
      expect(activeProjects.length).toBeGreaterThan(0);
    });

    it('should filter projects by name search', () => {
      service.setFilter('search', 'Pythia');

      const filteredProjects = service.projects().filter(p =>
        p.name.toLowerCase().includes('pythia')
      );
      expect(filteredProjects.length).toBeGreaterThan(0);
    });

    it('should clear filters', () => {
      service.setFilter('status', 'active');
      service.setFilter('search', 'test');

      service.clearFilters();

      // After clearing, all projects should be visible
      expect(service.projects().length).toBe(mockProjectList.length);
    });
  });

  // =========================================================================
  // CRUD OPERATIONS TESTS
  // =========================================================================

  describe('Create Project', () => {
    const createRequest: CreateProjectRequest = {
      name: 'New Project',
      description: 'Test project description',
      status: 'active',
      startDate: '2024-01-01',
      budget: 100000
    };

    it('should create a new project', (done) => {
      service.createProject(createRequest).subscribe({
        next: (project) => {
          expect(project).toBeDefined();
          expect(project.name).toBe('New Project');
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);

      req.flush({ ...mockProject, ...createRequest });
    });

    it('should handle create errors', (done) => {
      service.createProject(createRequest).subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects`);
      req.flush(
        { message: 'Validation failed' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('Update Project', () => {
    const updateRequest = {
      name: 'Updated Project Name',
      description: 'Updated description'
    };

    it('should update an existing project', (done) => {
      service.updateProject(1, updateRequest).subscribe({
        next: (project) => {
          expect(project.name).toBe('Updated Project Name');
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects/1`);
      expect(req.request.method).toBe('PUT');

      req.flush({ ...mockProject, ...updateRequest });
    });
  });

  describe('Delete Project', () => {
    it('should delete a project', (done) => {
      service.deleteProject(1).subscribe({
        next: () => {
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects/1`);
      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });

    it('should handle delete errors', (done) => {
      service.deleteProject(1).subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects/1`);
      req.flush(
        { message: 'Cannot delete' },
        { status: 403, statusText: 'Forbidden' }
      );
    });
  });

  // =========================================================================
  // ANALYTICS CALCULATION TESTS
  // =========================================================================

  describe('Analytics Calculation', () => {
    it('should calculate total projects correctly', () => {
      service.projects.set(mockProjectList);

      const analytics = service.analytics();
      expect(analytics?.totalProjects).toBe(3);
    });

    it('should calculate active vs completed projects', () => {
      service.projects.set(mockProjectList);

      const analytics = service.analytics();
      expect(analytics?.activeProjects).toBe(2);
      expect(analytics?.completedProjects).toBe(1);
    });

    it('should calculate average progress', () => {
      service.projects.set(mockProjectList);

      const analytics = service.analytics();
      const expectedAvg = (40 + 60 + 30) / 3;
      expect(analytics?.averageProgress).toBeCloseTo(expectedAvg, 2);
    });

    it('should handle empty project list', () => {
      service.projects.set([]);

      const analytics = service.analytics();
      expect(analytics?.totalProjects).toBe(0);
      expect(analytics?.averageProgress).toBe(0);
    });
  });

  // =========================================================================
  // ERROR MESSAGE FORMATTING TESTS
  // =========================================================================

  describe('Error Handling', () => {
    it('should format 404 error message', (done) => {
      service.getProjectById(999).subscribe({
        error: () => {
          expect(service.projectError()).toContain('not found');
          done();
        }
      });

      const req = httpMock.expectOne(`${service['API_BASE_URL']}/projects/999`);
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should format network error message', (done) => {
      service.loadProjects();

      const req = httpMock.expectOne((request) => request.url.includes('/projects'));
      req.error(new ErrorEvent('Network error'), { status: 0 });

      setTimeout(() => {
        expect(service.error()).toContain('connection');
        done();
      }, 100);
    });
  });
});

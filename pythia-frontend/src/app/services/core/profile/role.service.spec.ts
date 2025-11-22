import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoleService } from './role.service';
import { Role, RoleResponse, RoleRequest } from '../models/role.model';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'http://localhost:8080/api/v1';

  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'Full Stack Developer',
      description: 'Develops both frontend and backend components',
      category: 'Roles',
      createdAt: '2025-11-16T13:52:15.883959Z',
      updatedAt: '2025-11-16T13:52:15.883959Z'
    },
    {
      id: 2,
      name: 'Backend Developer',
      description: 'Focuses on server-side application logic',
      category: 'Roles',
      createdAt: '2025-11-16T13:52:15.883959Z',
      updatedAt: '2025-11-16T13:52:15.883959Z'
    }
  ];

  const mockResponse: RoleResponse = {
    items: mockRoles,
    total: 2,
    category: 'Roles'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService]
    });

    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadRoles', () => {
    it('should fetch roles and update signals', (done) => {
      service.loadRoles().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(service.roles()).toEqual(mockRoles);
          expect(service.total()).toBe(2);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/roles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors correctly', (done) => {
      service.loadRoles().subscribe({
        error: () => {
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/roles`);
      req.error(new ProgressEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
    });
  });

  describe('createRole', () => {
    it('should create a new role and update state', (done) => {
      const newRoleRequest: RoleRequest = {
        name: 'DevOps Engineer',
        description: 'Manages infrastructure and CI/CD pipelines',
        category: 'Roles'
      };

      const newRole: Role = {
        id: 3,
        ...newRoleRequest,
        createdAt: '2025-11-17T10:00:00Z',
        updatedAt: '2025-11-17T10:00:00Z'
      };

      // Set initial state
      service.roles.set(mockRoles);
      service.total.set(2);

      service.createRole(newRoleRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(newRole);
          expect(service.roles().length).toBe(3);
          expect(service.total()).toBe(3);
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/roles`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newRoleRequest);
      req.flush(newRole);
    });

    it('should handle 409 conflict error', (done) => {
      const newRoleRequest: RoleRequest = {
        name: 'Full Stack Developer',
        description: 'Duplicate role',
        category: 'Roles'
      };

      service.createRole(newRoleRequest).subscribe({
        error: () => {
          expect(service.error()).toContain('already exists');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/roles`);
      req.error(new ProgressEvent('Error'), { status: 409 });
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', (done) => {
      const updateRequest: RoleRequest = {
        name: 'Senior Full Stack Developer',
        description: 'Updated description',
        category: 'Roles'
      };

      const updatedRole: Role = {
        id: 1,
        ...updateRequest,
        createdAt: '2025-11-16T13:52:15.883959Z',
        updatedAt: '2025-11-17T10:00:00Z'
      };

      // Set initial state
      service.roles.set(mockRoles);

      service.updateRole(1, updateRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(updatedRole);
          const updated = service.roles().find(r => r.id === 1);
          expect(updated?.name).toBe('Senior Full Stack Developer');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/roles/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(updatedRole);
    });

    it('should handle 404 not found error', (done) => {
      const updateRequest: RoleRequest = {
        name: 'Test Role',
        description: 'Test description',
        category: 'Roles'
      };

      service.updateRole(999, updateRequest).subscribe({
        error: () => {
          expect(service.error()).toContain('not found');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/roles/999`);
      req.error(new ProgressEvent('Error'), { status: 404 });
    });
  });

  describe('deleteRole', () => {
    it('should delete a role and update state', (done) => {
      // Set initial state
      service.roles.set(mockRoles);
      service.total.set(2);

      service.deleteRole(1).subscribe({
        next: () => {
          expect(service.roles().length).toBe(1);
          expect(service.roles().find(r => r.id === 1)).toBeUndefined();
          expect(service.total()).toBe(1);
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/roles/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle server error', (done) => {
      service.deleteRole(1).subscribe({
        error: () => {
          expect(service.error()).toContain('Server error');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/roles/1`);
      req.error(new ProgressEvent('Error'), { status: 500 });
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      service.error.set('Test error');
      expect(service.error()).toBe('Test error');

      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});

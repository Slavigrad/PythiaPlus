/**
 * EmployeeService Tests
 *
 * Comprehensive tests for the EmployeeService covering:
 * - Signal state management
 * - HTTP operations (get, update, delete)
 * - Error handling
 * - Pagination
 * - Cache management
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeListResponse, EmployeeUpdateResponse } from '../../../models';
import { createServiceTestHarness, assertServiceSignalState } from '../../../../testing';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployee: Employee = {
    id: 1,
    fullName: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    location: 'Zurich, Switzerland',
    city: 'Zurich',
    country: 'Switzerland',
    availability: 'available',
    yearsOfExperience: 8,
    seniority: 'senior',
    technologies: ['Angular', 'TypeScript', 'Kotlin'],
    skills: ['Frontend Development', 'REST APIs'],
    certifications: ['AWS Certified Solutions Architect'],
    languages: ['English', 'German'],
    roles: ['Full Stack Developer'],
    trainings: [],
    projectIds: [],
    bio: 'Experienced software engineer',
    profileImageUrl: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockEmployeeList: Employee[] = [
    mockEmployee,
    { ...mockEmployee, id: 2, fullName: 'Jane Smith' },
    { ...mockEmployee, id: 3, fullName: 'Bob Johnson' }
  ];

  const mockEmployeeListResponse: EmployeeListResponse = {
    employees: mockEmployeeList,
    pagination: {
      page: 0,
      size: 20,
      totalElements: 3,
      totalPages: 1
    }
  };

  beforeEach(() => {
    const harness = createServiceTestHarness(EmployeeService);
    service = harness.service;
    httpMock = harness.httpMock;
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
      assertServiceSignalState(service, {
        employee: null,
        loading: false,
        error: null,
        listLoading: false,
        listError: null,
        updateLoading: false,
        updateError: null
      });
    });

    it('should initialize employees as empty array', () => {
      expect(service.employees()).toEqual([]);
    });

    it('should initialize pageMetadata as null', () => {
      expect(service.pageMetadata()).toBeNull();
    });
  });

  // =========================================================================
  // GET EMPLOYEE BY ID TESTS
  // =========================================================================

  describe('getEmployeeById', () => {
    it('should set loading state to true when fetching', () => {
      service.getEmployeeById(1);

      expect(service.loading()).toBe(true);
      expect(service.error()).toBeNull();

      // Clean up pending request
      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush(mockEmployee);
    });

    it('should fetch employee successfully and update signals', () => {
      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      expect(req.request.method).toBe('GET');

      req.flush(mockEmployee);

      assertServiceSignalState(service, {
        employee: mockEmployee,
        loading: false,
        error: null
      });
    });

    it('should compute location from city and country if not provided', () => {
      const employeeWithoutLocation = { ...mockEmployee, location: '' };

      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush(employeeWithoutLocation);

      const employee = service.employee();
      expect(employee?.location).toBe('Zurich, Switzerland');
    });

    it('should handle 404 error gracefully', () => {
      service.getEmployeeById(999);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/999');
      req.flush(
        { message: 'Employee not found' },
        { status: 404, statusText: 'Not Found' }
      );

      assertServiceSignalState(service, {
        employee: null,
        loading: false
      });
      expect(service.error()).toContain('not found');
    });

    it('should handle network error gracefully', () => {
      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.error(new ErrorEvent('Network error'), { status: 0 });

      assertServiceSignalState(service, {
        employee: null,
        loading: false
      });
      expect(service.error()).toContain('connection');
    });

    it('should handle server error (500) gracefully', () => {
      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush(
        { message: 'Internal server error' },
        { status: 500, statusText: 'Internal Server Error' }
      );

      assertServiceSignalState(service, {
        employee: null,
        loading: false
      });
      expect(service.error()).toContain('Server error');
    });
  });

  // =========================================================================
  // GET ALL EMPLOYEES TESTS
  // =========================================================================

  describe('getAllEmployees', () => {
    it('should fetch employees with default pagination', () => {
      service.getAllEmployees().subscribe();

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=0&size=20'
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockEmployeeListResponse);

      expect(service.employees()).toEqual(mockEmployeeList);
      expect(service.pageMetadata()).toEqual({
        page: 0,
        size: 20,
        totalElements: 3,
        totalPages: 1
      });
      expect(service.listLoading()).toBe(false);
    });

    it('should fetch employees with custom pagination', () => {
      service.getAllEmployees(2, 10).subscribe();

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=2&size=10'
      );
      req.flush(mockEmployeeListResponse);

      expect(service.employees()).toEqual(mockEmployeeList);
    });

    it('should include sort parameter when provided', () => {
      service.getAllEmployees(0, 20, 'fullName,asc').subscribe();

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=0&size=20&sort=fullName,asc'
      );
      req.flush(mockEmployeeListResponse);
    });

    it('should set listLoading to true during fetch', () => {
      service.getAllEmployees().subscribe();

      expect(service.listLoading()).toBe(true);

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=0&size=20'
      );
      req.flush(mockEmployeeListResponse);

      expect(service.listLoading()).toBe(false);
    });

    it('should handle list fetch error', () => {
      service.getAllEmployees().subscribe({
        error: () => {} // Catch error to prevent test failure
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=0&size=20'
      );
      req.error(new ErrorEvent('Network error'));

      expect(service.listLoading()).toBe(false);
      expect(service.listError()).toBeTruthy();
    });
  });

  // =========================================================================
  // UPDATE EMPLOYEE TESTS
  // =========================================================================

  describe('updateEmployee', () => {
    const updateRequest = {
      fullName: 'John Doe Updated',
      title: 'Lead Software Engineer'
    };

    const updateResponse: EmployeeUpdateResponse = {
      id: 1,
      updatedAt: '2024-01-02T00:00:00Z',
      message: 'Employee updated successfully'
    };

    it('should update employee successfully', (done) => {
      service.updateEmployee(1, updateRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(updateResponse);
          expect(service.updateLoading()).toBe(false);
          expect(service.updateError()).toBeNull();
          done();
        }
      });

      expect(service.updateLoading()).toBe(true);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);

      req.flush(updateResponse);
    });

    it('should handle update error', (done) => {
      service.updateEmployee(1, updateRequest).subscribe({
        error: () => {
          expect(service.updateLoading()).toBe(false);
          expect(service.updateError()).toContain('Failed');
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush(
        { message: 'Validation failed' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  // =========================================================================
  // DELETE EMPLOYEE TESTS
  // =========================================================================

  describe('deleteEmployee', () => {
    it('should delete employee successfully', (done) => {
      service.deleteEmployee(1).subscribe({
        next: () => {
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });

    it('should handle delete error', (done) => {
      service.deleteEmployee(1).subscribe({
        error: () => {
          expect(service.loading()).toBe(false);
          expect(service.error()).toContain('delete');
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush(
        { message: 'Cannot delete' },
        { status: 403, statusText: 'Forbidden' }
      );
    });
  });

  // =========================================================================
  // ERROR MESSAGE FORMATTING TESTS
  // =========================================================================

  describe('Error Message Formatting', () => {
    it('should format 404 error as "not found"', () => {
      service.getEmployeeById(999);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/999');
      req.flush({}, { status: 404, statusText: 'Not Found' });

      expect(service.error()).toContain('not found');
    });

    it('should format network error (status 0) as connection error', () => {
      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.error(new ErrorEvent('Network error'), { status: 0 });

      expect(service.error()).toContain('connection');
    });

    it('should format 500 error as server error', () => {
      service.getEmployeeById(1);

      const req = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      expect(service.error()).toContain('Server error');
    });
  });

  // =========================================================================
  // CONCURRENT REQUEST TESTS
  // =========================================================================

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent getEmployeeById calls', () => {
      service.getEmployeeById(1);
      service.getEmployeeById(2);

      const req1 = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');
      const req2 = httpMock.expectOne('http://localhost:8080/api/v1/employees/2');

      req2.flush({ ...mockEmployee, id: 2 });
      req1.flush(mockEmployee);

      // Latest response wins
      expect(service.employee()?.id).toBe(1);
    });

    it('should handle getAllEmployees and getEmployeeById concurrently', () => {
      service.getAllEmployees().subscribe();
      service.getEmployeeById(1);

      const listReq = httpMock.expectOne(
        'http://localhost:8080/api/v1/employees?page=0&size=20'
      );
      const detailReq = httpMock.expectOne('http://localhost:8080/api/v1/employees/1');

      listReq.flush(mockEmployeeListResponse);
      detailReq.flush(mockEmployee);

      expect(service.employees().length).toBe(3);
      expect(service.employee()?.id).toBe(1);
    });
  });
});

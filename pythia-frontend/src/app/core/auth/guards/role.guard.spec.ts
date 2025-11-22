/**
 * Role Guard Tests
 *
 * Tests for role-based authorization guard
 * Ensures proper hierarchical role checking
 */

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { signal } from '@angular/core';

describe('roleGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;

  const mockAdminUser: User = {
    id: '1',
    email: 'admin@pythia.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'admin',
    permissions: ['*']
  };

  const mockHRUser: User = {
    id: '2',
    email: 'hr@pythia.com',
    firstName: 'HR',
    lastName: 'Manager',
    fullName: 'HR Manager',
    role: 'hr',
    permissions: ['employees.read', 'employees.write']
  };

  const mockViewerUser: User = {
    id: '3',
    email: 'viewer@pythia.com',
    firstName: 'Viewer',
    lastName: 'User',
    fullName: 'Viewer User',
    role: 'viewer',
    permissions: ['employees.read']
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['hasRoleSync'], {
      currentUser: signal(null)
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockRoute = {} as ActivatedRouteSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  describe('Admin Role', () => {
    it('should allow admin to access admin-only routes', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockAdminUser);
      mockAuthService.hasRoleSync.and.returnValue(true);

      const guard = roleGuard(['admin']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should allow admin to access HR routes (hierarchical)', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockAdminUser);
      mockAuthService.hasRoleSync.and.returnValue(true);

      const guard = roleGuard(['hr']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('HR Role', () => {
    it('should allow HR to access HR routes', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockHRUser);
      mockAuthService.hasRoleSync.and.returnValue(true);

      const guard = roleGuard(['hr']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should deny HR access to admin-only routes', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockHRUser);
      mockAuthService.hasRoleSync.and.returnValue(false);

      const guard = roleGuard(['admin']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  describe('Viewer Role', () => {
    it('should deny viewer access to HR routes', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockViewerUser);
      mockAuthService.hasRoleSync.and.returnValue(false);

      const guard = roleGuard(['hr']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('should deny viewer access to admin routes', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(mockViewerUser);
      mockAuthService.hasRoleSync.and.returnValue(false);

      const guard = roleGuard(['admin']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  describe('Multiple Allowed Roles', () => {
    it('should allow access if user has any of the allowed roles', () => {
      // Arrange: HR user accessing route that allows both admin and hr
      (mockAuthService.currentUser as any) = signal(mockHRUser);
      mockAuthService.hasRoleSync.and.returnValue(true);

      const guard = roleGuard(['admin', 'hr']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should deny access if user has none of the allowed roles', () => {
      // Arrange: Viewer accessing admin/hr only route
      (mockAuthService.currentUser as any) = signal(mockViewerUser);
      mockAuthService.hasRoleSync.and.returnValue(false);

      const guard = roleGuard(['admin', 'hr']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  describe('Unauthenticated User', () => {
    it('should redirect to login if no user is authenticated', () => {
      // Arrange
      (mockAuthService.currentUser as any) = signal(null);

      const guard = roleGuard(['admin']);

      // Act
      const result = TestBed.runInInjectionContext(() =>
        guard(mockRoute)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});

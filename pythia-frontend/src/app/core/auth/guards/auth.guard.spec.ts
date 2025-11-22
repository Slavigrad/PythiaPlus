/**
 * Auth Guard Tests
 *
 * Tests for authentication guard functionality
 * Ensures unauthenticated users are redirected to login
 */

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Create mocks
    mockAuthService = jasmine.createSpyObj('AuthService', ['hasRoleSync'], {
      currentUser: signal(null),
      isAuthenticated: signal(false),
      redirectUrl: signal('/')
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/dashboard' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access for authenticated users', () => {
    // Arrange: User is authenticated
    (mockAuthService.isAuthenticated as any) = signal(true);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access for unauthenticated users', () => {
    // Arrange: User is NOT authenticated
    (mockAuthService.isAuthenticated as any) = signal(false);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should store redirect URL when denying access', () => {
    // Arrange: User trying to access /dashboard
    (mockAuthService.isAuthenticated as any) = signal(false);
    const setRedirectUrlSpy = jasmine.createSpy('set');
    (mockAuthService.redirectUrl as any).set = setRedirectUrlSpy;

    // Act
    TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(setRedirectUrlSpy).toHaveBeenCalledWith('/dashboard');
  });

  it('should redirect to login page', () => {
    // Arrange
    (mockAuthService.isAuthenticated as any) = signal(false);

    // Act
    TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

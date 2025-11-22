/**
 * Authentication Service Tests
 *
 * Tests signal-based auth state management, login/logout, and token handling
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User, LoginCredentials, LoginResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 'usr_001',
    email: 'test@pythia.ai',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    role: 'ADMIN',
    permissions: ['*'],
    avatarUrl: 'https://example.com/avatar.jpg',
    company: 'Pythia AI'
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have null user initially', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('should have null token initially', () => {
      expect(service.token()).toBeNull();
    });

    it('should not be authenticated initially', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should not be loading initially', () => {
      expect(service.loading()).toBeFalse();
    });

    it('should have no error initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('Login', () => {
    it('should login successfully with rememberMe=false (sessionStorage)', (done) => {
      const credentials: LoginCredentials = {
        email: 'test@pythia.ai',
        password: 'password123',
        rememberMe: false
      };

      service.login(credentials).subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(service.currentUser()).toEqual(mockUser);
          expect(service.token()).toBe('mock-jwt-token');
          expect(service.isAuthenticated()).toBeTrue();
          expect(service.loading()).toBeFalse();
          expect(service.error()).toBeNull();

          // Should use sessionStorage (not localStorage)
          expect(sessionStorage.getItem('pythia-token')).toBe('mock-jwt-token');
          expect(localStorage.getItem('pythia-token')).toBeNull();

          expect(router.navigate).toHaveBeenCalledWith(['/']);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should login successfully with rememberMe=true (localStorage)', (done) => {
      const credentials: LoginCredentials = {
        email: 'test@pythia.ai',
        password: 'password123',
        rememberMe: true
      };

      service.login(credentials).subscribe({
        next: () => {
          // Should use localStorage (not sessionStorage)
          expect(localStorage.getItem('pythia-token')).toBe('mock-jwt-token');
          expect(localStorage.getItem('pythia-refresh-token')).toBe('mock-refresh-token');
          expect(localStorage.getItem('pythia-remember-me')).toBe('true');
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
      req.flush(mockLoginResponse);
    });

    it('should set loading=true during login', () => {
      const credentials: LoginCredentials = {
        email: 'test@pythia.ai',
        password: 'password123'
      };

      service.login(credentials).subscribe();

      expect(service.loading()).toBeTrue();

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
      req.flush(mockLoginResponse);

      expect(service.loading()).toBeFalse();
    });

    it('should handle login error (401 Unauthorized)', (done) => {
      const credentials: LoginCredentials = {
        email: 'test@pythia.ai',
        password: 'wrong-password'
      };

      service.login(credentials).subscribe({
        next: () => done.fail('Should have failed'),
        error: () => {
          expect(service.currentUser()).toBeNull();
          expect(service.token()).toBeNull();
          expect(service.isAuthenticated()).toBeFalse();
          expect(service.loading()).toBeFalse();
          expect(service.error()).toBe('Invalid email or password');
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle network error', (done) => {
      const credentials: LoginCredentials = {
        email: 'test@pythia.ai',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        next: () => done.fail('Should have failed'),
        error: () => {
          expect(service.error()).toBe('Unable to connect to server. Please check your connection.');
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
      req.error(new ProgressEvent('error'), { status: 0 });
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Set up authenticated state
      service['currentUser'].set(mockUser);
      service['token'].set('mock-jwt-token');
      localStorage.setItem('pythia-user', JSON.stringify(mockUser));
      localStorage.setItem('pythia-token', 'mock-jwt-token');
      sessionStorage.setItem('pythia-user', JSON.stringify(mockUser));
      sessionStorage.setItem('pythia-token', 'mock-jwt-token');
    });

    it('should logout successfully', () => {
      service.logout();

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/logout');
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Logged out' });

      expect(service.currentUser()).toBeNull();
      expect(service.token()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.error()).toBeNull();

      // Should clear all storage
      expect(localStorage.getItem('pythia-user')).toBeNull();
      expect(localStorage.getItem('pythia-token')).toBeNull();
      expect(sessionStorage.getItem('pythia-user')).toBeNull();
      expect(sessionStorage.getItem('pythia-token')).toBeNull();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should logout even if API call fails', () => {
      service.logout();

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/logout');
      req.error(new ProgressEvent('error'));

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('Computed Signals', () => {
    it('should compute isAdmin correctly for ADMIN role', () => {
      service['currentUser'].set({ ...mockUser, role: 'ADMIN' });
      expect(service.isAdmin()).toBeTrue();
    });

    it('should compute isAdmin correctly for admin role (legacy)', () => {
      service['currentUser'].set({ ...mockUser, role: 'admin' });
      expect(service.isAdmin()).toBeTrue();
    });

    it('should compute isAdmin=false for USER role', () => {
      service['currentUser'].set({ ...mockUser, role: 'USER' });
      expect(service.isAdmin()).toBeFalse();
    });

    it('should compute userInitials correctly', () => {
      service['currentUser'].set(mockUser);
      expect(service.userInitials()).toBe('TU');
    });

    it('should compute userInitials as "?" when no user', () => {
      service['currentUser'].set(null);
      expect(service.userInitials()).toBe('?');
    });

    it('should compute isRegularUser correctly for USER role', () => {
      service['currentUser'].set({ ...mockUser, role: 'USER' });
      expect(service.isRegularUser()).toBeTrue();
    });

    it('should compute isRegularUser correctly for viewer role', () => {
      service['currentUser'].set({ ...mockUser, role: 'viewer' });
      expect(service.isRegularUser()).toBeTrue();
    });
  });

  describe('Token Refresh', () => {
    beforeEach(() => {
      localStorage.setItem('pythia-refresh-token', 'mock-refresh-token');
    });

    it('should refresh token successfully', (done) => {
      service.refreshToken().subscribe({
        next: (token) => {
          expect(token).toBe('new-mock-token');
          expect(service.token()).toBe('new-mock-token');
          expect(localStorage.getItem('pythia-token')).toBe('new-mock-token');
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mock-refresh-token' });
      req.flush({ token: 'new-mock-token' });
    });

    it('should logout on refresh token failure', (done) => {
      spyOn(service, 'logout');

      service.refreshToken().subscribe({
        next: () => done.fail('Should have failed'),
        error: () => {
          expect(service.logout).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
      req.flush({ message: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should fail if no refresh token available', (done) => {
      localStorage.removeItem('pythia-refresh-token');

      service.refreshToken().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
          done();
        }
      });

      httpMock.expectNone('http://localhost:8080/api/v1/auth/refresh');
    });
  });

  describe('Storage Persistence', () => {
    it('should load user from localStorage on init', () => {
      localStorage.setItem('pythia-user', JSON.stringify(mockUser));
      localStorage.setItem('pythia-token', 'mock-jwt-token');

      const newService = new AuthService(TestBed.inject(HttpTestingController) as any, router);

      expect(newService.currentUser()).toEqual(mockUser);
      expect(newService.token()).toBe('mock-jwt-token');
      expect(newService.isAuthenticated()).toBeTrue();
    });

    it('should load user from sessionStorage if not in localStorage', () => {
      sessionStorage.setItem('pythia-user', JSON.stringify(mockUser));
      sessionStorage.setItem('pythia-token', 'mock-jwt-token');

      const newService = new AuthService(TestBed.inject(HttpTestingController) as any, router);

      expect(newService.currentUser()).toEqual(mockUser);
      expect(newService.token()).toBe('mock-jwt-token');
    });

    it('should handle corrupted storage data gracefully', () => {
      localStorage.setItem('pythia-user', 'corrupted-json{{{');
      localStorage.setItem('pythia-token', 'mock-jwt-token');

      const newService = new AuthService(TestBed.inject(HttpTestingController) as any, router);

      expect(newService.currentUser()).toBeNull();
      expect(newService.token()).toBeNull();
      expect(localStorage.getItem('pythia-user')).toBeNull();
    });
  });

  describe('Role and Permission Checks', () => {
    beforeEach(() => {
      service['currentUser'].set(mockUser);
    });

    it('should check role synchronously', () => {
      expect(service.hasRoleSync('ADMIN')).toBeTrue();
      expect(service.hasRoleSync('USER')).toBeFalse();
    });

    it('should check permission synchronously', () => {
      expect(service.hasPermissionSync('*')).toBeTrue();
      expect(service.hasPermissionSync('search.read')).toBeFalse();
    });

    it('should return false for role check when not authenticated', () => {
      service['currentUser'].set(null);
      expect(service.hasRoleSync('ADMIN')).toBeFalse();
    });
  });
});

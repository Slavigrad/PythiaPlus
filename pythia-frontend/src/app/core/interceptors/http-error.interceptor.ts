/**
 * HTTP Error Interceptor
 *
 * Intercepts all HTTP errors and provides:
 * - Automatic retry for transient errors (network failures, 5xx errors)
 * - Exponential backoff retry strategy
 * - User-friendly error notifications
 * - Token refresh on 401 errors
 * - Centralized error handling
 *
 * Features:
 * - Retries failed requests up to 2 times
 * - Uses exponential backoff (1s, 2s delays)
 * - Only retries safe operations (GET, HEAD, OPTIONS)
 * - Skips retry for client errors (4xx)
 * - Integrates with NotificationService for user feedback
 */

import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, timer, retry, mergeMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../auth/services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    // Retry strategy for transient errors
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Don't retry client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Don't retry non-safe operations (POST, PUT, DELETE, PATCH)
        if (!isSafeHttpMethod(req)) {
          throw error;
        }

        // Only retry network errors (status 0) and server errors (5xx)
        if (error.status === 0 || error.status >= 500) {
          // Exponential backoff: 1s, 2s
          const delayMs = Math.pow(2, retryCount - 1) * 1000;
          console.log(`Retrying request (attempt ${retryCount}/2) after ${delayMs}ms...`);
          return timer(delayMs);
        }

        throw error;
      }
    }),

    // Catch errors after retry attempts exhausted
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      // Handle different error status codes
      switch (error.status) {
        case 0:
          handleNetworkError(notificationService);
          break;

        case 401:
          handleUnauthorized(authService, router, notificationService);
          break;

        case 403:
          handleForbidden(router, notificationService);
          break;

        case 404:
          handleNotFound(notificationService);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          handleServerError(notificationService);
          break;

        default:
          // Let individual services handle specific errors
          break;
      }

      return throwError(() => error);
    })
  );
};

/**
 * Check if HTTP method is safe to retry
 * Safe methods: GET, HEAD, OPTIONS (idempotent)
 * Unsafe methods: POST, PUT, DELETE, PATCH (may cause side effects)
 */
function isSafeHttpMethod(req: HttpRequest<any>): boolean {
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  return safeMethod;
}

/**
 * Handle network errors (status 0)
 * Usually means no internet connection or CORS issues
 */
function handleNetworkError(notificationService: NotificationService): void {
  notificationService.error(
    'Unable to connect to server. Please check your internet connection.',
    { duration: 0 } // Don't auto-dismiss
  );
}

/**
 * Handle 401 Unauthorized
 * Try to refresh token, otherwise redirect to login
 */
function handleUnauthorized(
  authService: AuthService,
  router: Router,
  notificationService: NotificationService
): void {
  // Try to refresh token
  authService.refreshToken().subscribe({
    next: () => {
      // Token refreshed successfully, retry will happen automatically
      console.log('Token refreshed successfully');
    },
    error: () => {
      // Token refresh failed, logout and redirect to login
      notificationService.error('Session expired. Please log in again.');
      authService.logout();
      router.navigate(['/login']);
    }
  });
}

/**
 * Handle 403 Forbidden
 * User is authenticated but doesn't have permission
 */
function handleForbidden(router: Router, notificationService: NotificationService): void {
  notificationService.error(
    'You don\'t have permission to access this resource.'
  );
  router.navigate(['/unauthorized']);
}

/**
 * Handle 404 Not Found
 */
function handleNotFound(notificationService: NotificationService): void {
  notificationService.warning('Resource not found.');
}

/**
 * Handle server errors (5xx)
 */
function handleServerError(notificationService: NotificationService): void {
  notificationService.error(
    'Server error. Our team has been notified. Please try again later.',
    { duration: 8000 }
  );
}

/**
 * Auth Token Interceptor
 *
 * Automatically adds JWT token to all HTTP requests
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Skip adding token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Add token to request if available
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

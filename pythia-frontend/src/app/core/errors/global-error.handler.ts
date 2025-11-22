/**
 * Global Error Handler
 *
 * Catches all unhandled errors in the application
 * Provides user-friendly error messages and logging
 *
 * Handles:
 * - Chunk load errors (lazy loading failures)
 * - Network errors
 * - JavaScript runtime errors
 * - Promise rejections
 *
 * Does NOT handle HTTP errors - those are handled by HTTP interceptor
 */

import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  handleError(error: Error | HttpErrorResponse): void {
    // HTTP errors are handled by HTTP interceptor, not here
    if (error instanceof HttpErrorResponse) {
      return;
    }

    // Log to console in development
    console.error('Global error caught:', error);

    // Classify and handle different error types
    this.ngZone.run(() => {
      if (this.isChunkLoadError(error)) {
        this.handleChunkLoadError();
      } else if (this.isNetworkError(error)) {
        this.handleNetworkError();
      } else if (this.isQuotaExceededError(error)) {
        this.handleQuotaExceededError();
      } else {
        this.handleGenericError(error);
      }
    });

    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
    // this.logErrorToService(error);
  }

  /**
   * Check if error is a chunk load failure
   * Happens when lazy-loaded modules fail to load
   */
  private isChunkLoadError(error: Error): boolean {
    return (
      error.message?.includes('ChunkLoadError') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to fetch dynamically imported module')
    );
  }

  /**
   * Handle chunk load errors by reloading the page
   * This usually happens after deployment when old chunks are removed
   */
  private handleChunkLoadError(): void {
    this.notificationService.warning(
      'New version available. Reloading page...',
      { duration: 3000 }
    );

    // Reload page after showing message
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: Error): boolean {
    return (
      error.message?.includes('NetworkError') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Network request failed')
    );
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(): void {
    this.notificationService.error(
      'Network connection lost. Please check your internet connection.',
      { duration: 0 } // Don't auto-dismiss
    );
  }

  /**
   * Check if error is quota exceeded (localStorage/sessionStorage full)
   */
  private isQuotaExceededError(error: Error): boolean {
    return (
      error.name === 'QuotaExceededError' ||
      error.message?.includes('quota') ||
      error.message?.includes('storage')
    );
  }

  /**
   * Handle quota exceeded errors
   */
  private handleQuotaExceededError(): void {
    this.notificationService.warning(
      'Browser storage is full. Some features may not work correctly.',
      { duration: 8000 }
    );

    // Try to clear some space
    try {
      localStorage.removeItem('pythia-cache');
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }

  /**
   * Handle generic/unknown errors
   */
  private handleGenericError(error: Error): void {
    const message = this.getErrorMessage(error);

    this.notificationService.error(
      message,
      { duration: 5000 }
    );
  }

  /**
   * Extract user-friendly error message
   */
  private getErrorMessage(error: Error): string {
    // Check for specific error types
    if (error.message?.includes('Cannot read property')) {
      return 'An unexpected error occurred. Please refresh the page.';
    }

    if (error.message?.includes('undefined is not an object')) {
      return 'An unexpected error occurred. Please refresh the page.';
    }

    if (error.message?.includes('Permission denied')) {
      return 'Permission denied. Please check your browser settings.';
    }

    // Default message
    return 'An unexpected error occurred. Our team has been notified.';
  }

  /**
   * Log error to external service
   * Integrate with Sentry, LogRocket, or custom logging service
   */
  private logErrorToService(error: Error): void {
    // Example: Sentry integration
    // if (environment.production) {
    //   Sentry.captureException(error);
    // }

    // Example: Custom logging service
    // this.loggingService.logError({
    //   message: error.message,
    //   stack: error.stack,
    //   url: window.location.href,
    //   userAgent: navigator.userAgent,
    //   timestamp: new Date().toISOString()
    // });

    console.log('Error logged:', error);
  }
}

/**
 * Application Configuration
 *
 * Provides global services and configuration for the Angular application
 *
 * Features:
 * - Global error handling with user notifications
 * - HTTP interceptors for error handling and retry logic
 * - HTTP interceptors for automatic JWT token injection
 * - Browser animations
 * - Zone change detection with event coalescing
 */

import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error.handler';
import { httpErrorInterceptor, authTokenInterceptor } from './core/interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js configuration with performance optimizations
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Routing
    provideRouter(routes),

    // HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,    // Add JWT token to requests (order matters - first)
        httpErrorInterceptor,    // Handle errors and retries (order matters - second)
      ])
    ),

    // Global error handler (catches all unhandled errors)
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

    // Material Design animations
    provideAnimationsAsync()
  ]
};

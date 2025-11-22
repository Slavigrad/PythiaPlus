/**
 * Service Testing Utilities
 *
 * Provides helpers for testing Angular services, especially those using signals
 * Includes HTTP mocking utilities and state verification helpers
 */

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

/**
 * Service Test Harness
 *
 * Creates a comprehensive test setup for a service with HTTP mocking
 *
 * @example
 * ```typescript
 * const harness = createServiceTestHarness(SearchService);
 * harness.service.search({ query: 'developer' });
 * const req = harness.expectOne('/api/search');
 * req.flush({ results: [] });
 * expect(harness.service.loading()).toBe(false);
 * ```
 */
export interface ServiceTestHarness<T> {
  service: T;
  httpMock: HttpTestingController;
  expectOne(url: string): any;
  expectNone(url: string): void;
  verify(): void;
}

export function createServiceTestHarness<T>(
  serviceType: Type<T>,
  additionalProviders: any[] = []
): ServiceTestHarness<T> {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      serviceType,
      provideHttpClient(),
      provideHttpClientTesting(),
      ...additionalProviders
    ]
  });

  const service = TestBed.inject(serviceType);
  const httpMock = TestBed.inject(HttpTestingController);

  return {
    service,
    httpMock,
    expectOne: (url: string) => httpMock.expectOne(url),
    expectNone: (url: string) => httpMock.expectNone(url),
    verify: () => httpMock.verify()
  };
}

/**
 * Mock HTTP Response
 *
 * Creates a mock HTTP response for testing
 *
 * @example
 * ```typescript
 * const response = mockHttpResponse({ results: [mockCandidate] });
 * req.flush(response);
 * ```
 */
export function mockHttpResponse<T>(data: T, status: number = 200): T {
  return data;
}

/**
 * Mock HTTP Error
 *
 * Creates a mock HTTP error for testing error handling
 *
 * @example
 * ```typescript
 * const error = mockHttpError(404, 'Not Found');
 * req.error(error);
 * expect(service.error()).toContain('Not Found');
 * ```
 */
export function mockHttpError(
  status: number,
  statusText: string,
  errorBody?: any
): ErrorEvent {
  return new ErrorEvent('Network error', {
    message: statusText,
    error: errorBody
  });
}

/**
 * Wait for HTTP Calls
 *
 * Waits for all pending HTTP calls to complete
 *
 * @example
 * ```typescript
 * service.loadData();
 * await waitForHttpCalls(httpMock);
 * expect(service.data()).toBeDefined();
 * ```
 */
export function waitForHttpCalls(
  httpMock: HttpTestingController,
  timeoutMs: number = 5000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('HTTP calls did not complete within timeout'));
    }, timeoutMs);

    const checkPending = () => {
      try {
        httpMock.verify();
        clearTimeout(timeout);
        resolve();
      } catch {
        setTimeout(checkPending, 50);
      }
    };

    checkPending();
  });
}

/**
 * Spy on Service Method
 *
 * Creates a jasmine spy on a service method while preserving the original
 *
 * @example
 * ```typescript
 * const spy = spyOnServiceMethod(searchService, 'search');
 * component.handleSearch('developer');
 * expect(spy).toHaveBeenCalledWith({ query: 'developer' });
 * ```
 */
export function spyOnServiceMethod<T, K extends keyof T>(
  service: T,
  methodName: K
): jasmine.Spy {
  return spyOn(service, methodName as any).and.callThrough();
}

/**
 * Create Mock Service
 *
 * Creates a mock implementation of a service with signal support
 *
 * @example
 * ```typescript
 * const mockSearch = createMockService<SearchService>({
 *   results: signal([]),
 *   loading: signal(false),
 *   search: jasmine.createSpy('search')
 * });
 * ```
 */
export function createMockService<T>(implementation: Partial<T>): jasmine.SpyObj<T> {
  return implementation as jasmine.SpyObj<T>;
}

/**
 * Assert Service Signal State
 *
 * Convenience assertion for verifying service signal state
 *
 * @example
 * ```typescript
 * assertServiceSignalState(searchService, {
 *   loading: false,
 *   error: null,
 *   resultCount: 5
 * });
 * ```
 */
export function assertServiceSignalState<T extends Record<string, any>>(
  service: T,
  expectedState: Partial<Record<keyof T, any>>
): void {
  Object.entries(expectedState).forEach(([key, expectedValue]) => {
    const signal = service[key as keyof T];
    if (typeof signal === 'function') {
      // It's a signal
      const actualValue = signal();
      expect(actualValue)
        .withContext(`Expected ${String(key)} to be ${expectedValue}`)
        .toBe(expectedValue);
    } else {
      // Regular property
      expect(signal)
        .withContext(`Expected ${String(key)} to be ${expectedValue}`)
        .toBe(expectedValue);
    }
  });
}

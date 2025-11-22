/**
 * Signal Testing Utilities
 *
 * Provides helpers for testing Angular 20 signal-based reactive state
 * Makes it easier to test signal changes, computed signals, and effects
 */

import { signal, computed, Signal, WritableSignal, effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Signal Test Harness
 *
 * Creates a testable wrapper around a signal with history tracking
 * Useful for verifying signal changes over time
 *
 * @example
 * ```typescript
 * const harness = createSignalTestHarness(0);
 * harness.set(1);
 * harness.set(2);
 * expect(harness.history).toEqual([0, 1, 2]);
 * expect(harness.current).toBe(2);
 * ```
 */
export interface SignalTestHarness<T> {
  signal: WritableSignal<T>;
  current: T;
  history: T[];
  set(value: T): void;
  update(fn: (current: T) => T): void;
  reset(): void;
}

export function createSignalTestHarness<T>(initialValue: T): SignalTestHarness<T> {
  const testSignal = signal(initialValue);
  const history: T[] = [initialValue];

  // Track changes using an effect
  TestBed.runInInjectionContext(() => {
    effect(() => {
      const value = testSignal();
      if (history[history.length - 1] !== value) {
        history.push(value);
      }
    });
  });

  return {
    signal: testSignal,
    get current() {
      return testSignal();
    },
    history,
    set(value: T) {
      testSignal.set(value);
    },
    update(fn: (current: T) => T) {
      testSignal.update(fn);
    },
    reset() {
      testSignal.set(initialValue);
      history.length = 0;
      history.push(initialValue);
    }
  };
}

/**
 * Spy on Computed Signal
 *
 * Creates a jasmine spy that tracks computed signal evaluations
 *
 * @example
 * ```typescript
 * const count = signal(0);
 * const doubled = spyOnComputed(() => count() * 2);
 * expect(doubled()).toBe(0);
 * expect(doubled.spy).toHaveBeenCalled();
 * count.set(5);
 * expect(doubled()).toBe(10);
 * ```
 */
export function spyOnComputed<T>(computeFn: () => T): Signal<T> & { spy: jasmine.Spy } {
  const spy = jasmine.createSpy('computed', computeFn).and.callThrough();
  const computedSignal = computed(() => spy());

  return Object.assign(computedSignal, { spy });
}

/**
 * Wait for Signal Change
 *
 * Returns a promise that resolves when a signal changes to a specific value
 * Useful for testing async effects
 *
 * @example
 * ```typescript
 * const loading = signal(true);
 * setTimeout(() => loading.set(false), 100);
 * await waitForSignalChange(loading, false);
 * expect(loading()).toBe(false);
 * ```
 */
export function waitForSignalChange<T>(
  signalToWatch: Signal<T>,
  expectedValue: T,
  timeoutMs: number = 5000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Signal did not change to ${expectedValue} within ${timeoutMs}ms`));
    }, timeoutMs);

    TestBed.runInInjectionContext(() => {
      effect(() => {
        const value = signalToWatch();
        if (value === expectedValue) {
          clearTimeout(timeout);
          resolve();
        }
      });
    });
  });
}

/**
 * Signal Change Counter
 *
 * Tracks how many times a signal changes
 *
 * @example
 * ```typescript
 * const count = signal(0);
 * const counter = createSignalChangeCounter(count);
 * count.set(1);
 * count.set(2);
 * count.set(3);
 * expect(counter.changeCount).toBe(3);
 * ```
 */
export function createSignalChangeCounter<T>(signalToWatch: Signal<T>): { changeCount: number } {
  const counter = { changeCount: 0 };

  TestBed.runInInjectionContext(() => {
    effect(() => {
      signalToWatch(); // Read to trigger effect
      counter.changeCount++;
    });
  });

  return counter;
}

/**
 * Assert Signal Value
 *
 * Convenience assertion for signal values with better error messages
 *
 * @example
 * ```typescript
 * const name = signal('John');
 * assertSignalValue(name, 'John'); // Pass
 * assertSignalValue(name, 'Jane'); // Fail with descriptive message
 * ```
 */
export function assertSignalValue<T>(
  signalToCheck: Signal<T>,
  expectedValue: T,
  message?: string
): void {
  const actualValue = signalToCheck();
  const errorMessage = message ||
    `Expected signal to have value ${JSON.stringify(expectedValue)}, but got ${JSON.stringify(actualValue)}`;

  expect(actualValue).withContext(errorMessage).toBe(expectedValue);
}

/**
 * Assert Computed Signal
 *
 * Verifies a computed signal produces the expected value
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const doubled = computed(() => count() * 2);
 * assertComputedSignal(doubled, 10);
 * ```
 */
export function assertComputedSignal<T>(
  computedSignal: Signal<T>,
  expectedValue: T,
  message?: string
): void {
  assertSignalValue(computedSignal, expectedValue, message);
}

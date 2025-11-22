/**
 * Component Testing Utilities
 *
 * Provides helpers for testing Angular 20 components with signal inputs/outputs
 * Simplifies common testing patterns for components, directives, and pipes
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type, DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Set Signal Inputs on Component
 *
 * Helper to set multiple signal inputs at once during tests
 * Works with Angular 20's new input() signal API
 *
 * @example
 * ```typescript
 * const fixture = TestBed.createComponent(CandidateCard);
 * setSignalInputs(fixture, {
 *   candidate: mockCandidate,
 *   selectable: true,
 *   isSelected: false
 * });
 * ```
 */
export function setSignalInputs<T>(
  fixture: ComponentFixture<T>,
  inputs: Record<string, any>
): void {
  Object.entries(inputs).forEach(([key, value]) => {
    fixture.componentRef.setInput(key, value);
  });
  fixture.detectChanges();
}

/**
 * Get Output Spy
 *
 * Creates a jasmine spy for component outputs
 * Works with Angular 20's output() signal API
 *
 * @example
 * ```typescript
 * const spy = getOutputSpy<string>();
 * component.candidateSelected.subscribe(spy);
 * // Trigger event
 * expect(spy).toHaveBeenCalledWith('candidate-123');
 * ```
 */
export function getOutputSpy<T>(): jasmine.Spy<(value: T) => void> {
  return jasmine.createSpy('outputSpy');
}

/**
 * Find Element by Selector
 *
 * Type-safe helper to find an element by CSS selector
 *
 * @example
 * ```typescript
 * const button = findElement<HTMLButtonElement>(fixture, '.submit-btn');
 * button.click();
 * ```
 */
export function findElement<T extends HTMLElement>(
  fixture: ComponentFixture<any>,
  selector: string
): T {
  const element = fixture.nativeElement.querySelector(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  return element as T;
}

/**
 * Find Element by Selector (Nullable)
 *
 * Same as findElement but returns null instead of throwing
 *
 * @example
 * ```typescript
 * const errorMsg = findElementOrNull(fixture, '.error-message');
 * expect(errorMsg).toBeNull();
 * ```
 */
export function findElementOrNull<T extends HTMLElement>(
  fixture: ComponentFixture<any>,
  selector: string
): T | null {
  return fixture.nativeElement.querySelector(selector) as T | null;
}

/**
 * Find All Elements
 *
 * Type-safe helper to find all elements matching a selector
 *
 * @example
 * ```typescript
 * const cards = findAllElements<HTMLDivElement>(fixture, '.candidate-card');
 * expect(cards.length).toBe(5);
 * ```
 */
export function findAllElements<T extends HTMLElement>(
  fixture: ComponentFixture<any>,
  selector: string
): T[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector));
}

/**
 * Find Debug Element
 *
 * Returns a DebugElement for more advanced testing
 *
 * @example
 * ```typescript
 * const button = findDebugElement(fixture, 'button');
 * button.triggerEventHandler('click', null);
 * ```
 */
export function findDebugElement(
  fixture: ComponentFixture<any>,
  selector: string
): DebugElement {
  const debugElement = fixture.debugElement.query(By.css(selector));
  if (!debugElement) {
    throw new Error(`DebugElement with selector "${selector}" not found`);
  }
  return debugElement;
}

/**
 * Get Text Content
 *
 * Returns trimmed text content of an element
 *
 * @example
 * ```typescript
 * expect(getTextContent(fixture, '.title')).toBe('Hello World');
 * ```
 */
export function getTextContent(
  fixture: ComponentFixture<any>,
  selector: string
): string {
  const element = findElement(fixture, selector);
  return element.textContent?.trim() || '';
}

/**
 * Has CSS Class
 *
 * Checks if an element has a specific CSS class
 *
 * @example
 * ```typescript
 * expect(hasCssClass(fixture, '.card', 'selected')).toBe(true);
 * ```
 */
export function hasCssClass(
  fixture: ComponentFixture<any>,
  selector: string,
  className: string
): boolean {
  const element = findElement(fixture, selector);
  return element.classList.contains(className);
}

/**
 * Get Attribute Value
 *
 * Returns the value of an element's attribute
 *
 * @example
 * ```typescript
 * expect(getAttributeValue(fixture, 'button', 'aria-label')).toBe('Submit');
 * ```
 */
export function getAttributeValue(
  fixture: ComponentFixture<any>,
  selector: string,
  attributeName: string
): string | null {
  const element = findElement(fixture, selector);
  return element.getAttribute(attributeName);
}

/**
 * Click Element
 *
 * Simulates a click on an element
 *
 * @example
 * ```typescript
 * clickElement(fixture, '.submit-btn');
 * expect(component.submitted()).toBe(true);
 * ```
 */
export function clickElement(
  fixture: ComponentFixture<any>,
  selector: string
): void {
  const element = findElement<HTMLElement>(fixture, selector);
  element.click();
  fixture.detectChanges();
}

/**
 * Dispatch Event
 *
 * Dispatches a custom event on an element
 *
 * @example
 * ```typescript
 * dispatchEvent(fixture, 'input', 'input', { value: 'test' });
 * ```
 */
export function dispatchEvent(
  fixture: ComponentFixture<any>,
  selector: string,
  eventName: string,
  eventData?: any
): void {
  const debugElement = findDebugElement(fixture, selector);
  debugElement.triggerEventHandler(eventName, eventData);
  fixture.detectChanges();
}

/**
 * Set Input Value
 *
 * Sets the value of an input element and triggers input event
 *
 * @example
 * ```typescript
 * setInputValue(fixture, '#search-input', 'developer');
 * expect(component.query()).toBe('developer');
 * ```
 */
export function setInputValue(
  fixture: ComponentFixture<any>,
  selector: string,
  value: string
): void {
  const input = findElement<HTMLInputElement>(fixture, selector);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

/**
 * Wait for Async
 *
 * Waits for async operations to complete in tests
 *
 * @example
 * ```typescript
 * component.loadData();
 * await waitForAsync(() => expect(component.loading()).toBe(false));
 * ```
 */
export async function waitForAsync(
  assertion: () => void,
  timeoutMs: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      assertion();
      return;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Final attempt - will throw if still failing
  assertion();
}

/**
 * Component Test Harness
 *
 * Creates a comprehensive test harness for a component
 * Provides common operations in a convenient object
 *
 * @example
 * ```typescript
 * const harness = createComponentTestHarness(CandidateCard, {
 *   candidate: mockCandidate,
 *   selectable: true
 * });
 * harness.click('.card');
 * expect(harness.getText('.name')).toBe('John Doe');
 * ```
 */
export interface ComponentTestHarness<T> {
  fixture: ComponentFixture<T>;
  component: T;
  nativeElement: HTMLElement;
  setInputs(inputs: Record<string, any>): void;
  click(selector: string): void;
  getText(selector: string): string;
  findElement<E extends HTMLElement>(selector: string): E;
  hasClass(selector: string, className: string): boolean;
  detectChanges(): void;
}

export function createComponentTestHarness<T>(
  componentType: Type<T>,
  initialInputs?: Record<string, any>
): ComponentTestHarness<T> {
  const fixture = TestBed.createComponent(componentType);
  const component = fixture.componentInstance;

  if (initialInputs) {
    setSignalInputs(fixture, initialInputs);
  }

  return {
    fixture,
    component,
    nativeElement: fixture.nativeElement,
    setInputs: (inputs) => setSignalInputs(fixture, inputs),
    click: (selector) => clickElement(fixture, selector),
    getText: (selector) => getTextContent(fixture, selector),
    findElement: (selector) => findElement(fixture, selector),
    hasClass: (selector, className) => hasCssClass(fixture, selector, className),
    detectChanges: () => fixture.detectChanges()
  };
}

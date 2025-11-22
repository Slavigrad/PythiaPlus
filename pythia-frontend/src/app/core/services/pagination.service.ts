/**
 * Pagination Service
 *
 * Reusable pagination state management for any paginated resource type.
 * Provides reactive signal-based state with computed pagination metadata.
 *
 * Design Philosophy:
 * - Generic type for maximum reusability
 * - Signal-based reactive state (Angular 20)
 * - Computed signals for derived values
 * - Immutable state updates
 * - 0-indexed (backend) → 1-indexed (UI) conversion
 *
 * Usage Example:
 * ```typescript
 * // In a service
 * readonly paginationService = inject(PaginationService<Project>);
 *
 * // Update pagination state from API response
 * this.paginationService.setPage(response.pagination, response.projects);
 *
 * // Access pagination state
 * readonly currentPage = this.paginationService.currentPage;  // 1-indexed for UI
 * readonly hasNextPage = this.paginationService.hasNext;
 * readonly totalPages = this.paginationService.totalPages;
 * ```
 *
 * @module PaginationService
 */

import { signal, computed, Signal } from '@angular/core';
import { PaginationMetadata } from '../../models';

/**
 * Extended pagination state with computed properties
 *
 * Includes all base pagination metadata plus computed helpers
 * for UI components (hasPrevious, hasNext, item ranges, etc.)
 */
export interface PaginationState extends PaginationMetadata {
  /** Whether there's a previous page */
  hasPrevious: boolean;

  /** Whether there's a next page */
  hasNext: boolean;

  /** First item index on current page (1-based for display) */
  firstItem: number;

  /** Last item index on current page (1-based for display) */
  lastItem: number;

  /** Number of items on current page */
  itemsOnPage: number;
}

/**
 * Generic Pagination Utility Class
 *
 * Manages pagination state for any entity type with computed signals.
 * Converts between 0-indexed backend pagination and 1-indexed UI display.
 *
 * **Design:** Plain TypeScript class (not @Injectable) for maximum reusability.
 * Each consuming service should instantiate its own instance.
 *
 * @template T - Type of items being paginated (e.g., Project, Employee)
 *
 * @example
 * ```typescript
 * // Create instance in a service
 * export class ProjectsService {
 *   private readonly paginationService = new PaginationService<Project>();
 *
 *   // Update from API response
 *   this.paginationService.setPage(
 *     { page: 0, size: 10, totalElements: 42, totalPages: 5 },
 *     [project1, project2, ...]
 *   );
 *
 *   // Expose pagination state
 *   readonly pagination = this.paginationService.state;
 *   readonly currentPage = this.paginationService.currentPage;
 * }
 * ```
 *
 * // Use in template
 * <div>Page {{ service.currentPage() }} of {{ service.totalPages() }}</div>
 * <div>Showing {{ service.firstItem() }}-{{ service.lastItem() }} of {{ service.totalItems() }}</div>
 * <button [disabled]="!service.hasPrevious()">Previous</button>
 * <button [disabled]="!service.hasNext()">Next</button>
 */
export class PaginationService<T = unknown> {

  // ============================================================================
  // PRIVATE STATE
  // ============================================================================

  /**
   * Raw pagination metadata from backend (0-indexed)
   * @private
   */
  private readonly _metadata = signal<PaginationMetadata | null>(null);

  /**
   * Items on current page
   * @private
   */
  private readonly _items = signal<readonly T[]>([]);

  // ============================================================================
  // PUBLIC COMPUTED SIGNALS
  // ============================================================================

  /**
   * Current page number (1-indexed for UI display)
   *
   * Converts backend's 0-indexed page to human-friendly 1-indexed display.
   *
   * @example
   * ```typescript
   * const page = pagination.currentPage();  // 1 for first page, 2 for second, etc.
   * ```
   */
  readonly currentPage: Signal<number> = computed(() => {
    const meta = this._metadata();
    return meta ? meta.page + 1 : 1; // Convert 0-indexed to 1-indexed
  });

  /**
   * Number of items per page
   */
  readonly pageSize: Signal<number> = computed(() =>
    this._metadata()?.size ?? 0
  );

  /**
   * Total number of items across all pages
   */
  readonly totalItems: Signal<number> = computed(() =>
    this._metadata()?.totalElements ?? 0
  );

  /**
   * Total number of pages
   */
  readonly totalPages: Signal<number> = computed(() =>
    this._metadata()?.totalPages ?? 0
  );

  /**
   * Whether there's a previous page
   *
   * @example
   * ```html
   * <button [disabled]="!pagination.hasPrevious()">Previous</button>
   * ```
   */
  readonly hasPrevious: Signal<boolean> = computed(() =>
    this.currentPage() > 1
  );

  /**
   * Whether there's a next page
   *
   * @example
   * ```html
   * <button [disabled]="!pagination.hasNext()">Next</button>
   * ```
   */
  readonly hasNext: Signal<boolean> = computed(() =>
    this.currentPage() < this.totalPages()
  );

  /**
   * First item index on current page (1-based for display)
   *
   * @example
   * ```typescript
   * // Page 1, size 10: firstItem = 1
   * // Page 2, size 10: firstItem = 11
   * // Page 3, size 10: firstItem = 21
   * ```
   */
  readonly firstItem: Signal<number> = computed(() => {
    const meta = this._metadata();
    if (!meta || meta.totalElements === 0) return 0;

    return meta.page * meta.size + 1;
  });

  /**
   * Last item index on current page (1-based for display)
   *
   * @example
   * ```typescript
   * // Page 1, size 10, 10 items: lastItem = 10
   * // Page 2, size 10, 10 items: lastItem = 20
   * // Page 5 (last), size 10, 2 items: lastItem = 42
   * ```
   */
  readonly lastItem: Signal<number> = computed(() => {
    const first = this.firstItem();
    const items = this._items();

    if (first === 0 || items.length === 0) return 0;

    return first + items.length - 1;
  });

  /**
   * Number of items on current page
   *
   * May be less than pageSize on the last page
   */
  readonly itemsOnPage: Signal<number> = computed(() =>
    this._items().length
  );

  /**
   * Items on current page (readonly)
   *
   * @example
   * ```typescript
   * const items = pagination.items();
   * items.forEach(item => console.log(item));
   * ```
   */
  readonly items: Signal<readonly T[]> = this._items.asReadonly();

  /**
   * Complete pagination state with all metadata
   *
   * Combines base pagination data with computed properties.
   *
   * @example
   * ```typescript
   * const state = pagination.state();
   * console.log(`Page ${state.page} of ${state.totalPages}`);
   * console.log(`Has next: ${state.hasNext}`);
   * ```
   */
  readonly state: Signal<PaginationState | null> = computed(() => {
    const meta = this._metadata();
    if (!meta) return null;

    return {
      page: meta.page,
      size: meta.size,
      totalElements: meta.totalElements,
      totalPages: meta.totalPages,
      hasPrevious: this.hasPrevious(),
      hasNext: this.hasNext(),
      firstItem: this.firstItem(),
      lastItem: this.lastItem(),
      itemsOnPage: this.itemsOnPage()
    };
  });

  /**
   * Whether pagination data has been loaded
   *
   * Useful for showing loading states
   *
   * @example
   * ```html
   * @if (pagination.isLoaded()) {
   *   <app-pagination-controls />
   * } @else {
   *   <app-skeleton-loader />
   * }
   * ```
   */
  readonly isLoaded: Signal<boolean> = computed(() =>
    this._metadata() !== null
  );

  /**
   * Whether there are any items
   */
  readonly hasItems: Signal<boolean> = computed(() =>
    this._items().length > 0
  );

  /**
   * Whether the result set is empty
   */
  readonly isEmpty: Signal<boolean> = computed(() =>
    this.totalItems() === 0
  );

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Update pagination metadata from API response
   *
   * @param metadata - Pagination metadata from backend
   *
   * @example
   * ```typescript
   * pagination.setMetadata({
   *   page: 0,
   *   size: 10,
   *   totalElements: 42,
   *   totalPages: 5
   * });
   * ```
   */
  setMetadata(metadata: PaginationMetadata): void {
    this._metadata.set(metadata);
  }

  /**
   * Update items on current page
   *
   * @param items - Array of items on current page
   *
   * @example
   * ```typescript
   * pagination.setItems([item1, item2, item3]);
   * ```
   */
  setItems(items: readonly T[]): void {
    this._items.set(items);
  }

  /**
   * Update both metadata and items atomically
   *
   * This is the recommended method to use after receiving API responses.
   *
   * @param metadata - Pagination metadata from backend
   * @param items - Items on current page
   *
   * @example
   * ```typescript
   * this.http.get<ProjectListResponse>('/api/v1/projects').subscribe(response => {
   *   pagination.setPage(response.pagination, response.projects);
   * });
   * ```
   */
  setPage(metadata: PaginationMetadata, items: readonly T[]): void {
    this._metadata.set(metadata);
    this._items.set(items);
  }

  /**
   * Reset pagination to initial state
   *
   * Clears all pagination data and items.
   *
   * @example
   * ```typescript
   * pagination.reset();  // Clear all data
   * ```
   */
  reset(): void {
    this._metadata.set(null);
    this._items.set([]);
  }

  /**
   * Get current page number (0-indexed for backend)
   *
   * Use this when making API calls that expect 0-indexed pages.
   *
   * @returns Current page number (0-indexed), or 0 if not loaded
   *
   * @example
   * ```typescript
   * const backendPage = pagination.getBackendPage();  // 0 for first page
   * this.http.get(`/api/v1/projects?page=${backendPage}`);
   * ```
   */
  getBackendPage(): number {
    return this._metadata()?.page ?? 0;
  }

  /**
   * Get page size for backend requests
   *
   * @returns Page size, or 0 if not loaded
   */
  getBackendSize(): number {
    return this._metadata()?.size ?? 0;
  }
}

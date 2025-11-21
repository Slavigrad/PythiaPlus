import { Component, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectQueryParams } from '../../../../models';

/**
 * Project Controls Component
 *
 * Sorting and pagination controls for project list.
 *
 * Features:
 * - Sort dropdown with 8 sort options
 * - Ascending/descending toggle
 * - Page size selector (10/20/50/100)
 * - Page navigation with first/prev/next/last
 * - Results counter "Showing X-Y of Z"
 * - Responsive layout
 * - Accessible keyboard navigation
 *
 * Design:
 * - Clean modern controls bar
 * - Pythia theme integration
 * - Smooth transitions
 * - Visual feedback for active states
 */
@Component({
  selector: 'app-project-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-controls.component.html',
  styleUrl: './project-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectControlsComponent {
  // ============================================================================
  // STATE SIGNALS
  // ============================================================================

  /** Current sort field */
  protected readonly sortBy = signal<string>('startDate');

  /** Sort direction */
  protected readonly sortDirection = signal<'asc' | 'desc'>('desc');

  /** Page size */
  protected readonly pageSize = signal(20);

  /** Current page (1-indexed) */
  protected readonly currentPage = signal(1);

  /** Total results count */
  protected readonly totalResults = signal(0);

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  /** Emitted when sorting changes */
  readonly sortChange = output<ProjectQueryParams>();

  /** Emitted when pagination changes */
  readonly paginationChange = output<ProjectQueryParams>();

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Available sort options
   */
  protected readonly sortOptions = [
    { value: 'startDate', label: 'Start Date', icon: '📅' },
    { value: 'endDate', label: 'End Date', icon: '🏁' },
    { value: 'name', label: 'Name', icon: '🔤' },
    { value: 'code', label: 'Code', icon: '#️⃣' },
    { value: 'company', label: 'Company', icon: '🏢' },
    { value: 'status', label: 'Status', icon: '📊' },
    { value: 'priority', label: 'Priority', icon: '⚡' },
    { value: 'progress', label: 'Progress', icon: '📈' }
  ];

  /**
   * Available page sizes
   */
  protected readonly pageSizeOptions = [10, 20, 50, 100];

  /**
   * Get current sort option
   */
  protected readonly currentSortOption = computed(() => {
    return this.sortOptions.find(opt => opt.value === this.sortBy()) || this.sortOptions[0];
  });

  /**
   * Calculate start index of current page
   */
  protected readonly startIndex = computed(() => {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  /**
   * Calculate end index of current page
   */
  protected readonly endIndex = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalResults());
  });

  /**
   * Calculate total pages
   */
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.totalResults() / this.pageSize());
  });

  /**
   * Check if on first page
   */
  protected readonly isFirstPage = computed(() => {
    return this.currentPage() === 1;
  });

  /**
   * Check if on last page
   */
  protected readonly isLastPage = computed(() => {
    return this.currentPage() >= this.totalPages();
  });

  /**
   * Get visible page numbers (max 7 pages shown)
   */
  protected readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 3) {
        // Near start
        pages.push(2, 3, 4, 5);
        pages.push(-1); // Ellipsis
        pages.push(total);
      } else if (current >= total - 2) {
        // Near end
        pages.push(-1); // Ellipsis
        pages.push(total - 4, total - 3, total - 2, total - 1, total);
      } else {
        // Middle
        pages.push(-1); // Ellipsis
        pages.push(current - 1, current, current + 1);
        pages.push(-1); // Ellipsis
        pages.push(total);
      }
    }

    return pages;
  });

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Handle sort field change
   */
  protected onSortByChange(sortBy: string): void {
    this.sortBy.set(sortBy);
    this.emitSortChange();
  }

  /**
   * Toggle sort direction
   */
  protected toggleSortDirection(): void {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    this.emitSortChange();
  }

  /**
   * Handle page size change
   */
  protected onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    // Reset to first page when changing page size
    this.currentPage.set(1);
    this.emitPaginationChange();
  }

  /**
   * Go to first page
   */
  protected goToFirstPage(): void {
    if (!this.isFirstPage()) {
      this.currentPage.set(1);
      this.emitPaginationChange();
    }
  }

  /**
   * Go to previous page
   */
  protected goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.currentPage.update(page => page - 1);
      this.emitPaginationChange();
    }
  }

  /**
   * Go to specific page
   */
  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.emitPaginationChange();
    }
  }

  /**
   * Go to next page
   */
  protected goToNextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage.update(page => page + 1);
      this.emitPaginationChange();
    }
  }

  /**
   * Go to last page
   */
  protected goToLastPage(): void {
    if (!this.isLastPage()) {
      this.currentPage.set(this.totalPages());
      this.emitPaginationChange();
    }
  }

  /**
   * Update total results from parent
   */
  public updateTotalResults(total: number): void {
    this.totalResults.set(total);
    // If current page is beyond total pages, reset to last valid page
    if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
      this.currentPage.set(this.totalPages());
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Emit sort change event
   */
  private emitSortChange(): void {
    this.sortChange.emit({
      sort: this.sortBy() as ProjectQueryParams['sort'],
      order: this.sortDirection()
    });
  }

  /**
   * Emit pagination change event
   */
  private emitPaginationChange(): void {
    this.paginationChange.emit({
      page: this.currentPage(),
      size: this.pageSize()
    });
  }
}

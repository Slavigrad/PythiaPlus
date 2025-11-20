import { Component, ChangeDetectionStrategy, signal, computed, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectQueryParams, ProjectStatus, ProjectPriority, ProjectComplexity } from '../../../../models';
import { ProjectsService } from '../../services/projects.service';

/**
 * Advanced Filters Panel Component
 *
 * Comprehensive filtering interface for projects with:
 * - Status multi-select (chips)
 * - Industry multi-select
 * - Technology multi-select
 * - Company text filter
 * - Date range picker
 * - Complexity multi-select
 * - Priority multi-select
 * - Has open positions toggle
 * - Clear all filters button
 *
 * Features:
 * - Collapsible sections for better UX
 * - Real-time filter application
 * - Visual active filter indicators
 * - Accessibility compliant
 */
@Component({
  selector: 'app-advanced-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-filters.component.html',
  styleUrl: './advanced-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedFiltersComponent {
  // Inject service
  private readonly projectsService = inject(ProjectsService);

  // ============================================================================
  // STATE SIGNALS
  // ============================================================================

  /** Panel expanded state */
  protected readonly isExpanded = signal(true);

  /** Selected statuses */
  protected readonly selectedStatuses = signal<ProjectStatus[]>([]);

  /** Selected industries */
  protected readonly selectedIndustries = signal<string[]>([]);

  /** Selected technologies */
  protected readonly selectedTechnologies = signal<string[]>([]);

  /** Company filter text */
  protected readonly companyFilter = signal('');

  /** Start date from */
  protected readonly startDateFrom = signal('');

  /** Start date to */
  protected readonly startDateTo = signal('');

  /** Selected complexities */
  protected readonly selectedComplexities = signal<ProjectComplexity[]>([]);

  /** Selected priorities */
  protected readonly selectedPriorities = signal<ProjectPriority[]>([]);

  /** Has open positions filter */
  protected readonly hasOpenPositions = signal<boolean | undefined>(undefined);

  // ============================================================================
  // AVAILABLE OPTIONS
  // ============================================================================

  /** Available status options */
  protected readonly statusOptions: ProjectStatus[] = [
    'ACTIVE',
    'COMPLETED',
    'PLANNING',
    'ON_HOLD',
    'CANCELLED'
  ];

  /** Available industry options (from analytics) */
  protected readonly industryOptions = computed(() => {
    const analytics = this.projectsService.analytics();
    return analytics?.topIndustries.map(i => i.name) || [
      'FinTech',
      'E-Commerce',
      'Healthcare',
      'Technology',
      'AI/ML',
      'IoT'
    ];
  });

  /** Available technology options (from analytics) */
  protected readonly technologyOptions = computed(() => {
    const analytics = this.projectsService.analytics();
    return analytics?.topTechnologies.map(t => t.name) || [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Python',
      'AWS'
    ];
  });

  /** Available complexity options */
  protected readonly complexityOptions: ProjectComplexity[] = [
    'SIMPLE',
    'MODERATE',
    'COMPLEX',
    'ENTERPRISE'
  ];

  /** Available priority options */
  protected readonly priorityOptions: ProjectPriority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
  ];

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /** Total active filters count */
  protected readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedStatuses().length > 0) count++;
    if (this.selectedIndustries().length > 0) count++;
    if (this.selectedTechnologies().length > 0) count++;
    if (this.companyFilter().length > 0) count++;
    if (this.startDateFrom().length > 0) count++;
    if (this.startDateTo().length > 0) count++;
    if (this.selectedComplexities().length > 0) count++;
    if (this.selectedPriorities().length > 0) count++;
    if (this.hasOpenPositions() !== undefined) count++;
    return count;
  });

  /** Has any filters applied */
  protected readonly hasFilters = computed(() => this.activeFilterCount() > 0);

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  /** Emitted when filters change */
  readonly filtersChange = output<ProjectQueryParams>();

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Toggle panel expanded/collapsed
   */
  protected toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }

  /**
   * Toggle status filter
   */
  protected toggleStatus(status: ProjectStatus): void {
    this.selectedStatuses.update(statuses => {
      const index = statuses.indexOf(status);
      if (index >= 0) {
        return statuses.filter(s => s !== status);
      } else {
        return [...statuses, status];
      }
    });
    this.applyFilters();
  }

  /**
   * Check if status is selected
   */
  protected isStatusSelected(status: ProjectStatus): boolean {
    return this.selectedStatuses().includes(status);
  }

  /**
   * Toggle industry filter
   */
  protected toggleIndustry(industry: string): void {
    this.selectedIndustries.update(industries => {
      const index = industries.indexOf(industry);
      if (index >= 0) {
        return industries.filter(i => i !== industry);
      } else {
        return [...industries, industry];
      }
    });
    this.applyFilters();
  }

  /**
   * Check if industry is selected
   */
  protected isIndustrySelected(industry: string): boolean {
    return this.selectedIndustries().includes(industry);
  }

  /**
   * Toggle technology filter
   */
  protected toggleTechnology(tech: string): void {
    this.selectedTechnologies.update(technologies => {
      const index = technologies.indexOf(tech);
      if (index >= 0) {
        return technologies.filter(t => t !== tech);
      } else {
        return [...technologies, tech];
      }
    });
    this.applyFilters();
  }

  /**
   * Check if technology is selected
   */
  protected isTechnologySelected(tech: string): boolean {
    return this.selectedTechnologies().includes(tech);
  }

  /**
   * Toggle complexity filter
   */
  protected toggleComplexity(complexity: ProjectComplexity): void {
    this.selectedComplexities.update(complexities => {
      const index = complexities.indexOf(complexity);
      if (index >= 0) {
        return complexities.filter(c => c !== complexity);
      } else {
        return [...complexities, complexity];
      }
    });
    this.applyFilters();
  }

  /**
   * Check if complexity is selected
   */
  protected isComplexitySelected(complexity: ProjectComplexity): boolean {
    return this.selectedComplexities().includes(complexity);
  }

  /**
   * Toggle priority filter
   */
  protected togglePriority(priority: ProjectPriority): void {
    this.selectedPriorities.update(priorities => {
      const index = priorities.indexOf(priority);
      if (index >= 0) {
        return priorities.filter(p => p !== priority);
      } else {
        return [...priorities, priority];
      }
    });
    this.applyFilters();
  }

  /**
   * Check if priority is selected
   */
  protected isPrioritySelected(priority: ProjectPriority): boolean {
    return this.selectedPriorities().includes(priority);
  }

  /**
   * Handle company filter change
   */
  protected onCompanyChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.companyFilter.set(value);
    this.applyFilters();
  }

  /**
   * Handle start date from change
   */
  protected onStartDateFromChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.startDateFrom.set(value);
    this.applyFilters();
  }

  /**
   * Handle start date to change
   */
  protected onStartDateToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.startDateTo.set(value);
    this.applyFilters();
  }

  /**
   * Toggle has open positions filter
   */
  protected toggleOpenPositions(): void {
    this.hasOpenPositions.update(v => {
      if (v === undefined) return true;
      if (v === true) return false;
      return undefined;
    });
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  protected clearAllFilters(): void {
    this.selectedStatuses.set([]);
    this.selectedIndustries.set([]);
    this.selectedTechnologies.set([]);
    this.companyFilter.set('');
    this.startDateFrom.set('');
    this.startDateTo.set('');
    this.selectedComplexities.set([]);
    this.selectedPriorities.set([]);
    this.hasOpenPositions.set(undefined);
    this.applyFilters();
  }

  /**
   * Apply current filters
   */
  private applyFilters(): void {
    const filters: ProjectQueryParams = {
      page: 1 // Reset to first page on filter change
    };

    if (this.selectedStatuses().length > 0) {
      filters.status = this.selectedStatuses();
    }

    if (this.selectedIndustries().length > 0) {
      filters.industry = this.selectedIndustries();
    }

    if (this.selectedTechnologies().length > 0) {
      filters.technology = this.selectedTechnologies();
    }

    if (this.companyFilter().length > 0) {
      filters.company = this.companyFilter();
    }

    if (this.startDateFrom().length > 0) {
      filters.startDateFrom = this.startDateFrom();
    }

    if (this.startDateTo().length > 0) {
      filters.startDateTo = this.startDateTo();
    }

    if (this.selectedComplexities().length > 0) {
      filters.complexity = this.selectedComplexities();
    }

    if (this.selectedPriorities().length > 0) {
      filters.priority = this.selectedPriorities();
    }

    if (this.hasOpenPositions() !== undefined) {
      filters.hasOpenPositions = this.hasOpenPositions();
    }

    // Emit filters change
    this.filtersChange.emit(filters);

    // Apply to service
    this.projectsService.loadProjects(filters);
  }

  /**
   * Get status badge color class
   */
  protected getStatusClass(status: ProjectStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  /**
   * Get complexity badge color class
   */
  protected getComplexityClass(complexity: ProjectComplexity): string {
    return `complexity-${complexity.toLowerCase()}`;
  }

  /**
   * Get priority badge color class
   */
  protected getPriorityClass(priority: ProjectPriority): string {
    return `priority-${priority.toLowerCase()}`;
  }
}

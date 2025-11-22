/**
 * Employee List Page - Pythia+
 *
 * Visionary employee listing with:
 * - 3 view modes (Grid, List, Gallery)
 * - Advanced filtering (search, status, department, seniority, skills)
 * - Comparison mode
 * - Live status indicators
 * - Export functionality
 * - Virtual scrolling for 1000+ employees (Ultra Premium)
 */

import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Employee } from '../../../../models/employee.model';
import { Availability, Seniority } from '../../../../core/constants/employee.constants';
import { EmployeeService } from '../../services/employee.service';

import { EmployeeCardComponent } from '../../components/employee-card/employee-card.component';
import { EmployeeCardCompactComponent } from '../../components/employee-card-compact/employee-card-compact.component';
import { EmployeeFilterPanelComponent } from '../../components/employee-filter-panel/employee-filter-panel.component';
import { ViewToggleComponent } from '../../components/view-toggle/view-toggle.component';

export type ViewMode = 'grid' | 'list' | 'gallery';

export interface EmployeeFilters {
  search: string;
  availabilityStatuses: Availability[];
  departments: string[];
  seniorities: Seniority[];
  skills: string[];
}

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    DragDropModule,
    EmployeeCardComponent,
    EmployeeCardCompactComponent,
    EmployeeFilterPanelComponent,
    ViewToggleComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  // Expose Math for template
  protected readonly Math = Math;

  // State Management
  protected readonly viewMode = signal<ViewMode>('grid');
  protected readonly showFilters = signal(true);
  protected readonly comparisonMode = signal(false);
  protected readonly selectedEmployees = signal<number[]>([]);

  // Ultra Premium Features
  protected readonly ultraPremiumMode = signal(false); // Basic mode by default
  protected readonly virtualScrollEnabled = signal(true); // Virtual scrolling for performance
  protected readonly groupingEnabled = signal(false); // Smart grouping/categorization
  protected readonly groupBy = signal<'department' | 'seniority' | 'availability' | 'none'>('none');
  protected readonly comparisonPanel = signal<Employee[]>([]); // Employees in comparison (max 3)
  protected readonly showComparisonPanel = signal(false); // Show/hide comparison panel
  protected readonly showAnalytics = signal(false); // Show/hide analytics panel

  // Virtual Scroll Item Sizes (approximate heights in px)
  protected readonly GRID_ITEM_HEIGHT = 520;
  protected readonly LIST_ITEM_HEIGHT = 100;
  protected readonly GALLERY_ITEM_HEIGHT = 640;

  // Data
  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // Pagination State
  protected readonly currentPage = signal(0);
  protected readonly pageSize = signal(20);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);

  // Filters
  protected readonly filters = signal<EmployeeFilters>({
    search: '',
    availabilityStatuses: [],
    departments: [],
    seniorities: [],
    skills: []
  });

  // Computed - Filtered Employees
  protected readonly filteredEmployees = computed(() => {
    const allEmployees = this.employees();
    const currentFilters = this.filters();

    return allEmployees.filter(employee => {
      // Search filter
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const matchesSearch =
          employee.fullName.toLowerCase().includes(searchLower) ||
          employee.title.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower) ||
          employee.technologies.some(t => t.name.toLowerCase().includes(searchLower)) ||
          employee.skills.some(s => s.name.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Availability filter
      if (currentFilters.availabilityStatuses.length > 0) {
        if (!currentFilters.availabilityStatuses.includes(employee.availability)) {
          return false;
        }
      }

      // Department filter
      if (currentFilters.departments.length > 0) {
        if (!currentFilters.departments.includes(employee.department)) {
          return false;
        }
      }

      // Seniority filter
      if (currentFilters.seniorities.length > 0) {
        if (!currentFilters.seniorities.includes(employee.seniority)) {
          return false;
        }
      }

      // Skills filter
      if (currentFilters.skills.length > 0) {
        const employeeSkills = [
          ...employee.technologies.map(t => t.name),
          ...employee.skills.map(s => s.name)
        ];
        const hasAllSkills = currentFilters.skills.every(skill =>
          employeeSkills.some(es => es.toLowerCase() === skill.toLowerCase())
        );
        if (!hasAllSkills) return false;
      }

      return true;
    });
  });

  // Computed - Statistics
  protected readonly totalCount = computed(() => this.employees().length);
  protected readonly filteredCount = computed(() => this.filteredEmployees().length);
  protected readonly availableCount = computed(() =>
    this.filteredEmployees().filter(e => e.availability === 'available').length
  );

  // Computed - Selected employees for comparison
  protected readonly selectedEmployeeData = computed(() => {
    const selected = this.selectedEmployees();
    return this.employees().filter(e => selected.includes(e.id));
  });

  // Computed - Analytics Data (Ultra Premium)
  protected readonly departmentDistribution = computed(() => {
    const employees = this.filteredEmployees();
    const distribution = new Map<string, number>();

    employees.forEach(emp => {
      const count = distribution.get(emp.department) || 0;
      distribution.set(emp.department, count + 1);
    });

    return Array.from(distribution.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly seniorityDistribution = computed(() => {
    const employees = this.filteredEmployees();
    const distribution = new Map<string, number>();

    employees.forEach(emp => {
      const count = distribution.get(emp.seniority) || 0;
      distribution.set(emp.seniority, count + 1);
    });

    // Define order
    const order = ['junior', 'mid-level', 'senior', 'lead', 'principal'];
    return order
      .map(level => ({
        name: level,
        count: distribution.get(level) || 0
      }))
      .filter(item => item.count > 0);
  });

  protected readonly availabilityDistribution = computed(() => {
    const employees = this.filteredEmployees();
    const distribution = new Map<string, number>();

    employees.forEach(emp => {
      const count = distribution.get(emp.availability) || 0;
      distribution.set(emp.availability, count + 1);
    });

    return Array.from(distribution.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly topTechnologies = computed(() => {
    const employees = this.filteredEmployees();
    const techCounts = new Map<string, number>();

    employees.forEach(emp => {
      emp.technologies.forEach(tech => {
        const count = techCounts.get(tech.name) || 0;
        techCounts.set(tech.name, count + 1);
      });
    });

    return Array.from(techCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  });

  protected readonly topSkills = computed(() => {
    const employees = this.filteredEmployees();
    const skillCounts = new Map<string, number>();

    employees.forEach(emp => {
      emp.skills.forEach(skill => {
        const count = skillCounts.get(skill.name) || 0;
        skillCounts.set(skill.name, count + 1);
      });
    });

    return Array.from(skillCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  });

  // Computed - Grouped Employees (Smart Grouping)
  protected readonly groupedEmployees = computed(() => {
    const employees = this.filteredEmployees();
    const groupByKey = this.groupBy();

    if (groupByKey === 'none' || !this.groupingEnabled()) {
      return null; // No grouping
    }

    const groups = new Map<string, Employee[]>();

    employees.forEach(emp => {
      let key: string;
      switch (groupByKey) {
        case 'department':
          key = emp.department;
          break;
        case 'seniority':
          key = emp.seniority;
          break;
        case 'availability':
          key = emp.availability;
          break;
        default:
          key = 'Other';
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(emp);
    });

    // Convert to array and sort by group name
    return Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([groupName, members]) => ({
        name: groupName,
        count: members.length,
        employees: members
      }));
  });

  constructor() {
    this.loadEmployees();
  }

  /**
   * Load employees with pagination
   * @param page Page number (0-indexed)
   */
  private loadEmployees(page: number = 0): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    this.employeeService.getAllEmployees(page, this.pageSize()).subscribe({
      next: (response) => {
        // Extract employees from Pythia Hybrid response
        this.employees.set(response.employees);

        // Update pagination metadata
        this.totalPages.set(response.pagination.totalPages);
        this.totalElements.set(response.pagination.totalElements);

        this.loading.set(false);

        console.log(
          `Loaded page ${page + 1}/${response.pagination.totalPages} ` +
          `(${response.employees.length} employees)`
        );
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.error.set('Failed to load employees. Please try again.');
        this.loading.set(false);
      }
    });
  }

  // View Mode Actions
  protected handleViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  // Filter Actions
  protected handleFiltersChange(newFilters: EmployeeFilters): void {
    this.filters.set(newFilters);
  }

  protected toggleFilters(): void {
    this.showFilters.update(current => !current);
  }

  protected clearFilters(): void {
    this.filters.set({
      search: '',
      availabilityStatuses: [],
      departments: [],
      seniorities: [],
      skills: []
    });
  }

  // Grouping Actions
  protected toggleGrouping(): void {
    if (this.groupingEnabled()) {
      this.groupingEnabled.set(false);
      this.groupBy.set('none');
    } else {
      this.groupingEnabled.set(true);
      this.groupBy.set('department'); // Default to department
    }
  }

  protected cycleGroupBy(): void {
    const current = this.groupBy();
    const options: typeof current[] = ['department', 'seniority', 'availability', 'none'];
    const currentIndex = options.indexOf(current);
    const nextIndex = (currentIndex + 1) % options.length;
    const next = options[nextIndex];

    this.groupBy.set(next);
    this.groupingEnabled.set(next !== 'none');
  }

  // Drag-to-Compare Actions (Ultra Premium)
  protected handleEmployeeDragStart(employee: Employee): void {
    // Visual feedback will be handled by CDK
    console.log('Drag started:', employee.fullName);
  }

  protected handleEmployeeDrop(event: CdkDragDrop<Employee[]>): void {
    const employee = event.item.data as Employee;
    this.addToComparison(employee);
  }

  protected addToComparison(employee: Employee): void {
    this.comparisonPanel.update(current => {
      // Check if already in comparison
      if (current.some(e => e.id === employee.id)) {
        return current;
      }

      // Limit to 3 employees
      if (current.length >= 3) {
        return [...current.slice(1), employee]; // Remove first, add new
      }

      return [...current, employee];
    });

    // Auto-show panel when employee is added
    this.showComparisonPanel.set(true);
  }

  protected removeFromComparison(employeeId: number): void {
    this.comparisonPanel.update(current =>
      current.filter(e => e.id !== employeeId)
    );

    // Hide panel if empty
    if (this.comparisonPanel().length === 0) {
      this.showComparisonPanel.set(false);
    }
  }

  protected clearComparisonPanel(): void {
    this.comparisonPanel.set([]);
    this.showComparisonPanel.set(false);
  }

  protected toggleComparisonPanel(): void {
    this.showComparisonPanel.update(current => !current);
  }

  protected reorderComparison(event: CdkDragDrop<Employee[]>): void {
    const items = [...this.comparisonPanel()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.comparisonPanel.set(items);
  }

  // Analytics Actions (Ultra Premium)
  protected toggleAnalytics(): void {
    this.showAnalytics.update(current => !current);
  }

  // Comparison Mode Actions
  protected toggleComparisonMode(): void {
    this.comparisonMode.update(current => !current);
    if (!this.comparisonMode()) {
      this.selectedEmployees.set([]);
    }
  }

  protected handleEmployeeSelect(employeeId: number): void {
    if (!this.comparisonMode()) return;

    this.selectedEmployees.update(current => {
      if (current.includes(employeeId)) {
        return current.filter(id => id !== employeeId);
      } else {
        // Limit to 3 employees for comparison
        if (current.length >= 3) {
          return [...current.slice(1), employeeId];
        }
        return [...current, employeeId];
      }
    });
  }

  protected isEmployeeSelected(employeeId: number): boolean {
    return this.selectedEmployees().includes(employeeId);
  }

  protected clearComparison(): void {
    this.selectedEmployees.set([]);
  }

  // Navigation
  protected handleEmployeeClick(employeeId: number): void {
    if (this.comparisonMode()) {
      this.handleEmployeeSelect(employeeId);
    } else {
      this.router.navigate(['/employees', employeeId]);
    }
  }

  // Export Functionality
  protected exportEmployees(): void {
    const data = this.filteredEmployees();
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'employees-export.csv');
  }

  private convertToCSV(employees: Employee[]): string {
    const headers = ['ID', 'Name', 'Title', 'Department', 'Seniority', 'Availability', 'Experience', 'Email', 'Location'];
    const rows = employees.map(e => [
      e.id,
      e.fullName,
      e.title,
      e.department,
      e.seniority,
      e.availability,
      e.yearsExperience,
      e.email,
      e.location
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected refresh(): void {
    this.loadEmployees(this.currentPage());
  }

  // Pagination Actions
  /**
   * Navigate to next page
   */
  protected nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadEmployees(this.currentPage() + 1);
    }
  }

  /**
   * Navigate to previous page
   */
  protected previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadEmployees(this.currentPage() - 1);
    }
  }

  /**
   * Navigate to specific page
   * @param page Page number (0-indexed)
   */
  protected goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.loadEmployees(page);
    }
  }

  /**
   * Change page size and reload from first page
   * @param newSize New page size
   */
  protected handlePageSizeChange(newSize: number): void {
    this.pageSize.set(newSize);
    this.loadEmployees(0); // Reset to first page
  }

  /**
   * Check if there's a next page available
   */
  protected get hasNextPage(): boolean {
    return this.currentPage() < this.totalPages() - 1;
  }

  /**
   * Check if there's a previous page available
   */
  protected get hasPreviousPage(): boolean {
    return this.currentPage() > 0;
  }
}

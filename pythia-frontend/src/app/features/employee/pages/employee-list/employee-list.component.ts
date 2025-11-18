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
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ScrollingModule,
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

  // State Management
  protected readonly viewMode = signal<ViewMode>('grid');
  protected readonly showFilters = signal(true);
  protected readonly comparisonMode = signal(false);
  protected readonly selectedEmployees = signal<number[]>([]);

  // Ultra Premium Features
  protected readonly ultraPremiumMode = signal(true); // Enable all premium features
  protected readonly virtualScrollEnabled = signal(true); // Virtual scrolling for performance

  // Virtual Scroll Item Sizes (approximate heights in px)
  protected readonly GRID_ITEM_HEIGHT = 520;
  protected readonly LIST_ITEM_HEIGHT = 100;
  protected readonly GALLERY_ITEM_HEIGHT = 640;

  // Data
  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

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

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
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
    this.loadEmployees();
  }
}

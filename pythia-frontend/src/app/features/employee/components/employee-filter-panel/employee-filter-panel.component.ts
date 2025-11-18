/**
 * Employee Filter Panel Component - Pythia+
 *
 * Advanced filtering with:
 * - Search by name/title/skills
 * - Availability status filter
 * - Department filter
 * - Seniority filter
 * - Skill tags filter
 */

import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';

import { Employee } from '../../../../models/employee.model';
import {
  Availability,
  Seniority,
  AVAILABILITY_STATUSES,
  AVAILABILITY_LABELS,
  SENIORITY_LEVELS
} from '../../../../core/constants/employee.constants';

export interface EmployeeFilters {
  search: string;
  availabilityStatuses: Availability[];
  departments: string[];
  seniorities: Seniority[];
  skills: string[];
}

@Component({
  selector: 'app-employee-filter-panel',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatExpansionModule
  ],
  templateUrl: './employee-filter-panel.component.html',
  styleUrl: './employee-filter-panel.component.scss'
})
export class EmployeeFilterPanelComponent {
  // Inputs
  readonly filters = input.required<EmployeeFilters>();
  readonly employees = input.required<Employee[]>();

  // Outputs
  readonly filtersChange = output<EmployeeFilters>();

  // Local State
  protected readonly searchText = signal('');
  protected readonly skillInput = signal('');

  // Constants
  protected readonly availabilityOptions = AVAILABILITY_STATUSES;
  protected readonly availabilityLabels = AVAILABILITY_LABELS;
  protected readonly seniorityOptions = SENIORITY_LEVELS;

  // Computed - Available Departments from employees
  protected readonly availableDepartments = computed(() => {
    const depts = new Set(this.employees().map(e => e.department));
    return Array.from(depts).sort();
  });

  // Computed - Available Skills from employees
  protected readonly availableSkills = computed(() => {
    const skills = new Set<string>();
    this.employees().forEach(emp => {
      emp.technologies.forEach(t => skills.add(t.name));
      emp.skills.forEach(s => skills.add(s.name));
    });
    return Array.from(skills).sort();
  });

  // Computed - Filtered skill suggestions
  protected readonly filteredSkillOptions = computed(() => {
    const input = this.skillInput().toLowerCase();
    if (!input) return this.availableSkills().slice(0, 20);

    return this.availableSkills()
      .filter(skill => skill.toLowerCase().includes(input))
      .slice(0, 10);
  });

  constructor() {
    // Sync search text with filters
    effect(() => {
      this.searchText.set(this.filters().search);
    }, { allowSignalWrites: true });
  }

  // Search
  protected handleSearchChange(value: string): void {
    const updated: EmployeeFilters = {
      ...this.filters(),
      search: value
    };
    this.filtersChange.emit(updated);
  }

  // Availability
  protected isAvailabilityChecked(status: Availability): boolean {
    return this.filters().availabilityStatuses.includes(status);
  }

  protected toggleAvailability(status: Availability, checked: boolean): void {
    const current = this.filters().availabilityStatuses;
    const updated = checked
      ? [...current, status]
      : current.filter(s => s !== status);

    this.filtersChange.emit({
      ...this.filters(),
      availabilityStatuses: updated
    });
  }

  protected getAvailabilityCount(status: Availability): number {
    return this.employees().filter(e => e.availability === status).length;
  }

  // Department
  protected isDepartmentChecked(department: string): boolean {
    return this.filters().departments.includes(department);
  }

  protected toggleDepartment(department: string, checked: boolean): void {
    const current = this.filters().departments;
    const updated = checked
      ? [...current, department]
      : current.filter(d => d !== department);

    this.filtersChange.emit({
      ...this.filters(),
      departments: updated
    });
  }

  protected getDepartmentCount(department: string): number {
    return this.employees().filter(e => e.department === department).length;
  }

  // Seniority
  protected isSeniorityChecked(seniority: Seniority): boolean {
    return this.filters().seniorities.includes(seniority);
  }

  protected toggleSeniority(seniority: Seniority, checked: boolean): void {
    const current = this.filters().seniorities;
    const updated = checked
      ? [...current, seniority]
      : current.filter(s => s !== seniority);

    this.filtersChange.emit({
      ...this.filters(),
      seniorities: updated
    });
  }

  protected getSeniorityCount(seniority: Seniority): number {
    return this.employees().filter(e => e.seniority === seniority).length;
  }

  // Skills
  protected addSkill(skill: string): void {
    if (!skill || this.filters().skills.includes(skill)) return;

    this.filtersChange.emit({
      ...this.filters(),
      skills: [...this.filters().skills, skill]
    });

    this.skillInput.set('');
  }

  protected removeSkill(skill: string): void {
    this.filtersChange.emit({
      ...this.filters(),
      skills: this.filters().skills.filter(s => s !== skill)
    });
  }

  protected handleSkillInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const value = this.skillInput().trim();
      if (value) {
        this.addSkill(value);
      }
    }
  }
}

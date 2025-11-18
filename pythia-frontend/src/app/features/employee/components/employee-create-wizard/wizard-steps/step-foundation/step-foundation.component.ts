import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeCreateService } from '../../../../services/employee-create.service';
import { SENIORITY_LEVELS, AVAILABILITY_STATUSES, Seniority, Availability } from '../../../../../../core/constants/employee.constants';

/**
 * Step 2: The Foundation - Professional Context
 *
 * Captures professional background:
 * - Title (job title)
 * - Department (visual icon grid)
 * - Seniority Level (interactive slider)
 * - Location (city & country)
 * - Years of Experience (number spinner)
 * - Availability (toggle cards)
 *
 * Features:
 * - Icon grid for department selection
 * - Visual tier slider for seniority
 * - Animated toggle cards for availability
 * - Smart defaults and hints
 */
@Component({
  selector: 'app-step-foundation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatChipsModule
  ],
  templateUrl: './step-foundation.component.html',
  styleUrl: './step-foundation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepFoundationComponent {
  private readonly createService = inject(EmployeeCreateService);

  // =============================================================================
  // FORM CONTROLS
  // =============================================================================

  protected readonly foundationForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    department: new FormControl('', { nonNullable: true }),
    seniority: new FormControl<Seniority | ''>('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    country: new FormControl('', { nonNullable: true }),
    yearsExperience: new FormControl<number | null>(null),
    availability: new FormControl<Availability | ''>('', { nonNullable: true })
  });

  // =============================================================================
  // CONSTANTS FOR UI
  // =============================================================================

  /**
   * Department options with icons
   */
  protected readonly departments = [
    { value: 'Engineering', icon: 'code', color: '#3b82f6' },
    { value: 'Product', icon: 'lightbulb', color: '#f59e0b' },
    { value: 'Design', icon: 'palette', color: '#ec4899' },
    { value: 'Marketing', icon: 'campaign', color: '#10b981' },
    { value: 'Sales', icon: 'trending_up', color: '#8b5cf6' },
    { value: 'HR', icon: 'people', color: '#06b6d4' },
    { value: 'Finance', icon: 'account_balance', color: '#14b8a6' },
    { value: 'Operations', icon: 'settings', color: '#6366f1' }
  ];

  /**
   * Seniority levels for slider
   */
  protected readonly seniorityLevels = SENIORITY_LEVELS;

  /**
   * Availability options with styling
   */
  protected readonly availabilityOptions = [
    {
      value: 'available' as Availability,
      label: 'Available',
      icon: 'check_circle',
      color: '#10b981',
      description: 'Ready for new opportunities'
    },
    {
      value: 'notice_period' as Availability,
      label: 'Notice Period',
      icon: 'schedule',
      color: '#f59e0b',
      description: 'Available after notice period'
    },
    {
      value: 'busy' as Availability,
      label: 'Busy',
      icon: 'work',
      color: '#3b82f6',
      description: 'Currently engaged'
    },
    {
      value: 'unavailable' as Availability,
      label: 'Unavailable',
      icon: 'block',
      color: '#ef4444',
      description: 'Not looking for opportunities'
    }
  ];

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Load existing data
    const existingData = this.createService.formData();

    if (existingData.title) {
      this.foundationForm.controls.title.setValue(existingData.title);
    }
    if (existingData.department) {
      this.foundationForm.controls.department.setValue(existingData.department);
    }
    if (existingData.seniority) {
      this.foundationForm.controls.seniority.setValue(existingData.seniority);
    }
    if (existingData.city) {
      this.foundationForm.controls.city.setValue(existingData.city);
    }
    if (existingData.country) {
      this.foundationForm.controls.country.setValue(existingData.country);
    }
    if (existingData.yearsExperience !== undefined) {
      this.foundationForm.controls.yearsExperience.setValue(existingData.yearsExperience);
    }
    if (existingData.availability) {
      this.foundationForm.controls.availability.setValue(existingData.availability);
    }

    // Auto-save on changes
    this.foundationForm.valueChanges.subscribe(values => {
      this.createService.updateFormData({
        title: values.title || undefined,
        department: values.department || undefined,
        seniority: values.seniority || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        yearsExperience: values.yearsExperience ?? undefined,
        availability: values.availability || undefined
      });
    });
  }

  // =============================================================================
  // SELECTION HANDLERS
  // =============================================================================

  /**
   * Select department
   */
  protected selectDepartment(department: string): void {
    this.foundationForm.controls.department.setValue(department);
  }

  /**
   * Check if department is selected
   */
  protected isDepartmentSelected(department: string): boolean {
    return this.foundationForm.controls.department.value === department;
  }

  /**
   * Select seniority
   */
  protected selectSeniority(seniority: Seniority): void {
    this.foundationForm.controls.seniority.setValue(seniority);
  }

  /**
   * Check if seniority is selected
   */
  protected isSenioritySelected(seniority: Seniority): boolean {
    return this.foundationForm.controls.seniority.value === seniority;
  }

  /**
   * Select availability
   */
  protected selectAvailability(availability: Availability): void {
    this.foundationForm.controls.availability.setValue(availability);
  }

  /**
   * Check if availability is selected
   */
  protected isAvailabilitySelected(availability: Availability): boolean {
    return this.foundationForm.controls.availability.value === availability;
  }

  /**
   * Get department color
   */
  protected getDepartmentColor(department: string): string {
    const dept = this.departments.find(d => d.value === department);
    return dept?.color || '#9e9e9e';
  }

  /**
   * Increment years of experience
   */
  protected incrementYears(): void {
    const current = this.foundationForm.controls.yearsExperience.value ?? 0;
    if (current < 50) {
      this.foundationForm.controls.yearsExperience.setValue(current + 1);
    }
  }

  /**
   * Decrement years of experience
   */
  protected decrementYears(): void {
    const current = this.foundationForm.controls.yearsExperience.value ?? 0;
    if (current > 0) {
      this.foundationForm.controls.yearsExperience.setValue(current - 1);
    }
  }
}

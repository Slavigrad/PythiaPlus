import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeCreateService } from '../../../../services/employee-create.service';
import { EmployeeCreateWorkExperience } from '../../../../../../models/employee-create.model';

/**
 * Step 4: The Journey - Work Experience Timeline
 *
 * Interactive timeline of professional experiences:
 * - Add multiple work experiences
 * - Company, role, dates, description
 * - Current position toggle (no end date)
 * - Visual timeline connector
 * - Remove experiences
 * - Smooth animations
 */
@Component({
  selector: 'app-step-journey',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './step-journey.component.html',
  styleUrl: './step-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepJourneyComponent {
  private readonly createService = inject(EmployeeCreateService);

  // =============================================================================
  // STATE SIGNALS
  // =============================================================================

  /**
   * Work experiences array
   */
  protected readonly workExperiences = signal<EmployeeCreateWorkExperience[]>([]);

  /**
   * Currently editing experience index (-1 means adding new)
   */
  protected readonly editingIndex = signal<number>(-1);

  /**
   * Show add/edit form
   */
  protected readonly showForm = signal(false);

  // =============================================================================
  // FORM
  // =============================================================================

  protected readonly experienceForm = new FormGroup({
    company: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    role: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    startDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    endDate: new FormControl<Date | null>(null),
    isCurrent: new FormControl(false, { nonNullable: true }),
    description: new FormControl('', { nonNullable: true })
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Load existing data
    const existingData = this.createService.formData();

    if (existingData.workExperiences && existingData.workExperiences.length > 0) {
      this.workExperiences.set([...existingData.workExperiences]);
    }

    // Watch current position toggle
    this.experienceForm.controls.isCurrent.valueChanges.subscribe(isCurrent => {
      if (isCurrent) {
        this.experienceForm.controls.endDate.setValue(null);
        this.experienceForm.controls.endDate.disable();
      } else {
        this.experienceForm.controls.endDate.enable();
      }
    });
  }

  // =============================================================================
  // ADD/EDIT METHODS
  // =============================================================================

  /**
   * Show form to add new experience
   */
  protected addNew(): void {
    this.editingIndex.set(-1);
    this.experienceForm.reset({
      company: '',
      role: '',
      startDate: null,
      endDate: null,
      isCurrent: false,
      description: ''
    });
    this.showForm.set(true);
  }

  /**
   * Edit existing experience
   */
  protected editExperience(index: number): void {
    const exp = this.workExperiences()[index];
    this.editingIndex.set(index);

    const isCurrent = !exp.endDate;

    this.experienceForm.patchValue({
      company: exp.company,
      role: exp.role,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : null,
      isCurrent: isCurrent,
      description: exp.description
    });

    if (isCurrent) {
      this.experienceForm.controls.endDate.disable();
    }

    this.showForm.set(true);
  }

  /**
   * Save experience (add or update)
   */
  protected saveExperience(): void {
    if (this.experienceForm.invalid) {
      return;
    }

    const formValue = this.experienceForm.getRawValue();

    const experience: EmployeeCreateWorkExperience = {
      company: formValue.company,
      role: formValue.role,
      startDate: this.formatDate(formValue.startDate!),
      endDate: formValue.isCurrent || !formValue.endDate
        ? null
        : this.formatDate(formValue.endDate),
      description: formValue.description
    };

    if (this.editingIndex() === -1) {
      // Add new
      this.workExperiences.update(exps => [...exps, experience]);
    } else {
      // Update existing
      this.workExperiences.update(exps => {
        const updated = [...exps];
        updated[this.editingIndex()] = experience;
        return updated;
      });
    }

    this.cancelEdit();
    this.saveToService();
  }

  /**
   * Cancel editing
   */
  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingIndex.set(-1);
    this.experienceForm.reset();
  }

  /**
   * Remove experience
   */
  protected removeExperience(index: number): void {
    this.workExperiences.update(exps =>
      exps.filter((_, i) => i !== index)
    );
    this.saveToService();
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format date for display
   */
  protected formatDisplayDate(dateString: string | null): string {
    if (!dateString) {
      return 'Present';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Calculate duration
   */
  protected calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = (end.getFullYear() - start.getFullYear()) * 12 +
                   (end.getMonth() - start.getMonth());

    if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }

    return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }

  /**
   * Save to service
   */
  private saveToService(): void {
    this.createService.updateFormData({
      workExperiences: this.workExperiences().length > 0
        ? this.workExperiences()
        : undefined
    });
  }

  /**
   * Get form field error
   */
  protected getFieldError(fieldName: string): string {
    const control = this.experienceForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    return '';
  }
}

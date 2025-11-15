import { Component, input, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Employee } from '../../../../../models/employee.model';
import { WorkExperienceUpdateItem } from '../../../../../models/employee-update.model';

/**
 * Work Experience Edit Component
 *
 * Editable form for employee work experiences:
 * - Company name (required)
 * - Role/Position (required)
 * - Start date (required)
 * - End date (optional, null for current position)
 * - Description (optional)
 * - "Current position" checkbox
 * - Add/Remove items
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of work experiences
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-work-experience-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './work-experience-edit.component.html',
  styleUrl: './work-experience-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkExperienceEditComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly employee = input.required<Employee>();

  // Form
  protected form: FormGroup;

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      workExperiences: this.fb.array([])
    });

    // Update form when employee changes
    effect(() => {
      const emp = this.employee();
      if (emp) {
        this.resetForm(emp);
      }
    });

    // Track form validity
    this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });
  }

  /**
   * Get work experiences form array
   */
  get workExperiences(): FormArray {
    return this.form.get('workExperiences') as FormArray;
  }

  /**
   * Reset form to employee work experiences
   */
  protected resetForm(emp: Employee): void {
    this.workExperiences.clear();

    emp.workExperiences.forEach(work => {
      this.workExperiences.push(this.createWorkExperienceFormGroup({
        company: work.company,
        role: work.role,
        startDate: work.startDate,
        endDate: work.endDate,
        description: work.description
      }));
    });

    // Add one empty row if no work experiences
    if (emp.workExperiences.length === 0) {
      this.addWorkExperience();
    }
  }

  /**
   * Create a work experience form group
   */
  private createWorkExperienceFormGroup(work?: Partial<WorkExperienceUpdateItem>): FormGroup {
    const group = this.fb.group({
      company: [work?.company || '', [Validators.required, Validators.maxLength(255)]],
      role: [work?.role || '', [Validators.required, Validators.maxLength(255)]],
      startDate: [work?.startDate ? new Date(work.startDate) : null, Validators.required],
      endDate: [work?.endDate ? new Date(work.endDate) : null],
      description: [work?.description || ''],
      isCurrent: [!work?.endDate] // True if no end date
    }, {
      validators: this.dateRangeValidator
    });

    // Watch for "isCurrent" checkbox changes
    group.get('isCurrent')?.valueChanges.subscribe(isCurrent => {
      if (isCurrent) {
        group.patchValue({ endDate: null }, { emitEvent: false });
      }
    });

    return group;
  }

  /**
   * Date range validator: end date must be after start date
   */
  private dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const isCurrent = group.get('isCurrent')?.value;

    if (!isCurrent && startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { dateRange: true };
    }

    return null;
  }

  /**
   * Add new work experience row
   */
  protected addWorkExperience(): void {
    this.workExperiences.push(this.createWorkExperienceFormGroup());
  }

  /**
   * Remove work experience at index
   */
  protected removeWorkExperience(index: number): void {
    this.workExperiences.removeAt(index);

    // Ensure at least one empty row
    if (this.workExperiences.length === 0) {
      this.addWorkExperience();
    }
  }

  /**
   * Get form data for save
   * Returns array of WorkExperienceUpdateItem
   */
  getFormData(): WorkExperienceUpdateItem[] {
    return this.workExperiences.controls
      .map(control => control.value)
      .filter(work => work.company && work.role && work.startDate) // Only include valid entries
      .map(work => ({
        company: work.company,
        role: work.role,
        startDate: this.formatDate(work.startDate),
        endDate: work.endDate ? this.formatDate(work.endDate) : null,
        description: work.description || undefined
      }));
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Reset form to original employee values
   */
  reset(): void {
    this.resetForm(this.employee());
  }

  /**
   * Check if form is valid
   */
  isValid(): boolean {
    // Valid if at least one work experience or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any work experiences
   */
  hasWorkExperiences(): boolean {
    return this.getFormData().length > 0;
  }

  /**
   * Check if work experience group has date range error
   */
  protected hasDateRangeError(index: number): boolean {
    const workGroup = this.workExperiences.at(index) as FormGroup;
    return workGroup.hasError('dateRange') && workGroup.touched;
  }
}

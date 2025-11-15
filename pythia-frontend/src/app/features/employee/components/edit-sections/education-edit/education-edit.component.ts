import { Component, input, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Employee } from '../../../../../models/employee.model';
import { EducationUpdateItem } from '../../../../../models/employee-update.model';

/**
 * Education Edit Component
 *
 * Editable form for employee educations:
 * - Institution (required)
 * - Degree (required)
 * - Field of study (required)
 * - Start year (required)
 * - End year (optional, null for ongoing)
 * - "Ongoing" checkbox
 * - Add/Remove items
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of educations
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-education-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './education-edit.component.html',
  styleUrl: './education-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationEditComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly employee = input.required<Employee>();

  // Form
  protected form: FormGroup;

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  // Current year for validation
  protected readonly currentYear = new Date().getFullYear();

  constructor() {
    this.form = this.fb.group({
      educations: this.fb.array([])
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
   * Get educations form array
   */
  get educations(): FormArray {
    return this.form.get('educations') as FormArray;
  }

  /**
   * Reset form to employee educations
   */
  protected resetForm(emp: Employee): void {
    this.educations.clear();

    emp.educations.forEach(edu => {
      this.educations.push(this.createEducationFormGroup({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startYear: edu.startYear,
        endYear: edu.endYear
      }));
    });

    // Add one empty row if no educations
    if (emp.educations.length === 0) {
      this.addEducation();
    }
  }

  /**
   * Create an education form group
   */
  private createEducationFormGroup(edu?: Partial<EducationUpdateItem>): FormGroup {
    const group = this.fb.group({
      institution: [edu?.institution || '', [Validators.required, Validators.maxLength(255)]],
      degree: [edu?.degree || '', [Validators.required, Validators.maxLength(255)]],
      field: [edu?.field || '', [Validators.required, Validators.maxLength(255)]],
      startYear: [edu?.startYear || null, [Validators.required, Validators.min(1950), Validators.max(this.currentYear + 10)]],
      endYear: [edu?.endYear || null, [Validators.min(1950), Validators.max(this.currentYear + 10)]],
      isOngoing: [!edu?.endYear] // True if no end year
    }, {
      validators: this.yearRangeValidator
    });

    // Watch for "isOngoing" checkbox changes
    group.get('isOngoing')?.valueChanges.subscribe(isOngoing => {
      if (isOngoing) {
        group.patchValue({ endYear: null }, { emitEvent: false });
      }
    });

    return group;
  }

  /**
   * Year range validator: end year must be after start year
   */
  private yearRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startYear = group.get('startYear')?.value;
    const endYear = group.get('endYear')?.value;
    const isOngoing = group.get('isOngoing')?.value;

    if (!isOngoing && startYear && endYear && endYear <= startYear) {
      return { yearRange: true };
    }

    return null;
  }

  /**
   * Add new education row
   */
  protected addEducation(): void {
    this.educations.push(this.createEducationFormGroup());
  }

  /**
   * Remove education at index
   */
  protected removeEducation(index: number): void {
    this.educations.removeAt(index);

    // Ensure at least one empty row
    if (this.educations.length === 0) {
      this.addEducation();
    }
  }

  /**
   * Get form data for save
   * Returns array of EducationUpdateItem
   */
  getFormData(): EducationUpdateItem[] {
    return this.educations.controls
      .map(control => control.value)
      .filter(edu => edu.institution && edu.degree && edu.field && edu.startYear) // Only include valid entries
      .map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startYear: edu.startYear,
        endYear: edu.endYear || null
      }));
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
    // Valid if at least one education or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any educations
   */
  hasEducations(): boolean {
    return this.getFormData().length > 0;
  }

  /**
   * Check if education group has year range error
   */
  protected hasYearRangeError(index: number): boolean {
    const eduGroup = this.educations.at(index) as FormGroup;
    return eduGroup.hasError('yearRange') && eduGroup.touched;
  }
}

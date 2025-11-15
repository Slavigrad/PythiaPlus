import { Component, input, output, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../../../models/employee.model';
import { EmployeeUpdateRequest } from '../../../../../models/employee-update.model';

/**
 * Basic Info Edit Component
 *
 * Editable form for employee basic information:
 * - Full Name
 * - Title
 * - Email
 * - Phone
 * - Location
 * - Department
 * - Seniority
 * - Years of Experience
 * - Availability
 */
@Component({
  selector: 'app-basic-info-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './basic-info-edit.component.html',
  styleUrl: './basic-info-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicInfoEditComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly employee = input.required<Employee>();

  // Outputs
  readonly save = output<EmployeeUpdateRequest>();

  // Form
  protected form: FormGroup;

  // Availability options
  protected readonly availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'notice', label: 'Notice Period' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.maxLength(50)],
      location: ['', Validators.maxLength(255)],
      department: ['', Validators.maxLength(100)],
      seniority: ['', Validators.maxLength(50)],
      yearsExperience: [0, [Validators.min(0), Validators.max(50)]],
      availability: ['available', Validators.required]
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
   * Reset form to employee values
   */
  protected resetForm(emp: Employee): void {
    this.form.patchValue({
      fullName: emp.fullName || '',
      title: emp.title || '',
      email: emp.email || '',
      phone: emp.phone || '',
      location: emp.location || '',
      department: emp.department || '',
      seniority: emp.seniority || '',
      yearsExperience: emp.yearsExperience || 0,
      availability: emp.availability || 'available'
    });
  }

  /**
   * Get form data for save
   */
  getFormData(): EmployeeUpdateRequest {
    return this.form.value;
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
    return this.form.valid;
  }
}

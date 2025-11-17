import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Technology, TechnologyRequest } from '../../../../models/technology.model';

export interface TechnologyEditDialogData {
  mode: 'create' | 'edit';
  technology?: Technology;
}

/**
 * Technology Edit Dialog Component
 *
 * Purpose: Modal dialog for creating and editing technology entries
 * Features:
 * - Reactive form with validation
 * - Create and edit modes
 * - Professional, user-friendly design
 * - Keyboard accessible (WCAG AA)
 */
@Component({
  selector: 'app-technology-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './technology-edit-dialog.component.html',
  styleUrl: './technology-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologyEditDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly dialogRef = inject(MatDialogRef<TechnologyEditDialogComponent>);
  protected readonly data = inject<TechnologyEditDialogData>(MAT_DIALOG_DATA);

  protected technologyForm!: FormGroup;
  protected readonly isEditMode = this.data.mode === 'edit';

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    const technology = this.data.technology;

    this.technologyForm = this.fb.group({
      name: [
        technology?.name || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      description: [
        technology?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ]
    });
  }

  /**
   * Get dialog title based on mode
   */
  protected get dialogTitle(): string {
    return this.isEditMode ? 'Edit Technology' : 'Add New Technology';
  }

  /**
   * Get submit button text based on mode
   */
  protected get submitButtonText(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }

  /**
   * Handle form submission
   */
  protected onSubmit(): void {
    if (this.technologyForm.valid) {
      const request: TechnologyRequest = {
        name: this.technologyForm.value.name.trim(),
        description: this.technologyForm.value.description.trim(),
        category: 'Technologies'
      };

      this.dialogRef.close(request);
    }
  }

  /**
   * Handle dialog cancellation
   */
  protected onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Check if a form field has an error
   */
  protected hasError(fieldName: string, errorType: string): boolean {
    const field = this.technologyForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for a form field
   */
  protected getErrorMessage(fieldName: string): string {
    const field = this.technologyForm.get(fieldName);

    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Must be at least ${minLength} characters`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Must not exceed ${maxLength} characters`;
    }

    return '';
  }
}

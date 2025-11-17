import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Role, RoleRequest } from '../../../../models/role.model';

export interface RoleEditDialogData {
  mode: 'create' | 'edit';
  role?: Role;
}

/**
 * Role Edit Dialog Component
 *
 * Purpose: Modal dialog for creating and editing role entries
 * Features:
 * - Reactive form with validation
 * - Create and edit modes
 * - Professional, user-friendly design
 * - Keyboard accessible (WCAG AA)
 */
@Component({
  selector: 'app-role-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './role-edit-dialog.component.html',
  styleUrl: './role-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleEditDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly dialogRef = inject(MatDialogRef<RoleEditDialogComponent>);
  protected readonly data = inject<RoleEditDialogData>(MAT_DIALOG_DATA);

  protected roleForm!: FormGroup;
  protected readonly isEditMode = this.data.mode === 'edit';

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    const role = this.data.role;

    this.roleForm = this.fb.group({
      name: [
        role?.name || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      code: [
        role?.code || '',
        [Validators.maxLength(50)]
      ],
      description: [
        role?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ]
    });
  }

  /**
   * Get dialog title based on mode
   */
  protected get dialogTitle(): string {
    return this.isEditMode ? 'Edit Role' : 'Add New Role';
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
    if (this.roleForm.valid) {
      const codeValue = this.roleForm.value.code?.trim();
      const request: RoleRequest = {
        name: this.roleForm.value.name.trim(),
        code: codeValue || undefined,
        description: this.roleForm.value.description.trim(),
        category: 'Roles'
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
    const field = this.roleForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for a form field
   */
  protected getErrorMessage(fieldName: string): string {
    const field = this.roleForm.get(fieldName);

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

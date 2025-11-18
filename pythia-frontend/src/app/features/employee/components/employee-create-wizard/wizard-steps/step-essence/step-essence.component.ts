import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeCreateService } from '../../../../services/employee-create.service';

/**
 * Step 1: The Essence - Core Identity
 *
 * Captures the fundamental identity of the talent:
 * - Full Name (required) - with live initials preview
 * - Email (required) - with format validation
 * - Profile Picture (optional) - URL input with preview
 *
 * Features:
 * - Floating label animations
 * - Real-time validation feedback
 * - Colorful initials bubble preview
 * - Smart error messages
 * - Auto-save on change
 */
@Component({
  selector: 'app-step-essence',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './step-essence.component.html',
  styleUrl: './step-essence.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepEssenceComponent {
  private readonly createService = inject(EmployeeCreateService);

  // =============================================================================
  // FORM CONTROLS
  // =============================================================================

  /**
   * Reactive form for Step 1
   */
  protected readonly essenceForm = new FormGroup({
    fullName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    profilePicture: new FormControl('', {
      validators: [Validators.pattern(/^https?:\/\/.+/)],
      nonNullable: true
    })
  });

  // =============================================================================
  // COMPUTED SIGNALS FOR LIVE PREVIEW
  // =============================================================================

  /**
   * Get initials from full name
   */
  protected readonly initials = computed(() => {
    const name = this.essenceForm.controls.fullName.value;
    if (!name || name.trim().length === 0) {
      return '?';
    }

    return name
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  /**
   * Get consistent color for initials based on name
   */
  protected readonly initialsColor = computed(() => {
    const name = this.essenceForm.controls.fullName.value;
    if (!name || name.trim().length === 0) {
      return '#9e9e9e'; // Gray for empty
    }

    const colors = [
      '#10b981', // green
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
      '#14b8a6', // teal
      '#6366f1', // indigo
    ];

    // Generate consistent hash from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  });

  /**
   * Check if profile picture is valid URL
   */
  protected readonly hasValidProfilePicture = computed(() => {
    const url = this.essenceForm.controls.profilePicture.value;
    return url && url.trim().length > 0 && this.essenceForm.controls.profilePicture.valid;
  });

  /**
   * Get current profile picture URL
   */
  protected readonly profilePictureUrl = computed(() => {
    return this.essenceForm.controls.profilePicture.value;
  });

  // =============================================================================
  // VALIDATION STATE
  // =============================================================================

  /**
   * Full Name validation messages
   */
  protected getFullNameError(): string {
    const control = this.essenceForm.controls.fullName;

    if (control.hasError('required')) {
      return 'Full name is required';
    }
    if (control.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  /**
   * Email validation messages
   */
  protected getEmailError(): string {
    const control = this.essenceForm.controls.email;

    if (control.hasError('required')) {
      return 'Email is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  /**
   * Profile Picture validation messages
   */
  protected getProfilePictureError(): string {
    const control = this.essenceForm.controls.profilePicture;

    if (control.hasError('pattern')) {
      return 'Please enter a valid URL (http:// or https://)';
    }
    return '';
  }

  // =============================================================================
  // LIFECYCLE & EFFECTS
  // =============================================================================

  constructor() {
    // Load existing data from service
    const existingData = this.createService.formData();

    if (existingData.fullName) {
      this.essenceForm.controls.fullName.setValue(existingData.fullName);
    }
    if (existingData.email) {
      this.essenceForm.controls.email.setValue(existingData.email);
    }
    if (existingData.profilePicture) {
      this.essenceForm.controls.profilePicture.setValue(existingData.profilePicture);
    }

    // Auto-save on form changes
    this.essenceForm.valueChanges.subscribe(values => {
      this.createService.updateFormData({
        fullName: values.fullName || undefined,
        email: values.email || undefined,
        profilePicture: values.profilePicture || undefined
      });
    });
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Handle image load error
   */
  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  /**
   * Clear profile picture
   */
  protected clearProfilePicture(): void {
    this.essenceForm.controls.profilePicture.setValue('');
  }
}

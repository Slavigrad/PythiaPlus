import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeCreateService } from '../../services/employee-create.service';
import { Router } from '@angular/router';

/**
 * Employee Create Wizard - "Oracle's Creation Experience"
 *
 * A multi-step wizard for creating employee profiles with:
 * - 6 sacred steps (The Essence → The Oracle Speaks)
 * - Cinematic page transitions
 * - Progress indicator with motivational messages
 * - Auto-save draft functionality
 * - Beautiful success animations
 *
 * "Not just a form - an experience of discovery"
 */
@Component({
  selector: 'app-employee-create-wizard',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './employee-create-wizard.component.html',
  styleUrl: './employee-create-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeCreateWizardComponent {
  private readonly dialogRef = inject(MatDialogRef<EmployeeCreateWizardComponent>);
  protected readonly createService = inject(EmployeeCreateService);
  private readonly router = inject(Router);

  // Expose service signals to template
  protected readonly currentStep = this.createService.currentStep;
  protected readonly totalSteps = this.createService.totalSteps;
  protected readonly completionPercentage = this.createService.completionPercentage;
  protected readonly motivationalMessage = this.createService.motivationalMessage;
  protected readonly isCurrentStepValid = this.createService.isCurrentStepValid;
  protected readonly canSubmit = this.createService.canSubmit;
  protected readonly loading = this.createService.loading;
  protected readonly error = this.createService.error;
  protected readonly success = this.createService.success;

  // Animation state
  protected readonly slideDirection = signal<'forward' | 'backward'>('forward');

  /**
   * Step titles for breadcrumb navigation
   */
  protected readonly stepTitles = [
    { step: 1, title: 'The Essence', icon: 'person' },
    { step: 2, title: 'The Foundation', icon: 'business' },
    { step: 3, title: 'The Arsenal', icon: 'code' },
    { step: 4, title: 'The Journey', icon: 'timeline' },
    { step: 5, title: 'The Credentials', icon: 'school' },
    { step: 6, title: 'The Oracle Speaks', icon: 'visibility' }
  ];

  /**
   * Check if a step is completed (lower than current step)
   */
  protected isStepCompleted(step: number): boolean {
    return step < this.currentStep();
  }

  /**
   * Check if a step is the current active step
   */
  protected isStepActive(step: number): boolean {
    return step === this.currentStep();
  }

  /**
   * Navigate to previous step
   */
  protected onPrevious(): void {
    this.slideDirection.set('backward');
    this.createService.previousStep();
  }

  /**
   * Navigate to next step
   */
  protected onNext(): void {
    this.slideDirection.set('forward');
    this.createService.nextStep();
  }

  /**
   * Jump to specific step (only for completed or current steps)
   */
  protected goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.slideDirection.set(step > this.currentStep() ? 'forward' : 'backward');
      this.createService.goToStep(step);
    }
  }

  /**
   * Submit employee creation
   */
  protected onSubmit(): void {
    this.createService.createEmployee().subscribe({
      next: (response) => {
        // Show success animation for 2 seconds
        setTimeout(() => {
          // Close dialog
          this.dialogRef.close(response);

          // Navigate to the new employee profile
          this.router.navigate(['/employees', response.id]);
        }, 2000);
      },
      error: (error) => {
        console.error('Failed to create employee:', error);
        // Error is already set in service
      }
    });
  }

  /**
   * Cancel wizard and close dialog
   */
  protected onCancel(): void {
    // Check if there's unsaved data
    const hasData = this.completionPercentage() > 0;

    if (hasData) {
      const confirmLeave = confirm(
        'You have unsaved changes. Your draft will be saved automatically. Are you sure you want to exit?'
      );

      if (!confirmLeave) {
        return;
      }
    }

    this.dialogRef.close(null);
  }
}

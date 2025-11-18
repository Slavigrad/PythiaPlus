import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { EmployeeCreate, EmployeeCreateDraft, EmployeeCreateResponse } from '../../../models/employee-create.model';

/**
 * Employee Create Service
 *
 * Manages the employee creation wizard state:
 * - Multi-step form data
 * - Current step navigation
 * - Form completion percentage
 * - Draft auto-save to localStorage
 * - API submission with error handling
 *
 * "The Oracle remembers all - your progress is never lost"
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeCreateService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/employees';
  private readonly DRAFT_STORAGE_KEY = 'pythia_employee_draft';
  private readonly AUTO_SAVE_DELAY = 5000; // 5 seconds

  // =============================================================================
  // FORM STATE SIGNALS
  // =============================================================================

  /**
   * Current form data (mutable draft)
   */
  readonly formData = signal<EmployeeCreateDraft>({});

  /**
   * Current wizard step (1-6)
   */
  readonly currentStep = signal(1);

  /**
   * Total number of steps
   */
  readonly totalSteps = 6;

  /**
   * Loading state during API submission
   */
  readonly loading = signal(false);

  /**
   * Error message from API
   */
  readonly error = signal<string | null>(null);

  /**
   * Success state after employee creation
   */
  readonly success = signal(false);

  /**
   * Created employee ID (set after successful creation)
   */
  readonly createdEmployeeId = signal<number | null>(null);

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /**
   * Calculate form completion percentage (0-100)
   * Based on filled fields across all steps
   */
  readonly completionPercentage = computed(() => {
    const data = this.formData();
    let totalFields = 0;
    let filledFields = 0;

    // Required fields (Step 1: The Essence)
    totalFields += 2;
    if (data.fullName && data.fullName.trim()) filledFields++;
    if (data.email && data.email.trim()) filledFields++;

    // Optional basic info (Step 2: The Foundation)
    totalFields += 8;
    if (data.title) filledFields++;
    if (data.department) filledFields++;
    if (data.seniority) filledFields++;
    if (data.city) filledFields++;
    if (data.country) filledFields++;
    if (data.yearsExperience !== undefined) filledFields++;
    if (data.availability) filledFields++;
    if (data.profilePicture) filledFields++;

    // Technologies (Step 3: The Arsenal)
    totalFields += 1;
    if (data.technologies && data.technologies.length > 0) filledFields++;

    // Skills (Step 3: The Arsenal)
    totalFields += 1;
    if (data.skills && data.skills.length > 0) filledFields++;

    // Work experiences (Step 4: The Journey)
    totalFields += 1;
    if (data.workExperiences && data.workExperiences.length > 0) filledFields++;

    // Education (Step 5: The Credentials)
    totalFields += 1;
    if (data.educations && data.educations.length > 0) filledFields++;

    // Certifications (Step 5: The Credentials)
    totalFields += 1;
    if (data.certifications && data.certifications.length > 0) filledFields++;

    // Languages (Step 5: The Credentials)
    totalFields += 1;
    if (data.languages && data.languages.length > 0) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  });

  /**
   * Check if current step is valid
   */
  readonly isCurrentStepValid = computed(() => {
    const step = this.currentStep();
    const data = this.formData();

    switch (step) {
      case 1: // The Essence - requires fullName and email
        return !!(
          data.fullName &&
          data.fullName.trim().length >= 2 &&
          data.email &&
          this.isValidEmail(data.email)
        );

      case 2: // The Foundation - all optional
      case 3: // The Arsenal - all optional
      case 4: // The Journey - all optional
      case 5: // The Credentials - all optional
      case 6: // The Oracle Speaks - preview step
        return true;

      default:
        return false;
    }
  });

  /**
   * Check if form is ready for submission
   */
  readonly canSubmit = computed(() => {
    return this.isCurrentStepValid() && !this.loading();
  });

  /**
   * Motivational message based on completion
   */
  readonly motivationalMessage = computed(() => {
    const percentage = this.completionPercentage();

    if (percentage === 100) {
      return '✨ Perfect! Your profile is complete!';
    } else if (percentage >= 75) {
      return '🎯 Almost there! Looking great!';
    } else if (percentage >= 50) {
      return '💪 Halfway done! Keep going!';
    } else if (percentage >= 25) {
      return '🌟 Great start! Add more details!';
    } else {
      return '🚀 Let\'s build something amazing!';
    }
  });

  // =============================================================================
  // AUTO-SAVE EFFECT
  // =============================================================================

  constructor() {
    // Auto-save draft to localStorage when formData changes
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    effect(() => {
      const data = this.formData();

      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for debounced save
      timeoutId = setTimeout(() => {
        this.saveDraft(data);
      }, this.AUTO_SAVE_DELAY);
    });

    // Load draft on initialization
    this.loadDraft();
  }

  // =============================================================================
  // NAVIGATION METHODS
  // =============================================================================

  /**
   * Go to next step
   */
  nextStep(): void {
    if (this.currentStep() < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep.update(step => step + 1);
    }
  }

  /**
   * Go to previous step
   */
  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  /**
   * Jump to specific step
   */
  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  // =============================================================================
  // FORM DATA METHODS
  // =============================================================================

  /**
   * Update form data
   */
  updateFormData(updates: Partial<EmployeeCreateDraft>): void {
    this.formData.update(current => ({
      ...current,
      ...updates
    }));
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.formData.set({});
    this.currentStep.set(1);
    this.error.set(null);
    this.success.set(false);
    this.createdEmployeeId.set(null);
    this.clearDraft();
  }

  // =============================================================================
  // DRAFT PERSISTENCE
  // =============================================================================

  /**
   * Save draft to localStorage
   */
  private saveDraft(data: EmployeeCreateDraft): void {
    try {
      localStorage.setItem(this.DRAFT_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }

  /**
   * Load draft from localStorage
   */
  private loadDraft(): void {
    try {
      const savedDraft = localStorage.getItem(this.DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft) as EmployeeCreateDraft;
        this.formData.set(draft);
      }
    } catch (error) {
      console.warn('Failed to load draft:', error);
    }
  }

  /**
   * Check if draft exists
   */
  hasDraft(): boolean {
    return !!localStorage.getItem(this.DRAFT_STORAGE_KEY);
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft(): void {
    try {
      localStorage.removeItem(this.DRAFT_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear draft:', error);
    }
  }

  // =============================================================================
  // VALIDATION HELPERS
  // =============================================================================

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // =============================================================================
  // API SUBMISSION
  // =============================================================================

  /**
   * Create employee via API
   * Returns Observable for component subscription
   */
  createEmployee(): Observable<EmployeeCreateResponse> {
    const data = this.formData() as EmployeeCreate;

    // Validate required fields
    if (!data.fullName || !data.email) {
      this.error.set('Full name and email are required');
      return throwError(() => new Error('Full name and email are required'));
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.post<EmployeeCreateResponse>(this.API_URL, data).pipe(
      tap(response => {
        this.loading.set(false);
        this.success.set(true);
        this.createdEmployeeId.set(response.id);
        this.clearDraft(); // Clear draft on successful creation
      }),
      catchError((error: HttpErrorResponse) => {
        this.loading.set(false);
        this.success.set(false);

        // Handle different error statuses
        let errorMessage = 'Failed to create employee';

        if (error.status === 400) {
          errorMessage = 'Validation error: Please check your input';
        } else if (error.status === 404) {
          errorMessage = 'Invalid reference: Technology, skill, or certification not found';
        } else if (error.status === 409) {
          errorMessage = 'Email already exists: This email is already in use';
        } else if (error.status === 500) {
          errorMessage = 'Server error: Please try again later';
        }

        this.error.set(errorMessage);
        return throwError(() => error);
      })
    );
  }
}

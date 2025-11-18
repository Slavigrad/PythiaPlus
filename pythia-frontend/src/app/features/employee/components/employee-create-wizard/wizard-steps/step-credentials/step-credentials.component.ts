import { Component, ChangeDetectionStrategy, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeCreateService } from '../../../../services/employee-create.service';
import {
  EmployeeCreateEducation,
  EmployeeCreateCertification
} from '../../../../../../models/employee-create.model';

/**
 * Step 5: The Credentials
 *
 * Education timeline and certification badges
 *
 * Features:
 * - Education entries with degree and institution
 * - Certification cards with issue/expiry dates
 * - Current education toggle (ongoing degrees)
 * - Beautiful achievement badges
 * - Timeline visualization
 */
@Component({
  selector: 'app-step-credentials',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './step-credentials.component.html',
  styleUrl: './step-credentials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepCredentialsComponent implements OnInit {
  private readonly createService = inject(EmployeeCreateService);

  // State signals
  protected readonly educations = signal<EmployeeCreateEducation[]>([]);
  protected readonly certifications = signal<EmployeeCreateCertification[]>([]);
  protected readonly isAddingEducation = signal(false);
  protected readonly isAddingCertification = signal(false);
  protected readonly editingEducationIndex = signal<number | null>(null);
  protected readonly editingCertificationIndex = signal<number | null>(null);

  // Education form
  protected readonly educationForm = new FormGroup({
    institution: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    degree: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    fieldOfStudy: new FormControl('', { nonNullable: true }),
    startDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    endDate: new FormControl<Date | null>(null),
    isCurrent: new FormControl(false, { nonNullable: true })
  });

  // Certification form
  protected readonly certificationForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    issuingOrganization: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    issueDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    expiryDate: new FormControl<Date | null>(null),
    credentialId: new FormControl('', { nonNullable: true }),
    credentialUrl: new FormControl('', { nonNullable: true })
  });

  // Computed - check if currently editing
  protected readonly isEditingEducation = computed(() => this.editingEducationIndex() !== null);
  protected readonly isEditingCertification = computed(() => this.editingCertificationIndex() !== null);

  // Watch "isCurrent" checkbox to disable/enable endDate
  protected readonly Math = Math;

  ngOnInit(): void {
    // Load existing data from service
    const draft = this.createService.formData();
    if (draft.educations) {
      this.educations.set(draft.educations);
    }
    if (draft.certifications) {
      this.certifications.set(draft.certifications);
    }

    // Watch isCurrent checkbox for education
    this.educationForm.controls.isCurrent.valueChanges.subscribe((isCurrent) => {
      if (isCurrent) {
        this.educationForm.controls.endDate.setValue(null);
        this.educationForm.controls.endDate.disable();
      } else {
        this.educationForm.controls.endDate.enable();
      }
    });
  }

  // =============================================================================
  // EDUCATION METHODS
  // =============================================================================

  /**
   * Start adding a new education entry
   */
  protected onAddEducation(): void {
    this.educationForm.reset();
    this.educationForm.controls.isCurrent.setValue(false);
    this.isAddingEducation.set(true);
    this.editingEducationIndex.set(null);
  }

  /**
   * Edit an existing education entry
   */
  protected onEditEducation(index: number): void {
    const education = this.educations()[index];
    this.educationForm.patchValue({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || '',
      startDate: education.startDate ? new Date(education.startDate) : null,
      endDate: education.endDate ? new Date(education.endDate) : null,
      isCurrent: !education.endDate
    });
    this.isAddingEducation.set(true);
    this.editingEducationIndex.set(index);
  }

  /**
   * Remove an education entry
   */
  protected onRemoveEducation(index: number): void {
    const updatedEducations = this.educations().filter((_, i) => i !== index);
    this.educations.set(updatedEducations);
    this.saveEducationsToService();
  }

  /**
   * Save education form
   */
  protected onSaveEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const formValue = this.educationForm.getRawValue();
    const education: EmployeeCreateEducation = {
      institution: formValue.institution,
      degree: formValue.degree,
      fieldOfStudy: formValue.fieldOfStudy || undefined,
      startDate: this.formatDateToYYYYMMDD(formValue.startDate),
      endDate: formValue.isCurrent ? undefined : this.formatDateToYYYYMMDD(formValue.endDate)
    };

    const editIndex = this.editingEducationIndex();
    if (editIndex !== null) {
      // Update existing
      const updated = [...this.educations()];
      updated[editIndex] = education;
      this.educations.set(updated);
    } else {
      // Add new
      this.educations.set([...this.educations(), education]);
    }

    this.saveEducationsToService();
    this.onCancelEducation();
  }

  /**
   * Cancel education form
   */
  protected onCancelEducation(): void {
    this.educationForm.reset();
    this.isAddingEducation.set(false);
    this.editingEducationIndex.set(null);
  }

  /**
   * Save educations to service
   */
  private saveEducationsToService(): void {
    this.createService.updateFormData({ educations: this.educations() });
  }

  // =============================================================================
  // CERTIFICATION METHODS
  // =============================================================================

  /**
   * Start adding a new certification
   */
  protected onAddCertification(): void {
    this.certificationForm.reset();
    this.isAddingCertification.set(true);
    this.editingCertificationIndex.set(null);
  }

  /**
   * Edit an existing certification
   */
  protected onEditCertification(index: number): void {
    const cert = this.certifications()[index];
    this.certificationForm.patchValue({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    });
    this.isAddingCertification.set(true);
    this.editingCertificationIndex.set(index);
  }

  /**
   * Remove a certification
   */
  protected onRemoveCertification(index: number): void {
    const updated = this.certifications().filter((_, i) => i !== index);
    this.certifications.set(updated);
    this.saveCertificationsToService();
  }

  /**
   * Save certification form
   */
  protected onSaveCertification(): void {
    if (this.certificationForm.invalid) {
      this.certificationForm.markAllAsTouched();
      return;
    }

    const formValue = this.certificationForm.getRawValue();
    const certification: EmployeeCreateCertification = {
      name: formValue.name,
      issuingOrganization: formValue.issuingOrganization,
      issueDate: this.formatDateToYYYYMMDD(formValue.issueDate),
      expiryDate: formValue.expiryDate ? this.formatDateToYYYYMMDD(formValue.expiryDate) : undefined,
      credentialId: formValue.credentialId || undefined,
      credentialUrl: formValue.credentialUrl || undefined
    };

    const editIndex = this.editingCertificationIndex();
    if (editIndex !== null) {
      // Update existing
      const updated = [...this.certifications()];
      updated[editIndex] = certification;
      this.certifications.set(updated);
    } else {
      // Add new
      this.certifications.set([...this.certifications(), certification]);
    }

    this.saveCertificationsToService();
    this.onCancelCertification();
  }

  /**
   * Cancel certification form
   */
  protected onCancelCertification(): void {
    this.certificationForm.reset();
    this.isAddingCertification.set(false);
    this.editingCertificationIndex.set(null);
  }

  /**
   * Save certifications to service
   */
  private saveCertificationsToService(): void {
    this.createService.updateFormData({ certifications: this.certifications() });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Format date to YYYY-MM-DD for backend
   */
  private formatDateToYYYYMMDD(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format date for display (MMM YYYY)
   */
  protected formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Calculate duration between two dates
   */
  protected calculateDuration(startDate: string, endDate: string | undefined): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    let totalMonths = years * 12 + months;
    if (totalMonths < 0) totalMonths = 0;

    const durationYears = Math.floor(totalMonths / 12);
    const durationMonths = totalMonths % 12;

    if (durationYears === 0) {
      return `${durationMonths} month${durationMonths !== 1 ? 's' : ''}`;
    } else if (durationMonths === 0) {
      return `${durationYears} year${durationYears !== 1 ? 's' : ''}`;
    } else {
      return `${durationYears} year${durationYears !== 1 ? 's' : ''}, ${durationMonths} month${durationMonths !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Check if certification is expired
   */
  protected isCertificationExpired(expiryDate: string | undefined): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  /**
   * Check if certification expires soon (within 3 months)
   */
  protected isCertificationExpiringSoon(expiryDate: string | undefined): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry > new Date() && expiry <= threeMonthsFromNow;
  }

  /**
   * Get degree icon based on degree name
   */
  protected getDegreeIcon(degree: string): string {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctor')) return 'school';
    if (lowerDegree.includes('master')) return 'workspace_premium';
    if (lowerDegree.includes('bachelor')) return 'military_tech';
    if (lowerDegree.includes('associate')) return 'card_membership';
    return 'school';
  }

  /**
   * Get degree color based on degree name
   */
  protected getDegreeColor(degree: string): string {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctor')) return '#8b5cf6'; // Purple
    if (lowerDegree.includes('master')) return '#3b82f6'; // Blue
    if (lowerDegree.includes('bachelor')) return '#10b981'; // Green
    if (lowerDegree.includes('associate')) return '#f59e0b'; // Amber
    return '#6366f1'; // Indigo
  }
}

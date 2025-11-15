import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, EmployeeUpdateRequest } from '../../../../models';
import { SectionEditWrapperComponent } from '../../components/shared/section-edit-wrapper/section-edit-wrapper.component';
import { BasicInfoEditComponent } from '../../components/edit-sections/basic-info-edit/basic-info-edit.component';
import { TechnologiesEditComponent } from '../../components/edit-sections/technologies-edit/technologies-edit.component';
import { SkillsEditComponent } from '../../components/edit-sections/skills-edit/skills-edit.component';
import { CertificationsEditComponent } from '../../components/edit-sections/certifications-edit/certifications-edit.component';
import { LanguagesEditComponent } from '../../components/edit-sections/languages-edit/languages-edit.component';
import { WorkExperienceEditComponent } from '../../components/edit-sections/work-experience-edit/work-experience-edit.component';
import { EducationEditComponent } from '../../components/edit-sections/education-edit/education-edit.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/shared/confirm-dialog/confirm-dialog.component';

/**
 * Employee Profile Page
 *
 * Displays comprehensive employee information with Swiss UX/UI design
 * Features: Visual timeline, proficiency bars, status indicators, responsive layout, Material Icons
 */
@Component({
  selector: 'app-employee-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    SectionEditWrapperComponent,
    BasicInfoEditComponent,
    TechnologiesEditComponent,
    SkillsEditComponent,
    CertificationsEditComponent,
    LanguagesEditComponent,
    WorkExperienceEditComponent,
    EducationEditComponent
  ],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  readonly employeeService = inject(EmployeeService);

  // ViewChild references
  readonly basicInfoEdit = viewChild<BasicInfoEditComponent>('basicInfoEdit');
  readonly technologiesEdit = viewChild<TechnologiesEditComponent>('technologiesEdit');
  readonly skillsEdit = viewChild<SkillsEditComponent>('skillsEdit');
  readonly certificationsEdit = viewChild<CertificationsEditComponent>('certificationsEdit');
  readonly languagesEdit = viewChild<LanguagesEditComponent>('languagesEdit');
  readonly workExperienceEdit = viewChild<WorkExperienceEditComponent>('workExperienceEdit');
  readonly educationEdit = viewChild<EducationEditComponent>('educationEdit');

  // Computed signals from service
  readonly employee = this.employeeService.employee;
  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;

  // Edit mode signals
  readonly editingBasicInfo = signal(false);
  readonly editingTechnologies = signal(false);
  readonly editingSkills = signal(false);
  readonly editingCertifications = signal(false);
  readonly editingLanguages = signal(false);
  readonly editingWorkExperience = signal(false);
  readonly editingEducation = signal(false);
  readonly updateLoading = this.employeeService.updateLoading;

  // Computed values
  readonly topTechnologies = computed(() =>
    this.employee()?.technologies
      .sort((a, b) => b.years - a.years)
      .slice(0, 8) ?? []
  );

  readonly activeCertifications = computed(() =>
    this.employee()?.certifications
      .filter(cert => !this.isExpired(cert.expiresOn)) ?? []
  );

  readonly sortedWorkExperiences = computed(() =>
    this.employee()?.workExperiences
      .sort((a, b) => {
        const dateA = b.endDate ? new Date(b.endDate) : new Date();
        const dateB = a.endDate ? new Date(a.endDate) : new Date();
        return dateA.getTime() - dateB.getTime();
      }) ?? []
  );

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employeeService.getEmployeeById(Number(employeeId));
    }
  }

  ngOnDestroy(): void {
    this.employeeService.clearEmployee();
  }

  /**
   * Export employee CV
   */
  protected exportCV(): void {
    // TODO: Implement CV export functionality
    console.log('Export CV for:', this.employee()?.fullName);
  }

  /**
   * Navigate back to previous page
   * Uses browser history to preserve search state and query params
   */
  protected goBack(): void {
    this.location.back();
  }

  /**
   * Get technology category color class
   */
  protected getTechCategoryClass(techName: string): string {
    const backend = ['Kotlin', 'Java', 'Spring', 'Spring Boot', 'Node.js', 'Python', 'Django'];
    const frontend = ['React', 'Angular', 'Vue', 'TypeScript', 'JavaScript'];
    const database = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'];
    const cloud = ['AWS', 'Azure', 'GCP'];
    const devops = ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD'];

    if (backend.includes(techName)) return 'tech-backend';
    if (frontend.includes(techName)) return 'tech-frontend';
    if (database.includes(techName)) return 'tech-database';
    if (cloud.includes(techName)) return 'tech-cloud';
    if (devops.includes(techName)) return 'tech-devops';
    return 'tech-default';
  }

  /**
   * Get proficiency percentage for visual bar
   */
  protected getProficiencyPercentage(years: number): number {
    // Map years to percentage (max 10 years = 100%)
    return Math.min((years / 10) * 100, 100);
  }

  /**
   * Get skill proficiency class
   */
  protected getSkillProficiencyClass(proficiency: string): string {
    return `skill-${proficiency.toLowerCase()}`;
  }

  /**
   * Calculate duration between dates
   */
  protected calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = this.getMonthDifference(start, end);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years}y ${remainingMonths}m`;
    }
  }

  /**
   * Get month difference between two dates
   */
  private getMonthDifference(start: Date, end: Date): number {
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }

  /**
   * Check if certification is expired
   */
  protected isExpired(expiryDate: string | null): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  /**
   * Check if certification is expiring soon (within 6 months)
   */
  protected isExpiringSoon(expiryDate: string | null): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiry <= sixMonthsFromNow && expiry >= new Date();
  }

  /**
   * Get certification status class
   */
  protected getCertStatusClass(expiryDate: string | null): string {
    if (!expiryDate) return 'cert-no-expiry';
    if (this.isExpired(expiryDate)) return 'cert-expired';
    if (this.isExpiringSoon(expiryDate)) return 'cert-expiring';
    return 'cert-active';
  }

  /**
   * Get certification status label
   */
  protected getCertStatusLabel(expiryDate: string | null): string {
    if (!expiryDate) return 'NO EXPIRY';
    if (this.isExpired(expiryDate)) return 'EXPIRED';
    if (this.isExpiringSoon(expiryDate)) return 'EXPIRING SOON';
    return 'ACTIVE';
  }

  /**
   * Get months until expiry
   */
  protected getMonthsUntilExpiry(expiryDate: string | null): number {
    if (!expiryDate) return Infinity;
    return this.getMonthDifference(new Date(), new Date(expiryDate));
  }

  /**
   * Get language proficiency percentage for bar
   */
  protected getLanguageProficiency(proficiency: string): number {
    const levels: Record<string, number> = {
      'native': 100,
      'fluent': 90,
      'advanced': 75,
      'intermediate': 50,
      'beginner': 25
    };
    return levels[proficiency.toLowerCase()] || 50;
  }

  /**
   * Get language proficiency description
   */
  protected getLanguageDescription(proficiency: string): string {
    const descriptions: Record<string, string> = {
      'native': 'Native proficiency',
      'fluent': 'Full professional proficiency',
      'advanced': 'Professional working proficiency',
      'intermediate': 'Limited working proficiency',
      'beginner': 'Elementary proficiency'
    };
    return descriptions[proficiency.toLowerCase()] || 'Unknown proficiency';
  }

  /**
   * Get availability status class
   */
  protected getAvailabilityClass(availability: string): string {
    return `status-${availability.toLowerCase().replace('_', '-')}`;
  }

  /**
   * Get availability status label
   */
  protected getAvailabilityLabel(availability: string): string {
    const labels: Record<string, string> = {
      'available': 'Available',
      'busy': 'Busy',
      'unavailable': 'Unavailable',
      'notice_period': 'Notice Period'
    };
    return labels[availability.toLowerCase()] || availability;
  }

  /**
   * Get availability status icon (Material Icon name)
   */
  protected getAvailabilityIcon(availability: string): string {
    const icons: Record<string, string> = {
      'available': 'check_circle',
      'busy': 'work_outline',
      'unavailable': 'cancel',
      'notice_period': 'schedule'
    };
    return icons[availability.toLowerCase()] || 'work_outline';
  }

  /**
   * Enable edit mode for basic info section
   */
  protected editBasicInfo(): void {
    this.editingBasicInfo.set(true);
  }

  /**
   * Save basic info changes
   */
  protected saveBasicInfo(): void {
    const basicInfoComponent = this.basicInfoEdit();
    if (!basicInfoComponent || !basicInfoComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = basicInfoComponent.getFormData();

    this.employeeService.updateEmployee(employeeId, formData)
      .subscribe({
        next: () => {
          this.editingBasicInfo.set(false);
          this.showSuccess('Basic information updated successfully');
        },
        error: (error) => {
          this.showError(error.message || 'Failed to update basic information');
        }
      });
  }

  /**
   * Cancel basic info editing
   */
  protected cancelBasicInfo(): void {
    const basicInfoComponent = this.basicInfoEdit();
    if (basicInfoComponent) {
      basicInfoComponent.reset();
    }
    this.editingBasicInfo.set(false);
  }

  /**
   * Enable edit mode for technologies section
   */
  protected editTechnologies(): void {
    this.editingTechnologies.set(true);
  }

  /**
   * Save technologies changes
   */
  protected saveTechnologies(): void {
    const technologiesComponent = this.technologiesEdit();
    if (!technologiesComponent || !technologiesComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = technologiesComponent.getFormData();

    // IMPORTANT: Send complete array to backend (DELETE ALL + INSERT)
    this.employeeService.updateEmployee(employeeId, {
      technologies: formData
    }).subscribe({
      next: () => {
        this.editingTechnologies.set(false);
        this.showSuccess('Technologies updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update technologies');
      }
    });
  }

  /**
   * Cancel technologies editing
   */
  protected cancelTechnologies(): void {
    const technologiesComponent = this.technologiesEdit();
    if (technologiesComponent) {
      technologiesComponent.reset();
    }
    this.editingTechnologies.set(false);
  }

  /**
   * Enable edit mode for skills section
   */
  protected editSkills(): void {
    this.editingSkills.set(true);
  }

  /**
   * Save skills changes
   */
  protected saveSkills(): void {
    const skillsComponent = this.skillsEdit();
    if (!skillsComponent || !skillsComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = skillsComponent.getFormData();

    // IMPORTANT: Send complete array to backend (DELETE ALL + INSERT)
    this.employeeService.updateEmployee(employeeId, {
      skills: formData
    }).subscribe({
      next: () => {
        this.editingSkills.set(false);
        this.showSuccess('Skills updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update skills');
      }
    });
  }

  /**
   * Cancel skills editing
   */
  protected cancelSkills(): void {
    const skillsComponent = this.skillsEdit();
    if (skillsComponent) {
      skillsComponent.reset();
    }
    this.editingSkills.set(false);
  }

  /**
   * Enable edit mode for certifications section
   */
  protected editCertifications(): void {
    this.editingCertifications.set(true);
  }

  /**
   * Save certifications changes
   */
  protected saveCertifications(): void {
    const certificationsComponent = this.certificationsEdit();
    if (!certificationsComponent || !certificationsComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = certificationsComponent.getFormData();

    this.employeeService.updateEmployee(employeeId, {
      certifications: formData
    }).subscribe({
      next: () => {
        this.editingCertifications.set(false);
        this.showSuccess('Certifications updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update certifications');
      }
    });
  }

  /**
   * Cancel certifications editing
   */
  protected cancelCertifications(): void {
    const certificationsComponent = this.certificationsEdit();
    if (certificationsComponent) {
      certificationsComponent.reset();
    }
    this.editingCertifications.set(false);
  }

  /**
   * Enable edit mode for languages section
   */
  protected editLanguages(): void {
    this.editingLanguages.set(true);
  }

  /**
   * Save languages changes
   */
  protected saveLanguages(): void {
    const languagesComponent = this.languagesEdit();
    if (!languagesComponent || !languagesComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = languagesComponent.getFormData();

    this.employeeService.updateEmployee(employeeId, {
      languages: formData
    }).subscribe({
      next: () => {
        this.editingLanguages.set(false);
        this.showSuccess('Languages updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update languages');
      }
    });
  }

  /**
   * Cancel languages editing
   */
  protected cancelLanguages(): void {
    const languagesComponent = this.languagesEdit();
    if (languagesComponent) {
      languagesComponent.reset();
    }
    this.editingLanguages.set(false);
  }

  /**
   * Enable edit mode for work experience section
   */
  protected editWorkExperience(): void {
    this.editingWorkExperience.set(true);
  }

  /**
   * Save work experience changes
   */
  protected saveWorkExperience(): void {
    const workExperienceComponent = this.workExperienceEdit();
    if (!workExperienceComponent || !workExperienceComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = workExperienceComponent.getFormData();

    this.employeeService.updateEmployee(employeeId, {
      workExperiences: formData
    }).subscribe({
      next: () => {
        this.editingWorkExperience.set(false);
        this.showSuccess('Work experience updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update work experience');
      }
    });
  }

  /**
   * Cancel work experience editing
   */
  protected cancelWorkExperience(): void {
    const workExperienceComponent = this.workExperienceEdit();
    if (workExperienceComponent) {
      workExperienceComponent.reset();
    }
    this.editingWorkExperience.set(false);
  }

  /**
   * Enable edit mode for education section
   */
  protected editEducation(): void {
    this.editingEducation.set(true);
  }

  /**
   * Save education changes
   */
  protected saveEducation(): void {
    const educationComponent = this.educationEdit();
    if (!educationComponent || !educationComponent.isValid()) {
      this.showError('Please correct the form errors before saving');
      return;
    }

    const employeeId = this.employee()?.id;
    if (!employeeId) {
      this.showError('Employee ID not found');
      return;
    }

    const formData = educationComponent.getFormData();

    this.employeeService.updateEmployee(employeeId, {
      educations: formData
    }).subscribe({
      next: () => {
        this.editingEducation.set(false);
        this.showSuccess('Education updated successfully');
      },
      error: (error) => {
        this.showError(error.message || 'Failed to update education');
      }
    });
  }

  /**
   * Cancel education editing
   */
  protected cancelEducation(): void {
    const educationComponent = this.educationEdit();
    if (educationComponent) {
      educationComponent.reset();
    }
    this.editingEducation.set(false);
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.notificationService.success(message);
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.notificationService.error(message);
  }

  /**
   * Show confirmation dialog for destructive actions
   */
  protected confirmAction(data: ConfirmDialogData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '400px',
      disableClose: false
    });

    return dialogRef.afterClosed().toPromise().then(result => result === true);
  }
}

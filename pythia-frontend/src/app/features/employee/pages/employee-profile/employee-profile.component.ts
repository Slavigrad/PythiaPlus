import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, EmployeeUpdateRequest } from '../../../../models';
import { ProfileSectionEditDialogComponent, ProfileSectionEditDialogData } from '../../components/shared/profile-section-edit-dialog/profile-section-edit-dialog';
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
    MatDialogModule
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

  // Computed signals from service
  readonly employee = this.employeeService.employee;
  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;
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
   * Generic method to open edit dialog for any profile section
   */
  private openEditDialog(config: {
    title: string;
    icon: string;
    componentType: any;
    updateField: (formData: any) => any;
    successMessage: string;
  }): void {
    const emp = this.employee();
    if (!emp) {
      this.showError('Employee data not loaded');
      return;
    }

    const dialogData: ProfileSectionEditDialogData = {
      title: config.title,
      icon: config.icon,
      employee: emp,
      componentType: config.componentType
    };

    const dialogRef = this.dialog.open(ProfileSectionEditDialogComponent, {
      data: dialogData,
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        // User clicked save - update employee
        const employeeId = emp.id;
        const updateData = config.updateField(result);

        this.employeeService.updateEmployee(employeeId, updateData)
          .subscribe({
            next: () => {
              this.showSuccess(config.successMessage);
            },
            error: (error) => {
              this.showError(error.message || `Failed to update ${config.title.toLowerCase()}`);
            }
          });
      }
    });
  }

  /**
   * Open edit dialog for basic info section
   */
  protected editBasicInfo(): void {
    this.openEditDialog({
      title: 'Basic Information',
      icon: 'person',
      componentType: BasicInfoEditComponent,
      updateField: (formData) => formData, // Basic info uses all fields from form
      successMessage: 'Basic information updated successfully'
    });
  }

  /**
   * Open edit dialog for technologies section
   */
  protected editTechnologies(): void {
    this.openEditDialog({
      title: 'Technologies',
      icon: 'code',
      componentType: TechnologiesEditComponent,
      updateField: (formData) => ({ technologies: formData }),
      successMessage: 'Technologies updated successfully'
    });
  }

  /**
   * Open edit dialog for skills section
   */
  protected editSkills(): void {
    this.openEditDialog({
      title: 'Skills',
      icon: 'build',
      componentType: SkillsEditComponent,
      updateField: (formData) => ({ skills: formData }),
      successMessage: 'Skills updated successfully'
    });
  }

  /**
   * Open edit dialog for certifications section
   */
  protected editCertifications(): void {
    this.openEditDialog({
      title: 'Certifications',
      icon: 'workspace_premium',
      componentType: CertificationsEditComponent,
      updateField: (formData) => ({ certifications: formData }),
      successMessage: 'Certifications updated successfully'
    });
  }

  /**
   * Open edit dialog for languages section
   */
  protected editLanguages(): void {
    this.openEditDialog({
      title: 'Languages',
      icon: 'language',
      componentType: LanguagesEditComponent,
      updateField: (formData) => ({ languages: formData }),
      successMessage: 'Languages updated successfully'
    });
  }

  /**
   * Open edit dialog for work experience section
   */
  protected editWorkExperience(): void {
    this.openEditDialog({
      title: 'Project History',
      icon: 'business_center',
      componentType: WorkExperienceEditComponent,
      updateField: (formData) => ({ workExperiences: formData }),
      successMessage: 'Project history updated successfully'
    });
  }

  /**
   * Open edit dialog for education section
   */
  protected editEducation(): void {
    this.openEditDialog({
      title: 'Education',
      icon: 'school',
      componentType: EducationEditComponent,
      updateField: (formData) => ({ educations: formData }),
      successMessage: 'Education updated successfully'
    });
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

  /**
   * Get initials from full name
   */
  protected getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Get a consistent color for initials based on name
   * Returns a color from a predefined palette
   */
  protected getInitialsColor(fullName: string): string {
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

    // Generate a consistent hash from the name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use absolute value and modulo to get consistent index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  /**
   * Handle image load error - will show initials instead
   */
  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

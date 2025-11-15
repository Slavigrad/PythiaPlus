import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeUpdateRequest } from '../../../../models';
import { SectionEditWrapperComponent } from '../../components/shared/section-edit-wrapper/section-edit-wrapper.component';
import { BasicInfoEditComponent } from '../../components/edit-sections/basic-info-edit/basic-info-edit.component';

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
    MatSnackBarModule,
    SectionEditWrapperComponent,
    BasicInfoEditComponent
  ],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly snackBar = inject(MatSnackBar);
  readonly employeeService = inject(EmployeeService);

  // ViewChild references
  readonly basicInfoEdit = viewChild<BasicInfoEditComponent>('basicInfoEdit');

  // Computed signals from service
  readonly employee = this.employeeService.employee;
  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;

  // Edit mode signals
  readonly editingBasicInfo = signal(false);
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
   * Show success message
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}

import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeeCreateService } from '../../../../services/employee-create.service';

/**
 * Step 6: The Oracle Speaks
 *
 * Final preview and submission step
 *
 * Features:
 * - Beautiful profile card with all data
 * - Section summaries with edit buttons
 * - Completion indicators
 * - Final validation
 * - Success state
 *
 * "Behold the talent you've summoned"
 */
@Component({
  selector: 'app-step-oracle',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './step-oracle.component.html',
  styleUrl: './step-oracle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepOracleComponent {
  private readonly createService = inject(EmployeeCreateService);

  // Expose service data
  protected readonly formData = this.createService.formData;
  protected readonly completionPercentage = this.createService.completionPercentage;

  // Computed - section completion
  protected readonly essenceComplete = computed(() => {
    const data = this.formData();
    return !!(data.fullName && data.email);
  });

  protected readonly foundationComplete = computed(() => {
    const data = this.formData();
    return !!(data.department || data.seniority || data.location);
  });

  protected readonly arsenalComplete = computed(() => {
    const data = this.formData();
    return ((data.technologies?.length ?? 0) + (data.skills?.length ?? 0)) > 0;
  });

  protected readonly journeyComplete = computed(() => {
    const data = this.formData();
    return (data.workExperiences?.length ?? 0) > 0;
  });

  protected readonly credentialsComplete = computed(() => {
    const data = this.formData();
    return ((data.educations?.length ?? 0) + (data.certifications?.length ?? 0)) > 0;
  });

  // Computed - statistics
  protected readonly totalTechnologies = computed(() => this.formData().technologies?.length ?? 0);
  protected readonly totalSkills = computed(() => this.formData().skills?.length ?? 0);
  protected readonly totalExperiences = computed(() => this.formData().workExperiences?.length ?? 0);
  protected readonly totalEducations = computed(() => this.formData().educations?.length ?? 0);
  protected readonly totalCertifications = computed(() => this.formData().certifications?.length ?? 0);

  // Computed - total years of experience
  protected readonly totalYearsExperience = computed(() => {
    const experiences = this.formData().workExperiences ?? [];
    if (experiences.length === 0) return 0;

    let totalMonths = 0;
    for (const exp of experiences) {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = end.getFullYear() - start.getFullYear();
      const months = end.getMonth() - start.getMonth();
      totalMonths += years * 12 + months;
    }

    return Math.floor(totalMonths / 12);
  });

  // Computed - initials and color (same as Step 1)
  protected readonly initials = computed(() => {
    const name = this.formData().fullName || '';
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  protected readonly initialsColor = computed(() => {
    const name = this.formData().fullName || '';
    const colors = [
      '#10b981', // emerald
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ef4444', // red
      '#f59e0b', // amber
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316'  // orange
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  });

  /**
   * Navigate to a specific step for editing
   */
  protected goToStep(step: number): void {
    this.createService.goToStep(step);
  }

  /**
   * Format date for display (MMM YYYY)
   */
  protected formatDateDisplay(dateString: string | undefined): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Get seniority display name
   */
  protected getSeniorityDisplay(seniority: string | undefined): string {
    if (!seniority) return 'Not specified';
    return seniority;
  }

  /**
   * Get availability display name
   */
  protected getAvailabilityDisplay(availability: string | undefined): string {
    if (!availability) return 'Not specified';
    return availability.replace(/_/g, ' ');
  }

  /**
   * Get proficiency color
   */
  protected getProficiencyColor(proficiency: string): string {
    const map: Record<string, string> = {
      'Beginner': '#94a3b8',
      'Intermediate': '#3b82f6',
      'Advanced': '#10b981',
      'Expert': '#8b5cf6'
    };
    return map[proficiency] || '#6366f1';
  }

  /**
   * Get degree icon
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
   * Get degree color
   */
  protected getDegreeColor(degree: string): string {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctor')) return '#8b5cf6'; // Purple
    if (lowerDegree.includes('master')) return '#3b82f6'; // Blue
    if (lowerDegree.includes('bachelor')) return '#10b981'; // Green
    if (lowerDegree.includes('associate')) return '#f59e0b'; // Amber
    return '#6366f1'; // Indigo
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
   * Get certification status
   */
  protected getCertificationStatus(expiryDate: string | undefined): string {
    if (!expiryDate) return 'Active';
    if (this.isCertificationExpired(expiryDate)) return 'Expired';
    if (this.isCertificationExpiringSoon(expiryDate)) return 'Expiring Soon';
    return 'Active';
  }
}

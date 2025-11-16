import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComparisonService } from '../../services/comparison.service';
import {
  CandidateProfile,
  Certification,
  Technology,
  Training
} from '../../models/candidate-profile.model';

/**
 * Comparison Modal Component (v2)
 *
 * Purpose: Full-screen modal for side-by-side candidate comparison
 * Features: Inline table layout (no nested components), avatar header, role/location/experience,
 *           availability pills, technologies tags, trainings and certifications lists.
 */
@Component({
  selector: 'app-comparison-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './comparison-modal.component.html',
  styleUrl: './comparison-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonModalComponent {
  protected readonly comparisonService = inject(ComparisonService);
  private readonly dialogRef = inject(MatDialogRef<ComparisonModalComponent>);

  /**
   * Convenience computed for selected candidate profiles
   */
  protected readonly candidates = computed<CandidateProfile[]>(() =>
    this.comparisonService.candidates()
  );

  /**
   * Close the modal
   */
  protected close(): void {
    this.comparisonService.closeComparison();
    this.dialogRef.close();
  }

  /**
   * Remove a candidate from comparison
   */
  protected removeCand(candidateId: string): void {
    this.comparisonService.removeSelection(candidateId);

    // Close modal if less than 2 candidates remain
    if (this.comparisonService.selectionCount() < 2) {
      this.close();
    }
  }

  /**
   * Derive initials from full name (e.g. "Daniel Wilson" -> "DW")
   */
  protected initials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /**
   * Format experience as "X years • Level" (e.g. "6 years • Senior")
   */
  protected formatExperience(candidate: CandidateProfile): string {
    const experience = candidate.experienceDetails;
    if (!experience || typeof experience.totalYears !== 'number') {
      return '—';
    }

    const years = experience.totalYears;
    const base = years === 1 ? '1 year' : `${years} years`;

    return experience.level ? `${base} • ${experience.level}` : base;
  }

  /**
   * Format technology as "Name • X years"
   */
  protected formatTechnology(tech: Technology): string {
    const years = tech.yearsExperience;
    const suffix = years === 1 ? 'year' : 'years';
    return `${tech.name} - ${years} ${suffix}`;
  }

  /**
   * Format training with optional provider and year
   */
  protected formatTraining(training: Training): string {
    const parts: string[] = [training.name];

    if (training.provider) {
      parts.push(training.provider);
    }

    if (typeof training.completedYear === 'number') {
      parts.push(training.completedYear.toString());
    }

    if (parts.length === 1) {
      return parts[0];
    }

    const [first, ...rest] = parts;
    return `${first} (${rest.join(', ')})`;
  }

  /**
   * Format certification as "Name - Issuer - Year"
   */
  protected formatCertification(certification: Certification): string {
    const parts: string[] = [certification.name, certification.issuer];

    if (certification.issuedDate) {
      const year = new Date(certification.issuedDate).getFullYear();
      if (!Number.isNaN(year)) {
        parts.push(year.toString());
      }
    }

    return parts.filter(Boolean).join(' - ');
  }
}

import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CandidateProfile } from '../../models/candidate-profile.model';
import { ComparisonHeaderComponent } from '../comparison-header/comparison-header.component';
import { ComparisonRowComponent } from '../comparison-row/comparison-row.component';

/**
 * Comparison Table Component
 *
 * Purpose: Display side-by-side comparison table with candidate profiles
 * Features: Sticky header, scrollable rows, responsive layout, 8 attribute rows
 */
@Component({
  selector: 'app-comparison-table',
  imports: [ComparisonHeaderComponent, ComparisonRowComponent],
  templateUrl: './comparison-table.component.html',
  styleUrl: './comparison-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonTableComponent {
  readonly candidates = input.required<CandidateProfile[]>();
  readonly removeCandidate = output<string>();

  // Computed values for comparison rows
  // Note: Arrow functions cannot be used in templates, so we use computed signals
  protected readonly titles = computed(() =>
    this.candidates().map(c => c.title)
  );

  protected readonly locations = computed(() =>
    this.candidates().map(c => c.location)
  );

  protected readonly experiences = computed(() =>
    this.candidates().map(c => c.experience)
  );

  protected readonly availabilities = computed(() =>
    this.candidates().map(c => c.availability)
  );

  protected readonly technologies = computed(() =>
    this.candidates().map(c => c.technologies || [])
  );

  protected readonly skills = computed(() =>
    this.candidates().map(c => c.skills || [])
  );

  protected readonly certifications = computed(() =>
    this.candidates().map(c => c.certifications || [])
  );

  protected readonly currentProjects = computed(() =>
    this.candidates().map(c => c.currentProject?.name || '—')
  );

  /**
   * Handle remove candidate request
   */
  protected handleRemove(candidateId: string): void {
    this.removeCandidate.emit(candidateId);
  }
}

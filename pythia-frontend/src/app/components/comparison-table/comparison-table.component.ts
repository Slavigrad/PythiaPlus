import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
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

  /**
   * Handle remove candidate request
   */
  protected handleRemove(candidateId: string): void {
    this.removeCandidate.emit(candidateId);
  }
}

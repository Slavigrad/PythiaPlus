import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

/**
 * Candidate List Component
 *
 * Purpose: Display list of candidate search results
 * Features: Result count, @for loop with track, viewport-based @defer, responsive grid, clickable cards
 */
@Component({
  selector: 'app-candidate-list',
  imports: [CandidateCardComponent, SkeletonCardComponent],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent {
  readonly candidates = input.required<Candidate[]>();

  // Output event for when a candidate is selected
  readonly candidateSelected = output<string>();

  /**
   * Handle candidate card click
   * Bubbles up the candidate ID to parent component
   */
  protected handleCandidateSelected(candidateId: string): void {
    this.candidateSelected.emit(candidateId);
  }
}

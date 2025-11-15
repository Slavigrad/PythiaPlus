import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

/**
 * Candidate List Component
 *
 * Purpose: Display list of candidate search results with comparison support
 * Features: Result count, @for loop with track, viewport-based @defer, responsive grid, clickable cards, selection mode
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

  // Comparison feature inputs
  readonly selectable = input<boolean>(false);
  readonly selectedIds = input<Set<string>>(new Set());
  readonly maxSelectionsReached = input<boolean>(false);
  readonly selectionCount = input<number>(0);

  // Output event for when a candidate is selected (detail view)
  readonly candidateSelected = output<string>();

  // Output event for when a candidate selection is toggled (comparison)
  readonly selectionToggle = output<string>();

  /**
   * Handle candidate card click
   * Bubbles up the candidate ID to parent component
   */
  protected handleCandidateSelected(candidateId: string): void {
    this.candidateSelected.emit(candidateId);
  }

  /**
   * Handle selection toggle from candidate card
   * Bubbles up the candidate ID to parent component
   */
  protected handleSelectionToggle(candidateId: string): void {
    this.selectionToggle.emit(candidateId);
  }

  /**
   * Check if a candidate is selected
   */
  protected isSelected(candidateId: string): boolean {
    return this.selectedIds().has(candidateId);
  }
}

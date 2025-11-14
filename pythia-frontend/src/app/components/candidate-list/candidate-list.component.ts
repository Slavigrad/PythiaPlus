import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

/**
 * Candidate List Component
 *
 * Purpose: Display list of candidate search results
 * Features: Result count, @for loop with track, viewport-based @defer, responsive grid
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
}

import { Component, input } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';

/**
 * Candidate List Component
 *
 * Purpose: Display list of candidate search results
 * Features: Result count, @for loop with track, responsive grid
 */
@Component({
  selector: 'app-candidate-list',
  imports: [CandidateCardComponent],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.css'
})
export class CandidateListComponent {
  readonly candidates = input.required<Candidate[]>();
}

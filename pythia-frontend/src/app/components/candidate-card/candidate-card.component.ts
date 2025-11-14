import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import {
  AVATAR_COLORS,
  MATCH_COLORS,
  MATCH_PERCENTAGE_HIGH,
  MATCH_PERCENTAGE_MEDIUM
} from '../../core/constants';

/**
 * Candidate Card Component
 *
 * Purpose: Display individual candidate information
 * Features: Colored avatars, match score %, skill pills
 */
@Component({
  selector: 'app-candidate-card',
  imports: [],
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateCardComponent {
  // Signal input (Angular 20)
  readonly candidate = input.required<Candidate>();

  // Computed signals
  protected readonly initials = computed(() => {
    const name = this.candidate().name;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });

  protected readonly avatarColor = computed(() => {
    const id = this.candidate().id;
    const index = parseInt(id, 10) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  });

  protected readonly matchPercentage = computed(() => {
    return Math.round(this.candidate().matchScore.matched * 100);
  });

  protected readonly matchColor = computed(() => {
    const percentage = this.matchPercentage();
    if (percentage >= MATCH_PERCENTAGE_HIGH) return MATCH_COLORS.HIGH;
    if (percentage >= MATCH_PERCENTAGE_MEDIUM) return MATCH_COLORS.MEDIUM;
    return MATCH_COLORS.LOW;
  });

  protected readonly availabilityClass = computed(() => {
    const availability = this.candidate().availability;
    if (availability === 'Available') return 'available';
    if (availability === 'Notice Period') return 'notice-period';
    return 'not-available';
  });
}

import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
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
 * Features: Colored avatars, match score %, skill pills, clickable for details
 *
 * Future Enhancement: Clicking a card will open a detailed candidate modal with:
 * - Full profile information
 * - Complete skills and certifications list
 * - Project history
 * - Contact information
 * - Download resume option
 */
@Component({
  selector: 'app-candidate-card',
  imports: [],
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'handleCardClick()',
    '(keydown.enter)': 'handleCardClick()',
    '(keydown.space)': 'handleCardClick($event)',
    '[attr.tabindex]': '0',
    '[attr.role]': '"button"',
    '[attr.aria-label]': '"View details for " + candidate().name'
  }
})
export class CandidateCardComponent {
  // Signal input (Angular 20)
  readonly candidate = input.required<Candidate>();

  // Signal output for card selection (Angular 20)
  // Emits the candidate ID when the card is clicked
  readonly candidateSelected = output<string>();

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

  /**
   * Handles card click/keyboard interaction
   * Emits the candidate ID for parent component to handle
   *
   * Future Enhancement: This will trigger opening a detailed candidate modal
   * The modal will fetch additional candidate data from the backend API
   */
  protected handleCardClick(event?: Event): void {
    // Prevent default for space key to avoid page scroll
    if (event && event.type === 'keydown') {
      event.preventDefault();
    }

    // Emit candidate ID for parent component to handle
    this.candidateSelected.emit(this.candidate().id);

    // TODO: Future enhancement - Open candidate detail modal
    // The parent component should handle this event and:
    // 1. Fetch full candidate profile from API: GET /api/v1/candidates/{id}
    // 2. Open CandidateDetailModal component (to be created)
    // 3. Display comprehensive candidate information
  }
}

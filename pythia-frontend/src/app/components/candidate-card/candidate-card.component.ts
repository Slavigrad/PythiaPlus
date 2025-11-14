import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Candidate } from '../../models/candidate.model';

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
    const colors = ['#FF6B35', '#4ECDC4', '#556FB5', '#9B59B6'];
    const id = this.candidate().id;
    const index = parseInt(id, 10) % colors.length;
    return colors[index];
  });

  protected readonly matchPercentage = computed(() => {
    return Math.round(this.candidate().matchScore.matched * 100);
  });

  protected readonly matchColor = computed(() => {
    const percentage = this.matchPercentage();
    if (percentage >= 90) return '#4caf50'; // Green
    if (percentage >= 70) return '#ff9800'; // Orange
    return '#757575'; // Gray
  });

  protected readonly availabilityClass = computed(() => {
    const availability = this.candidate().availability;
    if (availability === 'Available') return 'available';
    if (availability === 'Notice Period') return 'notice-period';
    return 'not-available';
  });
}

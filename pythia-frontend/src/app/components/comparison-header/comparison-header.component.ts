import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CandidateProfile } from '../../models/candidate-profile.model';
import { AVATAR_COLORS } from '../../core/constants';

/**
 * Comparison Header Component
 *
 * Purpose: Display candidate avatar, name, and title in comparison table header
 * Features: Colored avatar with initials, candidate info, remove button
 */
@Component({
  selector: 'app-comparison-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './comparison-header.component.html',
  styleUrl: './comparison-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonHeaderComponent {
  readonly candidate = input.required<CandidateProfile>();
  readonly remove = output<string>();

  // Computed signals for avatar
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

  /**
   * Handle remove button click
   */
  protected handleRemove(): void {
    this.remove.emit(this.candidate().id);
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Card Component
 *
 * Loading placeholder that mimics ProjectCard structure.
 *
 * Features:
 * - Animated shimmer effect
 * - Matches ProjectCard layout
 * - Accessible loading state
 * - Smooth appearance
 *
 * Design:
 * - Clean skeleton shapes
 * - Subtle animation
 * - Pythia theme integration
 */
@Component({
  selector: 'app-skeleton-card',
  imports: [CommonModule],
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonCardComponent {
  // No logic needed - pure presentational component
}

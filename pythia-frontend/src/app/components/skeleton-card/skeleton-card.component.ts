import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Skeleton Card Component
 *
 * Purpose: Loading placeholder for candidate cards during @defer
 * Features: Animated skeleton UI matching CandidateCard layout
 */
@Component({
  selector: 'app-skeleton-card',
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonCardComponent {}

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader component for displaying loading states
 * Used during save operations to provide visual feedback
 *
 * @example
 * <app-skeleton-loader [count]="3" [height]="20" />
 */
@Component({
  selector: 'app-skeleton-loader',
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  /**
   * Number of skeleton lines to display
   */
  readonly count = input<number>(1);

  /**
   * Height of each skeleton line in pixels
   */
  readonly height = input<number>(16);

  /**
   * Width of the skeleton (can be percentage or pixels)
   */
  readonly width = input<string>('100%');

  /**
   * Border radius of the skeleton
   */
  readonly borderRadius = input<string>('4px');

  /**
   * Type of skeleton (line, circle, rectangle)
   */
  readonly type = input<'line' | 'circle' | 'rectangle'>('line');

  /**
   * Get array for *ngFor based on count
   */
  protected get items(): number[] {
    return Array(this.count()).fill(0);
  }
}

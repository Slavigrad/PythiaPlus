import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Summary Card Component
 *
 * Purpose: Display a summary statistic with icon, value, title, and optional trend
 * Used in: Dashboard summary section
 */
@Component({
  selector: 'app-summary-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryCardComponent {
  // Required inputs
  readonly title = input.required<string>();
  readonly value = input.required<number>();

  // Optional inputs
  readonly subtitle = input<string>('');
  readonly icon = input<string>('analytics');
  readonly trend = input<'up' | 'down' | 'neutral'>('neutral');
  readonly trendValue = input<string>('');
  readonly color = input<'primary' | 'accent' | 'success' | 'warning'>('primary');
}

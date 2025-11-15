import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * Comparison Row Component
 *
 * Purpose: Reusable row component for comparison table
 * Features: Multiple row types (text, badge, list), responsive layout, zebra striping
 *
 * Row Types:
 * - text: Simple text display
 * - badge: Colored badge for status (Availability)
 * - list: Bulleted list for arrays (Technologies, Skills, Certifications)
 */
@Component({
  selector: 'app-comparison-row',
  imports: [],
  templateUrl: './comparison-row.component.html',
  styleUrl: './comparison-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonRowComponent {
  readonly attribute = input.required<string>();
  readonly values = input.required<any[]>();
  readonly rowType = input<'text' | 'badge' | 'list'>('text');

  /**
   * Get availability badge class based on status
   */
  protected getAvailabilityClass(value: string): string {
    if (value === 'Available') return 'available';
    if (value === 'Notice Period') return 'notice-period';
    return 'not-available';
  }

  /**
   * Check if value is an array
   */
  protected isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Format array as string list
   */
  protected formatList(value: any): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter(item => item && item !== '—');
  }
}

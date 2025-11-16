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
  readonly rowType = input<'text' | 'badge' | 'list' | 'tags' | 'project'>('text');

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
   * Handles both string arrays and object arrays (Technology, Certification, Skill)
   */
  protected formatList(value: any): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(item => item && item !== '—')
      .map(item => {
        // If item is a string, return as-is
        if (typeof item === 'string') {
          return item;
        }

        // If item is an object (Technology, Skill, Certification)
        if (typeof item === 'object' && item !== null) {
          return this.formatObjectItem(item);
        }

        return '';
      })
      .filter(item => item.length > 0);
  }

  /**
   * Format object item (Technology, Skill, Certification) as display string
   */
  private formatObjectItem(item: any): string {
    const name = item.name || '';

    // For Technology/Skill: show name + proficiency + years
    if (item.proficiency && item.yearsExperience !== undefined) {
      const years = item.yearsExperience;
      const proficiency = item.proficiency;
      return `${name} (${proficiency}, ${years}y)`;
    }

    // For Certification: show name + issued date
    if (item.issuedDate) {
      const year = new Date(item.issuedDate).getFullYear();
      return `${name} (${year})`;
    }

    // Fallback: just return the name
    return name;
  }

  /**
   * Format tag item (Technology with inline display)
   */
  protected formatTag(item: any): string {
    if (typeof item === 'string') {
      return item;
    }

    const name = item.name || '';
    const years = item.yearsExperience;

    if (years !== undefined && years > 0) {
      return `${name} - ${years} years`;
    }

    return name;
  }

  /**
   * Format tags for inline display
   */
  protected formatTags(value: any): any[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(item => item && item !== '—');
  }
}

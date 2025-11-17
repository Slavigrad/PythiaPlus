import { Component, ChangeDetectionStrategy, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Master Data Search Component
 *
 * Purpose: Reusable search input for filtering master data items (Technologies, Roles, etc.)
 * Features:
 * - Real-time filtering with two-way binding
 * - Material Design 3 styling
 * - Clear button with icon
 * - Customizable placeholder
 * - WCAG AA accessible
 * - Keyboard support (Escape to clear)
 *
 * Usage:
 * ```html
 * <app-master-data-search
 *   [(searchQuery)]="service.searchQuery()"
 *   [placeholder]="'Search technologies...'"
 * />
 * ```
 */
@Component({
  selector: 'app-master-data-search',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './master-data-search.html',
  styleUrl: './master-data-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'master-data-search',
    '(keydown.escape)': 'onClear()'
  }
})
export class MasterDataSearch {
  /**
   * Two-way bound search query
   * Use model() for automatic two-way binding with parent component
   */
  readonly searchQuery = model('');

  /**
   * Customizable placeholder text
   * Example: "Search technologies...", "Search roles...", etc.
   */
  readonly placeholder = input('Search...');

  /**
   * Clear the search input
   * Triggered by clear button click or Escape key
   */
  protected onClear(): void {
    this.searchQuery.set('');
  }
}

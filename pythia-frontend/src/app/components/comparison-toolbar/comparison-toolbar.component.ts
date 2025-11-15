import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Comparison Toolbar Component
 *
 * Purpose: Display action buttons for candidate comparison and export
 * Features: Compare button, Export button, selection count, clear selections
 *
 * Visibility: Only shown when at least one candidate is selected
 * Position: Floats in top-right corner of results area
 */
@Component({
  selector: 'app-comparison-toolbar',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './comparison-toolbar.component.html',
  styleUrl: './comparison-toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonToolbarComponent {
  // Signal inputs
  readonly selectionCount = input.required<number>();
  readonly canCompare = input.required<boolean>();
  readonly isMaxReached = input.required<boolean>();

  // Signal outputs
  readonly compare = output<void>();
  readonly export = output<void>();
  readonly clearSelections = output<void>();

  /**
   * Handle compare button click
   */
  protected handleCompare(): void {
    if (this.canCompare()) {
      this.compare.emit();
    }
  }

  /**
   * Handle export button click
   */
  protected handleExport(): void {
    this.export.emit();
  }

  /**
   * Handle clear selections click
   */
  protected handleClear(): void {
    this.clearSelections.emit();
  }

  /**
   * Get message for compare button tooltip
   */
  protected getCompareTooltip(): string {
    const count = this.selectionCount();
    if (count < 2) {
      return 'Select at least 2 candidates to compare';
    }
    if (count > 3) {
      return 'Maximum 3 candidates can be compared';
    }
    return `Compare ${count} selected candidates`;
  }
}

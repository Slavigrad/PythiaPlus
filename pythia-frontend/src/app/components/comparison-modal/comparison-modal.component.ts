import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComparisonService } from '../../services/comparison.service';
import { ComparisonTableComponent } from '../comparison-table/comparison-table.component';

/**
 * Comparison Modal Component
 *
 * Purpose: Full-screen modal for side-by-side candidate comparison
 * Features: Dark overlay, comparison table, close button, escape key support
 *
 * Design: Based on screenshot-ideas/Comparison-profiles-feature.png
 */
@Component({
  selector: 'app-comparison-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, ComparisonTableComponent],
  templateUrl: './comparison-modal.component.html',
  styleUrl: './comparison-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonModalComponent {
  protected readonly comparisonService = inject(ComparisonService);
  private readonly dialogRef = inject(MatDialogRef<ComparisonModalComponent>);

  /**
   * Close the modal
   */
  protected close(): void {
    this.comparisonService.closeComparison();
    this.dialogRef.close();
  }

  /**
   * Remove a candidate from comparison
   */
  protected removeCand(candidateId: string): void {
    this.comparisonService.removeSelection(candidateId);

    // Close modal if less than 2 candidates remain
    if (this.comparisonService.selectionCount() < 2) {
      this.close();
    }
  }
}

/**
 * View Toggle Component - Pythia+
 *
 * Toggles between Grid, List, and Gallery view modes
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ViewMode = 'grid' | 'list' | 'gallery';

@Component({
  selector: 'app-view-toggle',
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <mat-button-toggle-group
      class="view-toggle"
      [value]="viewMode()"
      (change)="handleViewModeChange($event.value)"
      aria-label="View mode">
      <mat-button-toggle value="grid" matTooltip="Grid View">
        <mat-icon>grid_view</mat-icon>
      </mat-button-toggle>
      <mat-button-toggle value="list" matTooltip="List View">
        <mat-icon>view_list</mat-icon>
      </mat-button-toggle>
      <mat-button-toggle value="gallery" matTooltip="Gallery View">
        <mat-icon>view_module</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styles: `
    .view-toggle {
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      overflow: hidden;

      ::ng-deep {
        .mat-button-toggle {
          border: none;
          color: white;

          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          &.mat-button-toggle-checked {
            background-color: rgba(211, 47, 47, 0.3);
            color: var(--color-primary-400);
          }
        }

        .mat-button-toggle-button {
          padding: 0 12px;
          height: 36px;
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
  `
})
export class ViewToggleComponent {
  readonly viewMode = input.required<ViewMode>();
  readonly viewModeChange = output<ViewMode>();

  protected handleViewModeChange(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }
}

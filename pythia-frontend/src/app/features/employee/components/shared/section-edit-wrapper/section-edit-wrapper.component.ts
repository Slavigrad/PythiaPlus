import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Section Edit Wrapper Component
 *
 * Reusable wrapper for editable sections in employee profile
 * Provides consistent UI for view/edit mode switching
 *
 * Usage:
 * <app-section-edit-wrapper
 *   [title]="'Basic Information'"
 *   [icon]="'person'"
 *   [isEditing]="editMode()"
 *   [loading]="loading()"
 *   (edit)="onEdit()"
 *   (save)="onSave()"
 *   (cancel)="onCancel()">
 *
 *   <div viewMode>
 *     <!-- View mode content -->
 *   </div>
 *
 *   <div editMode>
 *     <!-- Edit mode content (form fields) -->
 *   </div>
 * </app-section-edit-wrapper>
 */
@Component({
  selector: 'app-section-edit-wrapper',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './section-edit-wrapper.component.html',
  styleUrl: './section-edit-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionEditWrapperComponent {
  // Inputs
  readonly title = input.required<string>();
  readonly icon = input<string>(''); // Material icon name for section
  readonly isEditing = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly canEdit = input<boolean>(true);

  // Outputs
  readonly edit = output<void>();
  readonly save = output<void>();
  readonly cancel = output<void>();

  /**
   * Handle edit button click
   */
  protected onEdit(): void {
    this.edit.emit();
  }

  /**
   * Handle save button click
   */
  protected onSave(): void {
    this.save.emit();
  }

  /**
   * Handle cancel button click
   */
  protected onCancel(): void {
    this.cancel.emit();
  }
}

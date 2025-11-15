import { Component, inject, Inject, ChangeDetectionStrategy, ComponentRef, ViewContainerRef, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../../../models';

/**
 * Profile Section Edit Dialog
 *
 * Generic modal dialog for editing any profile section
 * Displays the appropriate edit component dynamically
 */
export interface ProfileSectionEditDialogData {
  title: string;
  icon: string;
  employee: Employee;
  componentType: any; // Type of edit component to display
}

@Component({
  selector: 'app-profile-section-edit-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-section-edit-dialog.html',
  styleUrl: './profile-section-edit-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSectionEditDialogComponent implements AfterViewInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<ProfileSectionEditDialogComponent>);
  readonly data = inject<ProfileSectionEditDialogData>(MAT_DIALOG_DATA);
  readonly editContainer = viewChild('editContainer', { read: ViewContainerRef });

  private componentRef: ComponentRef<any> | null = null;

  ngAfterViewInit(): void {
    // Dynamically create and insert the edit component
    const container = this.editContainer();
    if (container && this.data.componentType) {
      this.componentRef = container.createComponent(this.data.componentType);
      // Pass employee data to the component
      this.componentRef.setInput('employee', this.data.employee);
    }
  }

  ngOnDestroy(): void {
    // Clean up component ref
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * Cancel editing and close dialog
   */
  protected cancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Save changes and close dialog
   */
  protected save(): void {
    // Validate and get form data from dynamic component
    if (this.componentRef && this.componentRef.instance) {
      const editComponent = this.componentRef.instance;

      // Check if component has isValid method
      if (typeof editComponent.isValid === 'function' && !editComponent.isValid()) {
        // Form is invalid, don't close
        return;
      }

      // Get form data
      if (typeof editComponent.getFormData === 'function') {
        const formData = editComponent.getFormData();
        this.dialogRef.close(formData);
      } else {
        this.dialogRef.close(true);
      }
    }
  }
}

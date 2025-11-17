import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleEditDialogComponent, RoleEditDialogData } from './role-edit-dialog.component';
import { Role } from '../../../../models/role.model';

describe('RoleEditDialogComponent', () => {
  let component: RoleEditDialogComponent;
  let fixture: ComponentFixture<RoleEditDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<RoleEditDialogComponent>>;

  const mockRole: Role = {
    id: 1,
    name: 'Full Stack Developer',
    description: 'Develops both frontend and backend components',
    category: 'Roles',
    createdAt: '2025-11-16T13:52:15.883959Z',
    updatedAt: '2025-11-16T13:52:15.883959Z'
  };

  function createComponent(data: RoleEditDialogData) {
    TestBed.configureTestingModule({
      imports: [
        RoleEditDialogComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close'])
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        }
      ]
    });

    fixture = TestBed.createComponent(RoleEditDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<RoleEditDialogComponent>>;
    fixture.detectChanges();
  }

  describe('Create Mode', () => {
    beforeEach(() => {
      createComponent({ mode: 'create' });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form in create mode', () => {
      expect(component.roleForm.value).toEqual({
        name: '',
        description: ''
      });
      expect(component.isEditMode).toBe(false);
    });

    it('should display correct title for create mode', () => {
      expect(component.dialogTitle).toBe('Add New Role');
      expect(component.submitButtonText).toBe('Create');
    });

    it('should validate required fields', () => {
      const nameControl = component.roleForm.get('name');
      const descControl = component.roleForm.get('description');

      expect(nameControl?.hasError('required')).toBe(true);
      expect(descControl?.hasError('required')).toBe(true);
      expect(component.roleForm.valid).toBe(false);
    });

    it('should validate minimum length', () => {
      const nameControl = component.roleForm.get('name');
      const descControl = component.roleForm.get('description');

      nameControl?.setValue('A');
      descControl?.setValue('Short');

      expect(nameControl?.hasError('minlength')).toBe(true);
      expect(descControl?.hasError('minlength')).toBe(true);
    });

    it('should validate maximum length', () => {
      const nameControl = component.roleForm.get('name');
      const descControl = component.roleForm.get('description');

      nameControl?.setValue('A'.repeat(101));
      descControl?.setValue('A'.repeat(501));

      expect(nameControl?.hasError('maxlength')).toBe(true);
      expect(descControl?.hasError('maxlength')).toBe(true);
    });

    it('should be valid with correct input', () => {
      component.roleForm.patchValue({
        name: 'DevOps Engineer',
        description: 'Manages infrastructure and CI/CD pipelines for the team'
      });

      expect(component.roleForm.valid).toBe(true);
    });

    it('should close dialog with data on submit', () => {
      component.roleForm.patchValue({
        name: 'DevOps Engineer',
        description: 'Manages infrastructure and CI/CD pipelines for the team'
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'DevOps Engineer',
        description: 'Manages infrastructure and CI/CD pipelines for the team',
        category: 'Roles'
      });
    });

    it('should not submit invalid form', () => {
      component.roleForm.patchValue({
        name: '',
        description: ''
      });

      component.onSubmit();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      createComponent({ mode: 'edit', role: mockRole });
    });

    it('should initialize form with role data in edit mode', () => {
      expect(component.roleForm.value).toEqual({
        name: 'Full Stack Developer',
        description: 'Develops both frontend and backend components'
      });
      expect(component.isEditMode).toBe(true);
    });

    it('should display correct title for edit mode', () => {
      expect(component.dialogTitle).toBe('Edit Role');
      expect(component.submitButtonText).toBe('Update');
    });

    it('should close dialog with updated data on submit', () => {
      component.roleForm.patchValue({
        name: 'Senior Full Stack Developer',
        description: 'Updated description with more details about the role'
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'Senior Full Stack Developer',
        description: 'Updated description with more details about the role',
        category: 'Roles'
      });
    });
  });

  describe('Dialog Actions', () => {
    beforeEach(() => {
      createComponent({ mode: 'create' });
    });

    it('should close dialog without data on cancel', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith();
    });

    it('should trim whitespace from form values', () => {
      component.roleForm.patchValue({
        name: '  DevOps Engineer  ',
        description: '  Manages infrastructure  '
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'DevOps Engineer',
        description: 'Manages infrastructure',
        category: 'Roles'
      });
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      createComponent({ mode: 'create' });
    });

    it('should return correct error message for required field', () => {
      const nameControl = component.roleForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      expect(component.getErrorMessage('name')).toBe('Name is required');
    });

    it('should return correct error message for minlength', () => {
      const nameControl = component.roleForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('A');

      expect(component.getErrorMessage('name')).toContain('at least 2 characters');
    });

    it('should return correct error message for maxlength', () => {
      const descControl = component.roleForm.get('description');
      descControl?.markAsTouched();
      descControl?.setValue('A'.repeat(501));

      expect(component.getErrorMessage('description')).toContain('not exceed 500 characters');
    });

    it('should return empty string when no error', () => {
      component.roleForm.patchValue({
        name: 'Valid Name'
      });

      expect(component.getErrorMessage('name')).toBe('');
    });

    it('should check hasError correctly', () => {
      const nameControl = component.roleForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      expect(component.hasError('name', 'required')).toBe(true);
      expect(component.hasError('name', 'minlength')).toBe(false);
    });
  });
});

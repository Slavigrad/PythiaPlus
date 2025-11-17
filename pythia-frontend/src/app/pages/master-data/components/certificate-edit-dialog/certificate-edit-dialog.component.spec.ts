import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CertificateEditDialogComponent, CertificateEditDialogData } from './certificate-edit-dialog.component';
import { Certificate } from '../../../../models/certificate.model';

describe('CertificateEditDialogComponent', () => {
  let component: CertificateEditDialogComponent;
  let fixture: ComponentFixture<CertificateEditDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CertificateEditDialogComponent>>;

  const mockCertificate: Certificate = {
    id: 1,
    name: 'AWS Solutions Architect',
    description: 'AWS certification for designing distributed systems and applications on Amazon Web Services',
    category: 'Certificates',
    createdAt: '2025-11-16T13:52:16.710932Z',
    updatedAt: '2025-11-16T13:52:16.710932Z'
  };

  function createComponent(data: CertificateEditDialogData) {
    TestBed.configureTestingModule({
      imports: [
        CertificateEditDialogComponent,
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

    fixture = TestBed.createComponent(CertificateEditDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CertificateEditDialogComponent>>;
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
      expect(component.certificateForm.value).toEqual({
        name: '',
        description: ''
      });
      expect(component.isEditMode).toBe(false);
    });

    it('should display correct title for create mode', () => {
      expect(component.dialogTitle).toBe('Add New Certificate');
      expect(component.submitButtonText).toBe('Create');
    });

    it('should validate required fields', () => {
      const nameControl = component.certificateForm.get('name');
      const descControl = component.certificateForm.get('description');

      expect(nameControl?.hasError('required')).toBe(true);
      expect(descControl?.hasError('required')).toBe(true);
      expect(component.certificateForm.valid).toBe(false);
    });

    it('should validate minimum length', () => {
      const nameControl = component.certificateForm.get('name');
      const descControl = component.certificateForm.get('description');

      nameControl?.setValue('A');
      descControl?.setValue('Short');

      expect(nameControl?.hasError('minlength')).toBe(true);
      expect(descControl?.hasError('minlength')).toBe(true);
    });

    it('should validate maximum length', () => {
      const nameControl = component.certificateForm.get('name');
      const descControl = component.certificateForm.get('description');

      nameControl?.setValue('A'.repeat(101));
      descControl?.setValue('A'.repeat(501));

      expect(nameControl?.hasError('maxlength')).toBe(true);
      expect(descControl?.hasError('maxlength')).toBe(true);
    });

    it('should be valid with correct input', () => {
      component.certificateForm.patchValue({
        name: 'Google Cloud Professional',
        description: 'Google Cloud certification for cloud architecture and infrastructure'
      });

      expect(component.certificateForm.valid).toBe(true);
    });

    it('should close dialog with data on submit', () => {
      component.certificateForm.patchValue({
        name: 'Google Cloud Professional',
        description: 'Google Cloud certification for cloud architecture and infrastructure'
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'Google Cloud Professional',
        description: 'Google Cloud certification for cloud architecture and infrastructure',
        category: 'Certificates'
      });
    });

    it('should not submit invalid form', () => {
      component.certificateForm.patchValue({
        name: '',
        description: ''
      });

      component.onSubmit();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      createComponent({ mode: 'edit', certificate: mockCertificate });
    });

    it('should initialize form with certificate data in edit mode', () => {
      expect(component.certificateForm.value).toEqual({
        name: 'AWS Solutions Architect',
        description: 'AWS certification for designing distributed systems and applications on Amazon Web Services'
      });
      expect(component.isEditMode).toBe(true);
    });

    it('should display correct title for edit mode', () => {
      expect(component.dialogTitle).toBe('Edit Certificate');
      expect(component.submitButtonText).toBe('Update');
    });

    it('should close dialog with updated data on submit', () => {
      component.certificateForm.patchValue({
        name: 'AWS Solutions Architect - Professional',
        description: 'Updated description with more details about the certification'
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'AWS Solutions Architect - Professional',
        description: 'Updated description with more details about the certification',
        category: 'Certificates'
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
      component.certificateForm.patchValue({
        name: '  Google Cloud Professional  ',
        description: '  Google Cloud certification  '
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'Google Cloud Professional',
        description: 'Google Cloud certification',
        category: 'Certificates'
      });
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      createComponent({ mode: 'create' });
    });

    it('should return correct error message for required field', () => {
      const nameControl = component.certificateForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      expect(component.getErrorMessage('name')).toBe('Name is required');
    });

    it('should return correct error message for minlength', () => {
      const nameControl = component.certificateForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('A');

      expect(component.getErrorMessage('name')).toContain('at least 2 characters');
    });

    it('should return correct error message for maxlength', () => {
      const descControl = component.certificateForm.get('description');
      descControl?.markAsTouched();
      descControl?.setValue('A'.repeat(501));

      expect(component.getErrorMessage('description')).toContain('not exceed 500 characters');
    });

    it('should return empty string when no error', () => {
      component.certificateForm.patchValue({
        name: 'Valid Name'
      });

      expect(component.getErrorMessage('name')).toBe('');
    });

    it('should check hasError correctly', () => {
      const nameControl = component.certificateForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      expect(component.hasError('name', 'required')).toBe(true);
      expect(component.hasError('name', 'minlength')).toBe(false);
    });
  });
});

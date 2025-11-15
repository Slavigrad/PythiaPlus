import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  const mockData: ConfirmDialogData = {
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'warn',
    icon: 'warning'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dialog data correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Test Title');
    expect(compiled.querySelector('p').textContent).toContain('Test Message');
  });

  it('should display icon when provided', () => {
    const compiled = fixture.nativeElement;
    const icon = compiled.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('warning');
  });

  it('should use default confirm text when not provided', async () => {
    const defaultData: ConfirmDialogData = {
      title: 'Test',
      message: 'Test'
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: defaultData }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(ConfirmDialogComponent);
    newFixture.detectChanges();

    const buttons = newFixture.nativeElement.querySelectorAll('button');
    const confirmButton = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('Confirm')
    );
    expect(confirmButton).toBeTruthy();
  });

  it('should close dialog with true when confirm is clicked', () => {
    const confirmButton = fixture.nativeElement.querySelector('button[color="warn"]');
    confirmButton.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when cancel is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelButton = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('No')
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should apply correct color class to icon', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.className).toContain('icon-warn');
  });

  it('should focus confirm button initially', () => {
    const confirmButton = fixture.nativeElement.querySelector('[cdkFocusInitial]');
    expect(confirmButton).toBeTruthy();
  });
});

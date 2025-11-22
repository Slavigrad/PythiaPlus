import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should show success message with default duration', () => {
      service.success('Test success message');

      expect(snackBar.open).toHaveBeenCalledWith('Test success message', 'Close', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success']
      });
    });

    it('should show success message with custom duration', () => {
      service.success('Test success message', 2000);

      expect(snackBar.open).toHaveBeenCalledWith('Test success message', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success']
      });
    });
  });

  describe('error', () => {
    it('should show error message with default duration', () => {
      service.error('Test error message');

      expect(snackBar.open).toHaveBeenCalledWith('Test error message', 'Close', {
        duration: 6000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error']
      });
    });

    it('should show error message with custom duration', () => {
      service.error('Test error message', 3000);

      expect(snackBar.open).toHaveBeenCalledWith('Test error message', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error']
      });
    });
  });

  describe('warning', () => {
    it('should show warning message with default duration', () => {
      service.warning('Test warning message');

      expect(snackBar.open).toHaveBeenCalledWith('Test warning message', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-warning']
      });
    });

    it('should show warning message with custom duration', () => {
      service.warning('Test warning message', 2500);

      expect(snackBar.open).toHaveBeenCalledWith('Test warning message', 'Close', {
        duration: 2500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-warning']
      });
    });
  });

  describe('info', () => {
    it('should show info message with default duration', () => {
      service.info('Test info message');

      expect(snackBar.open).toHaveBeenCalledWith('Test info message', 'Close', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-info']
      });
    });

    it('should show info message with custom duration', () => {
      service.info('Test info message', 3500);

      expect(snackBar.open).toHaveBeenCalledWith('Test info message', 'Close', {
        duration: 3500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-info']
      });
    });
  });

  describe('dismiss', () => {
    it('should dismiss all snackbars', () => {
      service.dismiss();
      expect(snackBar.dismiss).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonToolbarComponent } from './comparison-toolbar.component';

describe('ComparisonToolbarComponent', () => {
  let component: ComparisonToolbarComponent;
  let fixture: ComponentFixture<ComparisonToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonToolbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonToolbarComponent);
    component = fixture.componentInstance;
  });

  describe('Rendering', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display selection count', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const selectionCount = fixture.nativeElement.querySelector('.selection-count');
      expect(selectionCount.textContent).toContain('2 selected');
    });

    it('should show max reached indicator when at max', () => {
      fixture.componentRef.setInput('selectionCount', 3);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', true);
      fixture.detectChanges();

      const maxIndicator = fixture.nativeElement.querySelector('.max-reached');
      expect(maxIndicator).toBeTruthy();
      expect(maxIndicator.textContent).toContain('(max)');
    });

    it('should not show max reached indicator when below max', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const maxIndicator = fixture.nativeElement.querySelector('.max-reached');
      expect(maxIndicator).toBeFalsy();
    });
  });

  describe('Compare Button', () => {
    it('should be disabled when canCompare is false', () => {
      fixture.componentRef.setInput('selectionCount', 1);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const compareButton = fixture.nativeElement.querySelector('.compare-button');
      expect(compareButton.disabled).toBe(true);
    });

    it('should be enabled when canCompare is true', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const compareButton = fixture.nativeElement.querySelector('.compare-button');
      expect(compareButton.disabled).toBe(false);
    });

    it('should emit compare event when clicked and enabled', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      let compareEmitted = false;
      component.compare.subscribe(() => compareEmitted = true);

      const compareButton = fixture.nativeElement.querySelector('.compare-button');
      compareButton.click();

      expect(compareEmitted).toBe(true);
    });

    it('should show selection count in button text', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const compareButton = fixture.nativeElement.querySelector('.compare-button');
      expect(compareButton.textContent).toContain('Compare (2)');
    });
  });

  describe('Export Button', () => {
    it('should be disabled when no selections', () => {
      fixture.componentRef.setInput('selectionCount', 0);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const exportButton = fixture.nativeElement.querySelector('.export-button');
      expect(exportButton.disabled).toBe(true);
    });

    it('should be enabled when selections exist', () => {
      fixture.componentRef.setInput('selectionCount', 1);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const exportButton = fixture.nativeElement.querySelector('.export-button');
      expect(exportButton.disabled).toBe(false);
    });

    it('should emit export event when clicked', () => {
      fixture.componentRef.setInput('selectionCount', 1);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      let exportEmitted = false;
      component.export.subscribe(() => exportEmitted = true);

      const exportButton = fixture.nativeElement.querySelector('.export-button');
      exportButton.click();

      expect(exportEmitted).toBe(true);
    });

    it('should show selection count in button text', () => {
      fixture.componentRef.setInput('selectionCount', 3);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', true);
      fixture.detectChanges();

      const exportButton = fixture.nativeElement.querySelector('.export-button');
      expect(exportButton.textContent).toContain('Export (3)');
    });
  });

  describe('Clear Button', () => {
    it('should emit clearSelections event when clicked', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      let clearEmitted = false;
      component.clearSelections.subscribe(() => clearEmitted = true);

      const clearButton = fixture.nativeElement.querySelector('.clear-button');
      clearButton.click();

      expect(clearEmitted).toBe(true);
    });
  });

  describe('Tooltips', () => {
    it('should show correct tooltip when less than 2 selections', () => {
      fixture.componentRef.setInput('selectionCount', 1);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', false);

      const tooltip = component['getCompareTooltip']();
      expect(tooltip).toBe('Select at least 2 candidates to compare');
    });

    it('should show correct tooltip when 2-3 selections', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);

      const tooltip = component['getCompareTooltip']();
      expect(tooltip).toBe('Compare 2 selected candidates');
    });

    it('should show correct tooltip when more than 3 selections (edge case)', () => {
      fixture.componentRef.setInput('selectionCount', 4);
      fixture.componentRef.setInput('canCompare', false);
      fixture.componentRef.setInput('isMaxReached', true);

      const tooltip = component['getCompareTooltip']();
      expect(tooltip).toBe('Maximum 3 candidates can be compared');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-live region for selection count', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const selectionCount = fixture.nativeElement.querySelector('.selection-count');
      expect(selectionCount.getAttribute('aria-live')).toBe('polite');
      expect(selectionCount.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have role="toolbar" on container', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const toolbar = fixture.nativeElement.querySelector('.comparison-toolbar');
      expect(toolbar.getAttribute('role')).toBe('toolbar');
    });

    it('should have aria-label on all buttons', () => {
      fixture.componentRef.setInput('selectionCount', 2);
      fixture.componentRef.setInput('canCompare', true);
      fixture.componentRef.setInput('isMaxReached', false);
      fixture.detectChanges();

      const compareButton = fixture.nativeElement.querySelector('.compare-button');
      const exportButton = fixture.nativeElement.querySelector('.export-button');
      const clearButton = fixture.nativeElement.querySelector('.clear-button');

      expect(compareButton.getAttribute('aria-label')).toBeTruthy();
      expect(exportButton.getAttribute('aria-label')).toBeTruthy();
      expect(clearButton.getAttribute('aria-label')).toBeTruthy();
    });
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchOptionsComponent } from './search-options.component';
import { SearchService } from '../../services/search.service';
import { signal } from '@angular/core';

describe('SearchOptionsComponent', () => {
  let component: SearchOptionsComponent;
  let fixture: ComponentFixture<SearchOptionsComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SearchService', ['search'], {
      lastQuery: signal(''),
      searchResults: signal([]),
      loading: signal(false),
      error: signal(null)
    });

    await TestBed.configureTestingModule({
      imports: [SearchOptionsComponent, FormsModule],
      providers: [{ provide: SearchService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOptionsComponent);
    component = fixture.componentInstance;
    searchServiceSpy = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize isExpanded as false', () => {
      expect(component['isExpanded']()).toBe(false);
    });

    it('should initialize topK signal as 10', () => {
      expect(component['topK']()).toBe(10);
    });

    it('should initialize minScore signal as 0.7', () => {
      expect(component['minScore']()).toBe(0.7);
    });

    it('should have topK options defined', () => {
      expect(component['topKOptions'].length).toBe(4);
      expect(component['topKOptions'][0].value).toBe(5);
      expect(component['topKOptions'][1].value).toBe(10);
    });
  });

  describe('Initial Values from URL', () => {
    it('should initialize topK from input', fakeAsync(() => {
      fixture.componentRef.setInput('initialTopK', 20);
      fixture.detectChanges();
      tick();

      expect(component['topK']()).toBe(20);
    }));

    it('should initialize minScore from input', fakeAsync(() => {
      fixture.componentRef.setInput('initialMinScore', 0.8);
      fixture.detectChanges();
      tick();

      expect(component['minScore']()).toBe(0.8);
    }));

    it('should initialize both values from URL', fakeAsync(() => {
      fixture.componentRef.setInput('initialTopK', 20);
      fixture.componentRef.setInput('initialMinScore', 0.85);
      fixture.detectChanges();
      tick();

      expect(component['topK']()).toBe(20);
      expect(component['minScore']()).toBe(0.85);
    }));

    it('should not reinitialize with default values', fakeAsync(() => {
      fixture.componentRef.setInput('initialTopK', 10);
      fixture.componentRef.setInput('initialMinScore', 0.7);
      fixture.detectChanges();
      tick();

      // Should keep defaults, not reinitialize
      expect(component['topK']()).toBe(10);
      expect(component['minScore']()).toBe(0.7);
    }));
  });

  describe('toggleExpanded()', () => {
    it('should toggle isExpanded from false to true', () => {
      expect(component['isExpanded']()).toBe(false);
      component.toggleExpanded();
      expect(component['isExpanded']()).toBe(true);
    });

    it('should toggle isExpanded from true to false', () => {
      component['isExpanded'].set(true);
      component.toggleExpanded();
      expect(component['isExpanded']()).toBe(false);
    });

    it('should toggle multiple times', () => {
      component.toggleExpanded();
      expect(component['isExpanded']()).toBe(true);
      component.toggleExpanded();
      expect(component['isExpanded']()).toBe(false);
      component.toggleExpanded();
      expect(component['isExpanded']()).toBe(true);
    });
  });

  describe('getScoreLabel()', () => {
    it('should return "Only excellent" for score >= 0.85', () => {
      expect(component['getScoreLabel'](0.85)).toBe('Only excellent');
      expect(component['getScoreLabel'](0.90)).toBe('Only excellent');
      expect(component['getScoreLabel'](1.0)).toBe('Only excellent');
    });

    it('should return "Good matches" for score 0.70-0.84', () => {
      expect(component['getScoreLabel'](0.70)).toBe('Good matches');
      expect(component['getScoreLabel'](0.75)).toBe('Good matches');
      expect(component['getScoreLabel'](0.84)).toBe('Good matches');
    });

    it('should return "Cast a wide net" for score < 0.70', () => {
      expect(component['getScoreLabel'](0.50)).toBe('Cast a wide net');
      expect(component['getScoreLabel'](0.60)).toBe('Cast a wide net');
      expect(component['getScoreLabel'](0.69)).toBe('Cast a wide net');
    });
  });

  describe('getScorePercentage()', () => {
    it('should convert score to percentage', () => {
      expect(component['getScorePercentage'](0.7)).toBe(70);
      expect(component['getScorePercentage'](0.85)).toBe(85);
      expect(component['getScorePercentage'](1.0)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(component['getScorePercentage'](0.754)).toBe(75);
      expect(component['getScorePercentage'](0.756)).toBe(76);
    });

    it('should handle edge cases', () => {
      expect(component['getScorePercentage'](0.5)).toBe(50);
      expect(component['getScorePercentage'](0.0)).toBe(0);
    });
  });

  describe('Search Effect', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should trigger search when topK changes with active query', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('developer');
      tick();

      component['topK'].set(20);
      tick();

      expect(searchServiceSpy.search).toHaveBeenCalledWith({
        query: 'developer',
        topK: 20,
        minScore: 0.7
      });
    }));

    it('should trigger search when minScore changes with active query', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('developer');
      tick();

      component['minScore'].set(0.85);
      tick();

      expect(searchServiceSpy.search).toHaveBeenCalledWith({
        query: 'developer',
        topK: 10,
        minScore: 0.85
      });
    }));

    it('should NOT trigger search without active query', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('');
      tick();

      component['topK'].set(20);
      tick();

      expect(searchServiceSpy.search).not.toHaveBeenCalled();
    }));

    it('should NOT trigger search with short query', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('ab');
      tick();

      component['topK'].set(20);
      tick();

      expect(searchServiceSpy.search).not.toHaveBeenCalled();
    }));

    it('should include both parameters in search', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('developer');
      tick();

      component['topK'].set(20);
      component['minScore'].set(0.8);
      tick();

      expect(searchServiceSpy.search).toHaveBeenCalledWith({
        query: 'developer',
        topK: 20,
        minScore: 0.8
      });
    }));
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.options-toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('should have correct aria-expanded initially', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.options-toggle');
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when expanded', () => {
      component['isExpanded'].set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.options-toggle');
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should toggle expanded state on button click', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.options-toggle') as HTMLButtonElement;

      expect(component['isExpanded']()).toBe(false);
      toggleButton.click();
      fixture.detectChanges();
      expect(component['isExpanded']()).toBe(true);
    });

    it('should show options panel when expanded', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const panel = compiled.querySelector('.options-panel');
      expect(panel?.classList.contains('expanded')).toBe(true);
    }));

    it('should render topK select dropdown', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('#topK');
      expect(select).toBeTruthy();
    }));

    it('should render minScore slider', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const slider = compiled.querySelector('#minScore');
      expect(slider).toBeTruthy();
    }));

    it('should display current score percentage', fakeAsync(() => {
      component['isExpanded'].set(true);
      component['minScore'].set(0.75);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const scoreValue = compiled.querySelector('.score-value');
      expect(scoreValue?.textContent).toContain('75');
    }));

    it('should display score label', fakeAsync(() => {
      component['isExpanded'].set(true);
      component['minScore'].set(0.85);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.slider-label.middle');
      expect(label?.textContent).toContain('Only excellent');
    }));
  });

  describe('Signal Reactivity', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update UI when topK signal changes', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      component['topK'].set(20);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('#topK') as HTMLSelectElement;
      expect(select.value).toBe('20');
    }));

    it('should update UI when minScore signal changes', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      component['minScore'].set(0.85);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const slider = compiled.querySelector('#minScore') as HTMLInputElement;
      expect(parseFloat(slider.value)).toBe(0.85);
    }));
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have aria-controls on toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.options-toggle');
      expect(toggleButton?.getAttribute('aria-controls')).toBe('options-panel');
    });

    it('should have proper id on options panel', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const panel = compiled.querySelector('.options-panel');
      expect(panel?.id).toBe('options-panel');
    });

    it('should have aria-hidden on panel when collapsed', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const panel = compiled.querySelector('.options-panel');
      expect(panel?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should update aria-hidden when panel expands', () => {
      component['isExpanded'].set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const panel = compiled.querySelector('.options-panel');
      expect(panel?.getAttribute('aria-hidden')).toBe('false');
    });

    it('should have labels for form controls', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const topKLabel = compiled.querySelector('label[for="topK"]');
      const minScoreLabel = compiled.querySelector('label[for="minScore"]');

      expect(topKLabel).toBeTruthy();
      expect(minScoreLabel).toBeTruthy();
    }));

    it('should have proper aria attributes on slider', fakeAsync(() => {
      component['isExpanded'].set(true);
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const slider = compiled.querySelector('#minScore');

      expect(slider?.getAttribute('aria-label')).toBeTruthy();
      expect(slider?.getAttribute('aria-valuenow')).toBeTruthy();
      expect(slider?.getAttribute('aria-valuemin')).toBe('0.5');
      expect(slider?.getAttribute('aria-valuemax')).toBe('1.0');
    }));
  });

  describe('Integration with SearchService', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should read lastQuery from SearchService', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('developer');
      tick();

      component['topK'].set(20);
      tick();

      expect(searchServiceSpy.search).toHaveBeenCalled();
    }));

    it('should not trigger search initially without query', fakeAsync(() => {
      tick();
      expect(searchServiceSpy.search).not.toHaveBeenCalled();
    }));

    it('should trigger search with correct parameters', fakeAsync(() => {
      (searchServiceSpy.lastQuery as any).set('react developer');
      component['topK'].set(5);
      component['minScore'].set(0.9);
      tick();

      expect(searchServiceSpy.search).toHaveBeenCalledWith({
        query: 'react developer',
        topK: 5,
        minScore: 0.9
      });
    }));
  });
});

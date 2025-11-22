import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { SearchService } from '../../services/search';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let searchService: jasmine.SpyObj<SearchService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['search', 'clear']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate'], {
      routerState: { root: {} }
    });

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize query signal as empty string', () => {
      expect(component['query']()).toBe('');
    });

    it('should have example queries defined', () => {
      expect(component['exampleQueries'].length).toBe(3);
      expect(component['exampleQueries'][0]).toContain('React');
    });
  });

  describe('Initial Query Input', () => {
    it('should initialize query from URL on first load', fakeAsync(() => {
      fixture.componentRef.setInput('initialQuery', 'developer');
      fixture.detectChanges();
      tick();

      expect(component['query']()).toBe('developer');
    }));

    it('should not reinitialize query on subsequent changes', fakeAsync(() => {
      fixture.componentRef.setInput('initialQuery', 'developer');
      fixture.detectChanges();
      tick();

      component['query'].set('custom query');
      fixture.componentRef.setInput('initialQuery', 'engineer');
      fixture.detectChanges();
      tick();

      expect(component['query']()).toBe('custom query');
    }));

    it('should not initialize with empty URL query', fakeAsync(() => {
      fixture.componentRef.setInput('initialQuery', '');
      fixture.detectChanges();
      tick();

      expect(component['query']()).toBe('');
    }));
  });

  describe('Debounced Search Effect', () => {
    it('should NOT search immediately when query changes', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('developer');
      tick(300);

      expect(searchService.search).not.toHaveBeenCalled();
    }));

    it('should search after 500ms debounce', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('developer');
      tick(500);

      expect(searchService.search).toHaveBeenCalledWith({ query: 'developer' });
    }));

    it('should cancel previous search on rapid typing', fakeAsync(() => {
      fixture.detectChanges();

      component['query'].set('dev');
      tick(300);

      component['query'].set('devel');
      tick(300);

      component['query'].set('developer');
      tick(500);

      // Should only search once with final query
      expect(searchService.search).toHaveBeenCalledTimes(1);
      expect(searchService.search).toHaveBeenCalledWith({ query: 'developer' });
    }));

    it('should NOT search for queries less than 3 characters', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('ab');
      tick(500);

      expect(searchService.search).not.toHaveBeenCalled();
    }));

    it('should search for exactly 3 characters', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('abc');
      tick(500);

      expect(searchService.search).toHaveBeenCalledWith({ query: 'abc' });
    }));

    it('should clear results when query is empty', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('');
      tick(500);

      expect(searchService.clear).toHaveBeenCalled();
    }));

    it('should trim whitespace when checking query length', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('   ');
      tick(500);

      expect(searchService.clear).toHaveBeenCalled();
      expect(searchService.search).not.toHaveBeenCalled();
    }));

    it('should handle queries with leading/trailing spaces', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('  developer  ');
      tick(500);

      expect(searchService.search).toHaveBeenCalledWith({ query: '  developer  ' });
    }));
  });

  describe('onExampleClick()', () => {
    it('should set query to example when clicked', () => {
      const exampleQuery = 'Find React developers in Zurich';
      component.onExampleClick(exampleQuery);

      expect(component['query']()).toBe(exampleQuery);
    });

    it('should trigger search after debounce', fakeAsync(() => {
      fixture.detectChanges();
      component.onExampleClick('Find React developers in Zurich');
      tick(500);

      expect(searchService.search).toHaveBeenCalled();
    }));

    it('should replace current query', () => {
      component['query'].set('old query');
      component.onExampleClick('new query');

      expect(component['query']()).toBe('new query');
    }));
  });

  describe('onClear()', () => {
    it('should clear query signal', () => {
      component['query'].set('test query');
      component.onClear();

      expect(component['query']()).toBe('');
    });

    it('should call searchService.clear()', () => {
      component.onClear();

      expect(searchService.clear).toHaveBeenCalled();
    });

    it('should not trigger search after clearing', fakeAsync(() => {
      fixture.detectChanges();
      component['query'].set('developer');
      tick(500);

      searchService.search.calls.reset();
      component.onClear();
      tick(500);

      expect(searchService.search).not.toHaveBeenCalled();
    }));
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render search input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('.search-input');
      expect(input).toBeTruthy();
    });

    it('should render example queries', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const examples = compiled.querySelectorAll('.example-query');
      expect(examples.length).toBe(3);
    });

    it('should NOT show clear button when query is empty', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const clearButton = compiled.querySelector('.clear-button');
      expect(clearButton).toBeNull();
    });

    it('should show clear button when query exists', fakeAsync(() => {
      component['query'].set('test');
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const clearButton = compiled.querySelector('.clear-button');
      expect(clearButton).toBeTruthy();
    }));

    it('should update input value when query changes', fakeAsync(() => {
      component['query'].set('developer');
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('.search-input') as HTMLInputElement;
      expect(input.value).toBe('developer');
    }));

    it('should call onClear when clear button clicked', fakeAsync(() => {
      spyOn(component, 'onClear');
      component['query'].set('test');
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const clearButton = compiled.querySelector('.clear-button') as HTMLButtonElement;
      clearButton.click();

      expect(component.onClear).toHaveBeenCalled();
    }));

    it('should call onExampleClick when example button clicked', () => {
      spyOn(component, 'onExampleClick');
      const compiled = fixture.nativeElement as HTMLElement;
      const exampleButton = compiled.querySelector('.example-query') as HTMLButtonElement;
      exampleButton.click();

      expect(component.onExampleClick).toHaveBeenCalled();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should clear search on Escape key', fakeAsync(() => {
      component['query'].set('test query');
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('.search-input') as HTMLInputElement;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      input.dispatchEvent(event);
      fixture.detectChanges();

      expect(component['query']()).toBe('');
    }));
  });

  describe('Signal Reactivity', () => {
    it('should trigger search when query signal changes', fakeAsync(() => {
      fixture.detectChanges();

      component['query'].set('developer');
      tick(500);

      expect(searchService.search).toHaveBeenCalledWith({ query: 'developer' });
    }));

    it('should handle multiple rapid query changes', fakeAsync(() => {
      fixture.detectChanges();

      component['query'].set('a');
      tick(100);
      component['query'].set('ab');
      tick(100);
      component['query'].set('abc');
      tick(100);
      component['query'].set('abcd');
      tick(500);

      // Only final query should trigger search
      expect(searchService.search).toHaveBeenCalledTimes(1);
      expect(searchService.search).toHaveBeenCalledWith({ query: 'abcd' });
    }));
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper aria-label on search input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('.search-input');
      expect(input?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have proper aria-label on clear button', fakeAsync(() => {
      component['query'].set('test');
      fixture.detectChanges();
      tick();

      const compiled = fixture.nativeElement as HTMLElement;
      const clearButton = compiled.querySelector('.clear-button');
      expect(clearButton?.getAttribute('aria-label')).toBe('Clear search');
    }));

    it('should have proper aria-labels on example buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const examples = compiled.querySelectorAll('.example-query');
      examples.forEach(button => {
        expect(button.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });
});

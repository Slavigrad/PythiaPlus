import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SearchService } from './search.service';
import { SearchParams } from '../models/search-params.model';
import { SearchResponse } from '../models/search-response.model';
import { Candidate } from '../models/candidate.model';
import { environment } from '../../environments/environment';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Senior Developer',
      location: 'Zurich',
      experience: '5 years',
      availability: 'Immediately',
      technologies: ['React', 'TypeScript'],
      matchScore: 0.95
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Full Stack Developer',
      location: 'Bern',
      experience: '3 years',
      availability: '2 weeks notice',
      technologies: ['Angular', 'Node.js'],
      matchScore: 0.85
    }
  ];

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate'], {
      routerState: { root: {} }
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Signal Initialization', () => {
    it('should initialize with empty search results', () => {
      expect(service.searchResults()).toEqual([]);
    });

    it('should initialize loading as false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should initialize error as null', () => {
      expect(service.error()).toBe(null);
    });

    it('should initialize lastQuery as empty string', () => {
      expect(service.lastQuery()).toBe('');
    });
  });

  describe('Computed Signals', () => {
    it('hasResults should return false when no results', () => {
      expect(service.hasResults()).toBe(false);
    });

    it('hasResults should return true when results exist', () => {
      service.searchResults.set(mockCandidates);
      expect(service.hasResults()).toBe(true);
    });

    it('resultCount should return correct count', () => {
      expect(service.resultCount()).toBe(0);
      service.searchResults.set(mockCandidates);
      expect(service.resultCount()).toBe(2);
    });

    it('isEmpty should return true initially', () => {
      expect(service.isEmpty()).toBe(true);
    });

    it('isEmpty should return false when loading', () => {
      service.loading.set(true);
      expect(service.isEmpty()).toBe(false);
    });

    it('isEmpty should return false when has results', () => {
      service.searchResults.set(mockCandidates);
      service.lastQuery.set('test');
      expect(service.isEmpty()).toBe(false);
    });

    it('hasError should return false initially', () => {
      expect(service.hasError()).toBe(false);
    });

    it('hasError should return true when error exists', () => {
      service.error.set('Test error');
      expect(service.hasError()).toBe(true);
    });
  });

  describe('search() method', () => {
    it('should not search with query less than 3 characters', () => {
      const params: SearchParams = { query: 'ab', topK: 10, minScore: 0.7 };
      service.search(params, false);

      expect(service.searchResults()).toEqual([]);
      expect(service.lastQuery()).toBe('');
      httpMock.expectNone(`${environment.apiUrl}/search`);
    });

    it('should clear results when query is empty', () => {
      service.searchResults.set(mockCandidates);
      const params: SearchParams = { query: '', topK: 10, minScore: 0.7 };
      service.search(params, false);

      expect(service.searchResults()).toEqual([]);
      expect(service.lastQuery()).toBe('');
    });

    it('should set loading state when searching', () => {
      const params: SearchParams = { query: 'developer', topK: 10, minScore: 0.7 };
      service.search(params, false);

      expect(service.loading()).toBe(true);
      expect(service.lastQuery()).toBe('developer');
      expect(service.error()).toBeNull();
    });

    it('should make HTTP GET request with correct parameters', () => {
      const params: SearchParams = { query: 'react developer', topK: 10, minScore: 0.7 };
      service.search(params, false);

      const req = httpMock.expectOne(request =>
        request.url.includes(`${environment.apiUrl}/search`) &&
        request.url.includes('query=react%20developer') &&
        request.url.includes('topK=10') &&
        request.url.includes('minScore=0.7')
      );
      expect(req.request.method).toBe('GET');
    });

    it('should update results on successful response', () => {
      const params: SearchParams = { query: 'developer', topK: 10, minScore: 0.7 };
      const mockResponse: SearchResponse = {
        results: mockCandidates,
        totalCount: 2,
        query: 'developer'
      };

      service.search(params, false);

      const req = httpMock.expectOne(request =>
        request.url.includes(`${environment.apiUrl}/search`)
      );
      req.flush(mockResponse);

      expect(service.searchResults()).toEqual(mockCandidates);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should handle HTTP errors correctly', () => {
      const params: SearchParams = { query: 'developer', topK: 10, minScore: 0.7 };

      service.search(params, false);

      const req = httpMock.expectOne(request =>
        request.url.includes(`${environment.apiUrl}/search`)
      );
      req.error(new ErrorEvent('Network error'));

      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Failed to search candidates. Please try again.');
      expect(service.searchResults()).toEqual([]);
    });

    it('should update URL when updateUrl is true', () => {
      const params: SearchParams = { query: 'developer', topK: 10, minScore: 0.7 };
      service.search(params, true);

      expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('should not update URL when updateUrl is false', () => {
      const params: SearchParams = { query: 'developer', topK: 10, minScore: 0.7 };
      service.search(params, false);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should use default values for topK and minScore', () => {
      const params: SearchParams = { query: 'developer' };
      service.search(params, false);

      const req = httpMock.expectOne(request =>
        request.url.includes('topK=10') &&
        request.url.includes('minScore=0.7')
      );
      expect(req).toBeTruthy();
      req.flush({ results: [], totalCount: 0, query: 'developer' });
    });
  });

  describe('clear() method', () => {
    it('should clear all search state', () => {
      service.searchResults.set(mockCandidates);
      service.error.set('Some error');
      service.lastQuery.set('test query');

      service.clear();

      expect(service.searchResults()).toEqual([]);
      expect(service.error()).toBeNull();
      expect(service.lastQuery()).toBe('');
    });

    it('should update URL when clearing', () => {
      service.clear();
      expect(routerSpy.navigate).toHaveBeenCalled();
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed signals when search results change', () => {
      expect(service.hasResults()).toBe(false);
      expect(service.resultCount()).toBe(0);

      service.searchResults.set(mockCandidates);

      expect(service.hasResults()).toBe(true);
      expect(service.resultCount()).toBe(2);
    });

    it('should update isEmpty when state changes', () => {
      expect(service.isEmpty()).toBe(true);

      service.loading.set(true);
      expect(service.isEmpty()).toBe(false);

      service.loading.set(false);
      service.lastQuery.set('test');
      expect(service.isEmpty()).toBe(false);

      service.clear();
      expect(service.isEmpty()).toBe(true);
    });
  });
});

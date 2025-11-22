/**
 * DashboardService Tests
 *
 * Comprehensive tests covering:
 * - Facets data fetching with caching (5-minute TTL)
 * - Summary statistics calculation
 * - Chart data transformation
 * - Cache invalidation
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { FacetsResponse, SummaryStats, ChartData } from '../models/dashboard.models';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockFacetsResponse: FacetsResponse = {
    totalCount: 150,
    facets: {
      availabilities: [
        { value: 'available', count: 45 },
        { value: 'notice', count: 30 },
        { value: 'not_available', count: 75 }
      ],
      cities: [
        { value: 'Zurich', count: 60 },
        { value: 'Geneva', count: 40 },
        { value: 'Bern', count: 30 },
        { value: 'Basel', count: 20 }
      ],
      countries: [
        { value: 'Switzerland', count: 120 },
        { value: 'Germany', count: 20 },
        { value: 'Austria', count: 10 }
      ],
      technologies: [
        { value: 'Angular', count: 80 },
        { value: 'React', count: 60 },
        { value: 'Vue', count: 40 },
        { value: 'TypeScript', count: 100 },
        { value: 'JavaScript', count: 90 }
      ],
      skills: [
        { value: 'Frontend Development', count: 100 },
        { value: 'Backend Development', count: 80 },
        { value: 'DevOps', count: 50 },
        { value: 'UI/UX Design', count: 40 }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // =========================================================================
  // INITIALIZATION TESTS
  // =========================================================================

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  // =========================================================================
  // DATA FETCHING TESTS
  // =========================================================================

  describe('getDashboardFacets', () => {
    it('should fetch facets data from API', (done) => {
      service.getDashboardFacets().subscribe({
        next: (data) => {
          expect(data).toEqual(mockFacetsResponse);
          expect(data.totalCount).toBe(150);
          expect(data.facets.availabilities.length).toBe(3);
          done();
        }
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('/search') &&
        request.params.get('query') === 'a' &&
        request.params.get('topK') === '100'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockFacetsResponse);
    });

    it('should use cache if data is fresh (< 5 minutes)', (done) => {
      // First call - fetches from API
      service.getDashboardFacets().subscribe(() => {
        // Second call - should use cache (no HTTP request)
        service.getDashboardFacets().subscribe({
          next: (data) => {
            expect(data).toEqual(mockFacetsResponse);
            done();
          }
        });

        // No second HTTP request expected
        httpMock.expectNone((request) => request.url.includes('/search'));
      });

      const req = httpMock.expectOne((request) => request.url.includes('/search'));
      req.flush(mockFacetsResponse);
    });

    it('should fetch fresh data if cache is expired (> 5 minutes)', (done) => {
      // Mock Date.now() to simulate time passage
      let currentTime = Date.now();
      spyOn(Date, 'now').and.callFake(() => currentTime);

      // First call
      service.getDashboardFacets().subscribe(() => {
        // Advance time by 6 minutes (cache TTL is 5 minutes)
        currentTime += 6 * 60 * 1000;

        // Second call - cache expired, should fetch fresh data
        service.getDashboardFacets().subscribe({
          next: (data) => {
            expect(data).toEqual(mockFacetsResponse);
            done();
          }
        });

        // Second HTTP request expected
        const req2 = httpMock.expectOne((request) => request.url.includes('/search'));
        req2.flush(mockFacetsResponse);
      });

      const req1 = httpMock.expectOne((request) => request.url.includes('/search'));
      req1.flush(mockFacetsResponse);
    });

    it('should handle HTTP errors gracefully', (done) => {
      service.getDashboardFacets().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne((request) => request.url.includes('/search'));
      req.error(new ErrorEvent('Network error'), { status: 500 });
    });
  });

  // =========================================================================
  // SUMMARY STATS CALCULATION TESTS
  // =========================================================================

  describe('calculateSummaryStats', () => {
    it('should calculate summary stats correctly', () => {
      const stats: SummaryStats = service.calculateSummaryStats(mockFacetsResponse);

      expect(stats.totalProfiles).toBe(150);
      expect(stats.availableNow).toBe(45);
      expect(stats.onNotice).toBe(30);
      expect(stats.citiesCovered).toBe(4); // Zurich, Geneva, Bern, Basel
    });

    it('should handle missing availability facets', () => {
      const responseWithoutAvailabilities: FacetsResponse = {
        ...mockFacetsResponse,
        facets: {
          ...mockFacetsResponse.facets,
          availabilities: []
        }
      };

      const stats = service.calculateSummaryStats(responseWithoutAvailabilities);

      expect(stats.availableNow).toBe(0);
      expect(stats.onNotice).toBe(0);
    });

    it('should handle missing cities facets', () => {
      const responseWithoutCities: FacetsResponse = {
        ...mockFacetsResponse,
        facets: {
          ...mockFacetsResponse.facets,
          cities: []
        }
      };

      const stats = service.calculateSummaryStats(responseWithoutCities);

      expect(stats.citiesCovered).toBe(0);
    });

    it('should handle partial availability data', () => {
      const responseWithPartialData: FacetsResponse = {
        ...mockFacetsResponse,
        facets: {
          ...mockFacetsResponse.facets,
          availabilities: [
            { value: 'available', count: 10 }
            // Missing 'notice' and 'not_available'
          ]
        }
      };

      const stats = service.calculateSummaryStats(responseWithPartialData);

      expect(stats.availableNow).toBe(10);
      expect(stats.onNotice).toBe(0); // Default to 0 if missing
    });
  });

  // =========================================================================
  // CHART DATA TRANSFORMATION TESTS
  // =========================================================================

  describe('transformAvailabilityChartData', () => {
    it('should transform availability facets to chart data', () => {
      const chartData: ChartData = service.transformAvailabilityChartData(mockFacetsResponse);

      expect(chartData.labels).toEqual(['available', 'notice', 'not_available']);
      expect(chartData.data).toEqual([45, 30, 75]);
      expect(chartData.backgroundColor).toBeDefined();
      expect(chartData.backgroundColor?.length).toBe(3);
    });

    it('should handle empty availability data', () => {
      const emptyResponse: FacetsResponse = {
        totalCount: 0,
        facets: {
          availabilities: [],
          cities: [],
          countries: [],
          technologies: [],
          skills: []
        }
      };

      const chartData = service.transformAvailabilityChartData(emptyResponse);

      expect(chartData.labels).toEqual([]);
      expect(chartData.data).toEqual([]);
    });

    it('should apply correct colors to availability statuses', () => {
      const chartData = service.transformAvailabilityChartData(mockFacetsResponse);

      // Verify that background colors are applied
      expect(chartData.backgroundColor).toBeDefined();
      expect(Array.isArray(chartData.backgroundColor)).toBe(true);

      // Each data point should have a color
      expect(chartData.backgroundColor?.length).toBe(chartData.data.length);
    });
  });

  describe('transformLocationChartData', () => {
    it('should transform cities to chart data with top 10 limit', () => {
      const chartData = service.transformLocationChartData(mockFacetsResponse, 'cities');

      expect(chartData.labels).toEqual(['Zurich', 'Geneva', 'Bern', 'Basel']);
      expect(chartData.data).toEqual([60, 40, 30, 20]);
      expect(chartData.backgroundColor).toBeDefined();
    });

    it('should transform countries to chart data', () => {
      const chartData = service.transformLocationChartData(mockFacetsResponse, 'countries');

      expect(chartData.labels).toEqual(['Switzerland', 'Germany', 'Austria']);
      expect(chartData.data).toEqual([120, 20, 10]);
    });

    it('should limit results to top 10', () => {
      const manyLocations: FacetsResponse = {
        ...mockFacetsResponse,
        facets: {
          ...mockFacetsResponse.facets,
          cities: Array.from({ length: 15 }, (_, i) => ({
            value: `City${i + 1}`,
            count: 15 - i
          }))
        }
      };

      const chartData = service.transformLocationChartData(manyLocations, 'cities');

      expect(chartData.labels.length).toBe(10);
      expect(chartData.data.length).toBe(10);
    });
  });

  describe('transformSkillsChartData', () => {
    it('should transform technologies to chart data', () => {
      const chartData = service.transformSkillsChartData(mockFacetsResponse, 'technologies');

      expect(chartData.labels).toEqual(['TypeScript', 'JavaScript', 'Angular', 'React', 'Vue']);
      expect(chartData.data).toEqual([100, 90, 80, 60, 40]);
      expect(chartData.backgroundColor).toBeDefined();
    });

    it('should transform skills to chart data', () => {
      const chartData = service.transformSkillsChartData(mockFacetsResponse, 'skills');

      expect(chartData.labels).toEqual([
        'Frontend Development',
        'Backend Development',
        'DevOps',
        'UI/UX Design'
      ]);
      expect(chartData.data).toEqual([100, 80, 50, 40]);
    });

    it('should sort by count descending', () => {
      const chartData = service.transformSkillsChartData(mockFacetsResponse, 'technologies');

      // Verify data is sorted in descending order
      for (let i = 1; i < chartData.data.length; i++) {
        expect(chartData.data[i]).toBeLessThanOrEqual(chartData.data[i - 1]);
      }
    });

    it('should limit to top 10 results', () => {
      const manyTechs: FacetsResponse = {
        ...mockFacetsResponse,
        facets: {
          ...mockFacetsResponse.facets,
          technologies: Array.from({ length: 20 }, (_, i) => ({
            value: `Tech${i + 1}`,
            count: 20 - i
          }))
        }
      };

      const chartData = service.transformSkillsChartData(manyTechs, 'technologies');

      expect(chartData.labels.length).toBe(10);
      expect(chartData.data.length).toBe(10);
    });
  });

  // =========================================================================
  // CACHE INVALIDATION TESTS
  // =========================================================================

  describe('Cache Management', () => {
    it('should invalidate cache after 5 minutes', (done) => {
      let currentTime = Date.now();
      spyOn(Date, 'now').and.callFake(() => currentTime);

      // First call - populates cache
      service.getDashboardFacets().subscribe(() => {
        // Advance time by 5 minutes + 1ms
        currentTime += (5 * 60 * 1000) + 1;

        // Second call - cache expired, should fetch again
        service.getDashboardFacets().subscribe({
          next: (data) => {
            expect(data).toEqual(mockFacetsResponse);
            done();
          }
        });

        const req2 = httpMock.expectOne((request) => request.url.includes('/search'));
        req2.flush(mockFacetsResponse);
      });

      const req1 = httpMock.expectOne((request) => request.url.includes('/search'));
      req1.flush(mockFacetsResponse);
    });

    it('should reuse cache within 5-minute window', (done) => {
      let currentTime = Date.now();
      spyOn(Date, 'now').and.callFake(() => currentTime);

      // First call
      service.getDashboardFacets().subscribe(() => {
        // Advance time by 4 minutes (still within TTL)
        currentTime += 4 * 60 * 1000;

        // Second call - should use cache
        service.getDashboardFacets().subscribe({
          next: (data) => {
            expect(data).toEqual(mockFacetsResponse);
            done();
          }
        });

        // No second request expected
        httpMock.expectNone((request) => request.url.includes('/search'));
      });

      const req = httpMock.expectOne((request) => request.url.includes('/search'));
      req.flush(mockFacetsResponse);
    });
  });
});

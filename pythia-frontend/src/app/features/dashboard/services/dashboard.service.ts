import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  FacetsResponse,
  ChartData,
  SummaryStats,
  Facet,
  AVAILABILITY_COLORS,
  CHART_COLOR_SCHEMES,
  ChartColorScheme
} from '../models/dashboard.models';

/**
 * Dashboard Service
 *
 * Purpose: Fetch and transform dashboard data from search API facets
 * Features: Signal-based caching, data transformation for charts, 5-minute TTL
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/search`;

  // Signal-based cache with 5-minute TTL
  private readonly cachedData = signal<FacetsResponse | null>(null);
  private readonly cacheTimestamp = signal<number>(0);
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get dashboard facets data
   * Uses cache if available and not expired, otherwise fetches fresh data
   */
  getDashboardFacets(): Observable<FacetsResponse> {
    const now = Date.now();
    const cached = this.cachedData();
    const cacheAge = now - this.cacheTimestamp();

    // Return cached data if valid
    if (cached && cacheAge < this.CACHE_TTL) {
      return of(cached);
    }

    // Fetch fresh data from API
    return this.http.get<FacetsResponse>(this.apiUrl, {
      params: {
        query: '',
        topK: '100'
      }
    }).pipe(
      tap(data => {
        this.cachedData.set(data);
        this.cacheTimestamp.set(now);
      })
    );
  }

  /**
   * Calculate summary statistics from facets data
   */
  calculateSummaryStats(data: FacetsResponse): SummaryStats {
    const availabilities = data.facets.availabilities || [];
    const cities = data.facets.cities || [];

    const availableNow = availabilities.find(f => f.value === 'available')?.count || 0;
    const onNotice = availabilities.find(f => f.value === 'notice')?.count || 0;
    const citiesCovered = cities.length;

    return {
      totalProfiles: data.totalCount,
      availableNow,
      onNotice,
      citiesCovered
    };
  }

  /**
   * Transform facets data for donut/pie chart
   */
  transformForDonut(
    facets: Facet[],
    colorMap: Record<string, string>
  ): ChartData {
    return {
      labels: facets.map(f => this.capitalizeFirst(f.value)),
      datasets: [{
        data: facets.map(f => f.count),
        backgroundColor: facets.map(f => colorMap[f.value] || '#9e9e9e'),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };
  }

  /**
   * Transform facets data for horizontal bar chart
   */
  transformForHorizontalBar(
    facets: Facet[],
    maxItems: number = 10,
    colorScheme: ChartColorScheme = 'blue'
  ): ChartData {
    const limited = facets.slice(0, maxItems);
    const colors = CHART_COLOR_SCHEMES[colorScheme];

    return {
      labels: limited.map(f => this.capitalizeFirst(f.value)),
      datasets: [{
        label: 'Count',
        data: limited.map(f => f.count),
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 4
      }]
    };
  }

  /**
   * Get availability donut chart data
   */
  getAvailabilityChartData(facets: Facet[]): ChartData {
    return this.transformForDonut(facets, AVAILABILITY_COLORS);
  }

  /**
   * Get locations bar chart data
   */
  getLocationsChartData(
    facets: Facet[],
    maxItems: number = 10
  ): ChartData {
    return this.transformForHorizontalBar(facets, maxItems, 'blue');
  }

  /**
   * Get skills bar chart data
   */
  getSkillsChartData(
    facets: Facet[],
    maxItems: number = 10
  ): ChartData {
    return this.transformForHorizontalBar(facets, maxItems, 'purple');
  }

  /**
   * Capitalize first letter of string
   */
  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Clear cache (useful for refresh functionality)
   */
  clearCache(): void {
    this.cachedData.set(null);
    this.cacheTimestamp.set(0);
  }
}

import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { DashboardService } from '../../services/dashboard.service';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { DonutChartComponent } from '../../components/donut-chart/donut-chart.component';
import { HorizontalBarChartComponent } from '../../components/horizontal-bar-chart/horizontal-bar-chart.component';

import {
  FacetsResponse,
  LocationViewMode,
  SkillViewMode,
  ChartData
} from '../../models/dashboard.models';

/**
 * Dashboard Page Component
 *
 * Purpose: Container component for HR talent pool intelligence dashboard
 * Features: Summary cards, interactive charts, toggle views, click-to-filter navigation
 */
@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SummaryCardComponent,
    DonutChartComponent,
    HorizontalBarChartComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // State signals
  protected readonly facetsData = signal<FacetsResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  // View mode toggles
  protected readonly locationViewMode = signal<LocationViewMode>('cities');
  protected readonly skillViewMode = signal<SkillViewMode>('skills');

  // Computed signals for summary stats
  protected readonly summaryStats = computed(() => {
    const data = this.facetsData();
    if (!data) return null;
    return this.dashboardService.calculateSummaryStats(data);
  });

  // Computed signals for chart data
  protected readonly availabilityChartData = computed<ChartData | null>(() => {
    const data = this.facetsData();
    if (!data || !data.facets.availability) return null;
    return this.dashboardService.getAvailabilityChartData(data.facets.availability);
  });

  protected readonly locationsChartData = computed<ChartData | null>(() => {
    const data = this.facetsData();
    if (!data) return null;

    const facets = this.locationViewMode() === 'cities'
      ? data.facets.cities
      : data.facets.countries;

    return facets
      ? this.dashboardService.getLocationsChartData(facets, 10)
      : null;
  });

  protected readonly skillsChartData = computed<ChartData | null>(() => {
    const data = this.facetsData();
    if (!data) return null;

    const facets = this.skillViewMode() === 'skills'
      ? data.facets.skills
      : data.facets.technologies;

    return facets
      ? this.dashboardService.getSkillsChartData(facets, 10)
      : null;
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard data from API
   */
  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService
      .getDashboardFacets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.facetsData.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to load dashboard data');
          this.loading.set(false);
        }
      });
  }

  /**
   * Handle availability donut chart click
   */
  protected onAvailabilityClick(status: string): void {
    this.router.navigate(['/search'], {
      queryParams: { availability: status }
    });
  }

  /**
   * Handle location bar chart click
   */
  protected onLocationClick(location: string): void {
    const paramKey = this.locationViewMode() === 'cities' ? 'city' : 'country';

    this.router.navigate(['/search'], {
      queryParams: { [paramKey]: location }
    });
  }

  /**
   * Handle skill bar chart click
   */
  protected onSkillClick(skill: string): void {
    const viewMode = this.skillViewMode();

    this.router.navigate(['/search'], {
      queryParams: { [viewMode]: skill }
    });
  }

  /**
   * Refresh dashboard data
   */
  protected refreshDashboard(): void {
    this.dashboardService.clearCache();
    this.loadDashboardData();
  }
}

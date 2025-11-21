import { Component, ChangeDetectionStrategy, input, computed, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Status Distribution Chart Component
 *
 * Doughnut chart showing project distribution by status.
 *
 * Features:
 * - Interactive doughnut chart
 * - Status-based color coding
 * - Center label with total count
 * - Animated rendering
 * - Responsive design
 *
 * Design:
 * - Pythia color scheme
 * - Dark theme optimized
 * - Hover interactions
 */
@Component({
  selector: 'app-status-distribution-chart',
  imports: [CommonModule],
  templateUrl: './status-distribution-chart.component.html',
  styleUrl: './status-distribution-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDistributionChartComponent implements AfterViewInit {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Status distribution data */
  readonly statusData = input.required<Record<string, number>>();

  // ============================================================================
  // PROPERTIES
  // ============================================================================

  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Chart data formatted for Chart.js
   */
  protected readonly chartData = computed(() => {
    const data = this.statusData();
    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    const statusColors: Record<string, string> = {
      'ACTIVE': '#DC2626',      // Pythia red
      'COMPLETED': '#059669',   // Green
      'PLANNING': '#4F46E5',    // Indigo
      'ON_HOLD': '#2563EB',     // Blue
      'CANCELLED': '#6B7280',   // Gray
    };

    Object.entries(data).forEach(([status, count]) => {
      if (count > 0) {
        labels.push(status.replace('_', ' '));
        values.push(count);
        colors.push(statusColors[status] || '#9CA3AF');
      }
    });

    return { labels, values, colors };
  });

  /**
   * Total projects
   */
  protected readonly totalProjects = computed(() => {
    return Object.values(this.statusData()).reduce((sum, count) => sum + count, 0);
  });

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  constructor() {
    // Update chart when data changes
    effect(() => {
      const data = this.chartData();
      if (this.chart && data) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  // ============================================================================
  // CHART METHODS
  // ============================================================================

  /**
   * Initialize the chart
   */
  private initChart(): void {
    this.canvas = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!this.canvas) return;

    const data = this.chartData();
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.colors,
          borderColor: '#1a1a2e',
          borderWidth: 2,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#E5E7EB',
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#1a1a2e',
            titleColor: '#ffffff',
            bodyColor: '#E5E7EB',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = this.totalProjects();
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutCubic'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  /**
   * Update chart data
   */
  private updateChart(): void {
    if (!this.chart) return;

    const data = this.chartData();
    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.values;
    this.chart.data.datasets[0].backgroundColor = data.colors;
    this.chart.update();
  }

  /**
   * Destroy chart instance
   */
  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

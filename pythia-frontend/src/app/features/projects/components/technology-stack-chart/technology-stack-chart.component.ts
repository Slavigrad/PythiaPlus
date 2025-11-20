import { Component, ChangeDetectionStrategy, input, computed, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

/**
 * Technology Stack Chart Component
 *
 * Horizontal bar chart showing most-used technologies.
 *
 * Features:
 * - Top 10 technologies by usage
 * - Category-based color coding
 * - Usage count display
 * - Interactive hover
 * - Sorted by popularity
 *
 * Design:
 * - Category colors (Frontend/Backend/Database/etc)
 * - Dark theme optimized
 * - Horizontal orientation
 */
@Component({
  selector: 'app-technology-stack-chart',
  imports: [CommonModule],
  templateUrl: './technology-stack-chart.component.html',
  styleUrl: './technology-stack-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologyStackChartComponent implements AfterViewInit {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Technology usage data */
  readonly technologyData = input.required<Record<string, number>>();

  // ============================================================================
  // PROPERTIES
  // ============================================================================

  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // Technology category colors
  private readonly categoryColors: Record<string, string> = {
    'Angular': '#DC2626',
    'TypeScript': '#3B82F6',
    'PostgreSQL': '#059669',
    'Spring Boot': '#10B981',
    'Kotlin': '#7C3AED',
    'Docker': '#2563EB',
    'Kubernetes': '#4F46E5',
    'React': '#06B6D4',
    'Java': '#F59E0B',
    'MongoDB': '#059669',
    'Python': '#3B82F6',
    'Node.js': '#10B981',
    'AWS': '#F97316',
    'Azure': '#3B82F6'
  };

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Chart data sorted by usage
   */
  protected readonly chartData = computed(() => {
    const data = this.technologyData();

    // Convert to array and sort by count (descending)
    const sorted = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10

    const labels = sorted.map(([tech]) => tech);
    const values = sorted.map(([, count]) => count);
    const colors = sorted.map(([tech]) => this.categoryColors[tech] || '#9CA3AF');

    return { labels, values, colors };
  });

  /**
   * Total technologies
   */
  protected readonly totalTech = computed(() => {
    return Object.keys(this.technologyData()).length;
  });

  /**
   * Total usage count
   */
  protected readonly totalUsage = computed(() => {
    return Object.values(this.technologyData()).reduce((sum, count) => sum + count, 0);
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
    this.canvas = document.getElementById('techStackChart') as HTMLCanvasElement;
    if (!this.canvas) return;

    const data = this.chartData();
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Usage Count',
          data: data.values,
          backgroundColor: data.colors,
          borderColor: '#1a1a2e',
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
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
                const value = context.parsed.x;
                return `Used in ${value} project${value !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 11
              },
              stepSize: 1
            },
            beginAtZero: true
          },
          y: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#E5E7EB',
              font: {
                size: 12,
                weight: '500'
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

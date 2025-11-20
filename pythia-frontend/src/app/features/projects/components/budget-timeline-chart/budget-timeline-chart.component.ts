import { Component, ChangeDetectionStrategy, input, computed, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

/**
 * Budget Timeline Chart Component
 *
 * Multi-line chart showing budget allocated vs spent over time.
 *
 * Features:
 * - Two lines: Allocated (blue) and Spent (red)
 * - Area fill under lines
 * - Time-based x-axis
 * - Interactive tooltips
 * - Responsive design
 *
 * Design:
 * - Pythia color scheme
 * - Dark theme optimized
 * - Gradient area fills
 */
@Component({
  selector: 'app-budget-timeline-chart',
  imports: [CommonModule],
  templateUrl: './budget-timeline-chart.component.html',
  styleUrl: './budget-timeline-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetTimelineChartComponent implements AfterViewInit {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Total budget allocated */
  readonly totalAllocated = input(0);

  /** Total budget spent */
  readonly totalSpent = input(0);

  // ============================================================================
  // PROPERTIES
  // ============================================================================

  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Budget utilization percentage
   */
  protected readonly utilization = computed(() => {
    const allocated = this.totalAllocated();
    const spent = this.totalSpent();
    return allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  });

  /**
   * Remaining budget
   */
  protected readonly remaining = computed(() => {
    return this.totalAllocated() - this.totalSpent();
  });

  /**
   * Budget status
   */
  protected readonly budgetStatus = computed(() => {
    const util = this.utilization();
    if (util > 95) return 'critical';
    if (util > 80) return 'warning';
    return 'healthy';
  });

  /**
   * Mock timeline data for demonstration
   */
  protected readonly chartData = computed(() => {
    const allocated = this.totalAllocated();
    const spent = this.totalSpent();

    // Generate 6 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const allocatedData: number[] = [];
    const spentData: number[] = [];

    // Simulate progressive spending
    for (let i = 0; i < months.length; i++) {
      const progress = (i + 1) / months.length;
      allocatedData.push(Math.round(allocated * progress));
      // Spent follows allocated but with some variance
      const variance = 0.85 + (Math.random() * 0.15);
      spentData.push(Math.round(allocated * progress * variance * (spent / allocated)));
    }

    return { months, allocatedData, spentData };
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
    this.canvas = document.getElementById('budgetChart') as HTMLCanvasElement;
    if (!this.canvas) return;

    const data = this.chartData();
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: data.months,
        datasets: [
          {
            label: 'Allocated',
            data: data.allocatedData,
            borderColor: '#3B82F6',
            backgroundColor: this.createGradient(ctx, 'rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0)'),
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#1a1a2e',
            pointBorderWidth: 2,
          },
          {
            label: 'Spent',
            data: data.spentData,
            borderColor: '#DC2626',
            backgroundColor: this.createGradient(ctx, 'rgba(220, 38, 38, 0.1)', 'rgba(220, 38, 38, 0)'),
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#DC2626',
            pointBorderColor: '#1a1a2e',
            pointBorderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
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
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: $${this.formatNumber(value)}`;
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
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 11
              },
              callback: (value) => {
                return '$' + this.formatNumber(value as number);
              }
            },
            beginAtZero: true
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
   * Create gradient for area fill
   */
  private createGradient(ctx: CanvasRenderingContext2D, color1: string, color2: string): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  /**
   * Update chart data
   */
  private updateChart(): void {
    if (!this.chart) return;

    const data = this.chartData();
    this.chart.data.labels = data.months;
    this.chart.data.datasets[0].data = data.allocatedData;
    this.chart.data.datasets[1].data = data.spentData;
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

  /**
   * Format number with K/M suffix
   */
  private formatNumber(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  }

  /**
   * Format currency
   */
  protected formatCurrency(value: number): string {
    return '$' + this.formatNumber(value);
  }
}

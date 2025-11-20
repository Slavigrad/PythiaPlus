import { Component, ChangeDetectionStrategy, input, computed, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

/**
 * Progress Gauge Chart Component
 *
 * Radial gauge showing average project progress.
 *
 * Features:
 * - Semi-circle gauge design
 * - Color gradient based on progress
 * - Large percentage in center
 * - Animated arc sweep
 * - Responsive design
 *
 * Design:
 * - Red (0-25%) → Orange (25-50%) → Yellow (50-75%) → Green (75-100%)
 * - Dark theme optimized
 * - Cosmic glow effects
 */
@Component({
  selector: 'app-progress-gauge-chart',
  imports: [CommonModule],
  templateUrl: './progress-gauge-chart.component.html',
  styleUrl: './progress-gauge-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressGaugeChartComponent implements AfterViewInit {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Average progress percentage (0-100) */
  readonly averageProgress = input(0);

  /** Total number of projects */
  readonly totalProjects = input(0);

  // ============================================================================
  // PROPERTIES
  // ============================================================================

  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Progress color based on percentage
   */
  protected readonly progressColor = computed(() => {
    const progress = this.averageProgress();
    if (progress >= 75) return '#10B981'; // Green
    if (progress >= 50) return '#F59E0B'; // Orange/Yellow
    if (progress >= 25) return '#F97316'; // Orange
    return '#DC2626'; // Red
  });

  /**
   * Progress status text
   */
  protected readonly progressStatus = computed(() => {
    const progress = this.averageProgress();
    if (progress >= 75) return 'Excellent';
    if (progress >= 50) return 'Good';
    if (progress >= 25) return 'Fair';
    return 'Needs Focus';
  });

  /**
   * Chart data for gauge
   */
  protected readonly chartData = computed(() => {
    const progress = this.averageProgress();
    const remaining = 100 - progress;

    return {
      progress,
      remaining,
      color: this.progressColor()
    };
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
    this.canvas = document.getElementById('progressGauge') as HTMLCanvasElement;
    if (!this.canvas) return;

    const data = this.chartData();
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [{
          data: [data.progress, data.remaining],
          backgroundColor: [
            data.color,
            'rgba(255, 255, 255, 0.05)'
          ],
          borderColor: '#1a1a2e',
          borderWidth: 2,
          circumference: 180,
          rotation: 270,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutCubic'
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, chartArea: { left, right, top, bottom } } = chart;
          const centerX = (left + right) / 2;
          const centerY = (top + bottom) / 2 + 20;

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Draw percentage
          ctx.fillStyle = 'white';
          ctx.font = 'bold 48px Inter, sans-serif';
          ctx.fillText(`${data.progress}%`, centerX, centerY);

          ctx.restore();
        }
      }]
    };

    this.chart = new Chart(ctx, config);
  }

  /**
   * Update chart data
   */
  private updateChart(): void {
    if (!this.chart) return;

    const data = this.chartData();
    this.chart.data.datasets[0].data = [data.progress, data.remaining];
    this.chart.data.datasets[0].backgroundColor = [
      data.color,
      'rgba(255, 255, 255, 0.05)'
    ];
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

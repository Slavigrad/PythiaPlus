import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ActiveElement } from 'chart.js';
import { ChartData } from '../../models/dashboard.models';

/**
 * Donut Chart Component
 *
 * Purpose: Display data in a donut chart with center text and click interaction
 * Used in: Dashboard availability snapshot
 */
@Component({
  selector: 'app-donut-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonutChartComponent {
  // Inputs
  readonly data = input.required<ChartData>();
  readonly centerText = input<string>('');
  readonly clickable = input(true);

  // Outputs
  readonly chartClick = output<string>();

  // Chart configuration
  protected readonly chartOptions = computed<ChartConfiguration<'doughnut'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%', // Donut hole size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: {
            size: 14,
            family: 'Roboto, "Helvetica Neue", Arial, sans-serif'
          },
          color: '#212121'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(33, 33, 33, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const dataset = context.dataset.data;
            const total = dataset.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 750,
      easing: 'easeInOutQuart'
    }
  }));

  protected readonly chartType = 'doughnut' as const;

  /**
   * Handle chart click events from ng2-charts
   * Event structure: { event?: ChartEvent, active?: ActiveElement[] }
   */
  protected onChartClick(event: { event?: ChartEvent; active?: ActiveElement[] }): void {
    if (!this.clickable()) return;

    const activeElements = event.active;
    if (activeElements && activeElements.length > 0) {
      const element = activeElements[0];
      const index = element.index;

      const labels = this.data().labels;
      if (labels && labels[index]) {
        const label = labels[index].toString().toLowerCase();
        this.chartClick.emit(label);
      }
    }
  }

  /**
   * Calculate total count for center text
   */
  protected get totalCount(): number {
    const dataset = this.data().datasets[0];
    if (!dataset || !dataset.data) return 0;

    return dataset.data.reduce((a: number, b: number) => a + b, 0);
  }
}

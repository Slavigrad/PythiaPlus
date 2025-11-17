import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ActiveElement } from 'chart.js';
import { ChartData } from '../../models/dashboard.models';

/**
 * Horizontal Bar Chart Component
 *
 * Purpose: Display data in a horizontal bar chart with click interaction
 * Used in: Dashboard locations and skills widgets
 */
@Component({
  selector: 'app-horizontal-bar-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrl: './horizontal-bar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalBarChartComponent {
  // Inputs
  readonly data = input.required<ChartData>();
  readonly clickable = input(true);
  readonly height = input<number>(400);

  // Outputs
  readonly chartClick = output<string>();

  // Chart configuration
  protected readonly chartOptions = computed<ChartConfiguration<'bar'>['options']>(() => ({
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(33, 33, 33, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return ` Count: ${context.parsed.x}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 12,
            family: 'Roboto, "Helvetica Neue", Arial, sans-serif'
          },
          color: '#757575'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 13,
            family: 'Roboto, "Helvetica Neue", Arial, sans-serif'
          },
          color: '#212121'
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  }));

  protected readonly chartType = 'bar' as const;

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
        const label = labels[index].toString();
        this.chartClick.emit(label);
      }
    }
  }
}

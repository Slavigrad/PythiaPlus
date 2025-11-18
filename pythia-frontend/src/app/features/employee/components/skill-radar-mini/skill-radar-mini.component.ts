/**
 * Skill Radar Mini Component - Pythia+
 *
 * Compact radar chart showing top 5 skills proficiency
 * Uses Chart.js for visualization
 */

import {
  Component,
  input,
  computed,
  signal,
  effect,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { Employee } from '../../../../models/employee.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-skill-radar-mini',
  imports: [CommonModule],
  template: `
    <div class="skill-radar-mini">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: `
    .skill-radar-mini {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-sm);
    }

    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `
})
export class SkillRadarMiniComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly employee = input.required<Employee>();

  private chart: Chart | null = null;

  // Computed - Top 5 skills with proficiency
  protected readonly topSkills = computed(() => {
    const employee = this.employee();
    const allSkills = [
      ...employee.technologies.map(t => ({
        name: t.name,
        proficiency: t.proficiency,
        years: t.years
      })),
      ...employee.skills.map(s => ({
        name: s.name,
        proficiency: s.proficiency,
        years: s.years
      }))
    ];

    // Sort by proficiency and years
    const proficiencyOrder: Record<string, number> = {
      expert: 4,
      advanced: 3,
      intermediate: 2,
      beginner: 1
    };

    return allSkills
      .sort((a, b) => {
        const profDiff = proficiencyOrder[b.proficiency] - proficiencyOrder[a.proficiency];
        if (profDiff !== 0) return profDiff;
        return b.years - a.years;
      })
      .slice(0, 5);
  });

  // Computed - Chart data
  protected readonly chartData = computed(() => {
    const skills = this.topSkills();
    const proficiencyValues: Record<string, number> = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100
    };

    return {
      labels: skills.map(s => s.name),
      values: skills.map(s => proficiencyValues[s.proficiency] || 0)
    };
  });

  constructor() {
    // Rebuild chart when data changes
    effect(() => {
      // Trigger when chartData changes
      this.chartData();
      if (this.chart) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.canvasRef) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.chartData();

    const config: ChartConfiguration = {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Proficiency',
          data: data.values,
          backgroundColor: 'rgba(211, 47, 47, 0.2)',
          borderColor: 'rgba(211, 47, 47, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(211, 47, 47, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(211, 47, 47, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.r;
                let proficiency = 'Beginner';
                if (value >= 75) proficiency = 'Expert';
                else if (value >= 50) proficiency = 'Advanced';
                else if (value >= 25) proficiency = 'Intermediate';

                return `${context.label}: ${proficiency}`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 25,
              display: false
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 11,
                weight: '600'
              },
              color: '#424242'
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    const data = this.chartData();
    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.values;
    this.chart.update();
  }
}

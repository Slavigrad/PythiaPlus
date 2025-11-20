import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';

/**
 * Projects Page Component
 *
 * Main orchestrator for the Projects feature with three viewing modes:
 * 1. Constellation View - 3D visualization of projects as glowing orbs
 * 2. Command Center - Power user list view with advanced filtering
 * 3. Analytics Temple - Data visualization and insights dashboard
 *
 * Phase 1: Basic shell with service integration
 * Phase 2: Command Center view implementation
 * Phase 3: Constellation View with Three.js
 * Phase 4: Analytics Temple with Chart.js
 */
@Component({
  selector: 'app-projects-page',
  imports: [CommonModule],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit {
  // Inject services
  protected readonly projectsService = inject(ProjectsService);

  // View mode: 'constellation' | 'command' | 'analytics'
  protected readonly viewMode = signal<'constellation' | 'command' | 'analytics'>('command');

  // Component lifecycle
  ngOnInit(): void {
    // Load projects on component initialization
    this.loadProjects();
  }

  /**
   * Load projects with current filters
   */
  protected loadProjects(): void {
    this.projectsService.loadProjects();
  }

  /**
   * Switch view mode
   */
  protected switchViewMode(mode: 'constellation' | 'command' | 'analytics'): void {
    this.viewMode.set(mode);
  }

  /**
   * Get total project count
   */
  protected get totalProjects(): number {
    return this.projectsService.totalProjects();
  }

  /**
   * Get loading state
   */
  protected get isLoading(): boolean {
    return this.projectsService.loading();
  }

  /**
   * Get error state
   */
  protected get error(): string | null {
    return this.projectsService.error();
  }
}

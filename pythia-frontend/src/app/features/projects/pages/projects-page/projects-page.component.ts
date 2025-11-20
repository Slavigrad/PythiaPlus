import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { AdvancedFiltersComponent } from '../../components/advanced-filters/advanced-filters.component';
import { ProjectSearchComponent } from '../../components/project-search/project-search.component';
import { Project, ProjectQueryParams } from '../../../../models';

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
  imports: [CommonModule, ProjectCardComponent, AdvancedFiltersComponent, ProjectSearchComponent],
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

  /**
   * Handle project card click
   */
  protected handleProjectClick(project: Project): void {
    console.log('Project clicked:', project);
    // TODO: Open project detail panel
  }

  /**
   * Handle view details click
   */
  protected handleViewDetails(project: Project): void {
    console.log('View details:', project);
    // TODO: Open project detail panel
  }

  /**
   * Handle edit project click
   */
  protected handleEditProject(project: Project): void {
    console.log('Edit project:', project);
    // TODO: Open edit form
  }

  /**
   * Handle delete project click
   */
  protected handleDeleteProject(project: Project): void {
    console.log('Delete project:', project);
    // TODO: Show confirmation dialog
  }

  /**
   * Handle filters change
   */
  protected handleFiltersChange(filters: ProjectQueryParams): void {
    console.log('Filters changed:', filters);
    // Service automatically handles the filter application
  }
}

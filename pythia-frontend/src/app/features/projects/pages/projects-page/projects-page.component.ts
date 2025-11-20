import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { AdvancedFiltersComponent } from '../../components/advanced-filters/advanced-filters.component';
import { ProjectSearchComponent } from '../../components/project-search/project-search.component';
import { ProjectDetailPanelComponent } from '../../components/project-detail-panel/project-detail-panel.component';
import { Project, ProjectDetail, ProjectQueryParams } from '../../../../models';

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
  imports: [
    CommonModule,
    ProjectCardComponent,
    AdvancedFiltersComponent,
    ProjectSearchComponent,
    ProjectDetailPanelComponent
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit {
  // Inject services
  protected readonly projectsService = inject(ProjectsService);

  // View mode: 'constellation' | 'command' | 'analytics'
  protected readonly viewMode = signal<'constellation' | 'command' | 'analytics'>('command');

  // Detail panel state
  protected readonly selectedProject = signal<ProjectDetail | null>(null);
  protected readonly isPanelOpen = signal(false);

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
    this.openDetailPanel(project.id);
  }

  /**
   * Handle view details click
   */
  protected handleViewDetails(project: Project): void {
    this.openDetailPanel(project.id);
  }

  /**
   * Handle edit project click from card
   */
  protected handleEditProject(project: Project): void {
    console.log('Edit project:', project);
    // TODO: Open edit form
  }

  /**
   * Handle delete project click from card
   */
  protected handleDeleteProject(project: Project): void {
    console.log('Delete project:', project);
    // TODO: Show confirmation dialog
  }

  /**
   * Open detail panel with project details
   */
  protected openDetailPanel(projectId: number): void {
    // Load detailed project data
    this.projectsService.getProjectById(projectId).subscribe({
      next: (projectDetail) => {
        this.selectedProject.set(projectDetail);
        this.isPanelOpen.set(true);
      },
      error: (err) => {
        console.error('Failed to load project details:', err);
        // TODO: Show error notification
      }
    });
  }

  /**
   * Close detail panel
   */
  protected closeDetailPanel(): void {
    this.isPanelOpen.set(false);
    // Clear selected project after animation completes
    setTimeout(() => {
      if (!this.isPanelOpen()) {
        this.selectedProject.set(null);
      }
    }, 400);
  }

  /**
   * Handle edit from detail panel
   */
  protected handleEditFromPanel(project: ProjectDetail): void {
    console.log('Edit project from panel:', project);
    this.closeDetailPanel();
    // TODO: Open edit form
  }

  /**
   * Handle delete from detail panel
   */
  protected handleDeleteFromPanel(project: ProjectDetail): void {
    console.log('Delete project from panel:', project);
    // TODO: Show confirmation dialog
    // After confirmation:
    // this.projectsService.deleteProject(project.id).subscribe(() => {
    //   this.closeDetailPanel();
    //   this.loadProjects();
    // });
  }

  /**
   * Handle filters change
   */
  protected handleFiltersChange(filters: ProjectQueryParams): void {
    console.log('Filters changed:', filters);
    // Service automatically handles the filter application
  }
}

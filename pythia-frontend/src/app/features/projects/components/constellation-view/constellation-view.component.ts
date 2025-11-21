import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  viewChild,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { Project } from '../../../../models';

/**
 * Constellation View Component
 *
 * 3D visualization of projects as glowing orbs in cosmic space.
 *
 * Features:
 * - Each project = glowing sphere in 3D space
 * - Size based on team size
 * - Color based on status
 * - Floating animation
 * - Orbit controls (mouse drag)
 * - Click to select project
 * - Particle star field background
 * - Auto-rotation
 *
 * Design:
 * - Cosmic dark space theme
 * - Glowing orbs with bloom effect
 * - Smooth animations
 * - Interactive camera
 */
@Component({
  selector: 'app-constellation-view',
  imports: [CommonModule],
  templateUrl: './constellation-view.component.html',
  styleUrl: './constellation-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstellationViewComponent implements AfterViewInit, OnDestroy {
  // ============================================================================
  // INPUTS & OUTPUTS
  // ============================================================================

  /** Projects to visualize */
  readonly projects = input.required<Project[]>();

  /** Project selected event */
  readonly projectSelect = output<Project>();

  // ============================================================================
  // VIEW CHILDREN
  // ============================================================================

  private readonly canvasContainer = viewChild<ElementRef>('canvasContainer');

  // ============================================================================
  // THREE.JS PROPERTIES
  // ============================================================================

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private projectMeshes: Map<number, THREE.Mesh> = new Map();
  private animationId: number | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private stars: THREE.Points | null = null;

  // Camera controls
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private cameraRotation = { x: 0, y: 0 };
  private cameraDistance = 50;

  // Status colors
  private readonly statusColors: Record<string, number> = {
    'ACTIVE': 0xDC2626,      // Pythia red
    'COMPLETED': 0x059669,   // Green
    'PLANNING': 0x4F46E5,    // Indigo
    'ON_HOLD': 0x2563EB,     // Blue
    'CANCELLED': 0x6B7280    // Gray
  };

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  constructor() {
    // Rebuild scene when projects change
    effect(() => {
      const projectList = this.projects();
      if (this.scene && projectList) {
        this.updateProjectOrbs();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.createStarField();
    this.createProjectOrbs();
    this.setupEventListeners();
    this.animate();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // ============================================================================
  // THREE.JS INITIALIZATION
  // ============================================================================

  /**
   * Initialize Three.js scene, camera, and renderer
   */
  private initThreeJS(): void {
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a1a, 30, 100);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 20, this.cameraDistance);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a0a1a, 1);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(0, 20, 20);
    this.scene.add(pointLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Create star field background
   */
  private createStarField(): void {
    const starCount = 5000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;     // x
      positions[i + 1] = (Math.random() - 0.5) * 200; // y
      positions[i + 2] = (Math.random() - 0.5) * 200; // z
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  /**
   * Create 3D orbs for each project
   */
  private createProjectOrbs(): void {
    const projectList = this.projects();
    const count = projectList.length;
    const radius = 30;

    projectList.forEach((project, index) => {
      // Calculate position in a spiral pattern
      const angle = (index / count) * Math.PI * 4;
      const height = (index / count - 0.5) * 40;
      const distance = radius + Math.sin(angle * 2) * 5;

      const x = Math.cos(angle) * distance;
      const y = height;
      const z = Math.sin(angle) * distance;

      // Size based on team size (or default)
      const teamSize = project.team?.totalMembers || 5;
      const size = 0.5 + (teamSize / 20);

      // Create orb
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const color = this.statusColors[project.status] || 0x9CA3AF;

      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = { project, originalY: y };

      this.scene.add(mesh);
      this.projectMeshes.set(project.id, mesh);
    });
  }

  /**
   * Update project orbs when data changes
   */
  private updateProjectOrbs(): void {
    // Clear existing meshes
    this.projectMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.projectMeshes.clear();

    // Create new orbs
    this.createProjectOrbs();
  }

  // ============================================================================
  // ANIMATION
  // ============================================================================

  /**
   * Animation loop
   */
  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate star field slowly
    if (this.stars) {
      this.stars.rotation.y += 0.0002;
    }

    // Animate project orbs (floating)
    const time = Date.now() * 0.001;
    this.projectMeshes.forEach((mesh, id) => {
      const originalY = mesh.userData['originalY'];
      mesh.position.y = originalY + Math.sin(time + id * 0.5) * 0.5;
      mesh.rotation.y += 0.01;
    });

    // Update camera position
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Update camera based on mouse controls
   */
  private updateCamera(): void {
    const x = Math.sin(this.cameraRotation.y) * this.cameraDistance;
    const z = Math.cos(this.cameraRotation.y) * this.cameraDistance;
    const y = this.cameraRotation.x * 10 + 20;

    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
    this.camera.lookAt(0, 0, 0);
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Setup event listeners for mouse interaction
   */
  private setupEventListeners(): void {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.onMouseUp());
    canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e));
    canvas.addEventListener('click', (e: MouseEvent) => this.onClick(e));
  }

  /**
   * Mouse down - start dragging
   */
  private onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  /**
   * Mouse move - rotate camera
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    this.cameraRotation.y += deltaX * 0.005;
    this.cameraRotation.x -= deltaY * 0.005;

    // Clamp vertical rotation
    this.cameraRotation.x = Math.max(-1, Math.min(1, this.cameraRotation.x));

    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  /**
   * Mouse up - stop dragging
   */
  private onMouseUp(): void {
    this.isDragging = false;
  }

  /**
   * Mouse wheel - zoom in/out
   */
  private onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    this.cameraDistance += event.deltaY * 0.05;
    this.cameraDistance = Math.max(20, Math.min(100, this.cameraDistance));
  }

  /**
   * Click - select project
   */
  private onClick(event: MouseEvent): void {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = Array.from(this.projectMeshes.values());
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object as THREE.Mesh;
      const project = selectedMesh.userData['project'];
      this.projectSelect.emit(project);
    }
  }

  /**
   * Window resize handler
   */
  private onWindowResize(): void {
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Cleanup Three.js resources
   */
  private cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', () => this.onWindowResize());

    // Dispose geometries and materials
    this.projectMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

/**
 * 3D Tilt Directive - Pythia+ Ultra Premium (Angular 20)
 *
 * Adds interactive 3D tilt effect to elements based on mouse movement
 * Creates premium parallax effect for cards and interactive elements
 *
 * Modern Angular 20 Features:
 * - Signal inputs for reactive configuration
 * - host object for event bindings (no @HostListener decorators)
 * - Computed signals for derived styles
 * - inject() function for DI
 *
 * Usage:
 * <div appTilt3d [tiltIntensity]="15" [glareEffect]="true">Content</div>
 */

import {
  Directive,
  ElementRef,
  input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject,
  computed
} from '@angular/core';

@Directive({
  selector: '[appTilt3d]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(mousemove)': 'onMouseMove($event)',
    '[style.transform-style]': '"preserve-3d"',
    '[style.transition]': 'transitionStyle()'
  }
})
export class Tilt3dDirective implements OnInit, OnDestroy {
  // Signal Inputs
  readonly tiltIntensity = input(15); // Max tilt angle in degrees
  readonly glareEffect = input(false); // Enable glare overlay
  readonly scale = input(1.05); // Scale on hover
  readonly speed = input(300); // Transition speed in ms
  readonly perspective = input(1000); // CSS perspective value

  // Computed Signals
  protected readonly transitionStyle = computed(() =>
    `transform ${this.speed()}ms cubic-bezier(0.23, 1, 0.32, 1)`
  );

  // Dependencies (inject function - Angular 20 pattern)
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  // Internal State
  private glareElement: HTMLElement | null = null;
  private isHovering = false;

  ngOnInit(): void {
    this.setupElement();
    if (this.glareEffect()) {
      this.createGlareElement();
    }
  }

  ngOnDestroy(): void {
    if (this.glareElement) {
      this.glareElement.remove();
    }
  }

  private setupElement(): void {
    // Note: transform-style and transition are now set via host binding
    // This keeps the directive cleaner and more Angular 20-compliant
  }

  private createGlareElement(): void {
    const element = this.el.nativeElement;
    this.glareElement = this.renderer.createElement('div');

    this.renderer.addClass(this.glareElement, 'tilt-glare');
    this.renderer.setStyle(this.glareElement, 'position', 'absolute');
    this.renderer.setStyle(this.glareElement, 'top', '0');
    this.renderer.setStyle(this.glareElement, 'left', '0');
    this.renderer.setStyle(this.glareElement, 'width', '100%');
    this.renderer.setStyle(this.glareElement, 'height', '100%');
    this.renderer.setStyle(this.glareElement, 'border-radius', 'inherit');
    this.renderer.setStyle(this.glareElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.glareElement, 'opacity', '0');
    this.renderer.setStyle(this.glareElement, 'transition', `opacity ${this.speed()}ms ease`);
    this.renderer.setStyle(this.glareElement, 'background',
      'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)');
    this.renderer.setStyle(this.glareElement, 'mix-blend-mode', 'overlay');

    this.renderer.appendChild(element, this.glareElement);
  }

  // Event Handlers (bound via host object - Angular 20 pattern)
  protected onMouseEnter(): void {
    this.isHovering = true;
    if (this.glareElement) {
      this.renderer.setStyle(this.glareElement, 'opacity', '1');
    }
  }

  protected onMouseLeave(): void {
    this.isHovering = false;
    this.resetTilt();
    if (this.glareElement) {
      this.renderer.setStyle(this.glareElement, 'opacity', '0');
    }
  }

  protected onMouseMove(event: MouseEvent): void {
    if (!this.isHovering) return;

    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();

    // Calculate mouse position relative to element (0 to 1)
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Calculate tilt angles
    const tiltX = (y - 0.5) * this.tiltIntensity() * -2; // Invert Y for natural feel
    const tiltY = (x - 0.5) * this.tiltIntensity() * 2;

    // Apply transform
    const transform = `
      perspective(${this.perspective()}px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale3d(${this.scale()}, ${this.scale()}, ${this.scale()})
    `;

    this.renderer.setStyle(element, 'transform', transform);

    // Update glare position
    if (this.glareElement) {
      const glareX = x * 100;
      const glareY = y * 100;
      this.renderer.setStyle(
        this.glareElement,
        'background',
        `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`
      );
    }
  }

  private resetTilt(): void {
    const element = this.el.nativeElement;
    this.renderer.setStyle(
      element,
      'transform',
      `perspective(${this.perspective()}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
  }
}

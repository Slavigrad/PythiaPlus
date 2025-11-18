import { Component, ChangeDetectionStrategy, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Employee Create Button - "Oracle's Summons"
 *
 * A visually stunning hero button with:
 * - Magnetic hover effect (elements pull toward cursor)
 * - Gradient glow with animated pulse
 * - 3D elevation with dramatic shadows
 * - Ripple effect on click
 * - Icon transformation animation
 * - Letter-spacing animation on hover
 *
 * This isn't just a button - it's an invitation to discover talent.
 */
@Component({
  selector: 'app-employee-create-button',
  imports: [CommonModule],
  templateUrl: './employee-create-button.component.html',
  styleUrl: './employee-create-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'employee-create-button-wrapper'
  }
})
export class EmployeeCreateButtonComponent {
  // Emit event when button is clicked
  readonly createClick = output<void>();

  // Track mouse position for magnetic effect
  protected readonly mouseX = signal(0);
  protected readonly mouseY = signal(0);
  protected readonly isHovering = signal(false);

  // Ripple animation state
  protected readonly showRipple = signal(false);
  protected readonly rippleX = signal(0);
  protected readonly rippleY = signal(0);

  /**
   * Handle mouse move for magnetic effect
   */
  protected onMouseMove(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    // Calculate mouse position relative to button center
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    this.mouseX.set(x * 0.15); // Reduced multiplier for subtle effect
    this.mouseY.set(y * 0.15);
  }

  /**
   * Reset magnetic effect on mouse leave
   */
  protected onMouseLeave(): void {
    this.mouseX.set(0);
    this.mouseY.set(0);
    this.isHovering.set(false);
  }

  /**
   * Set hovering state
   */
  protected onMouseEnter(): void {
    this.isHovering.set(true);
  }

  /**
   * Handle button click with ripple effect
   */
  protected onClick(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    // Calculate ripple position
    this.rippleX.set(event.clientX - rect.left);
    this.rippleY.set(event.clientY - rect.top);

    // Show ripple
    this.showRipple.set(true);

    // Hide ripple after animation
    setTimeout(() => this.showRipple.set(false), 600);

    // Emit create event
    this.createClick.emit();
  }
}

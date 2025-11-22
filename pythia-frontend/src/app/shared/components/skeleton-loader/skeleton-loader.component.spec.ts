import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default number of skeleton lines', () => {
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-loader');
    expect(skeletons.length).toBe(1);
  });

  it('should render specified number of skeleton lines', () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-loader');
    expect(skeletons.length).toBe(3);
  });

  it('should apply default height', () => {
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.style.height).toBe('16px');
  });

  it('should apply custom height', () => {
    fixture.componentRef.setInput('height', 24);
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.style.height).toBe('24px');
  });

  it('should apply default width', () => {
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.style.width).toBe('100%');
  });

  it('should apply custom width', () => {
    fixture.componentRef.setInput('width', '50%');
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.style.width).toBe('50%');
  });

  it('should apply circle class for circle type', () => {
    fixture.componentRef.setInput('type', 'circle');
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.classList.contains('skeleton-circle')).toBe(true);
  });

  it('should apply rectangle class for rectangle type', () => {
    fixture.componentRef.setInput('type', 'rectangle');
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.classList.contains('skeleton-rectangle')).toBe(true);
  });

  it('should apply custom border radius', () => {
    fixture.componentRef.setInput('borderRadius', '8px');
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.style.borderRadius).toBe('8px');
  });

  it('should have loading role for accessibility', () => {
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeleton.getAttribute('role')).toBe('status');
    expect(skeleton.getAttribute('aria-label')).toBe('Loading content');
  });

  it('should have visually hidden loading text', () => {
    fixture.detectChanges();
    const hiddenText = fixture.nativeElement.querySelector('.visually-hidden');
    expect(hiddenText).toBeTruthy();
    expect(hiddenText.textContent).toBe('Loading...');
  });

  it('should render zero skeletons when count is 0', () => {
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-loader');
    expect(skeletons.length).toBe(0);
  });
});

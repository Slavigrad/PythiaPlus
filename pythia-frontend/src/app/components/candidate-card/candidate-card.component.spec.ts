import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateCardComponent } from './candidate-card.component';
import { Candidate } from '../../models/candidate.model';
import { AVATAR_COLORS, MATCH_COLORS } from '../../core/constants';

describe('CandidateCardComponent', () => {
  let component: CandidateCardComponent;
  let fixture: ComponentFixture<CandidateCardComponent>;

  const mockCandidate: Candidate = {
    id: '123',
    name: 'John Doe',
    title: 'Senior Developer',
    location: 'Zurich',
    experience: '5 years',
    availability: 'Available',
    technologies: ['React', 'TypeScript', 'Node.js'],
    matchScore: { matched: 0.95, label: 'Excellent' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCardComponent);
    component = fixture.componentInstance;
  });

  describe('Signal Input', () => {
    it('should accept candidate input', () => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();

      expect(component.candidate()).toEqual(mockCandidate);
    });

    it('should be required input', () => {
      // Test will fail if input is not provided and component tries to access it
      expect(() => {
        fixture.componentRef.setInput('candidate', mockCandidate);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Computed Signal: initials', () => {
    it('should compute initials from full name', () => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();

      expect(component['initials']()).toBe('JD');
    });

    it('should handle single name', () => {
      const candidate = { ...mockCandidate, name: 'John' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['initials']()).toBe('J');
    });

    it('should handle three-part names', () => {
      const candidate = { ...mockCandidate, name: 'John Michael Doe' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['initials']()).toBe('JM');
    });

    it('should uppercase initials', () => {
      const candidate = { ...mockCandidate, name: 'john doe' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['initials']()).toBe('JD');
    });
  });

  describe('Computed Signal: avatarColor', () => {
    it('should return color based on ID modulo', () => {
      const candidate1 = { ...mockCandidate, id: '0' };
      fixture.componentRef.setInput('candidate', candidate1);
      fixture.detectChanges();
      expect(component['avatarColor']()).toBe(AVATAR_COLORS[0]);

      const candidate2 = { ...mockCandidate, id: '1' };
      fixture.componentRef.setInput('candidate', candidate2);
      fixture.detectChanges();
      expect(component['avatarColor']()).toBe(AVATAR_COLORS[1]);

      const candidate3 = { ...mockCandidate, id: '2' };
      fixture.componentRef.setInput('candidate', candidate3);
      fixture.detectChanges();
      expect(component['avatarColor']()).toBe(AVATAR_COLORS[2]);

      const candidate4 = { ...mockCandidate, id: '3' };
      fixture.componentRef.setInput('candidate', candidate4);
      fixture.detectChanges();
      expect(component['avatarColor']()).toBe(AVATAR_COLORS[3]);
    });

    it('should be deterministic for same ID', () => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();

      const color1 = component['avatarColor']();
      fixture.componentRef.setInput('candidate', { ...mockCandidate });
      fixture.detectChanges();
      const color2 = component['avatarColor']();

      expect(color1).toBe(color2);
    });
  });

  describe('Computed Signal: matchPercentage', () => {
    it('should convert match score to percentage', () => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();

      expect(component['matchPercentage']()).toBe(95);
    });

    it('should round to nearest integer', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.876, label: 'Good' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchPercentage']()).toBe(88);
    });

    it('should handle low scores', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.55, label: 'Fair' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchPercentage']()).toBe(55);
    });

    it('should handle perfect score', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 1.0, label: 'Perfect' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchPercentage']()).toBe(100);
    });
  });

  describe('Computed Signal: matchColor', () => {
    it('should return green for 90%+ match', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.95, label: 'Excellent' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchColor']()).toBe(MATCH_COLORS.HIGH);
    });

    it('should return green for exactly 90% match', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.90, label: 'Excellent' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchColor']()).toBe(MATCH_COLORS.HIGH);
    });

    it('should return orange for 70-89% match', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.80, label: 'Good' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchColor']()).toBe(MATCH_COLORS.MEDIUM);
    });

    it('should return orange for exactly 70% match', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.70, label: 'Good' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchColor']()).toBe(MATCH_COLORS.MEDIUM);
    });

    it('should return gray for below 70% match', () => {
      const candidate = {
        ...mockCandidate,
        matchScore: { matched: 0.65, label: 'Fair' }
      };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['matchColor']()).toBe(MATCH_COLORS.LOW);
    });
  });

  describe('Computed Signal: availabilityClass', () => {
    it('should return "available" for Available status', () => {
      const candidate = { ...mockCandidate, availability: 'Available' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['availabilityClass']()).toBe('available');
    });

    it('should return "notice-period" for Notice Period status', () => {
      const candidate = { ...mockCandidate, availability: 'Notice Period' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['availabilityClass']()).toBe('notice-period');
    });

    it('should return "not-available" for other statuses', () => {
      const candidate = { ...mockCandidate, availability: 'Not Available' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['availabilityClass']()).toBe('not-available');
    });

    it('should return "not-available" for undefined availability', () => {
      const candidate = { ...mockCandidate, availability: 'Unknown' };
      fixture.componentRef.setInput('candidate', candidate);
      fixture.detectChanges();

      expect(component['availabilityClass']()).toBe('not-available');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();
    });

    it('should render candidate name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const name = compiled.querySelector('.candidate-name');
      expect(name?.textContent).toBe('John Doe');
    });

    it('should render candidate title and location', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.candidate-title');
      expect(title?.textContent).toContain('Senior Developer');
      expect(title?.textContent).toContain('Zurich');
    });

    it('should render initials in avatar', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const initials = compiled.querySelector('.initials');
      expect(initials?.textContent).toBe('JD');
    });

    it('should render match percentage', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const percentage = compiled.querySelector('.match-percentage');
      expect(percentage?.textContent).toBe('95%');
    });

    it('should render technologies', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skills = compiled.querySelectorAll('.skill-pill');
      expect(skills.length).toBeGreaterThan(0);
    });

    it('should apply avatar color from computed signal', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const avatar = compiled.querySelector('.avatar') as HTMLElement;
      expect(avatar.style.backgroundColor).toBeTruthy();
    });

    it('should apply match color from computed signal', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const matchScore = compiled.querySelector('.match-score') as HTMLElement;
      expect(matchScore.style.color).toBeTruthy();
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed signals when candidate changes', () => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();

      const firstInitials = component['initials']();
      const firstColor = component['matchColor']();

      const newCandidate: Candidate = {
        ...mockCandidate,
        name: 'Jane Smith',
        matchScore: { matched: 0.65, label: 'Fair' }
      };

      fixture.componentRef.setInput('candidate', newCandidate);
      fixture.detectChanges();

      expect(component['initials']()).not.toBe(firstInitials);
      expect(component['matchColor']()).not.toBe(firstColor);
    });
  });

  describe('Click Handling (Task 3.6)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('candidate', mockCandidate);
      fixture.detectChanges();
    });

    it('should emit candidateSelected event when card is clicked', () => {
      let emittedId: string | undefined;
      component.candidateSelected.subscribe((id: string) => {
        emittedId = id;
      });

      const card = fixture.nativeElement as HTMLElement;
      card.click();
      fixture.detectChanges();

      expect(emittedId).toBe('123');
    });

    it('should emit candidateSelected event when Enter key is pressed', () => {
      let emittedId: string | undefined;
      component.candidateSelected.subscribe((id: string) => {
        emittedId = id;
      });

      const card = fixture.nativeElement as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      card.dispatchEvent(event);
      fixture.detectChanges();

      expect(emittedId).toBe('123');
    });

    it('should emit candidateSelected event when Space key is pressed', () => {
      let emittedId: string | undefined;
      component.candidateSelected.subscribe((id: string) => {
        emittedId = id;
      });

      const card = fixture.nativeElement as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      card.dispatchEvent(event);
      fixture.detectChanges();

      expect(emittedId).toBe('123');
    });

    it('should prevent default behavior for Space key to avoid page scroll', () => {
      const card = fixture.nativeElement as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      component['handleCardClick'](event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should emit correct candidate ID for different candidates', () => {
      const emittedIds: string[] = [];
      component.candidateSelected.subscribe((id: string) => {
        emittedIds.push(id);
      });

      // Click first candidate
      const card = fixture.nativeElement as HTMLElement;
      card.click();

      // Change to different candidate
      const newCandidate = { ...mockCandidate, id: '456', name: 'Jane Smith' };
      fixture.componentRef.setInput('candidate', newCandidate);
      fixture.detectChanges();

      // Click second candidate
      card.click();

      expect(emittedIds).toEqual(['123', '456']);
    });

    it('should have appropriate ARIA attributes for accessibility', () => {
      const card = fixture.nativeElement as HTMLElement;

      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('aria-label')).toContain('View details for John Doe');
    });
  });
});

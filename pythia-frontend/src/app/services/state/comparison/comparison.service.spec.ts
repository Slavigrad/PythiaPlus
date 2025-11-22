import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComparisonService } from './comparison.service';
import { CandidateProfile } from '../models/candidate-profile.model';
import { environment } from '../../environments/environment';

describe('ComparisonService', () => {
  let service: ComparisonService;
  let httpMock: HttpTestingController;

  const mockCandidateProfile1: CandidateProfile = {
    id: '1',
    name: 'John Doe',
    title: 'Senior Full Stack Developer',
    location: 'Zurich',
    profilePicture: '',
    experience: '6 years',
    availability: 'Available',
    technologies: ['Node.js', 'React', 'PostgreSQL'],
    skills: ['Node.js', 'React', 'PostgreSQL'],
    certifications: ['AWS Solutions Architect'],
    currentProject: { name: 'E-Commerce Platform', company: 'Tech Corp' },
    matchScore: { matched: 0.95, total: 1 },
    experienceDetails: { totalYears: 6, level: 'Senior' },
    availabilityDetails: { status: 'Available', startDate: '2025-12-01' },
    detailedTechnologies: [
      { name: 'Node.js', yearsExperience: 7, proficiency: 'Expert' },
      { name: 'React', yearsExperience: 5, proficiency: 'Expert' }
    ],
    trainings: [{ name: 'Angular', provider: 'Google' }],
    detailedCertifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', issuedDate: '2023-05' }
    ],
    currentProjectDetails: {
      name: 'E-Commerce Platform',
      company: 'Tech Corp',
      role: 'Lead Developer',
      startDate: '2024-01'
    }
  };

  const mockCandidateProfile2: CandidateProfile = {
    id: '2',
    name: 'Jane Smith',
    title: 'Frontend Engineer',
    location: 'Bern',
    profilePicture: '',
    experience: '4 years',
    availability: 'Available',
    technologies: ['React', 'TypeScript'],
    skills: ['React', 'TypeScript'],
    certifications: [],
    currentProject: null,
    matchScore: { matched: 0.88, total: 1 },
    experienceDetails: { totalYears: 4, level: 'Mid' },
    availabilityDetails: { status: 'Available' },
    detailedTechnologies: [
      { name: 'React', yearsExperience: 4, proficiency: 'Expert' },
      { name: 'TypeScript', yearsExperience: 3, proficiency: 'Intermediate' }
    ],
    trainings: [],
    detailedCertifications: []
  };

  const mockCandidateProfile3: CandidateProfile = {
    id: '3',
    name: 'Bob Johnson',
    title: 'Backend Developer',
    location: 'Geneva',
    profilePicture: '',
    experience: '5 years',
    availability: 'Notice Period',
    technologies: ['Node.js', 'Python'],
    skills: ['Node.js', 'Python'],
    certifications: [],
    currentProject: null,
    matchScore: { matched: 0.82, total: 1 },
    experienceDetails: { totalYears: 5, level: 'Senior' },
    availabilityDetails: { status: 'Busy', startDate: '2025-11-01' },
    detailedTechnologies: [
      { name: 'Node.js', yearsExperience: 5, proficiency: 'Expert' },
      { name: 'Python', yearsExperience: 4, proficiency: 'Intermediate' }
    ],
    trainings: [],
    detailedCertifications: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComparisonService]
    });

    service = TestBed.inject(ComparisonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.clearSelections(); // Clean up after each test
  });

  describe('Signal Initialization', () => {
    it('should initialize with empty selection', () => {
      expect(service.selectedIds().size).toBe(0);
    });

    it('should initialize with empty candidates', () => {
      expect(service.candidates()).toEqual([]);
    });

    it('should initialize isComparing as false', () => {
      expect(service.isComparing()).toBe(false);
    });

    it('should initialize loading as false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should initialize error as null', () => {
      expect(service.error()).toBe(null);
    });
  });

  describe('Computed Signals', () => {
    it('selectionCount should return 0 initially', () => {
      expect(service.selectionCount()).toBe(0);
    });

    it('selectionCount should update when selections change', () => {
      service.toggleSelection('1');
      expect(service.selectionCount()).toBe(1);

      service.toggleSelection('2');
      expect(service.selectionCount()).toBe(2);
    });

    it('hasSelections should return false initially', () => {
      expect(service.hasSelections()).toBe(false);
    });

    it('hasSelections should return true when selections exist', () => {
      service.toggleSelection('1');
      expect(service.hasSelections()).toBe(true);
    });

    it('canCompare should return false when less than 2 selections', () => {
      expect(service.canCompare()).toBe(false);
      service.toggleSelection('1');
      expect(service.canCompare()).toBe(false);
    });

    it('canCompare should return true when 2-3 selections', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      expect(service.canCompare()).toBe(true);

      service.toggleSelection('3');
      expect(service.canCompare()).toBe(true);
    });

    it('isMaxReached should return false when less than 3 selections', () => {
      expect(service.isMaxReached()).toBe(false);
      service.toggleSelection('1');
      expect(service.isMaxReached()).toBe(false);
      service.toggleSelection('2');
      expect(service.isMaxReached()).toBe(false);
    });

    it('isMaxReached should return true when 3 selections', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      service.toggleSelection('3');
      expect(service.isMaxReached()).toBe(true);
    });

    it('selectedIdsArray should convert Set to Array', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      const array = service.selectedIdsArray();
      expect(Array.isArray(array)).toBe(true);
      expect(array.length).toBe(2);
      expect(array).toContain('1');
      expect(array).toContain('2');
    });
  });

  describe('isSelected()', () => {
    it('should return false for unselected candidate', () => {
      expect(service.isSelected('1')).toBe(false);
    });

    it('should return true for selected candidate', () => {
      service.toggleSelection('1');
      expect(service.isSelected('1')).toBe(true);
    });
  });

  describe('toggleSelection()', () => {
    it('should add candidate to selection when not selected', () => {
      service.toggleSelection('1');
      expect(service.isSelected('1')).toBe(true);
      expect(service.selectionCount()).toBe(1);
    });

    it('should remove candidate from selection when already selected', () => {
      service.toggleSelection('1');
      expect(service.isSelected('1')).toBe(true);

      service.toggleSelection('1');
      expect(service.isSelected('1')).toBe(false);
      expect(service.selectionCount()).toBe(0);
    });

    it('should not add more than 3 candidates', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      service.toggleSelection('3');
      service.toggleSelection('4'); // Should be ignored

      expect(service.selectionCount()).toBe(3);
      expect(service.isSelected('4')).toBe(false);
    });

    it('should allow re-selection after removing a candidate', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      service.toggleSelection('3');
      expect(service.selectionCount()).toBe(3);

      service.toggleSelection('1'); // Remove
      expect(service.selectionCount()).toBe(2);

      service.toggleSelection('4'); // Should now work
      expect(service.selectionCount()).toBe(3);
      expect(service.isSelected('4')).toBe(true);
    });
  });

  describe('addSelection()', () => {
    it('should add candidate to selection', () => {
      service.addSelection('1');
      expect(service.isSelected('1')).toBe(true);
    });

    it('should not add duplicate', () => {
      service.addSelection('1');
      service.addSelection('1');
      expect(service.selectionCount()).toBe(1);
    });

    it('should not add when max reached', () => {
      service.addSelection('1');
      service.addSelection('2');
      service.addSelection('3');
      service.addSelection('4');

      expect(service.selectionCount()).toBe(3);
      expect(service.isSelected('4')).toBe(false);
    });
  });

  describe('removeSelection()', () => {
    it('should remove candidate from selection', () => {
      service.toggleSelection('1');
      expect(service.isSelected('1')).toBe(true);

      service.removeSelection('1');
      expect(service.isSelected('1')).toBe(false);
    });

    it('should handle removing non-existent selection gracefully', () => {
      service.removeSelection('999');
      expect(service.selectionCount()).toBe(0);
    });

    it('should remove candidate from loaded profiles', () => {
      service['candidatesSignal'].set([mockCandidateProfile1, mockCandidateProfile2]);

      service.removeSelection('1');

      const remainingCandidates = service.candidates();
      expect(remainingCandidates.length).toBe(1);
      expect(remainingCandidates[0].id).toBe('2');
    });
  });

  describe('clearSelections()', () => {
    it('should clear all selections', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      expect(service.selectionCount()).toBe(2);

      service.clearSelections();
      expect(service.selectionCount()).toBe(0);
      expect(service.hasSelections()).toBe(false);
    });

    it('should clear loaded candidates', () => {
      service['candidatesSignal'].set([mockCandidateProfile1]);
      expect(service.candidates().length).toBe(1);

      service.clearSelections();
      expect(service.candidates().length).toBe(0);
    });

    it('should clear error state', () => {
      service['errorSignal'].set('Some error');
      expect(service.error()).toBe('Some error');

      service.clearSelections();
      expect(service.error()).toBe(null);
    });
  });

  describe('selectMultiple()', () => {
    it('should select multiple candidates up to max', () => {
      service.selectMultiple(['1', '2', '3']);
      expect(service.selectionCount()).toBe(3);
    });

    it('should not exceed max of 3 candidates', () => {
      service.selectMultiple(['1', '2', '3', '4', '5']);
      expect(service.selectionCount()).toBe(3);
    });

    it('should not add duplicates', () => {
      service.toggleSelection('1');
      service.selectMultiple(['1', '2']);
      expect(service.selectionCount()).toBe(2);
    });

    it('should respect existing selections when adding multiple', () => {
      service.toggleSelection('1');
      service.selectMultiple(['2', '3', '4']);
      expect(service.selectionCount()).toBe(3);
      expect(service.isSelected('1')).toBe(true);
      expect(service.isSelected('2')).toBe(true);
      expect(service.isSelected('3')).toBe(true);
      expect(service.isSelected('4')).toBe(false); // Exceeded max
    });
  });

  describe('loadProfiles()', () => {
    it('should not load when no selections', async () => {
      await service.loadProfiles();
      // No HTTP request should be made
      httpMock.expectNone(`${environment.apiUrl}/candidates/batch-profiles`);
    });

    it('should not load when only 1 selection', async () => {
      service.toggleSelection('1');
      await service.loadProfiles();
      // No HTTP request should be made
      httpMock.expectNone(`${environment.apiUrl}/candidates/batch-profiles`);
    });

    it('should load profiles for 2 selected candidates', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      const loadPromise = service.loadProfiles();

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: jasmine.arrayContaining(['1', '2']) });

      req.flush({
        candidates: [mockCandidateProfile1, mockCandidateProfile2],
        success: true
      });

      await loadPromise;

      expect(service.candidates().length).toBe(2);
      expect(service.loading()).toBe(false);
    });

    it('should set loading state during load', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      const loadPromise = service.loadProfiles();

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req.flush({ candidates: [mockCandidateProfile1, mockCandidateProfile2], success: true });

      await loadPromise;

      expect(service.loading()).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      const loadPromise = service.loadProfiles();

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req.error(new ErrorEvent('Network error'));

      await loadPromise;

      expect(service.error()).toBe('Failed to load candidate details. Please try again.');
      expect(service.loading()).toBe(false);
    });
  });

  describe('openComparison()', () => {
    it('should not open when less than 2 selections', async () => {
      service.toggleSelection('1');
      await service.openComparison();
      expect(service.isComparing()).toBe(false);
    });

    it('should load profiles and open modal when valid selections', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      const openPromise = service.openComparison();

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req.flush({ candidates: [mockCandidateProfile1, mockCandidateProfile2], success: true });

      await openPromise;

      expect(service.isComparing()).toBe(true);
    });

    it('should not reload if profiles already loaded for same IDs', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      // First load
      const firstLoad = service.loadProfiles();
      const req1 = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req1.flush({ candidates: [mockCandidateProfile1, mockCandidateProfile2], success: true });
      await firstLoad;

      // Open comparison (should not trigger new request)
      await service.openComparison();

      httpMock.expectNone(`${environment.apiUrl}/candidates/batch-profiles`);
      expect(service.isComparing()).toBe(true);
    });

    it('should reload if selections changed', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      // Load first set
      const firstLoad = service.loadProfiles();
      const req1 = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req1.flush({ candidates: [mockCandidateProfile1, mockCandidateProfile2], success: true });
      await firstLoad;

      // Change selection
      service.toggleSelection('2');
      service.toggleSelection('3');

      // Open comparison (should trigger reload)
      const openPromise = service.openComparison();
      const req2 = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req2.flush({ candidates: [mockCandidateProfile1, mockCandidateProfile3], success: true });
      await openPromise;

      expect(service.isComparing()).toBe(true);
    });

    it('should not open modal if load fails', async () => {
      service.toggleSelection('1');
      service.toggleSelection('2');

      const openPromise = service.openComparison();

      const req = httpMock.expectOne(`${environment.apiUrl}/candidates/batch-profiles`);
      req.error(new ErrorEvent('Network error'));

      await openPromise;

      expect(service.isComparing()).toBe(false);
      expect(service.error()).toBeTruthy();
    });
  });

  describe('closeComparison()', () => {
    it('should close comparison modal', () => {
      service['isComparingSignal'].set(true);
      expect(service.isComparing()).toBe(true);

      service.closeComparison();
      expect(service.isComparing()).toBe(false);
    });
  });

  describe('getSelectionMessage()', () => {
    it('should return correct message for 0 selections', () => {
      expect(service.getSelectionMessage()).toBe('No candidates selected');
    });

    it('should return correct message for 1 selection', () => {
      service.toggleSelection('1');
      expect(service.getSelectionMessage()).toBe('1 candidate selected. Select at least 1 more to compare.');
    });

    it('should return correct message for 2 selections', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      expect(service.getSelectionMessage()).toBe('2 candidates selected');
    });

    it('should return correct message for 3 selections (max)', () => {
      service.toggleSelection('1');
      service.toggleSelection('2');
      service.toggleSelection('3');
      expect(service.getSelectionMessage()).toBe('3 candidates selected (maximum reached)');
    });
  });
});

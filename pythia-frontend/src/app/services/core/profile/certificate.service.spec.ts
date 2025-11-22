import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificateService } from './certificate.service';
import { Certificate, CertificateResponse, CertificateRequest } from '../models/certificate.model';

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'http://localhost:8080/api/v1';

  const mockCertificates: Certificate[] = [
    {
      id: 1,
      name: 'AWS Solutions Architect',
      description: 'AWS certification for designing distributed systems and applications on Amazon Web Services',
      category: 'Certificates',
      createdAt: '2025-11-16T13:52:16.710932Z',
      updatedAt: '2025-11-16T13:52:16.710932Z'
    },
    {
      id: 2,
      name: 'Node.js Certification',
      description: 'Professional certification demonstrating expertise in Node.js application development',
      category: 'Certificates',
      createdAt: '2025-11-16T13:52:16.710932Z',
      updatedAt: '2025-11-16T13:52:16.710932Z'
    }
  ];

  const mockResponse: CertificateResponse = {
    items: mockCertificates,
    total: 2,
    category: 'Certificates'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificateService]
    });

    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCertificates', () => {
    it('should fetch certificates and update signals', (done) => {
      service.loadCertificates().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(service.certificates()).toEqual(mockCertificates);
          expect(service.total()).toBe(2);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors correctly', (done) => {
      service.loadCertificates().subscribe({
        error: () => {
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates`);
      req.error(new ProgressEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
    });
  });

  describe('createCertificate', () => {
    it('should create a new certificate and update state', (done) => {
      const newCertificateRequest: CertificateRequest = {
        name: 'Google Cloud Professional',
        description: 'Google Cloud certification for cloud architecture',
        category: 'Certificates'
      };

      const newCertificate: Certificate = {
        id: 3,
        ...newCertificateRequest,
        createdAt: '2025-11-17T10:00:00Z',
        updatedAt: '2025-11-17T10:00:00Z'
      };

      // Set initial state
      service.certificates.set(mockCertificates);
      service.total.set(2);

      service.createCertificate(newCertificateRequest).subscribe({
        next: (certificate) => {
          expect(certificate).toEqual(newCertificate);
          expect(service.certificates().length).toBe(3);
          expect(service.total()).toBe(3);
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCertificateRequest);
      req.flush(newCertificate);
    });

    it('should handle 409 conflict error', (done) => {
      const newCertificateRequest: CertificateRequest = {
        name: 'AWS Solutions Architect',
        description: 'Duplicate certificate',
        category: 'Certificates'
      };

      service.createCertificate(newCertificateRequest).subscribe({
        error: () => {
          expect(service.error()).toContain('already exists');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates`);
      req.error(new ProgressEvent('Error'), { status: 409 });
    });
  });

  describe('updateCertificate', () => {
    it('should update an existing certificate', (done) => {
      const updateRequest: CertificateRequest = {
        name: 'AWS Solutions Architect - Professional',
        description: 'Updated description',
        category: 'Certificates'
      };

      const updatedCertificate: Certificate = {
        id: 1,
        ...updateRequest,
        createdAt: '2025-11-16T13:52:16.710932Z',
        updatedAt: '2025-11-17T10:00:00Z'
      };

      // Set initial state
      service.certificates.set(mockCertificates);

      service.updateCertificate(1, updateRequest).subscribe({
        next: (certificate) => {
          expect(certificate).toEqual(updatedCertificate);
          const updated = service.certificates().find(c => c.id === 1);
          expect(updated?.name).toBe('AWS Solutions Architect - Professional');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(updatedCertificate);
    });

    it('should handle 404 not found error', (done) => {
      const updateRequest: CertificateRequest = {
        name: 'Test Certificate',
        description: 'Test description',
        category: 'Certificates'
      };

      service.updateCertificate(999, updateRequest).subscribe({
        error: () => {
          expect(service.error()).toContain('not found');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates/999`);
      req.error(new ProgressEvent('Error'), { status: 404 });
    });
  });

  describe('deleteCertificate', () => {
    it('should delete a certificate and update state', (done) => {
      // Set initial state
      service.certificates.set(mockCertificates);
      service.total.set(2);

      service.deleteCertificate(1).subscribe({
        next: () => {
          expect(service.certificates().length).toBe(1);
          expect(service.certificates().find(c => c.id === 1)).toBeUndefined();
          expect(service.total()).toBe(1);
          expect(service.loading()).toBe(false);
          done();
        }
      });

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle server error', (done) => {
      service.deleteCertificate(1).subscribe({
        error: () => {
          expect(service.error()).toContain('Server error');
          expect(service.loading()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/certificates/1`);
      req.error(new ProgressEvent('Error'), { status: 500 });
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      service.error.set('Test error');
      expect(service.error()).toBe('Test error');

      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});

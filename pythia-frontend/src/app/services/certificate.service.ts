import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../core/services/base-data.service';
import { Certificate, CertificateResponse, CertificateRequest } from '../models/certificate.model';

/**
 * Certificate Service
 *
 * Manages CRUD operations for certificate master data.
 * Extends BaseDataService for standardized data management.
 */
@Injectable({
  providedIn: 'root'
})
export class CertificateService extends BaseDataService<Certificate, CertificateRequest> {
  protected getEndpoint(): string {
    return 'certificates';
  }

  protected getSearchFields(certificate: Certificate): string[] {
    return [
      certificate.name,
      certificate.description,
      certificate.issuer,
      certificate.code || ''
    ];
  }

  protected getItemNotFoundMessage(): string {
    return 'Certificate not found.';
  }

  protected getDuplicateMessage(): string {
    return 'A certificate with this name already exists.';
  }

  // Backward compatibility aliases
  loadCertificates(): Observable<CertificateResponse> {
    return this.load();
  }

  createCertificate(request: CertificateRequest): Observable<Certificate> {
    return this.create(request);
  }

  updateCertificate(id: number, request: CertificateRequest): Observable<Certificate> {
    return this.update(id, request);
  }

  deleteCertificate(id: number): Observable<void> {
    return this.delete(id);
  }

  get certificates() {
    return this.data;
  }

  get filteredCertificates() {
    return this.filteredData;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService, DataResponse } from '../core/services/base-data.service';
import { Certificate, CertificateRequest } from '../models/certificate.model';

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
      certificate.code || ''
    ];
  }

  protected override getItemNotFoundMessage(): string {
    return 'Certificate not found.';
  }

  protected override getDuplicateMessage(): string {
    return 'A certificate with this name already exists.';
  }

  // Backward compatibility aliases
  loadCertificates(): Observable<DataResponse<Certificate>> {
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

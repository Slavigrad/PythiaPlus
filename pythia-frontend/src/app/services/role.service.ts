import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService, DataResponse } from '../core/services/base-data.service';
import { Role, RoleRequest } from '../models/role.model';

/**
 * Role Service
 *
 * Manages CRUD operations for role master data.
 * Extends BaseDataService for standardized data management.
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseDataService<Role, RoleRequest> {
  protected getEndpoint(): string {
    return 'roles';
  }

  protected getSearchFields(role: Role): string[] {
    return [
      role.name,
      role.description,
      role.code || ''
    ];
  }

  protected override getItemNotFoundMessage(): string {
    return 'Role not found.';
  }

  protected override getDuplicateMessage(): string {
    return 'A role with this name already exists.';
  }

  // Backward compatibility aliases
  loadRoles(): Observable<DataResponse<Role>> {
    return this.load();
  }

  createRole(request: RoleRequest): Observable<Role> {
    return this.create(request);
  }

  updateRole(id: number, request: RoleRequest): Observable<Role> {
    return this.update(id, request);
  }

  deleteRole(id: number): Observable<void> {
    return this.delete(id);
  }

  get roles() {
    return this.data;
  }

  get filteredRoles() {
    return this.filteredData;
  }
}

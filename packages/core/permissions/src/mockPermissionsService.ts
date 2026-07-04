import type {
  PermissionStatus,
  PermissionType,
  PermissionsService,
} from './types';

export class MockPermissionsService implements PermissionsService {
  private grants = new Set<PermissionType>();

  async check(permission: PermissionType): Promise<PermissionStatus> {
    return this.grants.has(permission) ? 'granted' : 'denied';
  }

  async request(permission: PermissionType): Promise<PermissionStatus> {
    this.grants.add(permission);
    return 'granted';
  }
}

let service: PermissionsService = new MockPermissionsService();

export function getPermissionsService(): PermissionsService {
  return service;
}

export function configurePermissionsService(next?: PermissionsService): void {
  service = next ?? new MockPermissionsService();
}

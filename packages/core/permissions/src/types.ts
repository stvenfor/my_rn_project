export type PermissionType =
  | 'camera'
  | 'photoLibrary'
  | 'bluetooth'
  | 'location'
  | 'notifications';

export type PermissionStatus = 'granted' | 'denied' | 'blocked';

export interface PermissionsService {
  check(permission: PermissionType): Promise<PermissionStatus>;
  request(permission: PermissionType): Promise<PermissionStatus>;
}

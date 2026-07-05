import {collectMainTabs} from '@app/config/moduleManifest';

export function indexForModuleId(moduleId: string): number {
  return collectMainTabs().findIndex(tab => tab.moduleId === moduleId);
}

export function getMainTabRegistrations() {
  return collectMainTabs();
}

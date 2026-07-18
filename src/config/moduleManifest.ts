import type {FeatureRegistration} from '@core/navigation';
import {registerAuthFeature} from '@features/auth';
import {registerHomeFeature} from '@features/home';
import {registerChatFeature} from '@features/chat';
import {registerCommunityFeature} from '@features/community';
import {registerMusicFeature} from '@features/music';
import {registerSettingsFeature} from '@features/settings';
import {registerFriendFeature} from '@features/friend';
import {registerLiveFeature} from '@features/live';
import {registerPayFeature} from '@features/pay';
import {registerVideoFeature} from '@features/video';
import {registerBfuiFeature} from '@features/bfui';
import {registerClassroomFeature} from '@features/classroom';

export const enabledModules: FeatureRegistration[] = [
  registerHomeFeature(),
  registerChatFeature(),
  registerCommunityFeature(),
  registerSettingsFeature(),
  registerAuthFeature(),
  registerMusicFeature(),
  registerFriendFeature(),
  registerLiveFeature(),
  registerPayFeature(),
  registerVideoFeature(),
  registerBfuiFeature(),
  registerClassroomFeature(),
];

export function collectMainTabs() {
  return enabledModules
    .filter(m => m.tab)
    .map(m => m.tab!)
    .sort((a, b) => a.order - b.order);
}

export function collectFeatureReducers() {
  return enabledModules.filter(m => m.reducer).map(m => m.reducer!);
}

export function collectFeatureRoutes() {
  return enabledModules.flatMap(m => m.routes ?? []);
}

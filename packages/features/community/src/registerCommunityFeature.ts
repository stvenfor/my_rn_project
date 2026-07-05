import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {communityReducer} from './store/communitySlice';
import {CommunityPublishScreen} from './screens/CommunityPublishScreen';
import {CommunityVideoPlayScreen} from './screens/CommunityVideoPlayScreen';

export function registerCommunityFeature(): FeatureRegistration {
  return {
    moduleId: 'community',
    tab: {
      moduleId: 'community',
      name: 'CommunityTab',
      labelKey: 'tabCommunity',
      icon: 'community',
      selectedIcon: 'community-filled',
      order: 2,
      requiresAuth: true,
    },
    reducer: {key: 'community', reducer: communityReducer},
    routes: [
      {
        name: RoutePath.communityPublish,
        component: CommunityPublishScreen as StackScreenComponent,
      },
      {
        name: RoutePath.communityVideoPlay,
        component: CommunityVideoPlayScreen as StackScreenComponent,
      },
    ],
  };
}

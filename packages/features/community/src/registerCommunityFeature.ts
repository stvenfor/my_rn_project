import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {communityReducer} from './communitySlice';
import {
  CommunityPublishScreen,
  CommunityVideoPlayScreen,
} from './screens/CommunityScreens';

export function registerCommunityFeature(): FeatureRegistration {
  return {
    moduleId: 'community',
    tab: {
      moduleId: 'community',
      name: 'CommunityTab',
      labelKey: 'tabCommunity',
      icon: 'community',
      order: 2,
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

import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {chatReducer} from './chatSlice';
import {ChatDetailScreen} from './screens/ChatScreens';

export function registerChatFeature(): FeatureRegistration {
  return {
    moduleId: 'chat',
    tab: {
      moduleId: 'chat',
      name: 'ChatTab',
      labelKey: 'tabChat',
      icon: 'chat',
      order: 1,
    },
    reducer: {key: 'chat', reducer: chatReducer},
    routes: [
      {
        name: RoutePath.chatDetail,
        component: ChatDetailScreen as StackScreenComponent,
      },
    ],
  };
}

import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {chatReducer} from './store/chatSlice';
import {chatDetailReducer} from './store/chatDetailSlice';
import {ChatDetailScreen} from './screens/ChatDetailScreen';
import {ImagePreviewScreen} from './screens/ImagePreviewScreen';

export function registerChatFeature(): FeatureRegistration {
  return {
    moduleId: 'chat',
    tab: {
      moduleId: 'chat',
      name: 'ChatTab',
      labelKey: 'tabChat',
      icon: 'chat',
      selectedIcon: 'chat-filled',
      order: 1,
      requiresAuth: true,
    },
    reducer: {key: 'chat', reducer: chatReducer},
    routes: [
      {
        name: RoutePath.chatDetail,
        component: ChatDetailScreen as StackScreenComponent,
      },
      {
        name: RoutePath.imagePreview,
        component: ImagePreviewScreen as StackScreenComponent,
      },
    ],
  };
}

export function registerChatDetailReducer() {
  return {key: 'chatDetail', reducer: chatDetailReducer};
}

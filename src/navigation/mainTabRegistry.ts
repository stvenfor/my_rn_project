import type {StackScreenComponent} from '@core/navigation';
import type {MainTabParamList} from '@core/navigation';
import {HomeScreen} from '@features/home';
import {ChatScreen} from '@features/chat';
import {CommunityScreen} from '@features/community';
import {MineScreenContainer} from '@app/screens/SettingsWrappers';
import {getMainTabRegistrations} from './mainTabOrder';

const TAB_COMPONENTS: Record<keyof MainTabParamList, StackScreenComponent> = {
  HomeTab: HomeScreen as StackScreenComponent,
  ChatTab: ChatScreen as StackScreenComponent,
  CommunityTab: CommunityScreen as StackScreenComponent,
  MineTab: MineScreenContainer as StackScreenComponent,
};

export function getMainTabComponent(
  name: keyof MainTabParamList,
): StackScreenComponent {
  return TAB_COMPONENTS[name];
}

export {getMainTabRegistrations};

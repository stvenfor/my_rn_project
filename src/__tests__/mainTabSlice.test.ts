jest.mock('@app/config/moduleManifest', () => ({
  collectMainTabs: () => [
    {
      moduleId: 'home',
      name: 'HomeTab',
      labelKey: 'tabHome',
      icon: 'home',
      selectedIcon: 'home-filled',
      order: 0,
    },
    {
      moduleId: 'chat',
      name: 'ChatTab',
      labelKey: 'tabChat',
      icon: 'chat',
      selectedIcon: 'chat-filled',
      order: 1,
      requiresAuth: true,
    },
    {
      moduleId: 'community',
      name: 'CommunityTab',
      labelKey: 'tabCommunity',
      icon: 'community',
      selectedIcon: 'community-filled',
      order: 2,
      requiresAuth: true,
    },
    {
      moduleId: 'settings',
      name: 'MineTab',
      labelKey: 'tabMine',
      icon: 'mine',
      selectedIcon: 'mine-filled',
      order: 3,
    },
  ],
}));

import {
  mainTabReducer,
  switchToMainTabModule,
  setMainTabIndex,
  selectMainTabSelectedIndex,
} from '../store/mainTabSlice';
import {indexForModuleId} from '../navigation/mainTabOrder';

describe('mainTabSlice', () => {
  const base = {mainTab: mainTabReducer(undefined, {type: '@@INIT'})};

  it('starts at home tab index 0', () => {
    expect(selectMainTabSelectedIndex({mainTab: base.mainTab})).toBe(0);
  });

  it('setMainTabIndex updates selected index and revision', () => {
    const next = mainTabReducer(base.mainTab, setMainTabIndex(2));
    expect(selectMainTabSelectedIndex({mainTab: next})).toBe(2);
    expect(next.switchRevision).toBe(1);
  });

  it('switchToMainTabModule resolves module id to index', async () => {
    const action = await switchToMainTabModule('community')(
      jest.fn(),
      jest.fn(),
      undefined,
    );
    const next = mainTabReducer(base.mainTab, action);
    expect(selectMainTabSelectedIndex({mainTab: next})).toBe(2);
  });

  it('indexForModuleId maps known modules', () => {
    expect(indexForModuleId('home')).toBe(0);
    expect(indexForModuleId('chat')).toBe(1);
    expect(indexForModuleId('community')).toBe(2);
    expect(indexForModuleId('settings')).toBe(3);
  });
});

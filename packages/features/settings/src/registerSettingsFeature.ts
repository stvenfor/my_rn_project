import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {mineReducer} from './store/mineSlice';
import {MineScreen} from './screens/MineScreen';
import {MineHttpTestScreen} from './screens/MineHttpTestScreen';
import {
  DialogDemoScreen,
  DealInvoiceDemoScreen,
  DealInvoiceUploadScreen,
  PersonalizedSettingsScreen,
} from './screens/SettingsScreens';

export function registerSettingsFeature(): FeatureRegistration {
  return {
    moduleId: 'settings',
    tab: {
      moduleId: 'settings',
      name: 'MineTab',
      labelKey: 'tabMine',
      icon: 'mine',
      selectedIcon: 'mine-filled',
      order: 3,
    },
    reducer: {key: 'mine', reducer: mineReducer},
    routes: [
      {
        name: RoutePath.mineHttpTest,
        component: MineHttpTestScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dialogDemo,
        component: DialogDemoScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dealInvoiceDemo,
        component: DealInvoiceDemoScreen as StackScreenComponent,
      },
      {
        name: RoutePath.dealInvoiceUpload,
        component: DealInvoiceUploadScreen as StackScreenComponent,
      },
      {
        name: RoutePath.personalizedSettings,
        component: PersonalizedSettingsScreen as StackScreenComponent,
      },
    ],
  };
}

export {MineScreen};

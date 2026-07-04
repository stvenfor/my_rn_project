import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {
  MineHttpTestScreen,
  DialogDemoScreen,
  DealInvoiceDemoScreen,
  DealInvoiceUploadScreen,
} from './screens/SettingsScreens';

export function registerSettingsFeature(): FeatureRegistration {
  return {
    moduleId: 'settings',
    tab: {
      moduleId: 'settings',
      name: 'MineTab',
      labelKey: 'tabMine',
      icon: 'mine',
      order: 3,
    },
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
    ],
  };
}

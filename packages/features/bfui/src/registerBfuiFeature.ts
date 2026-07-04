import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {BfuiGalleryScreen, BfuiTemplateScreen} from './screens/BfuiScreens';

export function registerBfuiFeature(): FeatureRegistration {
  return {
    moduleId: 'bfui',
    routes: [
      {
        name: RoutePath.bfuiGallery,
        component: BfuiGalleryScreen as StackScreenComponent,
      },
      {
        name: RoutePath.bfuiTemplate,
        component: BfuiTemplateScreen as StackScreenComponent,
      },
    ],
  };
}

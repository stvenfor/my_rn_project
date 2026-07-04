import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {PayScreen} from './index';

export function registerPayFeature(): FeatureRegistration {
  return {
    moduleId: 'pay',
    routes: [
      {name: RoutePath.pay, component: PayScreen as StackScreenComponent},
    ],
  };
}

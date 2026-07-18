import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {PayScreen} from './PayScreen';
import {MembershipRenewScreen} from './membership/MembershipRenewScreen';

export function registerPayFeature(): FeatureRegistration {
  return {
    moduleId: 'pay',
    routes: [
      {name: RoutePath.pay, component: PayScreen as StackScreenComponent},
      {
        name: RoutePath.payMembership,
        component: MembershipRenewScreen as StackScreenComponent,
      },
    ],
  };
}

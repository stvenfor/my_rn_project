import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {homeReducer} from './homeSlice';
import {
  HomeLearningReportScreen,
  HomeCheckInMallScreen,
  HomeAllServicesScreen,
} from './screens/HomeScreens';

export function registerHomeFeature(): FeatureRegistration {
  return {
    moduleId: 'home',
    tab: {
      moduleId: 'home',
      name: 'HomeTab',
      labelKey: 'tabHome',
      icon: 'home',
      order: 0,
    },
    reducer: {key: 'home', reducer: homeReducer},
    routes: [
      {
        name: RoutePath.homeLearningReport,
        component: HomeLearningReportScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeCheckInMall,
        component: HomeCheckInMallScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeAllServices,
        component: HomeAllServicesScreen as StackScreenComponent,
      },
    ],
  };
}

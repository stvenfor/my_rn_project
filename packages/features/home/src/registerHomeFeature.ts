import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {homeReducer} from './store/homeSlice';
import {allServicesReducer} from './store/allServicesSlice';
import {HomeLearningReportScreen} from './screens/HomeLearningReportScreen';
import {HomeCheckInMallScreen} from './screens/HomeCheckInMallScreen';
import {HomeAllServicesScreen} from './screens/HomeAllServicesScreen';

export function registerHomeFeature(): FeatureRegistration {
  return {
    moduleId: 'home',
    tab: {
      moduleId: 'home',
      name: 'HomeTab',
      labelKey: 'tabHome',
      icon: 'home',
      selectedIcon: 'home-filled',
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

export function registerHomeAllServicesReducer() {
  return {key: 'allServices', reducer: allServicesReducer};
}

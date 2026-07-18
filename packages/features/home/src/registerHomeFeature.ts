import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {homeReducer} from './store/homeSlice';
import {allServicesReducer} from './store/allServicesSlice';
import {homeSearchReducer} from './store/searchSlice';
import {HomeLearningReportScreen} from './screens/HomeLearningReportScreen';
import {HomeCheckInMallScreen} from './screens/HomeCheckInMallScreen';
import {HomeAllServicesScreen} from './screens/HomeAllServicesScreen';
import {HomeSearchScreen} from './screens/HomeSearchScreen';
import {HomeStrategyScreen} from './screens/HomeStrategyScreen';
import {HomeDubbingFeedScreen} from './screens/HomeDubbingFeedScreen';
import {HomeHotRankDetailScreen} from './screens/HomeHotRankDetailScreen';
import {HomeUsedCarListScreen} from './screens/HomeUsedCarListScreen';
import {HomeUsedCarDetailScreen} from './screens/HomeUsedCarDetailScreen';

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
      {
        name: RoutePath.homeSearch,
        component: HomeSearchScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeStrategy,
        component: HomeStrategyScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeDubbingFeed,
        component: HomeDubbingFeedScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeHotRankDetail,
        component: HomeHotRankDetailScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeUsedCarList,
        component: HomeUsedCarListScreen as StackScreenComponent,
      },
      {
        name: RoutePath.homeUsedCarDetail,
        component: HomeUsedCarDetailScreen as StackScreenComponent,
      },
    ],
  };
}

export function registerHomeAllServicesReducer() {
  return {key: 'allServices', reducer: allServicesReducer};
}

export function registerHomeSearchReducer() {
  return {key: 'homeSearch', reducer: homeSearchReducer};
}

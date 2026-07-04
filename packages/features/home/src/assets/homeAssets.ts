import type {ImageSourcePropType} from 'react-native';

export const homeServiceIcons = {
  after_sales_area: require('../../assets/all_services/after_sales_area.png'),
  all_functions: require('../../assets/all_services/all_functions.png'),
  business_poster: require('../../assets/all_services/business_poster.png'),
  calculator: require('../../assets/all_services/calculator.png'),
  customer_profile: require('../../assets/all_services/customer_profile.png'),
  exhibition_hall_shooting: require('../../assets/all_services/exhibition_hall_shooting.png'),
  intelligence_task: require('../../assets/all_services/intelligence_task.png'),
  marketing: require('../../assets/all_services/marketing.png'),
  nav_back_black: require('../../assets/all_services/nav_back_black.png'),
  new_car_deal: require('../../assets/all_services/new_car_deal.png'),
  new_car_in_store: require('../../assets/all_services/new_car_in_store.png'),
  online_customer_acquisition: require('../../assets/all_services/online_customer_acquisition.png'),
  service_management: require('../../assets/all_services/service_management.png'),
  small_video: require('../../assets/all_services/small_video.png'),
  smart_number: require('../../assets/all_services/smart_number.png'),
  smart_online_marketing: require('../../assets/all_services/smart_online_marketing.png'),
  smart_sale: require('../../assets/all_services/smart_sale.png'),
  used_car: require('../../assets/all_services/used_car.png'),
  v_store: require('../../assets/all_services/v_store.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type HomeServiceIconKey = keyof typeof homeServiceIcons;

export const HOME_ASSET_MANIFEST: Record<HomeServiceIconKey, string> = {
  after_sales_area:
    'packages/features/home/assets/all_services/after_sales_area.png',
  all_functions: 'packages/features/home/assets/all_services/all_functions.png',
  business_poster:
    'packages/features/home/assets/all_services/business_poster.png',
  calculator: 'packages/features/home/assets/all_services/calculator.png',
  customer_profile:
    'packages/features/home/assets/all_services/customer_profile.png',
  exhibition_hall_shooting:
    'packages/features/home/assets/all_services/exhibition_hall_shooting.png',
  intelligence_task:
    'packages/features/home/assets/all_services/intelligence_task.png',
  marketing: 'packages/features/home/assets/all_services/marketing.png',
  nav_back_black:
    'packages/features/home/assets/all_services/nav_back_black.png',
  new_car_deal: 'packages/features/home/assets/all_services/new_car_deal.png',
  new_car_in_store:
    'packages/features/home/assets/all_services/new_car_in_store.png',
  online_customer_acquisition:
    'packages/features/home/assets/all_services/online_customer_acquisition.png',
  service_management:
    'packages/features/home/assets/all_services/service_management.png',
  small_video: 'packages/features/home/assets/all_services/small_video.png',
  smart_number: 'packages/features/home/assets/all_services/smart_number.png',
  smart_online_marketing:
    'packages/features/home/assets/all_services/smart_online_marketing.png',
  smart_sale: 'packages/features/home/assets/all_services/smart_sale.png',
  used_car: 'packages/features/home/assets/all_services/used_car.png',
  v_store: 'packages/features/home/assets/all_services/v_store.png',
};

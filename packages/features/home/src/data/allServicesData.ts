import {RoutePath} from '@core/navigation';
import type {HomeServiceIconKey} from '../assets/homeAssets';

export interface AllServiceItem {
  id: string;
  label: string;
  assetName: HomeServiceIconKey;
  routePath: string;
  templateId?: string;
}

export interface AllServiceSection {
  title: string;
  items: AllServiceItem[];
}

const intro: AllServiceItem = {
  id: 'introduction_animation',
  label: '引导动画',
  assetName: 'smart_online_marketing',
  routePath: RoutePath.bfuiTemplate,
  templateId: 'introduction_animation',
};
const hotel: AllServiceItem = {
  id: 'hotel_booking',
  label: '酒店预订',
  assetName: 'customer_profile',
  routePath: RoutePath.bfuiTemplate,
  templateId: 'hotel_booking',
};
const music: AllServiceItem = {
  id: 'music_list',
  label: '音频列表',
  assetName: 'used_car',
  routePath: RoutePath.musicList,
};
const video: AllServiceItem = {
  id: 'short_video',
  label: '短视频',
  assetName: 'small_video',
  routePath: RoutePath.shortVideo,
};

export const defaultFavoriteItems: AllServiceItem[] = [
  intro,
  {
    id: 'glass_view',
    label: '玻璃卡片',
    assetName: 'online_customer_acquisition',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'glass_view',
  },
  {
    id: 'mediterranean_diet',
    label: '地中海饮食',
    assetName: 'small_video',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'mediterranean_diet',
  },
  {
    id: 'navigation_drawer',
    label: '侧滑导航',
    assetName: 'service_management',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'navigation_drawer',
  },
  {
    id: 'my_diary',
    label: '我的日记',
    assetName: 'exhibition_hall_shooting',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'my_diary',
  },
  {
    id: 'training',
    label: '训练计划',
    assetName: 'intelligence_task',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'training',
  },
  {
    id: 'running_view',
    label: '跑步数据',
    assetName: 'new_car_in_store',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'running_view',
  },
  {
    id: 'wave_view',
    label: '波浪动画',
    assetName: 'smart_number',
    routePath: RoutePath.bfuiTemplate,
    templateId: 'wave_view',
  },
];

export const catalogSections: AllServiceSection[] = [
  {
    title: '线索服务',
    items: [
      intro,
      hotel,
      {
        id: 'hotel_filters',
        label: '酒店筛选',
        assetName: 'smart_sale',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'hotel_filters',
      },
      {
        id: 'fitness_app',
        label: '健身应用',
        assetName: 'new_car_deal',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'fitness_app',
      },
      {
        id: 'glass_view',
        label: '玻璃卡片',
        assetName: 'online_customer_acquisition',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'glass_view',
      },
      {
        id: 'running_view',
        label: '跑步数据',
        assetName: 'new_car_in_store',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'running_view',
      },
      {
        id: 'wave_view',
        label: '波浪动画',
        assetName: 'smart_number',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'wave_view',
      },
    ],
  },
  {
    title: '营销服务',
    items: [
      {
        id: 'my_diary',
        label: '我的日记',
        assetName: 'exhibition_hall_shooting',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'my_diary',
      },
      {
        id: 'design_course',
        label: '设计课程',
        assetName: 'marketing',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'design_course',
      },
      {
        id: 'training',
        label: '训练计划',
        assetName: 'intelligence_task',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'training',
      },
      {
        id: 'workout_view',
        label: '训练视图',
        assetName: 'v_store',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'workout_view',
      },
      {
        id: 'mediterranean_diet',
        label: '地中海饮食',
        assetName: 'small_video',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'mediterranean_diet',
      },
      {
        id: 'course_info',
        label: '课程详情',
        assetName: 'business_poster',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'course_info',
      },
    ],
  },
  {
    title: '其他服务',
    items: [
      {
        id: 'help',
        label: '帮助中心',
        assetName: 'after_sales_area',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'help',
      },
      {
        id: 'feedback',
        label: '意见反馈',
        assetName: 'calculator',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'feedback',
      },
      {
        id: 'navigation_drawer',
        label: '侧滑导航',
        assetName: 'service_management',
        routePath: RoutePath.bfuiTemplate,
        templateId: 'navigation_drawer',
      },
      music,
      video,
    ],
  },
];

export const allCatalogItems: AllServiceItem[] = [
  ...defaultFavoriteItems,
  ...catalogSections.flatMap(s => s.items),
];

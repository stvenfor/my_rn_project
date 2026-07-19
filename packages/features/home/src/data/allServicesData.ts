import {RoutePath} from '@core/navigation';
import type {HomeServiceIconKey} from '../assets/homeAssets';

export interface AllServiceItem {
  /** Flutter: defaults to assetName including `.png` */
  id: string;
  label: string;
  assetName: HomeServiceIconKey;
  routePath: string;
  templateId?: string;
}

export interface AllServiceSection {
  title: string;
  subtitle?: string;
  showEditButton?: boolean;
  items: AllServiceItem[];
}

export const MIN_FAVORITE_COUNT = 3;
export const MAX_FAVORITE_COUNT = 8;

export const favoriteSectionMeta = {
  title: '常用服务',
  subtitle: '将按自定义顺序出现在首页',
} as const;

function item(
  label: string,
  assetKey: HomeServiceIconKey,
  routePath: string,
  templateId?: string,
): AllServiceItem {
  return {
    id: `${assetKey}.png`,
    label,
    assetName: assetKey,
    routePath,
    templateId,
  };
}

const introductionAnimation = item(
  '引导动画',
  'smart_online_marketing',
  RoutePath.bfuiTemplate,
  'introduction_animation',
);
const hotelBooking = item(
  '酒店预订',
  'customer_profile',
  RoutePath.bfuiTemplate,
  'hotel_booking',
);
const hotelFilters = item(
  '酒店筛选',
  'smart_sale',
  RoutePath.bfuiTemplate,
  'hotel_filters',
);
const fitnessApp = item(
  '健身应用',
  'new_car_deal',
  RoutePath.bfuiTemplate,
  'fitness_app',
);
const myDiary = item(
  '我的日记',
  'exhibition_hall_shooting',
  RoutePath.bfuiTemplate,
  'my_diary',
);
const training = item(
  '训练计划',
  'intelligence_task',
  RoutePath.bfuiTemplate,
  'training',
);
const designCourse = item(
  '设计课程',
  'marketing',
  RoutePath.bfuiTemplate,
  'design_course',
);
const courseInfo = item(
  '课程详情',
  'business_poster',
  RoutePath.bfuiTemplate,
  'course_info',
);
const help = item(
  '帮助中心',
  'after_sales_area',
  RoutePath.bfuiTemplate,
  'help',
);
const feedback = item(
  '意见反馈',
  'calculator',
  RoutePath.bfuiTemplate,
  'feedback',
);
const musicPlayer = item('音频列表', 'used_car', RoutePath.musicList);
const navigationDrawer = item(
  '侧滑导航',
  'service_management',
  RoutePath.bfuiTemplate,
  'navigation_drawer',
);
const glassView = item(
  '玻璃卡片',
  'online_customer_acquisition',
  RoutePath.bfuiTemplate,
  'glass_view',
);
const waveView = item(
  '波浪动画',
  'smart_number',
  RoutePath.bfuiTemplate,
  'wave_view',
);
const runningView = item(
  '跑步数据',
  'new_car_in_store',
  RoutePath.bfuiTemplate,
  'running_view',
);
const workoutView = item(
  '训练视图',
  'v_store',
  RoutePath.bfuiTemplate,
  'workout_view',
);
const mediterraneanDiet = item(
  '地中海饮食',
  'small_video',
  RoutePath.bfuiTemplate,
  'mediterranean_diet',
);
const classroom = item(
  '班级教学',
  'intelligence_task',
  RoutePath.classroomMyClass,
);
const dubbingVideoList = item(
  '视频列表',
  'small_video',
  RoutePath.dubbingVideoList,
);
const dubbingWorkList = item(
  '作品列表',
  'exhibition_hall_shooting',
  RoutePath.dubbingWorkList,
);
const dubbingHome = item('配音首页', 'dubbing_home', RoutePath.homeDubbingFeed);
const membershipRenew = item('会员续费', 'marketing', RoutePath.payMembership);
const bfuiGallery = item(
  'BFUI 模板目录',
  'all_functions',
  RoutePath.bfuiGallery,
);
const inviteFriend = item(
  '邀请好友',
  'online_customer_acquisition',
  RoutePath.bfuiTemplate,
  'invite_friend',
);

export const defaultFavoriteItems: AllServiceItem[] = [
  introductionAnimation,
  glassView,
  mediterraneanDiet,
  navigationDrawer,
  myDiary,
  training,
  runningView,
  waveView,
];

export const catalogSections: AllServiceSection[] = [
  {
    title: '线索服务',
    items: [
      introductionAnimation,
      hotelBooking,
      hotelFilters,
      fitnessApp,
      glassView,
      runningView,
      waveView,
    ],
  },
  {
    title: '营销服务',
    items: [
      myDiary,
      designCourse,
      training,
      workoutView,
      mediterraneanDiet,
      courseInfo,
    ],
  },
  {
    title: '教学服务',
    items: [classroom, dubbingHome, dubbingVideoList, dubbingWorkList],
  },
  {
    title: '其他服务',
    items: [
      membershipRenew,
      bfuiGallery,
      inviteFriend,
      help,
      feedback,
      navigationDrawer,
      musicPlayer,
    ],
  },
];

/** Flutter builds Map from defaults + sections; later duplicate ids overwrite. */
const catalogById = new Map<string, AllServiceItem>();
for (const entry of [
  ...defaultFavoriteItems,
  ...catalogSections.flatMap(s => s.items),
]) {
  catalogById.set(entry.id, entry);
}

export const allCatalogItems: AllServiceItem[] = Array.from(
  catalogById.values(),
);

export function findItemById(id: string): AllServiceItem | undefined {
  return catalogById.get(id);
}

export const defaultFavoriteIds = defaultFavoriteItems.map(fav => fav.id);

import type {ImageSourcePropType} from 'react-native';

export const homeServiceIcons = {
  after_sales_area: require('../../assets/all_services/after_sales_area.png'),
  all_functions: require('../../assets/all_services/all_functions.png'),
  business_poster: require('../../assets/all_services/business_poster.png'),
  calculator: require('../../assets/all_services/calculator.png'),
  customer_profile: require('../../assets/all_services/customer_profile.png'),
  dubbing_home: require('../../assets/all_services/dubbing_home.png'),
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

export const searchAssets = {
  icon_clear_history: require('../../assets/search/icon_clear_history.png'),
  icon_filter: require('../../assets/search/icon_filter.png'),
  icon_refresh: require('../../assets/search/icon_refresh.png'),
  microphone: require('../../assets/search/microphone.png'),
  rank_badge_bg: require('../../assets/search/rank_badge_bg.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export const dubbingHomeAssets = {
  badge_vip: require('../../assets/dubbing_home/badge_vip.png'),
  banner_main: require('../../assets/dubbing_home/banner_main.png'),
  bar_icon_top: require('../../assets/dubbing_home/bar_icon_top.png'),
  cover_01: require('../../assets/dubbing_home/cover_01.png'),
  cover_02: require('../../assets/dubbing_home/cover_02.png'),
  cover_03: require('../../assets/dubbing_home/cover_03.png'),
  cover_04: require('../../assets/dubbing_home/cover_04.png'),
  cover_05: require('../../assets/dubbing_home/cover_05.png'),
  cover_06: require('../../assets/dubbing_home/cover_06.png'),
  cover_07: require('../../assets/dubbing_home/cover_07.png'),
  cover_08: require('../../assets/dubbing_home/cover_08.png'),
  cover_09: require('../../assets/dubbing_home/cover_09.png'),
  cover_10: require('../../assets/dubbing_home/cover_10.png'),
  cover_11: require('../../assets/dubbing_home/cover_11.png'),
  cover_12: require('../../assets/dubbing_home/cover_12.png'),
  cover_assessment: require('../../assets/dubbing_home/cover_assessment.png'),
  feature_all_videos: require('../../assets/dubbing_home/feature_all_videos.png'),
  feature_check_in: require('../../assets/dubbing_home/feature_check_in.png'),
  feature_classic_theater: require('../../assets/dubbing_home/feature_classic_theater.png'),
  feature_dubbing: require('../../assets/dubbing_home/feature_dubbing.png'),
  feature_movie_words: require('../../assets/dubbing_home/feature_movie_words.png'),
  feature_rank: require('../../assets/dubbing_home/feature_rank.png'),
  hot_rank_badge_top20: require('../../assets/dubbing_home/hot_rank/badge_top20.png'),
  hot_rank_icon_collapse: require('../../assets/dubbing_home/hot_rank/icon_collapse.png'),
  hot_rank_icon_like: require('../../assets/dubbing_home/hot_rank/icon_like.png'),
  hot_rank_icon_share: require('../../assets/dubbing_home/hot_rank/icon_share.png'),
  hot_rank_wheat_large_left: require('../../assets/dubbing_home/hot_rank/wheat_large_left.png'),
  hot_rank_wheat_large_right: require('../../assets/dubbing_home/hot_rank/wheat_large_right.png'),
  icon_chevron_right: require('../../assets/dubbing_home/icon_chevron_right.png'),
  icon_downward: require('../../assets/dubbing_home/icon_downward.png'),
  icon_duration: require('../../assets/dubbing_home/icon_duration.png'),
  icon_hot: require('../../assets/dubbing_home/icon_hot.png'),
  icon_menu: require('../../assets/dubbing_home/icon_menu.png'),
  icon_notification: require('../../assets/dubbing_home/icon_notification.png'),
  icon_play_badge: require('../../assets/dubbing_home/icon_play_badge.png'),
  icon_refresh: require('../../assets/dubbing_home/icon_refresh.png'),
  icon_search: require('../../assets/dubbing_home/icon_search.png'),
  icon_swap: require('../../assets/dubbing_home/icon_swap.png'),
  icon_view_all: require('../../assets/dubbing_home/icon_view_all.png'),
  rank_badge_1: require('../../assets/dubbing_home/rank_badge_1.png'),
  rank_badge_2: require('../../assets/dubbing_home/rank_badge_2.png'),
  rank_badge_3: require('../../assets/dubbing_home/rank_badge_3.png'),
  rank_icon_1: require('../../assets/dubbing_home/rank_icon_1.png'),
  rank_icon_10: require('../../assets/dubbing_home/rank_icon_10.png'),
  rank_icon_2: require('../../assets/dubbing_home/rank_icon_2.png'),
  rank_icon_6: require('../../assets/dubbing_home/rank_icon_6.png'),
  rank_icon_7: require('../../assets/dubbing_home/rank_icon_7.png'),
  rank_icon_8: require('../../assets/dubbing_home/rank_icon_8.png'),
  rank_icon_9: require('../../assets/dubbing_home/rank_icon_9.png'),
  rank_icon_dub: require('../../assets/dubbing_home/rank_icon_dub.png'),
  thumb_default: require('../../assets/dubbing_home/thumb_default.png'),
  wheat_left: require('../../assets/dubbing_home/wheat_left.png'),
  wheat_right: require('../../assets/dubbing_home/wheat_right.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type DubbingHomeAssetKey = keyof typeof dubbingHomeAssets;

export function dubbingRankBadge(rank: number): ImageSourcePropType {
  if (rank === 1) {
    return dubbingHomeAssets.rank_badge_1;
  }
  if (rank === 2) {
    return dubbingHomeAssets.rank_badge_2;
  }
  if (rank === 3) {
    return dubbingHomeAssets.rank_badge_3;
  }
  return dubbingHomeAssets.rank_icon_dub;
}

const ALL_SERVICES_DIR = 'packages/features/home/assets/all_services';
const SEARCH_DIR = 'packages/features/home/assets/search';
const DUBBING_DIR = 'packages/features/home/assets/dubbing_home';

/** Relative paths for assetParity disk checks (unique keys across registries). */
export const HOME_ASSET_MANIFEST: Record<string, string> = {
  ...Object.fromEntries(
    (Object.keys(homeServiceIcons) as HomeServiceIconKey[]).map(key => [
      `home-service-${key}`,
      `${ALL_SERVICES_DIR}/${key}.png`,
    ]),
  ),
  'search-icon_clear_history': `${SEARCH_DIR}/icon_clear_history.png`,
  'search-icon_filter': `${SEARCH_DIR}/icon_filter.png`,
  'search-icon_refresh': `${SEARCH_DIR}/icon_refresh.png`,
  'search-microphone': `${SEARCH_DIR}/microphone.png`,
  'search-rank_badge_bg': `${SEARCH_DIR}/rank_badge_bg.png`,
  'dubbing-badge_vip': `${DUBBING_DIR}/badge_vip.png`,
  'dubbing-banner_main': `${DUBBING_DIR}/banner_main.png`,
  'dubbing-bar_icon_top': `${DUBBING_DIR}/bar_icon_top.png`,
  'dubbing-cover_01': `${DUBBING_DIR}/cover_01.png`,
  'dubbing-cover_02': `${DUBBING_DIR}/cover_02.png`,
  'dubbing-cover_03': `${DUBBING_DIR}/cover_03.png`,
  'dubbing-cover_04': `${DUBBING_DIR}/cover_04.png`,
  'dubbing-cover_05': `${DUBBING_DIR}/cover_05.png`,
  'dubbing-cover_06': `${DUBBING_DIR}/cover_06.png`,
  'dubbing-cover_07': `${DUBBING_DIR}/cover_07.png`,
  'dubbing-cover_08': `${DUBBING_DIR}/cover_08.png`,
  'dubbing-cover_09': `${DUBBING_DIR}/cover_09.png`,
  'dubbing-cover_10': `${DUBBING_DIR}/cover_10.png`,
  'dubbing-cover_11': `${DUBBING_DIR}/cover_11.png`,
  'dubbing-cover_12': `${DUBBING_DIR}/cover_12.png`,
  'dubbing-cover_assessment': `${DUBBING_DIR}/cover_assessment.png`,
  'dubbing-feature_all_videos': `${DUBBING_DIR}/feature_all_videos.png`,
  'dubbing-feature_check_in': `${DUBBING_DIR}/feature_check_in.png`,
  'dubbing-feature_classic_theater': `${DUBBING_DIR}/feature_classic_theater.png`,
  'dubbing-feature_dubbing': `${DUBBING_DIR}/feature_dubbing.png`,
  'dubbing-feature_movie_words': `${DUBBING_DIR}/feature_movie_words.png`,
  'dubbing-feature_rank': `${DUBBING_DIR}/feature_rank.png`,
  'dubbing-hot_rank-badge_top20': `${DUBBING_DIR}/hot_rank/badge_top20.png`,
  'dubbing-hot_rank-icon_collapse': `${DUBBING_DIR}/hot_rank/icon_collapse.png`,
  'dubbing-hot_rank-icon_like': `${DUBBING_DIR}/hot_rank/icon_like.png`,
  'dubbing-hot_rank-icon_share': `${DUBBING_DIR}/hot_rank/icon_share.png`,
  'dubbing-hot_rank-wheat_large_left': `${DUBBING_DIR}/hot_rank/wheat_large_left.png`,
  'dubbing-hot_rank-wheat_large_right': `${DUBBING_DIR}/hot_rank/wheat_large_right.png`,
  'dubbing-icon_chevron_right': `${DUBBING_DIR}/icon_chevron_right.png`,
  'dubbing-icon_downward': `${DUBBING_DIR}/icon_downward.png`,
  'dubbing-icon_duration': `${DUBBING_DIR}/icon_duration.png`,
  'dubbing-icon_hot': `${DUBBING_DIR}/icon_hot.png`,
  'dubbing-icon_menu': `${DUBBING_DIR}/icon_menu.png`,
  'dubbing-icon_notification': `${DUBBING_DIR}/icon_notification.png`,
  'dubbing-icon_play_badge': `${DUBBING_DIR}/icon_play_badge.png`,
  'dubbing-icon_refresh': `${DUBBING_DIR}/icon_refresh.png`,
  'dubbing-icon_search': `${DUBBING_DIR}/icon_search.png`,
  'dubbing-icon_swap': `${DUBBING_DIR}/icon_swap.png`,
  'dubbing-icon_view_all': `${DUBBING_DIR}/icon_view_all.png`,
  'dubbing-rank_badge_1': `${DUBBING_DIR}/rank_badge_1.png`,
  'dubbing-rank_badge_2': `${DUBBING_DIR}/rank_badge_2.png`,
  'dubbing-rank_badge_3': `${DUBBING_DIR}/rank_badge_3.png`,
  'dubbing-rank_icon_1': `${DUBBING_DIR}/rank_icon_1.png`,
  'dubbing-rank_icon_10': `${DUBBING_DIR}/rank_icon_10.png`,
  'dubbing-rank_icon_2': `${DUBBING_DIR}/rank_icon_2.png`,
  'dubbing-rank_icon_6': `${DUBBING_DIR}/rank_icon_6.png`,
  'dubbing-rank_icon_7': `${DUBBING_DIR}/rank_icon_7.png`,
  'dubbing-rank_icon_8': `${DUBBING_DIR}/rank_icon_8.png`,
  'dubbing-rank_icon_9': `${DUBBING_DIR}/rank_icon_9.png`,
  'dubbing-rank_icon_dub': `${DUBBING_DIR}/rank_icon_dub.png`,
  'dubbing-thumb_default': `${DUBBING_DIR}/thumb_default.png`,
  'dubbing-wheat_left': `${DUBBING_DIR}/wheat_left.png`,
  'dubbing-wheat_right': `${DUBBING_DIR}/wheat_right.png`,
};

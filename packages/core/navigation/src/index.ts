import type {ComponentType} from 'react';
import type {Reducer} from '@reduxjs/toolkit';
import type {StackScreenProps} from '@react-native-ohos/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

export const RoutePath = {
  splash: 'Splash',
  main: 'Main',
  login: 'Login',
  loginPassword: 'LoginPassword',
  loginOtp: 'LoginOtp',
  register: 'Register',
  homeLearningReport: 'HomeLearningReport',
  homeCheckInMall: 'HomeCheckInMall',
  homeAllServices: 'HomeAllServices',
  homeSearch: 'HomeSearch',
  homeStrategy: 'HomeStrategy',
  homeDubbingFeed: 'HomeDubbingFeed',
  homeHotRankDetail: 'HomeHotRankDetail',
  homeUsedCarList: 'HomeUsedCarList',
  homeUsedCarDetail: 'HomeUsedCarDetail',
  chatDetail: 'ChatDetail',
  communityPublish: 'CommunityPublish',
  communityVideoPlay: 'CommunityVideoPlay',
  imagePreview: 'ImagePreview',
  settings: 'Settings',
  mineHttpTest: 'MineHttpTest',
  dialogDemo: 'DialogDemo',
  dealInvoiceDemo: 'DealInvoiceDemo',
  dealInvoiceUpload: 'DealInvoiceUpload',
  web: 'Web',
  friend: 'Friend',
  live: 'Live',
  liveRoom: 'LiveRoom',
  pay: 'Pay',
  payMembership: 'PayMembership',
  video: 'Video',
  shortVideo: 'ShortVideo',
  shortVideoPlay: 'ShortVideoPlay',
  dubbingVideoList: 'DubbingVideoList',
  dubbingWorkList: 'DubbingWorkList',
  dubbingVideoDetail: 'DubbingVideoDetail',
  dubbingWorkDetail: 'DubbingWorkDetail',
  musicList: 'MusicList',
  musicNowPlaying: 'MusicNowPlaying',
  bfuiGallery: 'BfuiGallery',
  bfuiTemplate: 'BfuiTemplate',
  classroomMyClass: 'ClassroomMyClass',
  classroomHomeworkStats: 'ClassroomHomeworkStats',
  classroomHomeworkReview: 'ClassroomHomeworkReview',
  debugBle: 'DebugBle',
  debugLinking: 'DebugLinking',
  debugRealtime: 'DebugRealtime',
  debugIm: 'DebugIm',
} as const;

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Login: undefined;
  LoginPassword: {email: string};
  LoginOtp: {phone: string};
  Register: undefined;
  HomeLearningReport: undefined;
  HomeCheckInMall: undefined;
  HomeAllServices: undefined;
  HomeSearch: undefined;
  HomeStrategy: undefined;
  HomeDubbingFeed: undefined;
  HomeHotRankDetail: {
    boardId?: string;
    title?: string;
    theme?: string;
  };
  HomeUsedCarList: undefined;
  HomeUsedCarDetail: {id: number};
  ChatDetail: {
    conversationId: string;
    title: string;
    portraitUrl?: string;
    type?: 'private' | 'group';
    isOnline?: boolean;
  };
  CommunityPublish: undefined;
  CommunityVideoPlay: {url: string; title?: string};
  ImagePreview: {
    uris?: string[];
    imageUrl?: string;
    initialIndex?: number;
  };
  Settings: undefined;
  MineHttpTest:
    | {
        level?: number;
        title?: string;
        collected?: number;
        total?: number;
        collecting?: boolean;
        locked?: boolean;
      }
    | undefined;
  DialogDemo: undefined;
  DealInvoiceDemo: undefined;
  DealInvoiceUpload: undefined;
  Web: {
    title?: string;
    url?: string;
    params?: Record<string, unknown>;
    loadType?: 'asset' | 'url';
    assetPath?: string;
    bridgeScriptAssetPath?: string | null;
    enableJavaScript?: boolean;
    showAppBar?: boolean;
    showBackButton?: boolean;
  };
  Friend: undefined;
  Live: undefined;
  LiveRoom: {roomId: string};
  Pay: undefined;
  PayMembership: undefined;
  Video: undefined;
  ShortVideo: undefined;
  ShortVideoPlay: {initialIndex?: number};
  DubbingVideoList: undefined;
  DubbingWorkList: undefined;
  DubbingVideoDetail: {id: string};
  DubbingWorkDetail: {id: string};
  MusicList: undefined;
  MusicNowPlaying: {trackId: string};
  BfuiGallery: undefined;
  BfuiTemplate: {templateId: string};
  ClassroomMyClass: undefined;
  ClassroomHomeworkStats: {classId?: string} | undefined;
  ClassroomHomeworkReview: undefined;
  DebugBle: undefined;
  DebugLinking: undefined;
  DebugRealtime: undefined;
  DebugIm: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  CommunityTab: undefined;
  MineTab: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >;

export interface TabRegistration {
  moduleId: string;
  name: keyof MainTabParamList;
  labelKey: string;
  icon: string;
  selectedIcon: string;
  order: number;
  requiresAuth?: boolean;
}

export type StackScreenComponent = ComponentType<{
  navigation?: object;
  route?: {params?: object; key?: string; name?: string};
}>;

/** Bridges typed screen components into the feature route registry. */
export function stackScreen(
  component: StackScreenComponent,
): StackScreenComponent {
  return component;
}

export interface FeatureRegistration {
  moduleId: string;
  tab?: TabRegistration;
  routes?: Array<{
    name: keyof RootStackParamList;
    component: StackScreenComponent;
    sharedElements?: (
      route: {name: string; params?: Record<string, unknown>},
      otherRoute?: {name: string; params?: Record<string, unknown>},
      showing?: boolean,
    ) => string[];
  }>;
  reducer?: {key: string; reducer: Reducer};
}

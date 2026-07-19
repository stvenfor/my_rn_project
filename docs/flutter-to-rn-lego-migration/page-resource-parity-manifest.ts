export type ParityStatus =
  | 'Migrated'
  | 'Degraded'
  | 'Placeholder'
  | 'Deferred'
  | 'Removed';

export interface PageParityEntry {
  id: string;
  module: string;
  flutterPath: string;
  rnRoute?: string;
  rnComponent?: string;
  status: ParityStatus;
  note?: string;
  owner?: string;
  targetVersion?: string;
}

export interface AssetParityEntry {
  id: string;
  module: string;
  flutterPath: string;
  rnPath: string;
  status: ParityStatus;
  registryKey?: string;
  note?: string;
}

export const PAGE_PARITY_ENTRIES: PageParityEntry[] = [
  {id: 'app-main', module: 'app', flutterPath: 'lib/pages/main_page.dart', rnRoute: 'Main', rnComponent: 'MainTabs', status: 'Migrated'},
  {id: 'app-splash', module: 'app', flutterPath: 'lib/pages/splash_page.dart', rnRoute: 'Splash', rnComponent: 'SplashScreen', status: 'Migrated'},
  {id: 'app-route-container', module: 'app', flutterPath: 'lib/route/app_route_container.dart', rnComponent: 'RootNavigator', status: 'Degraded', note: 'RN uses React Navigation stack instead of Flutter GetX container'},
  {id: 'app-web-route', module: 'app', flutterPath: 'packages/commons/ui/lib/kit/web/web_route_page.dart', rnRoute: 'Web', rnComponent: 'WebViewScreen', status: 'Migrated'},
  {id: 'app-web-view', module: 'app', flutterPath: 'packages/commons/ui/lib/kit/web/app_web_view_page.dart', rnRoute: 'Web', rnComponent: 'WebViewScreen', status: 'Migrated', note: 'Merged into WebViewScreen'},

  {id: 'auth-login', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_page.dart', rnRoute: 'Login', rnComponent: 'LoginScreen', status: 'Migrated', note: '1:1 same-page email+password / phone+OTP; iOS AuthTheme; account-not-registered Alert'},
  {id: 'auth-login-password', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_password_page.dart', rnRoute: 'LoginPassword', rnComponent: 'LoginPasswordScreen', status: 'Migrated', note: 'Legacy route only (no UI callers from Login); white underline style; min password 6'},
  {id: 'auth-login-otp', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_otp_page.dart', rnRoute: 'LoginOtp', rnComponent: 'LoginOtpScreen', status: 'Migrated', note: 'Legacy route only; white underline OTP page; resend cooldown + mock hint'},
  {id: 'auth-register', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/register_page.dart', rnRoute: 'Register', rnComponent: 'RegisterScreen', status: 'Migrated', note: '1:1 iOS register: AuthBackButton, Cupertino segment, grouped card / PhoneOtpFormSection'},
  {id: 'auth-dev-home', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/auth_dev_home_page.dart', status: 'Removed', note: 'Flutter module standalone dev entry; not part of app shell'},

  {id: 'home-page', module: 'home', flutterPath: 'packages/features/home/lib/home/view/home_page.dart', rnRoute: 'HomeTab', rnComponent: 'HomeScreen', status: 'Migrated', note: 'LoginRedirect used-car; Club→Community; Video daily/course 1:1; mock CTAs match Flutter'},
  {id: 'home-learning-report', module: 'home', flutterPath: 'packages/features/home/lib/home/view/home_learning_report_page.dart', rnRoute: 'HomeLearningReport', rnComponent: 'HomeLearningReportScreen', status: 'Migrated', note: 'Membership/parent CTAs inert on Flutter+RN'},
  {id: 'home-check-in-mall', module: 'home', flutterPath: 'packages/features/home/lib/home/view/check_in_mall_page.dart', rnRoute: 'HomeCheckInMall', rnComponent: 'HomeCheckInMallScreen', status: 'Migrated', note: 'Gift empty + non-interactive sign-in match Flutter mock'},
  {id: 'home-all-services', module: 'home', flutterPath: 'packages/features/home/lib/home/view/all_services_page.dart', rnRoute: 'HomeAllServices', rnComponent: 'HomeAllServicesScreen', status: 'Migrated'},
  {id: 'home-search', module: 'home', flutterPath: 'packages/features/home/lib/home/view/search_page.dart', rnRoute: 'HomeSearch', rnComponent: 'HomeSearchScreen', status: 'Migrated', note: 'Submit/rank/voice toast parity with Flutter mock'},
  {id: 'home-strategy', module: 'home', flutterPath: 'packages/features/home/lib/home/view/strategy_page.dart', rnRoute: 'HomeStrategy', rnComponent: 'HomeStrategyScreen', status: 'Migrated', note: 'Intro/footnote + fear-greed gauge; tabs/periods UI-only like Flutter'},
  {id: 'home-dubbing-feed', module: 'home', flutterPath: 'packages/features/home/lib/home/view/dubbing_home_page.dart', rnRoute: 'HomeDubbingFeed', rnComponent: 'HomeDubbingFeedScreen', status: 'Migrated', note: 'Expert+Editor×4; media taps→DubbingVideoDetail; scrollToHotRank'},
  {id: 'home-hot-rank-detail', module: 'home', flutterPath: 'packages/features/home/lib/home/view/hot_rank_detail_page.dart', rnRoute: 'HomeHotRankDetail', rnComponent: 'HomeHotRankDetailScreen', status: 'Migrated', note: 'Row tap → DubbingVideoDetail; age filter cosmetic like Flutter'},
  {id: 'home-used-car-list', module: 'home', flutterPath: 'packages/features/home/lib/home/view/used_car_list_page.dart', rnRoute: 'HomeUsedCarList', rnComponent: 'HomeUsedCarListScreen', status: 'Migrated', note: 'Entry gated via openUsedCarList + LoginRedirect'},
  {id: 'home-used-car-detail', module: 'home', flutterPath: 'packages/features/home/lib/home/view/used_car_detail_page.dart', rnRoute: 'HomeUsedCarDetail', rnComponent: 'HomeUsedCarDetailScreen', status: 'Migrated'},

  {id: 'chat-page', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/chat_page.dart', rnRoute: 'ChatTab', rnComponent: 'ChatScreen', status: 'Migrated', note: 'IM adapter via @core/im'},
  {id: 'chat-detail', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/chat_detail_page.dart', rnRoute: 'ChatDetail', rnComponent: 'ChatDetailScreen', status: 'Migrated', note: 'Messages via @core/im adapter'},
  {id: 'chat-image-preview', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/image_preview_page.dart', rnRoute: 'ImagePreview', rnComponent: 'ImagePreviewScreen', status: 'Migrated'},

  {id: 'community-page', module: 'community', flutterPath: 'packages/features/community/lib/community/view/community_page.dart', rnRoute: 'CommunityTab', rnComponent: 'CommunityScreen', status: 'Migrated', note: 'PostCard feed + refresh/loadMore + comment/like sheets aligned with MockPostRepository'},
  {id: 'community-publish', module: 'community', flutterPath: 'packages/features/community/lib/community/view/publish_page.dart', rnRoute: 'CommunityPublish', rnComponent: 'CommunityPublishScreen', status: 'Migrated'},
  {id: 'community-image-preview', module: 'community', flutterPath: 'packages/features/community/lib/community/view/image_preview_page.dart', rnRoute: 'ImagePreview', rnComponent: 'ImagePreviewScreen', status: 'Migrated'},
  {id: 'community-video-play', module: 'community', flutterPath: 'packages/features/community/lib/community/view/video_play_page.dart', rnRoute: 'CommunityVideoPlay', rnComponent: 'CommunityVideoPlayScreen', status: 'Migrated'},

  {id: 'settings-mine', module: 'settings', flutterPath: 'packages/features/settings/lib/mine/view/mine_page.dart', rnRoute: 'MineTab', rnComponent: 'MineScreen', status: 'Migrated'},
  {id: 'settings-settings', module: 'settings', flutterPath: 'packages/features/settings/lib/settings/view/settings_page.dart', rnRoute: 'Settings', rnComponent: 'SettingsScreen', status: 'Migrated', note: 'themeMode wired to NavigationContainer + Settings UI'},
  {id: 'settings-http-test', module: 'settings', flutterPath: 'packages/features/settings/lib/mine/view/mine_http_test_page.dart', rnRoute: 'MineHttpTest', rnComponent: 'MineHttpTestScreen', status: 'Migrated'},
  {id: 'settings-dialog-demo', module: 'settings', flutterPath: 'packages/features/settings/lib/settings/view/dialog_demo_page.dart', rnRoute: 'DialogDemo', rnComponent: 'DialogDemoScreen', status: 'Migrated', note: 'AppDialogManager priority queue + styles/queue sections 1:1'},
  {id: 'settings-invoice-demo', module: 'settings', flutterPath: 'packages/features/settings/lib/deal_invoice/view/deal_invoice_demo_page.dart', rnRoute: 'DealInvoiceDemo', rnComponent: 'DealInvoiceDemoScreen', status: 'Migrated', note: 'sticky tabs + pull refresh + load more + FAB; mock repo 1:1'},
  {id: 'settings-invoice-upload', module: 'settings', flutterPath: 'packages/features/settings/lib/deal_invoice/view/deal_invoice_upload_page.dart', rnRoute: 'DealInvoiceUpload', rnComponent: 'DealInvoiceUploadScreen', status: 'Migrated', note: 'create/detail/reupload scenes + customer picker + submit flow'},
  {id: 'settings-personalized', module: 'settings', flutterPath: 'packages/features/settings/lib/mine/personalized_settings/view/personalized_settings_page.dart', rnRoute: 'PersonalizedSettings', rnComponent: 'PersonalizedSettingsScreen', status: 'Migrated', note: 'Mine info entry; switches + eye-protection sheet + help/chevron assets'},

  {id: 'friend-page', module: 'friend', flutterPath: 'packages/features/friend/lib/friend/view/friend_page.dart', rnRoute: 'Friend', rnComponent: 'FriendScreen', status: 'Migrated'},
  {id: 'live-page', module: 'live', flutterPath: 'packages/features/live/lib/live/view/live_page.dart', rnRoute: 'Live', rnComponent: 'LiveScreen', status: 'Migrated', note: 'UI migrated; realtime core Deferred'},
  {id: 'live-room', module: 'live', flutterPath: 'packages/features/live/lib/live/view/live_room_page.dart', rnRoute: 'LiveRoom', rnComponent: 'LiveRoomScreen', status: 'Migrated', note: 'Realtime via @core/realtime mock adapter'},
  {id: 'pay-page', module: 'pay', flutterPath: 'packages/features/pay/lib/pay/view/pay_page.dart', rnRoute: 'Pay', rnComponent: 'PayScreen', status: 'Migrated', note: 'Layout migrated; payment SDK Deferred v0.2'},
  {id: 'pay-membership', module: 'pay', flutterPath: 'packages/features/pay/lib/membership/view/membership_renew_page.dart', rnRoute: 'PayMembership', rnComponent: 'MembershipRenewScreen', status: 'Migrated'},
  {id: 'video-page', module: 'video', flutterPath: 'packages/features/video/lib/videos/view/video_page.dart', rnRoute: 'Video', rnComponent: 'VideoScreen', status: 'Migrated'},
  {id: 'video-short', module: 'video', flutterPath: 'packages/features/video/lib/short_video/view/short_video_page.dart', rnRoute: 'ShortVideo', rnComponent: 'ShortVideoScreen', status: 'Migrated', note: 'Profile card + masonry grid + empty state; Lottie deferred (FallbackIllustration)'},
  {id: 'video-short-play', module: 'video', flutterPath: 'packages/features/video/lib/short_video/view/short_video_play_page.dart', rnRoute: 'ShortVideoPlay', rnComponent: 'ShortVideoPlayScreen', status: 'Migrated', note: 'Vertical feed via @commons/toolkit ShortVideoPlayerKit; landscape/danmaku Degraded'},
  {id: 'video-dubbing-list', module: 'video', flutterPath: 'packages/features/video/lib/dubbing/view/dubbing_video_list_page.dart', rnRoute: 'DubbingVideoList', rnComponent: 'DubbingVideoListScreen', status: 'Migrated'},
  {id: 'video-dubbing-work-list', module: 'video', flutterPath: 'packages/features/video/lib/dubbing/view/dubbing_work_list_page.dart', rnRoute: 'DubbingWorkList', rnComponent: 'DubbingWorkListScreen', status: 'Migrated'},
  {id: 'video-dubbing-detail', module: 'video', flutterPath: 'packages/features/video/lib/dubbing/view/dubbing_video_detail_page.dart', rnRoute: 'DubbingVideoDetail', rnComponent: 'DubbingVideoDetailScreen', status: 'Migrated', note: 'List-entry detail; full player chrome may be Degraded vs Flutter'},
  {id: 'video-dubbing-work-detail', module: 'video', flutterPath: 'packages/features/video/lib/dubbing/view/dubbing_work_detail_page.dart', rnRoute: 'DubbingWorkDetail', rnComponent: 'DubbingWorkDetailScreen', status: 'Migrated', note: 'List-entry detail; full player chrome may be Degraded vs Flutter'},

  {id: 'music-list', module: 'music', flutterPath: 'packages/features/music/lib/view/music_list_page.dart', rnRoute: 'MusicList', rnComponent: 'MusicListScreen', status: 'Migrated'},
  {id: 'music-now-playing', module: 'music', flutterPath: 'packages/features/music/lib/view/now_playing_page.dart', rnRoute: 'MusicNowPlaying', rnComponent: 'MusicNowPlayingScreen', status: 'Migrated'},

  {id: 'bfui-intro', module: 'bfui', flutterPath: 'packages/features/bfui/lib/introduction_animation/introduction_animation_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'IntroAnimationTemplate', status: 'Migrated'},
  {id: 'bfui-hotel-home', module: 'bfui', flutterPath: 'packages/features/bfui/lib/hotel_booking/hotel_home_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'HotelBookingTemplate', status: 'Migrated'},
  {id: 'bfui-hotel-filters', module: 'bfui', flutterPath: 'packages/features/bfui/lib/hotel_booking/filters_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'HotelFiltersTemplate', status: 'Migrated'},
  {id: 'bfui-fitness-home', module: 'bfui', flutterPath: 'packages/features/bfui/lib/fitness_app/fitness_app_home_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'FitnessAppTemplate', status: 'Migrated'},
  {id: 'bfui-my-diary', module: 'bfui', flutterPath: 'packages/features/bfui/lib/fitness_app/my_diary/my_diary_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'MyDiaryTemplate', status: 'Migrated'},
  {id: 'bfui-training', module: 'bfui', flutterPath: 'packages/features/bfui/lib/fitness_app/training/training_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'TrainingTemplate', status: 'Migrated'},
  {id: 'bfui-design-course', module: 'bfui', flutterPath: 'packages/features/bfui/lib/design_course/home_design_course.dart', rnRoute: 'BfuiTemplate', rnComponent: 'DesignCourseTemplate', status: 'Migrated'},
  {id: 'bfui-course-info', module: 'bfui', flutterPath: 'packages/features/bfui/lib/design_course/course_info_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'CourseInfoTemplate', status: 'Migrated'},
  {id: 'bfui-help', module: 'bfui', flutterPath: 'packages/features/bfui/lib/help_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'HelpTemplate', status: 'Migrated'},
  {id: 'bfui-feedback', module: 'bfui', flutterPath: 'packages/features/bfui/lib/feedback_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'FeedbackTemplate', status: 'Migrated'},
  {id: 'bfui-invite', module: 'bfui', flutterPath: 'packages/features/bfui/lib/invite_friend_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'InviteFriendTemplate', status: 'Migrated'},
  {id: 'bfui-nav-drawer', module: 'bfui', flutterPath: 'packages/features/bfui/lib/navigation_home_screen.dart', rnRoute: 'BfuiTemplate', rnComponent: 'NavigationDrawerTemplate', status: 'Migrated'},

  {id: 'debug-ble', module: 'infrastructure', flutterPath: 'packages/infrastructure/bluetooth/lib/debug/ble_demo_page.dart', rnRoute: 'DebugBle', rnComponent: 'DebugBleScreen', status: 'Migrated', note: '1:1 BleDemo UI + MockBluetoothService state machine; Settings entry; no image assets'},
  {id: 'debug-linking', module: 'infrastructure', flutterPath: 'packages/infrastructure/linking/lib/debug/linking_debug_page.dart', rnRoute: 'DebugLinking', rnComponent: 'DebugLinkingScreen', status: 'Migrated', note: 'App shell debug route via @core/linking'},
  {id: 'debug-realtime', module: 'infrastructure', flutterPath: 'packages/infrastructure/realtime/lib/debug/realtime_debug_page.dart', rnRoute: 'DebugRealtime', rnComponent: 'DebugRealtimeScreen', status: 'Migrated', note: 'App shell debug route via @core/realtime'},
  {id: 'debug-im', module: 'infrastructure', flutterPath: 'packages/infrastructure/rongcloud_im/lib/debug/im_debug_page.dart', rnRoute: 'DebugIm', rnComponent: 'DebugImScreen', status: 'Migrated', note: 'App shell debug route via @core/im'},

  {id: 'classroom-my-class-list', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/my_class_list_page.dart', rnRoute: 'ClassroomMyClass', rnComponent: 'MyClassListScreen', status: 'Migrated'},
  {id: 'classroom-class-homework-stats', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/class_homework_stats_page.dart', rnRoute: 'ClassroomHomeworkStats', rnComponent: 'ClassHomeworkStatsScreen', status: 'Migrated', note: 'Student row → teacher detail; custom time sheet still Degraded'},
  {id: 'classroom-homework-detail-student', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/homework_detail_student_page.dart', rnRoute: 'ClassroomHomeworkDetailStudent', rnComponent: 'HomeworkDetailStudentScreen', status: 'Migrated', note: 'Tasks + dubbing/gift entries; mock progress'},
  {id: 'classroom-homework-detail-teacher', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/homework_detail_teacher_page.dart', rnRoute: 'ClassroomHomeworkDetailTeacher', rnComponent: 'HomeworkDetailTeacherScreen', status: 'Migrated', note: 'Timeline + status tabs → student detail'},
  {id: 'classroom-homework-review', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/homework_review_page.dart', rnRoute: 'ClassroomHomeworkReview', rnComponent: 'HomeworkReviewScreen', status: 'Migrated', note: 'Gift checkbox → ClaimGift (Flutter SvipRewardDialog simplified)'},
  {id: 'classroom-dubbing-homework', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/dubbing_homework_page.dart', rnRoute: 'ClassroomDubbingHomework', rnComponent: 'DubbingHomeworkScreen', status: 'Migrated', note: 'Item → video detail; mock-only'},
  {id: 'classroom-video-detail', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/video_detail_page.dart', rnRoute: 'ClassroomVideoDetail', rnComponent: 'ClassroomVideoDetailScreen', status: 'Degraded', note: 'Player placeholder; settings sheet toast; UI shell 1:1'},
  {id: 'classroom-claim-gift-card', module: 'classroom', flutterPath: 'packages/features/classroom/lib/view/claim_gift_card_page.dart', rnRoute: 'ClassroomClaimGift', rnComponent: 'ClaimGiftCardScreen', status: 'Migrated'},
];

export const ASSET_PARITY_ENTRIES: AssetParityEntry[] = [
  ...Object.entries({
    after_sales_area: 'packages/features/home/assets/all_services/after_sales_area.png',
    all_functions: 'packages/features/home/assets/all_services/all_functions.png',
    business_poster: 'packages/features/home/assets/all_services/business_poster.png',
    calculator: 'packages/features/home/assets/all_services/calculator.png',
    customer_profile: 'packages/features/home/assets/all_services/customer_profile.png',
    dubbing_home: 'packages/features/home/assets/all_services/dubbing_home.png',
    exhibition_hall_shooting: 'packages/features/home/assets/all_services/exhibition_hall_shooting.png',
    intelligence_task: 'packages/features/home/assets/all_services/intelligence_task.png',
    marketing: 'packages/features/home/assets/all_services/marketing.png',
    nav_back_black: 'packages/features/home/assets/all_services/nav_back_black.png',
    new_car_deal: 'packages/features/home/assets/all_services/new_car_deal.png',
    new_car_in_store: 'packages/features/home/assets/all_services/new_car_in_store.png',
    online_customer_acquisition: 'packages/features/home/assets/all_services/online_customer_acquisition.png',
    service_management: 'packages/features/home/assets/all_services/service_management.png',
    small_video: 'packages/features/home/assets/all_services/small_video.png',
    smart_number: 'packages/features/home/assets/all_services/smart_number.png',
    smart_online_marketing: 'packages/features/home/assets/all_services/smart_online_marketing.png',
    smart_sale: 'packages/features/home/assets/all_services/smart_sale.png',
    used_car: 'packages/features/home/assets/all_services/used_car.png',
    v_store: 'packages/features/home/assets/all_services/v_store.png',
  }).map(([key, rnPath]) => ({
    id: `home-${key}`,
    module: 'home',
    flutterPath: `packages/features/home/assets/all_services/${key}.png`,
    rnPath,
    status: 'Migrated' as ParityStatus,
    registryKey: key,
  })),
  {id: 'home-search-icon_clear_history', module: 'home', flutterPath: 'packages/features/home/assets/search/icon_clear_history.png', rnPath: 'packages/features/home/assets/search/icon_clear_history.png', status: 'Migrated' as ParityStatus, registryKey: 'search-icon_clear_history'},
  {id: 'home-search-icon_filter', module: 'home', flutterPath: 'packages/features/home/assets/search/icon_filter.png', rnPath: 'packages/features/home/assets/search/icon_filter.png', status: 'Migrated' as ParityStatus, registryKey: 'search-icon_filter'},
  {id: 'home-search-icon_refresh', module: 'home', flutterPath: 'packages/features/home/assets/search/icon_refresh.png', rnPath: 'packages/features/home/assets/search/icon_refresh.png', status: 'Migrated' as ParityStatus, registryKey: 'search-icon_refresh'},
  {id: 'home-search-microphone', module: 'home', flutterPath: 'packages/features/home/assets/search/microphone.png', rnPath: 'packages/features/home/assets/search/microphone.png', status: 'Migrated' as ParityStatus, registryKey: 'search-microphone'},
  {id: 'home-search-rank_badge_bg', module: 'home', flutterPath: 'packages/features/home/assets/search/rank_badge_bg.png', rnPath: 'packages/features/home/assets/search/rank_badge_bg.png', status: 'Migrated' as ParityStatus, registryKey: 'search-rank_badge_bg'},
  {id: 'home-dubbing-badge_vip', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/badge_vip.png', rnPath: 'packages/features/home/assets/dubbing_home/badge_vip.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-badge_vip'},
  {id: 'home-dubbing-banner_main', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/banner_main.png', rnPath: 'packages/features/home/assets/dubbing_home/banner_main.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-banner_main'},
  {id: 'home-dubbing-bar_icon_top', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/bar_icon_top.png', rnPath: 'packages/features/home/assets/dubbing_home/bar_icon_top.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-bar_icon_top'},
  {id: 'home-dubbing-cover_01', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_01.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_01.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_01'},
  {id: 'home-dubbing-cover_02', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_02.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_02.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_02'},
  {id: 'home-dubbing-cover_03', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_03.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_03.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_03'},
  {id: 'home-dubbing-cover_04', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_04.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_04.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_04'},
  {id: 'home-dubbing-cover_05', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_05.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_05.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_05'},
  {id: 'home-dubbing-cover_06', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_06.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_06.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_06'},
  {id: 'home-dubbing-cover_07', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_07.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_07.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_07'},
  {id: 'home-dubbing-cover_08', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_08.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_08.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_08'},
  {id: 'home-dubbing-cover_09', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_09.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_09.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_09'},
  {id: 'home-dubbing-cover_10', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_10.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_10.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_10'},
  {id: 'home-dubbing-cover_11', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_11.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_11.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_11'},
  {id: 'home-dubbing-cover_12', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_12.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_12.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_12'},
  {id: 'home-dubbing-cover_assessment', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/cover_assessment.png', rnPath: 'packages/features/home/assets/dubbing_home/cover_assessment.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-cover_assessment'},
  {id: 'home-dubbing-feature_all_videos', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_all_videos.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_all_videos.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_all_videos'},
  {id: 'home-dubbing-feature_check_in', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_check_in.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_check_in.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_check_in'},
  {id: 'home-dubbing-feature_classic_theater', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_classic_theater.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_classic_theater.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_classic_theater'},
  {id: 'home-dubbing-feature_dubbing', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_dubbing.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_dubbing.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_dubbing'},
  {id: 'home-dubbing-feature_movie_words', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_movie_words.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_movie_words.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_movie_words'},
  {id: 'home-dubbing-feature_rank', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/feature_rank.png', rnPath: 'packages/features/home/assets/dubbing_home/feature_rank.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-feature_rank'},
  {id: 'home-dubbing-hot_rank-badge_top20', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/badge_top20.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/badge_top20.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-badge_top20'},
  {id: 'home-dubbing-hot_rank-icon_collapse', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_collapse.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_collapse.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-icon_collapse'},
  {id: 'home-dubbing-hot_rank-icon_like', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_like.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_like.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-icon_like'},
  {id: 'home-dubbing-hot_rank-icon_share', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_share.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/icon_share.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-icon_share'},
  {id: 'home-dubbing-hot_rank-wheat_large_left', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/wheat_large_left.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/wheat_large_left.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-wheat_large_left'},
  {id: 'home-dubbing-hot_rank-wheat_large_right', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/hot_rank/wheat_large_right.png', rnPath: 'packages/features/home/assets/dubbing_home/hot_rank/wheat_large_right.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-hot_rank-wheat_large_right'},
  {id: 'home-dubbing-icon_chevron_right', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_chevron_right.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_chevron_right.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_chevron_right'},
  {id: 'home-dubbing-icon_downward', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_downward.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_downward.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_downward'},
  {id: 'home-dubbing-icon_duration', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_duration.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_duration.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_duration'},
  {id: 'home-dubbing-icon_hot', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_hot.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_hot.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_hot'},
  {id: 'home-dubbing-icon_menu', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_menu.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_menu.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_menu'},
  {id: 'home-dubbing-icon_notification', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_notification.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_notification.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_notification'},
  {id: 'home-dubbing-icon_play_badge', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_play_badge.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_play_badge.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_play_badge'},
  {id: 'home-dubbing-icon_refresh', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_refresh.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_refresh.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_refresh'},
  {id: 'home-dubbing-icon_search', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_search.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_search.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_search'},
  {id: 'home-dubbing-icon_swap', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_swap.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_swap.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_swap'},
  {id: 'home-dubbing-icon_view_all', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/icon_view_all.png', rnPath: 'packages/features/home/assets/dubbing_home/icon_view_all.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-icon_view_all'},
  {id: 'home-dubbing-rank_badge_1', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_badge_1.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_badge_1.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_badge_1'},
  {id: 'home-dubbing-rank_badge_2', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_badge_2.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_badge_2.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_badge_2'},
  {id: 'home-dubbing-rank_badge_3', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_badge_3.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_badge_3.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_badge_3'},
  {id: 'home-dubbing-rank_icon_1', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_1.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_1.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_1'},
  {id: 'home-dubbing-rank_icon_10', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_10.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_10.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_10'},
  {id: 'home-dubbing-rank_icon_2', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_2.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_2.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_2'},
  {id: 'home-dubbing-rank_icon_6', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_6.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_6.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_6'},
  {id: 'home-dubbing-rank_icon_7', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_7.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_7.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_7'},
  {id: 'home-dubbing-rank_icon_8', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_8.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_8.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_8'},
  {id: 'home-dubbing-rank_icon_9', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_9.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_9.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_9'},
  {id: 'home-dubbing-rank_icon_dub', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/rank_icon_dub.png', rnPath: 'packages/features/home/assets/dubbing_home/rank_icon_dub.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-rank_icon_dub'},
  {id: 'home-dubbing-thumb_default', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/thumb_default.png', rnPath: 'packages/features/home/assets/dubbing_home/thumb_default.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-thumb_default'},
  {id: 'home-dubbing-wheat_left', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/wheat_left.png', rnPath: 'packages/features/home/assets/dubbing_home/wheat_left.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-wheat_left'},
  {id: 'home-dubbing-wheat_right', module: 'home', flutterPath: 'packages/features/home/assets/dubbing_home/wheat_right.png', rnPath: 'packages/features/home/assets/dubbing_home/wheat_right.png', status: 'Migrated' as ParityStatus, registryKey: 'dubbing-wheat_right'},

  ...Object.entries({
    sms: 'packages/features/settings/assets/mine_functions/sms.png',
    calculator: 'packages/features/settings/assets/mine_functions/calculator.png',
    used_car: 'packages/features/settings/assets/mine_functions/used_car.png',
    short_video: 'packages/features/settings/assets/mine_functions/short_video.png',
    after_sales: 'packages/features/settings/assets/mine_functions/after_sales.png',
    qr_pay: 'packages/features/settings/assets/mine_functions/qr_pay.png',
    qa: 'packages/features/settings/assets/mine_functions/qa.png',
    poster: 'packages/features/settings/assets/mine_functions/poster.png',
  }).map(([key, rnPath]) => ({
    id: `settings-mine-${key}`,
    module: 'settings',
    flutterPath: `packages/features/home/assets/all_services/${key === 'sms' ? 'marketing' : key === 'short_video' ? 'small_video' : key === 'after_sales' ? 'after_sales_area' : key === 'qr_pay' ? 'v_store' : key === 'qa' ? 'customer_profile' : key === 'poster' ? 'business_poster' : key}.png`,
    rnPath,
    status: 'Migrated' as ParityStatus,
    registryKey: key,
    note: 'Mine function card icon; Flutter uses Material Icons, RN uses dealership PNG set',
  })),
  ...Object.entries({
    help_circle:
      'packages/features/settings/assets/personalized_settings/help_circle.png',
    chevron_right:
      'packages/features/settings/assets/personalized_settings/chevron_right.png',
    chevron_right_alt:
      'packages/features/settings/assets/personalized_settings/chevron_right_alt.png',
  }).map(([key, rnPath]) => ({
    id: `settings-personalized-${key}`,
    module: 'settings',
    flutterPath: `packages/features/settings/assets/personalized_settings/${key}.png`,
    rnPath,
    status: 'Migrated' as ParityStatus,
    registryKey: key,
  })),
  {id: 'music-lady', module: 'music', flutterPath: 'packages/features/music/assets/defaults/lady.jpeg', rnPath: 'packages/features/music/assets/defaults/lady.jpeg', status: 'Migrated', registryKey: 'lady'},
  {id: 'music-record', module: 'music', flutterPath: 'packages/features/music/assets/defaults/music_record.jpeg', rnPath: 'packages/features/music/assets/defaults/music_record.jpeg', status: 'Migrated', registryKey: 'musicRecord'},
  {id: 'toolkit-video-mock', module: 'toolkit', flutterPath: 'packages/commons/toolkit/assets/data/video_mock_sources.json', rnPath: 'packages/commons/toolkit/assets/data/video_mock_sources.json', status: 'Migrated', registryKey: 'video_mock_sources'},
  {id: 'app-ios-icon-1024', module: 'app', flutterPath: 'ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png', rnPath: 'ios/MyRnProject/Images.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png', status: 'Migrated', registryKey: 'iosAppIcon1024'},
  {id: 'app-ios-launch-3x', module: 'app', flutterPath: 'ios/Runner/Assets.xcassets/LaunchImage.imageset/LaunchImage@3x.png', rnPath: 'ios/MyRnProject/Images.xcassets/LaunchImage.imageset/LaunchImage@3x.png', status: 'Migrated', registryKey: 'iosLaunchImage3x'},
  {id: 'app-android-icon', module: 'app', flutterPath: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', rnPath: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', status: 'Migrated', registryKey: 'androidLauncherIcon'},
  {id: 'app-android-launch', module: 'app', flutterPath: 'android/app/src/main/res/mipmap-xxxhdpi/launch_image.png', rnPath: 'android/app/src/main/res/mipmap-xxxhdpi/launch_image.png', status: 'Migrated', registryKey: 'androidLaunchImage'},
  {id: 'app-harmony-start-icon', module: 'app', flutterPath: 'ohos/entry/src/main/resources/base/media/icon.png', rnPath: 'harmony/entry/src/main/resources/base/media/startIcon.png', status: 'Migrated', registryKey: 'harmonyStartIcon'},
  {id: 'app-harmony-foreground', module: 'app', flutterPath: 'ohos/entry/src/main/resources/base/media/icon.png', rnPath: 'harmony/entry/src/main/resources/base/media/foreground.png', status: 'Migrated', registryKey: 'harmonyForegroundIcon', note: 'layered_image foreground; resized to 288px'},
  {id: 'app-harmony-background', module: 'app', flutterPath: 'android/app/src/main/res/values/colors.xml', rnPath: 'harmony/entry/src/main/resources/base/media/background.png', status: 'Migrated', registryKey: 'harmonyBackground', note: 'Solid #F7FAFC splash background for layered icon'},
  {id: 'webview-test-bridge', module: 'webview', flutterPath: 'assets/web/test_bridge.html', rnPath: 'packages/core/webview/assets/web/test_bridge.html', status: 'Migrated', registryKey: 'testBridgeHtml'},
  {id: 'webview-bridge-injection', module: 'webview', flutterPath: 'assets/web/ICSAPPInjection.js', rnPath: 'packages/core/webview/assets/web/ICSAPPInjection.js', status: 'Migrated', registryKey: 'icsAppInjectionJs', note: 'RN uses postMessage bridge; Flutter reference kept as .sourceflutter'},
  ...Object.keys({
    badge_trial_price: 1,
    header_ai_svip: 1,
    header_ai_svip_watermark: 1,
    header_svip: 1,
    header_svip_watermark: 1,
    icon_alipay: 1,
    icon_back: 1,
    icon_check_selected: 1,
    icon_checkbox_selected: 1,
    icon_checkbox_unselected: 1,
    icon_crown_svip: 1,
    icon_diamond_ai: 1,
    icon_diamond_ai_large: 1,
    icon_radio_selected_ai: 1,
    icon_radio_selected_svip: 1,
    icon_radio_unselected_ai: 1,
    icon_radio_unselected_svip: 1,
    icon_red_packet_ai: 1,
    icon_red_packet_svip: 1,
    icon_service: 1,
    icon_wechat: 1,
    illustration_ai_svip: 1,
    illustration_svip: 1,
    mask_watermark: 1,
    member_card_bg: 1,
    tab_ai_svip_center: 1,
    tab_ai_svip_left: 1,
    tab_ai_svip_right: 1,
    tab_svip_center: 1,
    tab_svip_left: 1,
    tab_svip_right: 1,
  }).map(key => ({
    id: `pay-membership-${key}`,
    module: 'pay',
    flutterPath: `packages/features/pay/assets/membership/${key}.png`,
    rnPath: `packages/features/pay/assets/membership/${key}.png`,
    status: 'Migrated' as ParityStatus,
    registryKey: key,
  })),
];

// BFUI assets appended programmatically in assetParity.test via BFUI_ASSET_MANIFEST

export const EXPECTED_PAGE_COUNT = 72;
export const EXPECTED_ASSET_COUNT = 186;

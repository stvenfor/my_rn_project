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

  {id: 'auth-login', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_page.dart', rnRoute: 'Login', rnComponent: 'LoginScreen', status: 'Migrated', note: 'Segmented email/phone login, privacy row, greeting, footer links aligned with AuthController'},
  {id: 'auth-login-password', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_password_page.dart', rnRoute: 'LoginPassword', rnComponent: 'LoginPasswordScreen', status: 'Migrated', note: 'Underline password input, 8-16 validation, footer links'},
  {id: 'auth-login-otp', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/login_otp_page.dart', rnRoute: 'LoginOtp', rnComponent: 'LoginOtpScreen', status: 'Migrated', note: 'Masked phone, OTP resend cooldown, mock OTP hint'},
  {id: 'auth-register', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/register_page.dart', rnRoute: 'Register', rnComponent: 'RegisterScreen', status: 'Migrated', note: 'Email/phone tab register with privacy checkbox and validation'},
  {id: 'auth-dev-home', module: 'auth', flutterPath: 'packages/features/auth/lib/user/view/auth_dev_home_page.dart', status: 'Removed', note: 'Flutter module standalone dev entry; not part of app shell'},

  {id: 'home-page', module: 'home', flutterPath: 'packages/features/home/lib/home/view/home_page.dart', rnRoute: 'HomeTab', rnComponent: 'HomeScreen', status: 'Migrated'},
  {id: 'home-learning-report', module: 'home', flutterPath: 'packages/features/home/lib/home/view/home_learning_report_page.dart', rnRoute: 'HomeLearningReport', rnComponent: 'HomeLearningReportScreen', status: 'Migrated'},
  {id: 'home-check-in-mall', module: 'home', flutterPath: 'packages/features/home/lib/home/view/check_in_mall_page.dart', rnRoute: 'HomeCheckInMall', rnComponent: 'HomeCheckInMallScreen', status: 'Migrated'},
  {id: 'home-all-services', module: 'home', flutterPath: 'packages/features/home/lib/home/view/all_services_page.dart', rnRoute: 'HomeAllServices', rnComponent: 'HomeAllServicesScreen', status: 'Migrated'},

  {id: 'chat-page', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/chat_page.dart', rnRoute: 'ChatTab', rnComponent: 'ChatScreen', status: 'Migrated', note: 'IM adapter via @core/im'},
  {id: 'chat-detail', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/chat_detail_page.dart', rnRoute: 'ChatDetail', rnComponent: 'ChatDetailScreen', status: 'Migrated', note: 'Messages via @core/im adapter'},
  {id: 'chat-image-preview', module: 'chat', flutterPath: 'packages/features/chat/lib/chat/view/image_preview_page.dart', rnRoute: 'ImagePreview', rnComponent: 'ImagePreviewScreen', status: 'Migrated'},

  {id: 'community-page', module: 'community', flutterPath: 'packages/features/community/lib/community/view/community_page.dart', rnRoute: 'CommunityTab', rnComponent: 'CommunityScreen', status: 'Migrated', note: 'PostCard feed + refresh/loadMore + comment/like sheets aligned with MockPostRepository'},
  {id: 'community-publish', module: 'community', flutterPath: 'packages/features/community/lib/community/view/publish_page.dart', rnRoute: 'CommunityPublish', rnComponent: 'CommunityPublishScreen', status: 'Migrated'},
  {id: 'community-image-preview', module: 'community', flutterPath: 'packages/features/community/lib/community/view/image_preview_page.dart', rnRoute: 'ImagePreview', rnComponent: 'ImagePreviewScreen', status: 'Migrated'},
  {id: 'community-video-play', module: 'community', flutterPath: 'packages/features/community/lib/community/view/video_play_page.dart', rnRoute: 'CommunityVideoPlay', rnComponent: 'CommunityVideoPlayScreen', status: 'Migrated'},

  {id: 'settings-mine', module: 'settings', flutterPath: 'packages/features/settings/lib/mine/view/mine_page.dart', rnRoute: 'MineTab', rnComponent: 'MineScreen', status: 'Migrated'},
  {id: 'settings-settings', module: 'settings', flutterPath: 'packages/features/settings/lib/settings/view/settings_page.dart', rnRoute: 'Settings', rnComponent: 'SettingsScreen', status: 'Migrated'},
  {id: 'settings-http-test', module: 'settings', flutterPath: 'packages/features/settings/lib/mine/view/mine_http_test_page.dart', rnRoute: 'MineHttpTest', rnComponent: 'MineHttpTestScreen', status: 'Migrated'},
  {id: 'settings-dialog-demo', module: 'settings', flutterPath: 'packages/features/settings/lib/settings/view/dialog_demo_page.dart', rnRoute: 'DialogDemo', rnComponent: 'DialogDemoScreen', status: 'Migrated'},
  {id: 'settings-invoice-demo', module: 'settings', flutterPath: 'packages/features/settings/lib/deal_invoice/view/deal_invoice_demo_page.dart', rnRoute: 'DealInvoiceDemo', rnComponent: 'DealInvoiceDemoScreen', status: 'Migrated'},
  {id: 'settings-invoice-upload', module: 'settings', flutterPath: 'packages/features/settings/lib/deal_invoice/view/deal_invoice_upload_page.dart', rnRoute: 'DealInvoiceUpload', rnComponent: 'DealInvoiceUploadScreen', status: 'Migrated'},

  {id: 'friend-page', module: 'friend', flutterPath: 'packages/features/friend/lib/friend/view/friend_page.dart', rnRoute: 'Friend', rnComponent: 'FriendScreen', status: 'Migrated'},
  {id: 'live-page', module: 'live', flutterPath: 'packages/features/live/lib/live/view/live_page.dart', rnRoute: 'Live', rnComponent: 'LiveScreen', status: 'Migrated', note: 'UI migrated; realtime core Deferred'},
  {id: 'live-room', module: 'live', flutterPath: 'packages/features/live/lib/live/view/live_room_page.dart', rnRoute: 'LiveRoom', rnComponent: 'LiveRoomScreen', status: 'Migrated', note: 'Realtime via @core/realtime mock adapter'},
  {id: 'pay-page', module: 'pay', flutterPath: 'packages/features/pay/lib/pay/view/pay_page.dart', rnRoute: 'Pay', rnComponent: 'PayScreen', status: 'Migrated', note: 'Layout migrated; payment SDK Deferred v0.2'},
  {id: 'video-page', module: 'video', flutterPath: 'packages/features/video/lib/videos/view/video_page.dart', rnRoute: 'Video', rnComponent: 'VideoScreen', status: 'Migrated'},
  {id: 'video-short', module: 'video', flutterPath: 'packages/features/video/lib/short_video/view/short_video_page.dart', rnRoute: 'ShortVideo', rnComponent: 'ShortVideoScreen', status: 'Migrated', note: 'Profile card + masonry grid + empty state; Lottie deferred (FallbackIllustration)'},
  {id: 'video-short-play', module: 'video', flutterPath: 'packages/features/video/lib/short_video/view/short_video_play_page.dart', rnRoute: 'ShortVideoPlay', rnComponent: 'ShortVideoPlayScreen', status: 'Migrated', note: 'Vertical feed via @commons/toolkit ShortVideoPlayerKit; landscape/danmaku Degraded'},

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

  {id: 'debug-ble', module: 'infrastructure', flutterPath: 'packages/infrastructure/bluetooth/lib/debug/ble_demo_page.dart', rnRoute: 'DebugBle', rnComponent: 'DebugBleScreen', status: 'Migrated', note: 'App shell debug route via @core/bluetooth'},
  {id: 'debug-linking', module: 'infrastructure', flutterPath: 'packages/infrastructure/linking/lib/debug/linking_debug_page.dart', rnRoute: 'DebugLinking', rnComponent: 'DebugLinkingScreen', status: 'Migrated', note: 'App shell debug route via @core/linking'},
  {id: 'debug-realtime', module: 'infrastructure', flutterPath: 'packages/infrastructure/realtime/lib/debug/realtime_debug_page.dart', rnRoute: 'DebugRealtime', rnComponent: 'DebugRealtimeScreen', status: 'Migrated', note: 'App shell debug route via @core/realtime'},
  {id: 'debug-im', module: 'infrastructure', flutterPath: 'packages/infrastructure/rongcloud_im/lib/debug/im_debug_page.dart', rnRoute: 'DebugIm', rnComponent: 'DebugImScreen', status: 'Migrated', note: 'App shell debug route via @core/im'},
];

export const ASSET_PARITY_ENTRIES: AssetParityEntry[] = [
  ...Object.entries({
    after_sales_area: 'packages/features/home/assets/all_services/after_sales_area.png',
    all_functions: 'packages/features/home/assets/all_services/all_functions.png',
    business_poster: 'packages/features/home/assets/all_services/business_poster.png',
    calculator: 'packages/features/home/assets/all_services/calculator.png',
    customer_profile: 'packages/features/home/assets/all_services/customer_profile.png',
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
];

// BFUI assets appended programmatically in assetParity.test via BFUI_ASSET_MANIFEST

export const EXPECTED_PAGE_COUNT = 52;
export const EXPECTED_ASSET_COUNT = 91;

import type {ImageSourcePropType} from 'react-native';

const design_course_design_course = require('../../assets/design_course/design_course.png');
const design_course_interFace1 = require('../../assets/design_course/interFace1.png');
const design_course_interFace2 = require('../../assets/design_course/interFace2.png');
const design_course_interFace3 = require('../../assets/design_course/interFace3.png');
const design_course_interFace4 = require('../../assets/design_course/interFace4.png');
const design_course_userImage = require('../../assets/design_course/userImage.png');
const design_course_webInterFace = require('../../assets/design_course/webInterFace.png');
const fitness_app_area1 = require('../../assets/fitness_app/area1.png');
const fitness_app_area2 = require('../../assets/fitness_app/area2.png');
const fitness_app_area3 = require('../../assets/fitness_app/area3.png');
const fitness_app_back = require('../../assets/fitness_app/back.png');
const fitness_app_bell = require('../../assets/fitness_app/bell.png');
const fitness_app_bottle = require('../../assets/fitness_app/bottle.png');
const fitness_app_breakfast = require('../../assets/fitness_app/breakfast.png');
const fitness_app_burned = require('../../assets/fitness_app/burned.png');
const fitness_app_dinner = require('../../assets/fitness_app/dinner.png');
const fitness_app_eaten = require('../../assets/fitness_app/eaten.png');
const fitness_app_fitness_app = require('../../assets/fitness_app/fitness_app.png');
const fitness_app_glass = require('../../assets/fitness_app/glass.png');
const fitness_app_lunch = require('../../assets/fitness_app/lunch.png');
const fitness_app_runner = require('../../assets/fitness_app/runner.png');
const fitness_app_snack = require('../../assets/fitness_app/snack.png');
const fitness_app_tab_1 = require('../../assets/fitness_app/tab_1.png');
const fitness_app_tab_1s = require('../../assets/fitness_app/tab_1s.png');
const fitness_app_tab_2 = require('../../assets/fitness_app/tab_2.png');
const fitness_app_tab_2s = require('../../assets/fitness_app/tab_2s.png');
const fitness_app_tab_3 = require('../../assets/fitness_app/tab_3.png');
const fitness_app_tab_3s = require('../../assets/fitness_app/tab_3s.png');
const fitness_app_tab_4 = require('../../assets/fitness_app/tab_4.png');
const fitness_app_tab_4s = require('../../assets/fitness_app/tab_4s.png');
const fonts_Roboto_Bold = require('../../assets/fonts/Roboto-Bold.ttf');
const fonts_Roboto_Medium = require('../../assets/fonts/Roboto-Medium.ttf');
const fonts_Roboto_Regular = require('../../assets/fonts/Roboto-Regular.ttf');
const fonts_WorkSans_Bold = require('../../assets/fonts/WorkSans-Bold.ttf');
const fonts_WorkSans_Medium = require('../../assets/fonts/WorkSans-Medium.ttf');
const fonts_WorkSans_Regular = require('../../assets/fonts/WorkSans-Regular.ttf');
const fonts_WorkSans_SemiBold = require('../../assets/fonts/WorkSans-SemiBold.ttf');
const hotel_hotel_1 = require('../../assets/hotel/hotel_1.png');
const hotel_hotel_2 = require('../../assets/hotel/hotel_2.png');
const hotel_hotel_3 = require('../../assets/hotel/hotel_3.png');
const hotel_hotel_4 = require('../../assets/hotel/hotel_4.png');
const hotel_hotel_5 = require('../../assets/hotel/hotel_5.png');
const hotel_hotel_booking = require('../../assets/hotel/hotel_booking.png');
const images_feedbackImage = require('../../assets/images/feedbackImage.png');
const images_helpImage = require('../../assets/images/helpImage.png');
const images_inviteImage = require('../../assets/images/inviteImage.png');
const images_supportIcon = require('../../assets/images/supportIcon.png');
const images_userImage = require('../../assets/images/userImage.png');
const introduction_animation_care_image = require('../../assets/introduction_animation/care_image.png');
const introduction_animation_introduction_animation = require('../../assets/introduction_animation/introduction_animation.png');
const introduction_animation_introduction_image = require('../../assets/introduction_animation/introduction_image.png');
const introduction_animation_mood_dairy_image = require('../../assets/introduction_animation/mood_dairy_image.png');
const introduction_animation_relax_image = require('../../assets/introduction_animation/relax_image.png');
const introduction_animation_welcome = require('../../assets/introduction_animation/welcome.png');

export const BFUI_FONTS = {
  robotoRegular: 'Roboto-Regular',
  robotoMedium: 'Roboto-Medium',
  robotoBold: 'Roboto-Bold',
  workSansRegular: 'WorkSans-Regular',
  workSansMedium: 'WorkSans-Medium',
  workSansSemiBold: 'WorkSans-SemiBold',
  workSansBold: 'WorkSans-Bold',
};

export const bfuiFontAssets = {
  fonts_Roboto_Bold,
  fonts_Roboto_Medium,
  fonts_Roboto_Regular,
  fonts_WorkSans_Bold,
  fonts_WorkSans_Medium,
  fonts_WorkSans_Regular,
  fonts_WorkSans_SemiBold,
};

export const bfuiImages = {
  design_course_design_course,
  design_course_interFace1,
  design_course_interFace2,
  design_course_interFace3,
  design_course_interFace4,
  design_course_userImage,
  design_course_webInterFace,
  fitness_app_area1,
  fitness_app_area2,
  fitness_app_area3,
  fitness_app_back,
  fitness_app_bell,
  fitness_app_bottle,
  fitness_app_breakfast,
  fitness_app_burned,
  fitness_app_dinner,
  fitness_app_eaten,
  fitness_app_fitness_app,
  fitness_app_glass,
  fitness_app_lunch,
  fitness_app_runner,
  fitness_app_snack,
  fitness_app_tab_1,
  fitness_app_tab_1s,
  fitness_app_tab_2,
  fitness_app_tab_2s,
  fitness_app_tab_3,
  fitness_app_tab_3s,
  fitness_app_tab_4,
  fitness_app_tab_4s,
  hotel_hotel_1,
  hotel_hotel_2,
  hotel_hotel_3,
  hotel_hotel_4,
  hotel_hotel_5,
  hotel_hotel_booking,
  images_feedbackImage,
  images_helpImage,
  images_inviteImage,
  images_supportIcon,
  images_userImage,
  introduction_animation_care_image,
  introduction_animation_introduction_animation,
  introduction_animation_introduction_image,
  introduction_animation_mood_dairy_image,
  introduction_animation_relax_image,
  introduction_animation_welcome,
} as const satisfies Record<string, ImageSourcePropType>;

export const BFUI_ASSET_MANIFEST: Record<string, string> = {
  design_course_design_course:
    'packages/features/bfui/assets/design_course/design_course.png',
  design_course_interFace1:
    'packages/features/bfui/assets/design_course/interFace1.png',
  design_course_interFace2:
    'packages/features/bfui/assets/design_course/interFace2.png',
  design_course_interFace3:
    'packages/features/bfui/assets/design_course/interFace3.png',
  design_course_interFace4:
    'packages/features/bfui/assets/design_course/interFace4.png',
  design_course_userImage:
    'packages/features/bfui/assets/design_course/userImage.png',
  design_course_webInterFace:
    'packages/features/bfui/assets/design_course/webInterFace.png',
  fitness_app_area1: 'packages/features/bfui/assets/fitness_app/area1.png',
  fitness_app_area2: 'packages/features/bfui/assets/fitness_app/area2.png',
  fitness_app_area3: 'packages/features/bfui/assets/fitness_app/area3.png',
  fitness_app_back: 'packages/features/bfui/assets/fitness_app/back.png',
  fitness_app_bell: 'packages/features/bfui/assets/fitness_app/bell.png',
  fitness_app_bottle: 'packages/features/bfui/assets/fitness_app/bottle.png',
  fitness_app_breakfast:
    'packages/features/bfui/assets/fitness_app/breakfast.png',
  fitness_app_burned: 'packages/features/bfui/assets/fitness_app/burned.png',
  fitness_app_dinner: 'packages/features/bfui/assets/fitness_app/dinner.png',
  fitness_app_eaten: 'packages/features/bfui/assets/fitness_app/eaten.png',
  fitness_app_fitness_app:
    'packages/features/bfui/assets/fitness_app/fitness_app.png',
  fitness_app_glass: 'packages/features/bfui/assets/fitness_app/glass.png',
  fitness_app_lunch: 'packages/features/bfui/assets/fitness_app/lunch.png',
  fitness_app_runner: 'packages/features/bfui/assets/fitness_app/runner.png',
  fitness_app_snack: 'packages/features/bfui/assets/fitness_app/snack.png',
  fitness_app_tab_1: 'packages/features/bfui/assets/fitness_app/tab_1.png',
  fitness_app_tab_1s: 'packages/features/bfui/assets/fitness_app/tab_1s.png',
  fitness_app_tab_2: 'packages/features/bfui/assets/fitness_app/tab_2.png',
  fitness_app_tab_2s: 'packages/features/bfui/assets/fitness_app/tab_2s.png',
  fitness_app_tab_3: 'packages/features/bfui/assets/fitness_app/tab_3.png',
  fitness_app_tab_3s: 'packages/features/bfui/assets/fitness_app/tab_3s.png',
  fitness_app_tab_4: 'packages/features/bfui/assets/fitness_app/tab_4.png',
  fitness_app_tab_4s: 'packages/features/bfui/assets/fitness_app/tab_4s.png',
  fonts_Roboto_Bold: 'packages/features/bfui/assets/fonts/Roboto-Bold.ttf',
  fonts_Roboto_Medium: 'packages/features/bfui/assets/fonts/Roboto-Medium.ttf',
  fonts_Roboto_Regular:
    'packages/features/bfui/assets/fonts/Roboto-Regular.ttf',
  fonts_WorkSans_Bold: 'packages/features/bfui/assets/fonts/WorkSans-Bold.ttf',
  fonts_WorkSans_Medium:
    'packages/features/bfui/assets/fonts/WorkSans-Medium.ttf',
  fonts_WorkSans_Regular:
    'packages/features/bfui/assets/fonts/WorkSans-Regular.ttf',
  fonts_WorkSans_SemiBold:
    'packages/features/bfui/assets/fonts/WorkSans-SemiBold.ttf',
  hotel_hotel_1: 'packages/features/bfui/assets/hotel/hotel_1.png',
  hotel_hotel_2: 'packages/features/bfui/assets/hotel/hotel_2.png',
  hotel_hotel_3: 'packages/features/bfui/assets/hotel/hotel_3.png',
  hotel_hotel_4: 'packages/features/bfui/assets/hotel/hotel_4.png',
  hotel_hotel_5: 'packages/features/bfui/assets/hotel/hotel_5.png',
  hotel_hotel_booking: 'packages/features/bfui/assets/hotel/hotel_booking.png',
  images_feedbackImage:
    'packages/features/bfui/assets/images/feedbackImage.png',
  images_helpImage: 'packages/features/bfui/assets/images/helpImage.png',
  images_inviteImage: 'packages/features/bfui/assets/images/inviteImage.png',
  images_supportIcon: 'packages/features/bfui/assets/images/supportIcon.png',
  images_userImage: 'packages/features/bfui/assets/images/userImage.png',
  introduction_animation_care_image:
    'packages/features/bfui/assets/introduction_animation/care_image.png',
  introduction_animation_introduction_animation:
    'packages/features/bfui/assets/introduction_animation/introduction_animation.png',
  introduction_animation_introduction_image:
    'packages/features/bfui/assets/introduction_animation/introduction_image.png',
  introduction_animation_mood_dairy_image:
    'packages/features/bfui/assets/introduction_animation/mood_dairy_image.png',
  introduction_animation_relax_image:
    'packages/features/bfui/assets/introduction_animation/relax_image.png',
  introduction_animation_welcome:
    'packages/features/bfui/assets/introduction_animation/welcome.png',
};

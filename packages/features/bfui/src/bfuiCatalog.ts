export type BfuiTemplateStatus =
  | 'migrated'
  | 'visual-degraded'
  | 'shell'
  | 'placeholder';

export interface BfuiTemplateEntry {
  id: string;
  titleKey: string;
  category: 'onboarding' | 'hotel' | 'fitness' | 'course' | 'system' | 'effect';
  flutterRoute: string;
  status: BfuiTemplateStatus;
}

export const BFUI_TEMPLATES: BfuiTemplateEntry[] = [
  {
    id: 'introduction_animation',
    titleKey: 'bfuiIntroAnim',
    category: 'onboarding',
    flutterRoute: '/bfui/introduction_animation',
    status: 'migrated',
  },
  {
    id: 'hotel_booking',
    titleKey: 'bfuiHotelBooking',
    category: 'hotel',
    flutterRoute: '/bfui/hotel_booking',
    status: 'migrated',
  },
  {
    id: 'hotel_filters',
    titleKey: 'bfuiHotelFilters',
    category: 'hotel',
    flutterRoute: '/bfui/hotel_filters',
    status: 'migrated',
  },
  {
    id: 'fitness_app',
    titleKey: 'bfuiFitnessApp',
    category: 'fitness',
    flutterRoute: '/bfui/fitness_app',
    status: 'migrated',
  },
  {
    id: 'my_diary',
    titleKey: 'bfuiMyDiary',
    category: 'fitness',
    flutterRoute: '/bfui/my_diary',
    status: 'migrated',
  },
  {
    id: 'training',
    titleKey: 'bfuiTraining',
    category: 'fitness',
    flutterRoute: '/bfui/training',
    status: 'migrated',
  },
  {
    id: 'design_course',
    titleKey: 'bfuiDesignCourse',
    category: 'course',
    flutterRoute: '/bfui/design_course',
    status: 'migrated',
  },
  {
    id: 'course_info',
    titleKey: 'bfuiCourseInfo',
    category: 'course',
    flutterRoute: '/bfui/course_info',
    status: 'migrated',
  },
  {
    id: 'help',
    titleKey: 'bfuiHelp',
    category: 'system',
    flutterRoute: '/bfui/help',
    status: 'migrated',
  },
  {
    id: 'feedback',
    titleKey: 'bfuiFeedback',
    category: 'system',
    flutterRoute: '/bfui/feedback',
    status: 'migrated',
  },
  {
    id: 'invite_friend',
    titleKey: 'bfuiInviteFriend',
    category: 'system',
    flutterRoute: '/bfui/invite_friend',
    status: 'migrated',
  },
  {
    id: 'navigation_drawer',
    titleKey: 'bfuiNavigationDrawer',
    category: 'system',
    flutterRoute: '/bfui/navigation_drawer',
    status: 'migrated',
  },
  {
    id: 'glass_view',
    titleKey: 'bfuiGlassView',
    category: 'effect',
    flutterRoute: '/bfui/glass_view',
    status: 'visual-degraded',
  },
  {
    id: 'wave_view',
    titleKey: 'bfuiWaveView',
    category: 'effect',
    flutterRoute: '/bfui/wave_view',
    status: 'visual-degraded',
  },
  {
    id: 'running_view',
    titleKey: 'bfuiRunningView',
    category: 'effect',
    flutterRoute: '/bfui/running_view',
    status: 'visual-degraded',
  },
  {
    id: 'workout_view',
    titleKey: 'bfuiWorkoutView',
    category: 'effect',
    flutterRoute: '/bfui/workout_view',
    status: 'visual-degraded',
  },
  {
    id: 'mediterranean_diet',
    titleKey: 'bfuiMediterraneanDiet',
    category: 'fitness',
    flutterRoute: '/bfui/mediterranean_diet',
    status: 'shell',
  },
];

export function findBfuiTemplate(
  templateId: string,
): BfuiTemplateEntry | undefined {
  return BFUI_TEMPLATES.find(t => t.id === templateId);
}

import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {MyClassListScreen} from './screens/MyClassListScreen';
import {ClassHomeworkStatsScreen} from './screens/ClassHomeworkStatsScreen';
import {HomeworkReviewScreen} from './screens/HomeworkReviewScreen';
import {HomeworkDetailTeacherScreen} from './screens/HomeworkDetailTeacherScreen';
import {HomeworkDetailStudentScreen} from './screens/HomeworkDetailStudentScreen';
import {DubbingHomeworkScreen} from './screens/DubbingHomeworkScreen';
import {ClassroomVideoDetailScreen} from './screens/ClassroomVideoDetailScreen';
import {ClaimGiftCardScreen} from './screens/ClaimGiftCardScreen';

export function registerClassroomFeature(): FeatureRegistration {
  return {
    moduleId: 'classroom',
    routes: [
      {
        name: RoutePath.classroomMyClass,
        component: MyClassListScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomHomeworkStats,
        component: ClassHomeworkStatsScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomHomeworkReview,
        component: HomeworkReviewScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomHomeworkDetailTeacher,
        component: HomeworkDetailTeacherScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomHomeworkDetailStudent,
        component: HomeworkDetailStudentScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomDubbingHomework,
        component: DubbingHomeworkScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomVideoDetail,
        component: ClassroomVideoDetailScreen as StackScreenComponent,
      },
      {
        name: RoutePath.classroomClaimGift,
        component: ClaimGiftCardScreen as StackScreenComponent,
      },
    ],
  };
}

export {MyClassListScreen} from './screens/MyClassListScreen';
export {ClassHomeworkStatsScreen} from './screens/ClassHomeworkStatsScreen';
export {HomeworkReviewScreen} from './screens/HomeworkReviewScreen';
export {HomeworkDetailTeacherScreen} from './screens/HomeworkDetailTeacherScreen';
export {HomeworkDetailStudentScreen} from './screens/HomeworkDetailStudentScreen';
export {DubbingHomeworkScreen} from './screens/DubbingHomeworkScreen';
export {ClassroomVideoDetailScreen} from './screens/ClassroomVideoDetailScreen';
export {ClaimGiftCardScreen} from './screens/ClaimGiftCardScreen';

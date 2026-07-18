import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {MyClassListScreen} from './screens/MyClassListScreen';
import {ClassHomeworkStatsScreen} from './screens/ClassHomeworkStatsScreen';
import {HomeworkReviewScreen} from './screens/HomeworkReviewScreen';

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
    ],
  };
}

export {MyClassListScreen} from './screens/MyClassListScreen';
export {ClassHomeworkStatsScreen} from './screens/ClassHomeworkStatsScreen';
export {HomeworkReviewScreen} from './screens/HomeworkReviewScreen';

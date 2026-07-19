import {RoutePath} from '@core/navigation';
import {classroomMockData} from '../data/classroomMockData';
import {registerClassroomFeature} from '../index';

describe('classroom feature registration', () => {
  it('registers all 8 Flutter-parity routes', () => {
    const names = registerClassroomFeature().routes?.map(r => r.name) ?? [];
    expect(names).toEqual(
      expect.arrayContaining([
        RoutePath.classroomMyClass,
        RoutePath.classroomHomeworkStats,
        RoutePath.classroomHomeworkReview,
        RoutePath.classroomHomeworkDetailTeacher,
        RoutePath.classroomHomeworkDetailStudent,
        RoutePath.classroomDubbingHomework,
        RoutePath.classroomVideoDetail,
        RoutePath.classroomClaimGift,
      ]),
    );
    expect(names).toHaveLength(8);
  });

  it('exposes mock chain data for teacher→student→dubbing→gift', () => {
    expect(classroomMockData.students[0]?.id).toBeTruthy();
    expect(classroomMockData.timelineItems.length).toBeGreaterThan(0);
    expect(classroomMockData.dubbingHomework.items.length).toBe(3);
    expect(classroomMockData.giftCard.cardType).toContain('会员');
  });
});

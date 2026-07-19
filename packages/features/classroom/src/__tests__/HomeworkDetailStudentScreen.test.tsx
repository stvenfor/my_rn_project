import React from 'react';
import renderer from 'react-test-renderer';
import {HomeworkDetailStudentScreen} from '../screens/HomeworkDetailStudentScreen';
import {classroomMockData} from '../data/classroomMockData';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

describe('HomeworkDetailStudentScreen', () => {
  it('renders progress from student completionRate without crashing', () => {
    const student = classroomMockData.findStudent('student_003');
    const navigation = {navigate: jest.fn(), goBack: jest.fn()};
    const tree = renderer
      .create(
        <HomeworkDetailStudentScreen
          navigation={navigation as never}
          route={
            {
              params: {
                studentId: student.id,
                classId: 'c1',
                homeworkId: 'h1',
              },
            } as never
          }
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
    expect(student.completionRate).toBe(74);
  });
});

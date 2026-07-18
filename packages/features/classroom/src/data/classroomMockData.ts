export interface ClassInfo {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
}

export interface HomeworkStatSummary {
  totalCount: number;
  avgCompletion: number;
  classCompletionRate: number;
}

export interface StudentHomeworkRow {
  id: string;
  name: string;
  completed: number;
  pending: number;
}

export const classroomMockData = {
  defaultClassId: 'class_001',
  classes: [
    {
      id: 'class_001',
      name: '班级名称',
      inviteCode: '11490rKkz',
      memberCount: 6,
    },
    {
      id: 'class_002',
      name: '三年级2班',
      inviteCode: '88201aBxP',
      memberCount: 32,
    },
  ] as ClassInfo[],
  statSummary: {
    totalCount: 12,
    avgCompletion: 10,
    classCompletionRate: 85,
  } as HomeworkStatSummary,
  students: [
    {id: 'student_001', name: '老谭酸菜', completed: 12, pending: 0},
    {id: 'student_002', name: '乌克丽丽', completed: 12, pending: 0},
    {id: 'student_003', name: '酸菜', completed: 10, pending: 2},
    {id: 'student_004', name: '张三李四', completed: 8, pending: 4},
  ] as StudentHomeworkRow[],
  reviewStudents: [
    '老坛酸菜',
    '乌克丽丽',
    '张三李四',
    '酸菜',
    '王五赵六',
    '小明',
    '小红',
    '小刚',
  ],
};

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

export type HomeworkType = 'dubbing' | 'sync' | 'checkin';

export interface StudentProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  homeworkCount: number;
  completionRate: number;
}

export interface HomeworkTimelineItem {
  id: string;
  title: string;
  className: string;
  dateLabel: string;
  type: HomeworkType;
  isCompleted: boolean;
}

export interface HomeworkTaskItem {
  id: string;
  title: string;
  subtitle: string;
  starReward: number;
  questionCount: number;
  iconColor: string;
  iconLabel: string;
}

export interface DubbingHomeworkItem {
  id: string;
  title: string;
  score: number;
  canResubmit: boolean;
}

export interface DubbingHomeworkDetail {
  id: string;
  studentName: string;
  title: string;
  className: string;
  deadline: string;
  description: string;
  items: DubbingHomeworkItem[];
}

export interface GiftCardInfo {
  studentName: string;
  teacherName: string;
  message: string;
  date: string;
  cardType: string;
  duration: string;
}

export interface VideoAlbumPart {
  id: string;
  title: string;
  isSelected: boolean;
  badge?: string;
}

export const classroomMockData = {
  defaultClassId: 'class_001',
  defaultStudentId: 'student_001',
  defaultHomeworkId: 'hw_001',
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
  studentProfiles: {
    student_001: {
      id: 'student_001',
      name: '老谭酸菜',
      avatarEmoji: '🐧',
      homeworkCount: 10,
      completionRate: 100,
    },
    student_002: {
      id: 'student_002',
      name: '乌克丽丽',
      avatarEmoji: '🐧',
      homeworkCount: 10,
      completionRate: 100,
    },
    student_003: {
      id: 'student_003',
      name: '酸菜',
      avatarEmoji: '🎒',
      homeworkCount: 10,
      completionRate: 74,
    },
  } as Record<string, StudentProfile>,
  timelineItems: [
    {
      id: 'hw_001',
      title: '周一（7月10日）配音作业',
      className: '三年级2班',
      dateLabel: '2026 05-21',
      type: 'dubbing',
      isCompleted: true,
    },
    {
      id: 'hw_002',
      title: '周二（7月11日）同步作业',
      className: '三年级2班',
      dateLabel: '2026 05-20',
      type: 'sync',
      isCompleted: true,
    },
    {
      id: 'hw_003',
      title: '周三打卡作业',
      className: '三年级2班',
      dateLabel: '2026 05-19',
      type: 'checkin',
      isCompleted: false,
    },
    {
      id: 'hw_004',
      title: '周四（7月13日）配音作业',
      className: '三年级2班',
      dateLabel: '2026 05-18',
      type: 'dubbing',
      isCompleted: false,
    },
  ] as HomeworkTimelineItem[],
  studentHomeworkTasks: [
    {
      id: 'task_001',
      title: '单词学习',
      subtitle: '共5道题',
      starReward: 3,
      questionCount: 5,
      iconColor: '#1890FF',
      iconLabel: 'En',
    },
    {
      id: 'task_002',
      title: '单词拼写',
      subtitle: '共22道题',
      starReward: 3,
      questionCount: 22,
      iconColor: '#52C41A',
      iconLabel: 'Aa',
    },
  ] as HomeworkTaskItem[],
  dubbingHomework: {
    id: 'hw_dub_001',
    studentName: '酸菜',
    title: '周二（7月11日）配音作业',
    className: '三年二班',
    deadline: '7月15日23:59',
    description: '本次作业核心考验大家的发音能力，重点练习a的发音',
    items: [
      {
        id: 'dub_001',
        title: '蜘蛛侠之英雄归来',
        score: 100,
        canResubmit: false,
      },
      {
        id: 'dub_002',
        title: '侏罗纪世界2：失落王国',
        score: 0,
        canResubmit: true,
      },
      {
        id: 'dub_003',
        title: '哈利波特与魔法石',
        score: 85,
        canResubmit: false,
      },
    ],
  } as DubbingHomeworkDetail,
  giftCard: {
    studentName: '乌克丽丽',
    teacherName: '老坛酸菜',
    message: '本次作业完成的很棒！老师送你一张体验卡，以资鼓励',
    date: '2026-05-20',
    cardType: '班级会员卡',
    duration: '1天 AI SVIP',
  } as GiftCardInfo,
  videoTitle: '恐龙科幻电影回归：《侏罗纪世界2：失落王国》电影预告',
  videoAlbumParts: [
    {
      id: 'part_1',
      title: 'Part 1 制服牛油果小怪兽',
      isSelected: true,
      badge: '试听',
    },
    {
      id: 'part_2',
      title: 'Part 2 想到制服牛油果...',
      isSelected: false,
      badge: '付费',
    },
    {
      id: 'part_3',
      title: 'Part 3 顺利制服...',
      isSelected: false,
    },
  ] as VideoAlbumPart[],

  findStudent(id?: string): StudentProfile {
    const key = id ?? this.defaultStudentId;
    return (
      this.studentProfiles[key] ?? this.studentProfiles[this.defaultStudentId]!
    );
  },

  homeworkTypeLabel(type: HomeworkType): string {
    if (type === 'dubbing') {
      return '配音作业';
    }
    if (type === 'sync') {
      return '同步作业';
    }
    return '打卡作业';
  },

  homeworkTypeColor(type: HomeworkType): string {
    if (type === 'dubbing') {
      return '#52C41A';
    }
    if (type === 'sync') {
      return '#FF8A34';
    }
    return '#1890FF';
  },
};

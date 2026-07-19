import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  classroomMockData,
  type HomeworkTimelineItem,
} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

type StatusTab = 'all' | 'completed' | 'incomplete';

export function HomeworkDetailTeacherScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.classroomHomeworkDetailTeacher>) {
  const studentId = route.params?.studentId;
  const classId = route.params?.classId;
  const profile = classroomMockData.findStudent(studentId);
  const [tab, setTab] = useState<StatusTab>('all');
  const items = useMemo(() => {
    const all = classroomMockData.timelineItems;
    if (tab === 'completed') {
      return all.filter(i => i.isCompleted);
    }
    if (tab === 'incomplete') {
      return all.filter(i => !i.isCompleted);
    }
    return all;
  }, [tab]);

  return (
    <AppPageScaffold layout="standard" backgroundColor={c.background}>
      <AppNavBar
        title="作业详情"
        showBackButton
        onBack={() => navigation.goBack()}
        backgroundColor={c.background}
        right={
          <Pressable onPress={() => AppToast.show('导出成绩功能开发中')}>
            <Text style={styles.export}>导出成绩</Text>
          </Pressable>
        }
      />
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>{profile.avatarEmoji}</Text>
        <View style={styles.flex1}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>
            作业 {profile.homeworkCount} · 完成率 {profile.completionRate}%
          </Text>
        </View>
      </View>
      <View style={styles.tabs}>
        {(
          [
            ['all', '全部'],
            ['completed', '已完成'],
            ['incomplete', '未完成'],
          ] as const
        ).map(([key, label]) => (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {label}
            </Text>
            {tab === key ? <View style={styles.underline} /> : null}
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {items.map((item, index) => (
          <TimelineRow
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
            onPress={() =>
              navigation.navigate(RoutePath.classroomHomeworkDetailStudent, {
                classId,
                studentId: profile.id,
                homeworkId: item.id,
              })
            }
          />
        ))}
      </ScrollView>
    </AppPageScaffold>
  );
}

function TimelineRow({
  item,
  isLast,
  onPress,
}: {
  item: HomeworkTimelineItem;
  isLast: boolean;
  onPress: () => void;
}) {
  const typeColor = classroomMockData.homeworkTypeColor(item.type);
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.timelineCol}>
        <View style={[styles.dot, {backgroundColor: typeColor}]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.rowCard}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowMeta}>
          {item.className} · {item.dateLabel}
        </Text>
        <View style={[styles.typeTag, {backgroundColor: `${typeColor}22`}]}>
          <Text style={[styles.typeTagText, {color: typeColor}]}>
            {classroomMockData.homeworkTypeLabel(item.type)}
          </Text>
        </View>
        <Text style={styles.status}>
          {item.isCompleted ? '已完成' : '未完成'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex1: {flex: 1},
  export: {color: c.primaryGreen, fontSize: 14},
  profileCard: {
    margin: 16,
    padding: 16,
    borderRadius: d.cardRadius,
    backgroundColor: c.cardWhite,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {fontSize: 36, marginRight: 12},
  name: {fontSize: 17, fontWeight: '600', color: c.titleBlack},
  meta: {marginTop: 4, fontSize: 13, color: c.textGray},
  tabs: {flexDirection: 'row', paddingHorizontal: 16, gap: 20},
  tab: {paddingBottom: 8},
  tabText: {fontSize: 14, color: c.textGray},
  tabTextActive: {color: c.primaryGreen, fontWeight: '600'},
  underline: {
    marginTop: 4,
    height: 2,
    backgroundColor: c.primaryGreen,
    borderRadius: 1,
  },
  list: {padding: 16, paddingTop: 8},
  row: {flexDirection: 'row', marginBottom: 4},
  timelineCol: {width: 20, alignItems: 'center'},
  dot: {width: 10, height: 10, borderRadius: 5, marginTop: 18},
  line: {flex: 1, width: 2, backgroundColor: c.divider, marginTop: 4},
  rowCard: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 12,
    padding: 14,
    borderRadius: d.cardRadius,
    backgroundColor: c.cardWhite,
  },
  rowTitle: {fontSize: 15, fontWeight: '600', color: c.titleBlack},
  rowMeta: {marginTop: 4, fontSize: 12, color: c.textGray},
  typeTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeTagText: {fontSize: 11, fontWeight: '600'},
  status: {marginTop: 6, fontSize: 12, color: c.textGray},
});

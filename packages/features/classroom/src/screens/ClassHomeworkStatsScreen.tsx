import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {classroomMockData} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

type Tab = 'all' | 'dubbing' | 'sync' | 'checkin';

export function ClassHomeworkStatsScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.classroomHomeworkStats>) {
  const [tab, setTab] = useState<Tab>('all');
  const summary = classroomMockData.statSummary;
  const students = classroomMockData.students;

  return (
    <AppPageScaffold layout="standard" backgroundColor={c.background}>
      <AppNavBar
        title="我的班级"
        onBack={() => navigation.goBack()}
        backgroundColor={c.background}
        right={
          <Pressable onPress={() => AppToast.show('导出成绩功能开发中')}>
            <Text style={styles.export}>导出成绩</Text>
          </Pressable>
        }
      />
      <View style={styles.tabs}>
        {(
          [
            ['all', '全部'],
            ['dubbing', '配音作业'],
            ['sync', '同步作业'],
            ['checkin', '打卡作业'],
          ] as const
        ).map(([key, label]) => (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {label}
            </Text>
            {tab === key ? <View style={styles.tabUnderline} /> : null}
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>作业统计</Text>
          <View style={styles.statsRow}>
            <Stat label="布置" value={`${summary.totalCount}`} />
            <Stat label="人均完成" value={`${summary.avgCompletion}`} />
            <Stat label="完成率" value={`${summary.classCompletionRate}%`} />
          </View>
        </View>
        <View style={styles.studentCard}>
          <Text style={styles.statsTitle}>学生列表</Text>
          {students.map(s => (
            <Pressable
              key={s.id}
              style={styles.studentRow}
              onPress={() =>
                navigation.navigate(RoutePath.classroomHomeworkDetailTeacher, {
                  classId: route.params?.classId,
                  studentId: s.id,
                })
              }>
              <Text style={styles.studentName}>{s.name}</Text>
              <Text style={styles.studentMeta}>
                已完成 {s.completed} · 待完成 {s.pending}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppPageScaffold>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  export: {color: c.primaryGreen, fontSize: 14},
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  tab: {paddingBottom: 8},
  tabText: {fontSize: 14, color: c.textGray},
  tabTextActive: {color: c.primaryGreen, fontWeight: '600'},
  tabUnderline: {
    marginTop: 4,
    height: 2,
    backgroundColor: c.primaryGreen,
    borderRadius: 1,
  },
  body: {padding: 16},
  statsCard: {
    backgroundColor: c.cardWhite,
    borderRadius: d.cardRadius,
    padding: 16,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: c.titleBlack,
    marginBottom: 12,
  },
  statsRow: {flexDirection: 'row'},
  stat: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 20, fontWeight: '700', color: c.primaryGreen},
  statLabel: {marginTop: 4, fontSize: 12, color: c.textGray},
  studentCard: {
    backgroundColor: c.cardWhite,
    borderRadius: d.cardRadius,
    padding: 16,
  },
  studentRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.divider,
  },
  studentName: {fontSize: 15, color: c.titleBlack, fontWeight: '500'},
  studentMeta: {marginTop: 4, fontSize: 12, color: c.textGray},
});

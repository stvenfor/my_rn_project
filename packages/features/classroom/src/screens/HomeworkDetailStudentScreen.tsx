import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {classroomMockData} from '../data/classroomMockData';
import {
  classroomColors as c,
  classroomDimens as d,
} from '../theme/classroomTheme';

export function HomeworkDetailStudentScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.classroomHomeworkDetailStudent>) {
  const student = classroomMockData.findStudent(route.params?.studentId);
  const tasks = classroomMockData.studentHomeworkTasks;
  const progressRatio = Math.min(
    Math.max((student.completionRate ?? 0) / 100, 0),
    1,
  );
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <AppPageScaffold
      layout="standard"
      backgroundColor={c.background}
      navBar={
        <AppNavBar
          title="作业详情"
          showBackButton
          onBack={() => navigation.goBack()}
          backgroundColor={c.background}
        />
      }>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Text style={styles.avatar}>{student.avatarEmoji}</Text>
            <View style={styles.flex1}>
              <Text style={styles.name}>{student.name}</Text>
              <Text style={styles.meta}>
                作业 {student.homeworkCount} · 完成率 {student.completionRate}%
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate(RoutePath.classroomClaimGift)}>
            <Text style={styles.giftLink}>领取礼品卡 ›</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>完成进度</Text>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, {width: `${progressPercent}%`}]}
            />
          </View>
          <Text style={styles.progressText}>{progressPercent}%</Text>
          <Text style={styles.social}>已有 32 人完成此作业</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>作业内容</Text>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <View
                style={[styles.taskIcon, {backgroundColor: task.iconColor}]}>
                <Text style={styles.taskIconText}>{task.iconLabel}</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.meta}>{task.subtitle}</Text>
              </View>
              <Text style={styles.stars}>★ {task.starReward}</Text>
            </View>
          ))}
          <Pressable
            style={styles.dubbingEntry}
            onPress={() =>
              navigation.navigate(RoutePath.classroomDubbingHomework, {
                classId: route.params?.classId,
                studentId: student.id,
                homeworkId: route.params?.homeworkId,
              })
            }>
            <Text style={styles.dubbingText}>查看配音作业 ›</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.shareBtn}
          onPress={() => AppToast.show('分享到班级群')}>
          <Text style={styles.shareText}>分享到班级群</Text>
        </Pressable>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  flex1: {flex: 1},
  body: {padding: 16, paddingBottom: 24},
  card: {
    backgroundColor: c.cardWhite,
    borderRadius: d.cardRadius,
    padding: 16,
    marginBottom: 12,
  },
  profileRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {fontSize: 36, marginRight: 12},
  name: {fontSize: 17, fontWeight: '600', color: c.titleBlack},
  meta: {marginTop: 4, fontSize: 13, color: c.textGray},
  giftLink: {
    marginTop: 10,
    fontSize: 13,
    color: c.primaryGreen,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: c.titleBlack,
    marginBottom: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: c.divider,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', backgroundColor: c.primaryGreen},
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: c.titleBlack,
  },
  social: {marginTop: 6, fontSize: 12, color: c.textGray},
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.divider,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskIconText: {color: '#fff', fontWeight: '700', fontSize: 12},
  taskTitle: {fontSize: 15, fontWeight: '500', color: c.titleBlack},
  stars: {fontSize: 13, color: c.orange, fontWeight: '600'},
  dubbingEntry: {marginTop: 12, paddingVertical: 8},
  dubbingText: {fontSize: 14, color: c.primaryGreen, fontWeight: '600'},
  footer: {padding: 16},
  shareBtn: {
    height: 48,
    borderRadius: d.buttonRadius,
    backgroundColor: c.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

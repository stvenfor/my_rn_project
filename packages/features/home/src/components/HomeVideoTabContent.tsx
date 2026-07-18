import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const SHORTCUTS = [
  {label: '会员专享', color: '#007AFF'},
  {label: '配音专栏', color: '#FF9500'},
  {label: '其他课程', color: '#5856D6'},
  {label: '功能教程', color: '#34C759'},
];

const DAILY = [
  {
    title: '带你玩转 ETF',
    tag: '直播中',
    cover: 'https://picsum.photos/seed/v1/120/120',
  },
  {
    title: '新能源赛道解读',
    tag: '回放',
    cover: 'https://picsum.photos/seed/v2/120/120',
  },
  {
    title: '门店短视频运营',
    tag: '直播中',
    cover: 'https://picsum.photos/seed/v3/120/120',
  },
];

const COURSES = [
  {
    title: '【配置】当星舰撞上算力',
    author: '尤国梁',
    cover: 'https://picsum.photos/seed/c1/400/240',
    isMember: true,
  },
  {
    title: '黄金恐贪定投实战',
    author: '策略组',
    cover: 'https://picsum.photos/seed/c2/400/240',
    isMember: false,
  },
];

interface Props {
  onOpenDubbing: () => void;
}

export function HomeVideoTabContent({onOpenDubbing}: Props) {
  return (
    <View>
      <View style={styles.shortcutRow}>
        {SHORTCUTS.map(item => (
          <View key={item.label} style={styles.shortcut}>
            <View
              style={[
                styles.shortcutIcon,
                {backgroundColor: `${item.color}22`},
              ]}>
              <Text style={{color: item.color, fontSize: 16}}>●</Text>
            </View>
            <Text style={styles.shortcutLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>每日推荐</Text>
          <Text style={styles.more}>更多</Text>
        </View>
        {DAILY.map(item => (
          <View key={item.title} style={styles.dailyRow}>
            <Image source={{uri: item.cover}} style={styles.dailyCover} />
            <View style={styles.dailyText}>
              <Text style={styles.dailyTitle}>{item.title}</Text>
              <Text style={styles.dailyTag}>{item.tag}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门课程</Text>
          <Text style={styles.more}>更多</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COURSES.map(course => (
            <View key={course.title} style={styles.courseCard}>
              <Image source={{uri: course.cover}} style={styles.courseCover} />
              <Text style={styles.courseTitle} numberOfLines={2}>
                {course.title}
              </Text>
              <Text style={styles.courseAuthor}>{course.author}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.dubbingEntry} onPress={onOpenDubbing}>
        <Text style={styles.dubbingText}>进入配音视频专区</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  shortcut: {alignItems: 'center', width: '22%'},
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {marginTop: 6, fontSize: 12, color: t.labelPrimary},
  section: {paddingHorizontal: 16, paddingTop: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 20, fontWeight: '600', color: t.labelPrimary},
  more: {fontSize: 13, color: t.labelSecondary},
  dailyRow: {flexDirection: 'row', marginBottom: 12, alignItems: 'center'},
  dailyCover: {width: 64, height: 64, borderRadius: 8},
  dailyText: {flex: 1, marginLeft: 12},
  dailyTitle: {fontSize: 15, fontWeight: '500', color: t.labelPrimary},
  dailyTag: {marginTop: 4, fontSize: 12, color: t.accent},
  courseCard: {width: 160, marginRight: 12},
  courseCover: {width: 160, height: 96, borderRadius: 8},
  courseTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: t.labelPrimary,
  },
  courseAuthor: {marginTop: 4, fontSize: 12, color: t.labelSecondary},
  dubbingEntry: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: t.radiusMd,
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
    alignItems: 'center',
  },
  dubbingText: {color: t.accent, fontWeight: '600'},
});

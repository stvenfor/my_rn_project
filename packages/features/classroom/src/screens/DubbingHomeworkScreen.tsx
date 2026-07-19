import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {classroomMockData} from '../data/classroomMockData';
import {classroomColors as c} from '../theme/classroomTheme';

export function DubbingHomeworkScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.classroomDubbingHomework>) {
  const insets = useSafeAreaInsets();
  const hw = classroomMockData.dubbingHomework;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>{hw.title}</Text>
          <Text style={styles.headerSub}>
            {hw.studentName} · {hw.className}
          </Text>
          <Text style={styles.headerSub}>截止：{hw.deadline}</Text>
        </View>
      </View>
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle}>配音作业（{hw.items.length}）</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>本次作业可享受免费评分</Text>
          </View>
        </View>
        <Text style={styles.desc}>{hw.description}</Text>
        <ScrollView contentContainerStyle={{paddingBottom: insets.bottom + 24}}>
          {hw.items.map(item => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() =>
                navigation.navigate(RoutePath.classroomVideoDetail, {
                  videoId: item.id,
                })
              }>
              <View style={styles.flex1}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>
                  {item.score > 0 ? `得分 ${item.score}` : '未提交'}
                  {item.canResubmit ? ' · 可重交' : ''}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: c.primaryGreen},
  flex1: {flex: 1},
  header: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 28,
    alignItems: 'flex-start',
  },
  back: {width: 36, alignItems: 'center', paddingTop: 2},
  backText: {fontSize: 30, color: '#fff'},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  headerSub: {fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  sheet: {
    flex: 1,
    marginTop: -16,
    backgroundColor: c.cardWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sheetTitle: {fontSize: 16, fontWeight: '600', color: c.titleBlack},
  freeBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
  },
  freeBadgeText: {fontSize: 11, color: c.orange},
  desc: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 13,
    color: c.textGray,
    lineHeight: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.divider,
  },
  itemTitle: {fontSize: 15, fontWeight: '500', color: c.titleBlack},
  itemMeta: {marginTop: 4, fontSize: 12, color: c.textGray},
  chevron: {fontSize: 22, color: c.textGrayLight},
});

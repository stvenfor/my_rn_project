import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {HxbCourse} from '../../../data/rnLabHxbMockData';
import {hxbTheme as t} from '../../../theme/rnLabHxbTheme';

type Props = {
  courses: HxbCourse[];
  activeId: string;
  onSelect: (id: string) => void;
  onSwitchCourse?: () => void;
};

export function HxbCourseTabs({
  courses,
  activeId,
  onSelect,
  onSwitchCourse,
}: Props) {
  return (
    <View style={styles.row}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {courses.map(course => {
          const active = course.id === activeId;
          return (
            <Pressable
              key={course.id}
              style={styles.tab}
              onPress={() => onSelect(course.id)}>
              <View style={styles.tabInner}>
                <View style={[styles.tag, active && styles.tagActive]}>
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>
                    {course.tag}
                  </Text>
                </View>
                <Text
                  style={[styles.name, active && styles.nameActive]}
                  numberOfLines={1}>
                  {course.name}
                </Text>
              </View>
              <View
                style={[styles.underline, active && styles.underlineActive]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable style={styles.switchBtn} onPress={onSwitchCourse}>
        <Text style={styles.switchIcon}>⇄</Text>
        <Text style={styles.switchText}>换课</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 8,
    backgroundColor: t.bg,
  },
  scroll: {
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  tab: {
    marginHorizontal: 6,
    maxWidth: 180,
    paddingBottom: 8,
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#D9EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  tagActive: {
    backgroundColor: t.tagBlue,
  },
  tagText: {
    fontSize: 10,
    color: t.primaryDeep,
    fontWeight: '700',
  },
  tagTextActive: {
    color: '#fff',
  },
  name: {
    fontSize: 14,
    color: t.textSecondary,
    fontWeight: '500',
  },
  nameActive: {
    color: t.text,
    fontWeight: '700',
    fontSize: 15,
  },
  underline: {
    marginTop: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: t.tabUnderline,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  switchIcon: {
    color: t.primary,
    fontSize: 14,
    marginRight: 2,
    fontWeight: '700',
  },
  switchText: {
    color: t.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});

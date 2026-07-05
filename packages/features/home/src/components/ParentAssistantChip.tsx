import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {homeReportTheme} from '../theme/homeReportTheme';

export function ParentAssistantChip() {
  return (
    <Pressable style={styles.chip}>
      <Text style={styles.icon}>👨‍👩‍👧</Text>
      <Text style={styles.label}>家长助手</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: homeReportTheme.parentChip,
    borderWidth: 1,
    borderColor: homeReportTheme.divider,
  },
  icon: {fontSize: 14, marginRight: 6},
  label: {fontSize: 12, color: homeReportTheme.subtitleGrey},
});

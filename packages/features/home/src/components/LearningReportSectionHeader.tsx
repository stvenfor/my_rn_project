import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {homeReportTheme} from '../theme/homeReportTheme';

interface Props {
  dotColor: string;
  title: string;
}

export function LearningReportSectionHeader({dotColor, title}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, {backgroundColor: dotColor}]} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  dot: {width: 8, height: 8, borderRadius: 4},
  title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: homeReportTheme.titleWhite,
  },
});

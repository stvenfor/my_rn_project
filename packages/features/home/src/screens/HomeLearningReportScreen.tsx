import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {LearningReportHighlightCard} from '../components/LearningReportHighlightCard';
import {LearningReportRecordCard} from '../components/LearningReportRecordCard';
import {LearningReportSectionHeader} from '../components/LearningReportSectionHeader';
import {MembershipBanner} from '../components/MembershipBanner';
import {ParentAssistantChip} from '../components/ParentAssistantChip';
import {learningHighlights, learningRecords} from '../data/homeReportData';
import {homeReportTheme} from '../theme/homeReportTheme';

export function HomeLearningReportScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <AppPageScaffold
      backgroundColor={homeReportTheme.background}
      navBar={
        <AppNavBar
          title="学习报告"
          showBackButton
          onBack={() => navigation.goBack()}
          backgroundColor={homeReportTheme.background}
          foregroundColor={homeReportTheme.titleWhite}
          barStyle={styles.navBar}
        />
      }>
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {paddingBottom: insets.bottom + 120},
          ]}>
          <LearningReportSectionHeader
            dotColor={homeReportTheme.dotYellow}
            title="今日高光"
          />
          <View style={styles.gapSm} />
          <LearningReportHighlightCard items={learningHighlights} />
          <View style={styles.gapLg} />
          <LearningReportSectionHeader
            dotColor={homeReportTheme.dotBlue}
            title="今日学习记录"
          />
          <View style={styles.gapSm} />
          <LearningReportRecordCard items={learningRecords} />
        </ScrollView>
        <View style={[styles.bannerWrap, {bottom: insets.bottom + 12}]}>
          <MembershipBanner />
        </View>
        <View style={[styles.chipWrap, {bottom: insets.bottom + 88}]}>
          <ParentAssistantChip />
        </View>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  navBar: {borderBottomWidth: 0},
  body: {flex: 1},
  scroll: {paddingHorizontal: 16, paddingTop: 12},
  gapSm: {height: 10},
  gapLg: {height: 20},
  bannerWrap: {position: 'absolute', left: 16, right: 16},
  chipWrap: {position: 'absolute', right: 16},
});

import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import type {User} from '@core/domain';
import {RoutePath, type MainTabScreenProps} from '@core/navigation';
import {WebBridgeAssets, WebPageLoadType} from '@core/webview';
import {PrimaryButton} from '@ui/design-system';
import {HomeBannerSection} from '../components/HomeBannerSection';
import {HomeContactList} from '../components/HomeContactList';
import {HomeFeatureGrid} from '../components/HomeFeatureGrid';
import {HomeGreetingSection} from '../components/HomeGreetingSection';
import {HomeLearningReportEntry} from '../components/HomeLearningReportEntry';
import {HomeNewsList} from '../components/HomeNewsList';
import {HomeQuickActionGrid} from '../components/HomeQuickActionGrid';
import {HomeSearchBar} from '../components/HomeSearchBar';
import {HomeServiceGrid} from '../components/HomeServiceGrid';
import {HomeStoreMetricsCard} from '../components/HomeStoreMetricsCard';
import {useHomeMiniPlayerInset} from '../hooks/useHomeMiniPlayerInset';
import type {HomeFeatureItem} from '../models/homeDashboardModel';
import {
  loadHomeDashboard,
  METRIC_TABS,
  refreshHomeDashboard,
  selectCurrentMetrics,
  selectHomeDashboard,
  selectHomeError,
  selectHomeGreeting,
  selectHomeLoading,
  selectHomeMetricTab,
  selectHomeRefreshing,
  setMetricTab,
  updateGreeting,
} from '../store/homeSlice';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

type HomeDispatch = ThunkDispatch<
  Record<string, unknown>,
  unknown,
  UnknownAction
>;

function selectAuthUser(state: Record<string, unknown>): User | null {
  const auth = state.auth as {user: User | null} | undefined;
  return auth?.user ?? null;
}

function selectCurrentEnv(state: Record<string, unknown>): string {
  const env = state.env as {currentEnv: string} | undefined;
  return env?.currentEnv ?? 'test';
}

export function HomeScreen({navigation}: MainTabScreenProps<'HomeTab'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<HomeDispatch>();
  const dashboard = useSelector(selectHomeDashboard);
  const greeting = useSelector(selectHomeGreeting);
  const metricTab = useSelector(selectHomeMetricTab);
  const metrics = useSelector(selectCurrentMetrics);
  const loading = useSelector(selectHomeLoading);
  const refreshing = useSelector(selectHomeRefreshing);
  const error = useSelector(selectHomeError);
  const user = useSelector(selectAuthUser);
  const currentEnv = useSelector(selectCurrentEnv);
  const miniPlayerInset = useHomeMiniPlayerInset();
  const isFirstEnv = useRef(true);
  const prevUserRef = useRef(user);

  useEffect(() => {
    dispatch(loadHomeDashboard());
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateGreeting(user));
    if (prevUserRef.current !== user && user) {
      if (dashboard) {
        dispatch(refreshHomeDashboard());
      } else {
        dispatch(loadHomeDashboard());
      }
    }
    prevUserRef.current = user;
  }, [user, dispatch, dashboard]);

  useEffect(() => {
    if (isFirstEnv.current) {
      isFirstEnv.current = false;
      return;
    }
    dispatch(refreshHomeDashboard());
  }, [currentEnv, dispatch]);

  const onFeaturePress = (item: HomeFeatureItem) => {
    if (item.label === '更多') {
      navigation.navigate(RoutePath.homeAllServices);
      return;
    }
    if (item.label === '生活服务') {
      navigation.navigate(RoutePath.homeCheckInMall);
      return;
    }
    if (item.label === '销售顾问') {
      navigation.navigate(RoutePath.web, {
        loadType: WebPageLoadType.asset,
        assetPath: WebBridgeAssets.testBridge,
        title: 'Web 桥接测试',
        params: {
          from: 'home',
          feature: item.label,
          storeName: dashboard?.storeName ?? '',
          timestamp: Date.now(),
        },
      });
    }
  };

  if (!dashboard && error) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>{error}</Text>
        <PrimaryButton
          title="重试"
          onPress={() => dispatch(loadHomeDashboard())}
        />
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.errorWrap}>
        {loading || refreshing ? (
          <>
            <ActivityIndicator size="large" color={homeDashboardTheme.primaryBlue} />
            <Text style={styles.loadingText}>加载中</Text>
          </>
        ) : null}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{paddingBottom: miniPlayerInset}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || loading}
          onRefresh={() => dispatch(refreshHomeDashboard())}
        />
      }>
      <View style={[styles.darkZone, {paddingTop: insets.top}]}>
        <HomeSearchBar />
        <HomeBannerSection />
        <HomeFeatureGrid
          items={dashboard.features}
          onFeaturePress={onFeaturePress}
        />
        <View style={styles.darkSpacer} />
      </View>
      <View style={styles.roundTransition} />
      <View style={styles.lightZone}>
        <HomeGreetingSection greeting={greeting} />
        <HomeQuickActionGrid actions={dashboard.quickActions} />
        <HomeStoreMetricsCard
          storeName={dashboard.storeName}
          selectedTab={metricTab}
          tabs={METRIC_TABS}
          metrics={metrics}
          details={dashboard.metricDetails}
          onTabSelected={index => dispatch(setMetricTab(index))}
        />
        <HomeServiceGrid items={dashboard.services} />
        <HomeContactList items={dashboard.contacts} />
        <HomeNewsList items={dashboard.news} />
        <HomeLearningReportEntry
          onPress={() => navigation.navigate(RoutePath.homeLearningReport)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: homeDashboardTheme.background},
  darkZone: {backgroundColor: homeDashboardTheme.bannerDark},
  darkSpacer: {height: 16},
  roundTransition: {
    height: 20,
    backgroundColor: homeDashboardTheme.bannerDark,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  lightZone: {backgroundColor: homeDashboardTheme.background},
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: homeDashboardTheme.background,
  },
  errorText: {color: '#E53935', marginBottom: 12, textAlign: 'center'},
  loadingText: {marginTop: 12, color: homeDashboardTheme.textGray, fontSize: 14},
});

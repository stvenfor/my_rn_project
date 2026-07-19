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
import {HomeClubTabContent} from '../components/HomeClubTabContent';
import {HomeContactList} from '../components/HomeContactList';
import {HomeFeatureGrid} from '../components/HomeFeatureGrid';
import {HomeGreetingSection} from '../components/HomeGreetingSection';
import {HomeLearningReportEntry} from '../components/HomeLearningReportEntry';
import {HomeNewsList} from '../components/HomeNewsList';
import {HomeQuickActionGrid} from '../components/HomeQuickActionGrid';
import {HomeSearchBar} from '../components/HomeSearchBar';
import {HomeServiceGrid} from '../components/HomeServiceGrid';
import {HomeStoreMetricsCard} from '../components/HomeStoreMetricsCard';
import {HomeStrategyEntry} from '../components/HomeStrategyEntry';
import {HomeTopTabBar} from '../components/HomeTopTabBar';
import {HomeVideoTabContent} from '../components/HomeVideoTabContent';
import {useHomeMiniPlayerInset} from '../hooks/useHomeMiniPlayerInset';
import type {HomeFeatureItem} from '../models/homeDashboardModel';
import {openUsedCarList} from '../navigation/usedCarNavigation';
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
  selectHomeTopTab,
  setMetricTab,
  setTopTab,
  updateGreeting,
} from '../store/homeSlice';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

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
  const topTab = useSelector(selectHomeTopTab);
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
    if (item.label === '二手车') {
      openUsedCarList({
        isLoggedIn: Boolean(user),
        navigate: name => navigation.navigate(name),
      });
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
            <ActivityIndicator size="large" color={t.accent} />
            <Text style={styles.loadingText}>加载中</Text>
          </>
        ) : null}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 24 + miniPlayerInset,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || loading}
          onRefresh={() => dispatch(refreshHomeDashboard())}
          tintColor={t.accent}
        />
      }>
      <HomeGreetingSection greeting={greeting} />
      <HomeSearchBar
        onSearchPress={() => navigation.navigate(RoutePath.homeSearch)}
      />
      <HomeTopTabBar
        selectedIndex={topTab}
        onSelected={index => dispatch(setTopTab(index))}
      />

      {topTab === 1 ? (
        <HomeVideoTabContent
          onOpenDubbing={() => navigation.navigate(RoutePath.homeDubbingFeed)}
        />
      ) : topTab === 2 ? (
        <HomeClubTabContent
          onOpenCommunity={() => navigation.navigate('CommunityTab')}
        />
      ) : (
        <>
          <HomeBannerSection />
          <HomeFeatureGrid
            items={dashboard.features}
            onFeaturePress={onFeaturePress}
          />
          <HomeQuickActionGrid actions={dashboard.quickActions} />
          <HomeStoreMetricsCard
            storeName={dashboard.storeName}
            selectedTab={metricTab}
            tabs={METRIC_TABS}
            metrics={metrics}
            details={dashboard.metricDetails}
            onTabSelected={index => dispatch(setMetricTab(index))}
          />
          <HomeStrategyEntry
            onPress={() => navigation.navigate(RoutePath.homeStrategy)}
          />
          <HomeServiceGrid items={dashboard.services} />
          <HomeContactList items={dashboard.contacts} />
          <HomeNewsList items={dashboard.news} />
          <HomeLearningReportEntry
            onPress={() => navigation.navigate(RoutePath.homeLearningReport)}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: t.background},
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: t.background,
  },
  errorText: {color: '#E53935', marginBottom: 12, textAlign: 'center'},
  loadingText: {marginTop: 12, color: t.textGray, fontSize: 14},
});

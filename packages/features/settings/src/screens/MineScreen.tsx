import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {AppPageScaffold} from '@ui/design-system/AppPageScaffold';
import {MineFunctionSection} from '../components/MineFunctionSection';
import {MineHeader, SwitchStoreDialog} from '../components/MineHeader';
import {MineMenuList} from '../components/MineMenuList';
import {MineQuickServices} from '../components/MineQuickServices';
import {
  MediaSourceBottomSheet,
  type MediaPickSource,
} from '../components/MediaSourceBottomSheet';
import type {MineFunctionItem} from '../models/mineFunctionItem';
import type {MineMenuItem, MineQuickServiceItem} from '../models/mineMenuData';
import {openMineGatedRoute} from '../navigation/mineGatedNavigation';
import {
  applySelectedStore,
  initializeMine,
  persistSelectedStore,
  reorderAndPersistMineFunctions,
  selectMineFunctions,
  selectMineInitialized,
  selectMineProfile,
  selectMineSelectedStoreId,
  syncMineUser,
} from '../store/mineSlice';
import {mineTheme} from '../theme/mineTheme';
import {pickMineAvatarMedia} from '../services/mineAvatarPicker';
import type {MineScreenProps} from '../types';

type MineDispatch = ThunkDispatch<
  Record<string, unknown>,
  unknown,
  UnknownAction
>;

export function MineScreen({
  navigation,
  isLoggedIn,
  user,
  onLogout,
  onUpdateAvatar,
}: MineScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<MineDispatch>();
  const profile = useSelector(selectMineProfile);
  const functions = useSelector(selectMineFunctions);
  const selectedStoreId = useSelector(selectMineSelectedStoreId);
  const initialized = useSelector(selectMineInitialized);

  const [storeDialogVisible, setStoreDialogVisible] = useState(false);
  const [mediaSheetVisible, setMediaSheetVisible] = useState(false);
  const [functionGridDragging, setFunctionGridDragging] = useState(false);

  useEffect(() => {
    dispatch(initializeMine(user));
  }, [dispatch, user]);

  useEffect(() => {
    if (initialized) {
      dispatch(syncMineUser(user));
    }
  }, [dispatch, initialized, user]);

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(reorderAndPersistMineFunctions({fromIndex, toIndex}));
    },
    [dispatch],
  );

  const handleFunctionTap = useCallback(
    (item: MineFunctionItem) => {
      if (item.id === 'qa') {
        navigation.navigate(RoutePath.mineHttpTest);
        return;
      }
      if (item.id === 'short_video') {
        openMineGatedRoute({
          isLoggedIn,
          navigate: name => navigation.navigate(name),
          target: RoutePath.shortVideo,
        });
        return;
      }
      if (item.id === 'used_car') {
        openMineGatedRoute({
          isLoggedIn,
          navigate: name => navigation.navigate(name),
          target: RoutePath.homeUsedCarList,
        });
        return;
      }
      AppToast.show(`${item.title} 开发中`);
    },
    [isLoggedIn, navigation],
  );

  const handleQuickServiceTap = useCallback((item: MineQuickServiceItem) => {
    AppToast.show(`${item.label} 开发中`);
  }, []);

  const handleMenuTap = useCallback(
    (item: MineMenuItem) => {
      if (item.id === 'settings') {
        navigation.navigate(RoutePath.settings);
        return;
      }
      if (item.id === 'feedback') {
        AppToast.show('意见反馈');
        return;
      }
      if (item.id === 'fan_group') {
        AppToast.show('粉丝群');
        return;
      }
      if (item.id === 'invite') {
        AppToast.show('邀请好友');
        return;
      }
      if (item.id === 'reminder') {
        AppToast.show('提醒事项');
        return;
      }
      if (item.id === 'cooperation') {
        AppToast.show('商务合作');
        return;
      }
      AppToast.show(`${item.label} 开发中`);
    },
    [navigation],
  );

  const handleStoreTap = useCallback(() => {
    if (!isLoggedIn) {
      AppToast.show('请先登录');
      return;
    }
    setStoreDialogVisible(true);
  }, [isLoggedIn]);

  const handleStoreSelect = useCallback(
    async (storeId: string) => {
      setStoreDialogVisible(false);
      if (storeId === selectedStoreId) {
        return;
      }
      dispatch(applySelectedStore(storeId));
      await dispatch(persistSelectedStore(storeId));
    },
    [dispatch, selectedStoreId],
  );

  const handleAuthTap = useCallback(async () => {
    if (isLoggedIn) {
      await onLogout();
      dispatch(syncMineUser(null));
      return;
    }
    navigation.navigate(RoutePath.login);
  }, [dispatch, isLoggedIn, navigation, onLogout]);

  const handleMediaPick = useCallback(
    (source: MediaPickSource) => {
      setMediaSheetVisible(false);
      if (!isLoggedIn) {
        return;
      }
      void pickMineAvatarMedia(source, onUpdateAvatar);
    },
    [isLoggedIn, onUpdateAvatar],
  );

  return (
    <AppPageScaffold
      layout="mainTabRoot"
      backgroundColor={mineTheme.pageBackground}>
      <ScrollView
        scrollEnabled={!functionGridDragging}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          {profile ? (
            <MineHeader
              data={profile}
              showBackButton={false}
              isLoggedIn={isLoggedIn}
              onInfoTap={() =>
                navigation.navigate(RoutePath.personalizedSettings)
              }
              onCalendarTap={() => AppToast.show('签到日历')}
              onSettingsTap={() => navigation.navigate(RoutePath.settings)}
              onAuthTap={handleAuthTap}
              onStoreTap={handleStoreTap}
              onElectronicCardTap={() => AppToast.show('电子名片')}
              onAvatarTap={() => {
                if (!isLoggedIn) {
                  AppToast.show('请先登录');
                  return;
                }
                setMediaSheetVisible(true);
              }}
            />
          ) : (
            <View style={styles.headerPlaceholder} />
          )}
        </View>
        <MineQuickServices onTap={handleQuickServiceTap} />
        <MineFunctionSection
          items={functions}
          onReorder={handleReorder}
          onItemTap={handleFunctionTap}
          onDragActiveChange={setFunctionGridDragging}
        />
        <MineMenuList onTap={handleMenuTap} />
      </ScrollView>

      <SwitchStoreDialog
        visible={storeDialogVisible}
        selectedId={selectedStoreId}
        onSelect={handleStoreSelect}
        onClose={() => setStoreDialogVisible(false)}
      />
      <MediaSourceBottomSheet
        visible={mediaSheetVisible}
        onPick={handleMediaPick}
        onClose={() => setMediaSheetVisible(false)}
      />
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingBottom: 40,
  },
  headerPlaceholder: {
    height: 220,
  },
});

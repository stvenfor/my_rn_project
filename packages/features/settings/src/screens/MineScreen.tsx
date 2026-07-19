import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {MineFunctionSection} from '../components/MineFunctionSection';
import {MineHeader, SwitchStoreDialog} from '../components/MineHeader';
import {
  MediaSourceBottomSheet,
  type MediaPickSource,
} from '../components/MediaSourceBottomSheet';
import type {MineFunctionItem} from '../models/mineFunctionItem';
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
import {mineLayout, mineTheme} from '../theme/mineTheme';
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
        if (!isLoggedIn) {
          navigation.navigate(RoutePath.login);
          return;
        }
        navigation.navigate(RoutePath.shortVideo);
        return;
      }
      AppToast.show(`${item.title} 开发中`);
    },
    [isLoggedIn, navigation],
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
    <View style={styles.page}>
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
        <View style={styles.sectionSpacer} />
        <MineFunctionSection
          items={functions}
          onReorder={handleReorder}
          onItemTap={handleFunctionTap}
          onDragActiveChange={setFunctionGridDragging}
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: mineTheme.pageBackground,
  },
  headerWrap: {
    paddingBottom: 40,
  },
  headerPlaceholder: {
    height: 220,
  },
  sectionSpacer: {
    height: mineLayout.statsBarBottomOffset * -1 + 12,
  },
});

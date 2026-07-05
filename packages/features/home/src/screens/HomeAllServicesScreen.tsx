import React, {useEffect} from 'react';
import {Image, Pressable, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {AllServicesSection} from '../components/AllServicesSection';
import {homeServiceIcons} from '../assets/homeAssets';
import type {AllServiceItem} from '../data/allServicesData';
import {catalogSections, favoriteSectionMeta} from '../data/allServicesData';
import {
  addFavorite,
  loadAllServicesFavorites,
  removeFavorite,
  selectAllServicesEditing,
  selectCanAddFavorite,
  selectCanRemoveFavorite,
  selectFavoriteIds,
  selectFavoriteItems,
  toggleEdit,
} from '../store/allServicesSlice';
import {allServicesTheme} from '../theme/allServicesTheme';

type Dispatch = ThunkDispatch<Record<string, unknown>, unknown, UnknownAction>;

export function HomeAllServicesScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeAllServices>) {
  const dispatch = useDispatch<Dispatch>();
  const favorites = useSelector(selectFavoriteItems);
  const isEditing = useSelector(selectAllServicesEditing);
  const favoriteIds = useSelector(selectFavoriteIds);
  const canRemove = useSelector(selectCanRemoveFavorite);
  const canAdd = useSelector(selectCanAddFavorite);

  useEffect(() => {
    dispatch(loadAllServicesFavorites());
  }, [dispatch]);

  const openService = (item: AllServiceItem) => {
    if (item.templateId) {
      navigation.navigate(RoutePath.bfuiTemplate, {
        templateId: item.templateId,
      });
      return;
    }
    if (item.routePath === RoutePath.musicList) {
      navigation.navigate(RoutePath.musicList);
    }
  };

  return (
    <AppPageScaffold
      backgroundColor={allServicesTheme.background}
      navBar={
        <AppNavBar
          title="全部服务"
          backgroundColor={allServicesTheme.background}
          leading={
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.leading}>
              <Image
                source={homeServiceIcons.nav_back_black}
                style={styles.backIcon}
              />
            </Pressable>
          }
        />
      }>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AllServicesSection
          section={{
            title: favoriteSectionMeta.title,
            subtitle: favoriteSectionMeta.subtitle,
            showEditButton: true,
            items: favorites,
          }}
          isEditing={isEditing}
          isFavoriteSection
          favoriteIds={favoriteIds}
          canRemoveFavorite={canRemove}
          onEditTap={() => dispatch(toggleEdit())}
          onRemoveFavorite={item => dispatch(removeFavorite(item.id))}
          onItemTap={openService}
        />
        {catalogSections.map(section => (
          <AllServicesSection
            key={section.title}
            section={section}
            isEditing={isEditing}
            favoriteIds={favoriteIds}
            canAddFavorite={canAdd}
            onAddFavorite={item => dispatch(addFavorite(item))}
            onItemTap={openService}
          />
        ))}
      </ScrollView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  leading: {paddingHorizontal: 8},
  backIcon: {width: 24, height: 24},
  scroll: {paddingTop: 8, paddingBottom: 24},
});

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type {AllServiceItem, AllServiceSection} from '../data/allServicesData';
import {homeServiceIcons} from '../assets/homeAssets';
import {allServicesTheme} from '../theme/allServicesTheme';

interface Props {
  section: AllServiceSection;
  isEditing?: boolean;
  isFavoriteSection?: boolean;
  favoriteIds?: Set<string>;
  canRemoveFavorite?: boolean;
  canAddFavorite?: boolean;
  onEditTap?: () => void;
  onRemoveFavorite?: (item: AllServiceItem) => void;
  onAddFavorite?: (item: AllServiceItem) => void;
  onItemTap?: (item: AllServiceItem) => void;
}

export function AllServicesSection({
  section,
  isEditing = false,
  isFavoriteSection = false,
  favoriteIds = new Set(),
  canRemoveFavorite = true,
  canAddFavorite = true,
  onEditTap,
  onRemoveFavorite,
  onAddFavorite,
  onItemTap,
}: Props) {
  const {width} = useWindowDimensions();
  const cellWidth = (width - 32) / 5;

  return (
    <View style={styles.wrap}>
      {section.showEditButton ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>{section.title}</Text>
          {section.subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {section.subtitle}
            </Text>
          ) : null}
          <Pressable style={styles.editBtn} onPress={onEditTap}>
            <Text style={styles.editText}>{isEditing ? '完成' : '编辑'}</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.titleOnly}>{section.title}</Text>
      )}
      <View style={styles.grid}>
        {section.items.map(item => (
          <AllServicesGridCell
            key={item.id}
            item={item}
            width={cellWidth}
            isEditing={isEditing}
            isFavoriteSection={isFavoriteSection}
            isInFavorites={favoriteIds.has(item.id)}
            canRemoveFavorite={canRemoveFavorite}
            canAddFavorite={canAddFavorite}
            onTap={() => onItemTap?.(item)}
            onRemove={() => onRemoveFavorite?.(item)}
            onAdd={() => onAddFavorite?.(item)}
          />
        ))}
      </View>
    </View>
  );
}

interface CellProps {
  item: AllServiceItem;
  width: number;
  isEditing: boolean;
  isFavoriteSection: boolean;
  isInFavorites: boolean;
  canRemoveFavorite: boolean;
  canAddFavorite: boolean;
  onTap: () => void;
  onRemove: () => void;
  onAdd: () => void;
}

export function AllServicesGridCell({
  item,
  width,
  isEditing,
  isFavoriteSection,
  isInFavorites,
  canRemoveFavorite,
  canAddFavorite,
  onTap,
  onRemove,
  onAdd,
}: CellProps) {
  const showRemove = isEditing && isFavoriteSection && canRemoveFavorite;
  const showAdd =
    isEditing && !isFavoriteSection && !isInFavorites && canAddFavorite;
  const dimmed = isEditing && !isFavoriteSection && isInFavorites;

  const dimmedStyle = dimmed ? styles.dimmed : undefined;

  return (
    <Pressable
      style={[styles.cell, {width}, dimmedStyle]}
      onPress={isEditing ? undefined : onTap}
      disabled={isEditing}>
      <View style={styles.iconStack}>
        <Image source={homeServiceIcons[item.assetName]} style={styles.icon} />
        {showRemove ? (
          <Pressable style={styles.badgeRemove} onPress={onRemove}>
            <Text style={styles.badgeRemoveText}>×</Text>
          </Pressable>
        ) : null}
        {showAdd ? (
          <Pressable style={styles.badgeAdd} onPress={onAdd}>
            <Text style={styles.badgeAddText}>+</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, marginBottom: 24},
  headerRow: {flexDirection: 'row', alignItems: 'center'},
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: allServicesTheme.titleBlack,
  },
  subtitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: allServicesTheme.subtitleGray,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: allServicesTheme.editBorderBlue,
    borderRadius: 14,
  },
  editText: {fontSize: 12, color: allServicesTheme.editBorderBlue},
  titleOnly: {
    fontSize: 18,
    fontWeight: '600',
    color: allServicesTheme.titleBlack,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    rowGap: 12,
  },
  cell: {alignItems: 'center'},
  dimmed: {opacity: 0.4},
  iconStack: {width: 48, height: 48},
  icon: {width: 48, height: 48},
  badgeRemove: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: allServicesTheme.badgeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRemoveText: {
    fontSize: 10,
    color: allServicesTheme.labelGray,
    lineHeight: 12,
  },
  badgeAdd: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: allServicesTheme.editBorderBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAddText: {fontSize: 12, color: '#fff', lineHeight: 14},
  label: {
    marginTop: 6,
    fontSize: 11,
    color: allServicesTheme.labelGray,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

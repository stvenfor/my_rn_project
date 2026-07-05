import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {mineFunctionIcons} from '../assets/settingsAssets';
import type {MineFunctionItem} from '../models/mineFunctionItem';
import {mineLayout, mineTheme} from '../theme/mineTheme';

interface Props {
  item: MineFunctionItem;
  onPress: () => void;
  interactive?: boolean;
}

export function MineFunctionCard({item, onPress, interactive = true}: Props) {
  const content = (
    <>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      <View style={[styles.accent, {backgroundColor: item.accentColor}]}>
        {item.id === 'calculator' ? (
          <Text style={[styles.calculatorValue, {color: item.iconColor}]}>
            5830.00
          </Text>
        ) : null}
        <Image
          source={mineFunctionIcons[item.iconKey]}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
    </>
  );

  if (!interactive) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: mineTheme.cardWhite,
    borderRadius: mineLayout.functionCardRadius,
    overflow: 'hidden',
  },
  textBlock: {
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: mineTheme.titleBlack,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: mineTheme.textGray600,
  },
  accent: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: mineLayout.functionAccentRadius,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 12,
    minHeight: 56,
  },
  iconImage: {
    width: 44,
    height: 44,
  },
  calculatorValue: {
    position: 'absolute',
    left: 14,
    bottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
});

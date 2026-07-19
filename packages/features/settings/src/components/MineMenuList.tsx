import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  MINE_MENU_ITEMS,
  type MineMenuIcon,
  type MineMenuItem,
} from '../models/mineMenuData';
import {mineTheme} from '../theme/mineTheme';
import {MineIcon} from './mineIcons';

interface Props {
  onTap: (item: MineMenuItem) => void;
}

function MenuGlyph({
  name,
  color,
}: {
  name: MineMenuIcon;
  color: string;
}) {
  if (name === 'gear') {
    return <MineIcon name="settings_outlined" color={color} size={22} />;
  }
  if (name === 'person_add') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.personHead, {backgroundColor: color}]} />
        <View style={[styles.personBody, {backgroundColor: color}]} />
        <View style={[styles.plusV, {backgroundColor: color}]} />
        <View style={[styles.plusH, {backgroundColor: color}]} />
      </View>
    );
  }
  if (name === 'bell') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.bellDome, {borderColor: color}]} />
        <View style={[styles.bellClapper, {backgroundColor: color}]} />
      </View>
    );
  }
  if (name === 'person_2') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.personHeadSm, {backgroundColor: color, left: 2}]} />
        <View style={[styles.personBodySm, {backgroundColor: color, left: 0}]} />
        <View style={[styles.personHeadSm, {backgroundColor: color, left: 10}]} />
        <View style={[styles.personBodySm, {backgroundColor: color, left: 8}]} />
      </View>
    );
  }
  if (name === 'chat_bubble_2') {
    return (
      <View style={styles.glyph}>
        <View style={[styles.bubble, {borderColor: color, top: 2, left: 0}]} />
        <View style={[styles.bubble, {borderColor: color, top: 6, left: 4}]} />
      </View>
    );
  }
  return (
    <View style={styles.glyph}>
      <View style={[styles.tagBody, {borderColor: color}]} />
      <View style={[styles.tagDot, {backgroundColor: color}]} />
    </View>
  );
}

export function MineMenuList({onTap}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.groupedCard}>
        {MINE_MENU_ITEMS.map((item, index) => {
          const color = item.destructive ? '#FF3B30' : '#007AFF';
          const labelColor = item.destructive ? '#FF3B30' : '#000000';
          return (
            <View key={item.id}>
              <Pressable
                style={styles.row}
                onPress={() => onTap(item)}
                accessibilityRole="button"
                accessibilityLabel={item.label}>
                <MenuGlyph name={item.icon} color={color} />
                <Text style={[styles.label, {color: labelColor}]}>
                  {item.label}
                </Text>
                {item.showBadge ? <View style={styles.badgeDot} /> : null}
                <MineIcon
                  name="chevron_right_rounded"
                  color="rgba(60,60,67,0.3)"
                  size={16}
                />
              </Pressable>
              {index < MINE_MENU_ITEMS.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  groupedCard: {
    backgroundColor: mineTheme.cardWhite,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 52,
  },
  glyph: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  personBody: {
    position: 'absolute',
    left: 1,
    bottom: 2,
    width: 12,
    height: 7,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  plusV: {
    position: 'absolute',
    right: 2,
    width: 1.5,
    height: 8,
  },
  plusH: {
    position: 'absolute',
    right: -1,
    width: 8,
    height: 1.5,
  },
  bellDome: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bellClapper: {
    width: 4,
    height: 2,
    borderRadius: 1,
    marginTop: 1,
  },
  personHeadSm: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  personBodySm: {
    position: 'absolute',
    bottom: 2,
    width: 10,
    height: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  bubble: {
    position: 'absolute',
    width: 12,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  tagBody: {
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 2,
    transform: [{rotate: '-20deg'}],
  },
  tagDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    left: 4,
  },
});

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  MINE_QUICK_SERVICE_ITEMS,
  type MineQuickServiceIcon,
  type MineQuickServiceItem,
} from '../models/mineMenuData';
import {mineTheme} from '../theme/mineTheme';

interface Props {
  onTap: (item: MineQuickServiceItem) => void;
}

function QuickServiceIcon({
  name,
  color,
}: {
  name: MineQuickServiceIcon;
  color: string;
}) {
  if (name === 'bag') {
    return (
      <View style={styles.iconBox}>
        <View style={[styles.bagBody, {borderColor: color}]} />
        <View style={[styles.bagHandle, {borderColor: color}]} />
      </View>
    );
  }
  if (name === 'creditcard') {
    return (
      <View style={styles.iconBox}>
        <View style={[styles.creditCard, {borderColor: color}]}>
          <View style={[styles.cardStripe, {backgroundColor: color}]} />
        </View>
      </View>
    );
  }
  if (name === 'play_rectangle') {
    return (
      <View style={styles.iconBox}>
        <View style={[styles.playRect, {borderColor: color}]}>
          <View style={[styles.playTriangle, {borderLeftColor: color}]} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.iconBox}>
      <View style={[styles.doc, {borderColor: color}]}>
        <View style={[styles.docLine, {backgroundColor: color}]} />
        <View style={[styles.docLineShort, {backgroundColor: color}]} />
      </View>
    </View>
  );
}

export function MineQuickServices({onTap}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.headline}>常用服务</Text>
      <View style={styles.groupedCard}>
        <View style={styles.row}>
          {MINE_QUICK_SERVICE_ITEMS.map(item => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() => onTap(item)}
              accessibilityRole="button"
              accessibilityLabel={item.label}>
              <View style={styles.iconStack}>
                <View
                  style={[
                    styles.iconBg,
                    {backgroundColor: `${item.iconColor}1F`},
                  ]}>
                  <QuickServiceIcon name={item.icon} color={item.iconColor} />
                </View>
                {item.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  groupedCard: {
    backgroundColor: mineTheme.cardWhite,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconStack: {
    position: 'relative',
    marginBottom: 8,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    color: '#000000',
  },
  iconBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagBody: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    marginTop: 4,
  },
  bagHandle: {
    position: 'absolute',
    top: 2,
    width: 8,
    height: 6,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  creditCard: {
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  cardStripe: {
    marginTop: 3,
    height: 2,
    width: '100%',
  },
  playRect: {
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 2,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  doc: {
    width: 12,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 2,
    paddingTop: 3,
    paddingHorizontal: 2,
    alignItems: 'flex-start',
  },
  docLine: {
    height: 1.5,
    width: 6,
    borderRadius: 1,
    marginBottom: 2,
  },
  docLineShort: {
    height: 1.5,
    width: 8,
    borderRadius: 1,
  },
});

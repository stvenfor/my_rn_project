import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {shortVideoTheme} from '../../theme/shortVideoTheme';

interface ShortVideoEmptyStateProps {
  onShootTap: () => void;
  onHelpTap: () => void;
}

function FallbackIllustration() {
  const size = shortVideoTheme.emptyFallbackSize;
  return (
    <View style={[styles.illustration, {width: size, height: size}]}>
      <View
        style={[
          styles.illustrationCircle,
          {width: size * 0.85, height: size * 0.85},
        ]}
      />
      <Text style={[styles.illustrationIcon, {fontSize: size * 0.35}]}>▣</Text>
    </View>
  );
}

export function ShortVideoEmptyState({
  onShootTap,
  onHelpTap,
}: ShortVideoEmptyStateProps) {
  return (
    <View style={styles.root}>
      <FallbackIllustration />
      <Text style={styles.message}>还没发过小视频，去发一个试试吧~</Text>
      <Pressable style={styles.shootButton} onPress={onShootTap}>
        <Text style={styles.shootIcon}>+</Text>
        <Text style={styles.shootLabel}>拍摄小视频</Text>
      </Pressable>
      <Pressable style={styles.helpButton} onPress={onHelpTap}>
        <Text style={styles.helpIcon}>?</Text>
        <Text style={styles.helpLabel}>如何拍摄小视频</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    minHeight: 360,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#F0F4F8',
  },
  illustrationIcon: {
    color: '#BDBDBD',
  },
  message: {
    marginTop: 16,
    fontSize: shortVideoTheme.emptyTextSize,
    color: shortVideoTheme.textSecondary,
    textAlign: 'center',
  },
  shootButton: {
    marginTop: 24,
    width: '100%',
    height: shortVideoTheme.emptyButtonH,
    borderRadius: shortVideoTheme.pillRadius,
    backgroundColor: shortVideoTheme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shootIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 6,
  },
  shootLabel: {
    color: '#FFFFFF',
    fontSize: shortVideoTheme.emptyButtonTextSize,
    fontWeight: '600',
  },
  helpButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 16,
    color: shortVideoTheme.primary,
    marginRight: 4,
  },
  helpLabel: {
    fontSize: shortVideoTheme.emptyHelpSize,
    color: shortVideoTheme.primary,
  },
});

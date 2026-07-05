import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {shortVideoTheme} from '../../theme/shortVideoTheme';

interface ShortVideoSectionHeaderProps {
  onHelpTap: () => void;
}

export function ShortVideoSectionHeader({
  onHelpTap,
}: ShortVideoSectionHeaderProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>我发布的小视频</Text>
      <Pressable style={styles.helpButton} onPress={onHelpTap}>
        <Text style={styles.helpIcon}>?</Text>
        <Text style={styles.helpLabel}>如何拍摄小视频</Text>
      </Pressable>
    </View>
  );
}

export function ShortVideoLoadingFooter() {
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={shortVideoTheme.primary} />
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: shortVideoTheme.sectionPaddingH,
    paddingTop: shortVideoTheme.sectionPaddingTop,
    paddingBottom: shortVideoTheme.sectionPaddingBottom,
  },
  title: {
    fontSize: shortVideoTheme.sectionTitleSize,
    fontWeight: '700',
    color: shortVideoTheme.textPrimary,
    flex: 1,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  helpIcon: {
    fontSize: shortVideoTheme.helpIconSize,
    color: shortVideoTheme.primary,
    marginRight: 4,
  },
  helpLabel: {
    fontSize: shortVideoTheme.helpLinkSize,
    color: shortVideoTheme.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: shortVideoTheme.loadingPaddingV,
    gap: 8,
  },
  loadingText: {
    fontSize: shortVideoTheme.loadingTextSize,
    color: shortVideoTheme.textMuted,
  },
});

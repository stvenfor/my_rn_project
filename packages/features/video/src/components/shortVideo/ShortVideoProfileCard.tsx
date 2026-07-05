import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {ShortVideoProfileModel} from '../../models/shortVideoModels';
import {
  shortVideoTheme,
  shortVideoTypography,
} from '../../theme/shortVideoTheme';

interface ShortVideoProfileCardProps {
  profile: ShortVideoProfileModel;
}

export function ShortVideoProfileCard({profile}: ShortVideoProfileCardProps) {
  const stats = [
    {value: profile.stats.videoCount, label: '视频数'},
    {value: profile.stats.viewCount, label: '浏览量'},
    {value: profile.stats.likeCount, label: '点赞数'},
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={shortVideoTypography.profileName} numberOfLines={1}>
              {profile.displayName}
            </Text>
            <View style={styles.badge}>
              <Text style={shortVideoTypography.profileBadge}>
                {profile.roleBadge}
              </Text>
            </View>
            <Text style={styles.storeIcon}>⌂</Text>
          </View>
          <Text style={shortVideoTypography.profileStore} numberOfLines={1}>
            {profile.storeName}
          </Text>
        </View>
        {profile.avatarUrl ? (
          <Image source={{uri: profile.avatarUrl}} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
      </View>
      <View style={styles.statsRow}>
        {stats.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 ? <View style={styles.statDivider} /> : null}
            <View style={styles.statCell}>
              <Text style={shortVideoTypography.profileStatValue}>
                {item.value}
              </Text>
              <Text style={shortVideoTypography.profileStatLabel}>
                {item.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: shortVideoTheme.profileMarginH,
    marginTop: shortVideoTheme.profileMarginTop,
    padding: shortVideoTheme.profilePadding,
    backgroundColor: '#FFFFFF',
    borderRadius: shortVideoTheme.cardRadius,
    shadowColor: shortVideoTheme.cardShadowColor,
    shadowOffset: {width: 0, height: shortVideoTheme.cardShadowOffsetY},
    shadowOpacity: shortVideoTheme.cardShadowOpacity,
    shadowRadius: shortVideoTheme.cardShadowRadius,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    backgroundColor: shortVideoTheme.primary,
    borderRadius: shortVideoTheme.badgeRadius,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  storeIcon: {
    fontSize: 16,
    color: shortVideoTheme.textMuted,
    marginLeft: 4,
  },
  avatar: {
    width: shortVideoTheme.profileAvatarSize,
    height: shortVideoTheme.profileAvatarSize,
    borderRadius: shortVideoTheme.profileAvatarSize / 2,
    backgroundColor: shortVideoTheme.divider,
  },
  avatarPlaceholder: {
    backgroundColor: shortVideoTheme.divider,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: shortVideoTheme.profileStatsDividerH,
    backgroundColor: shortVideoTheme.divider,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
});

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

const BANNER_IMAGE = 'https://picsum.photos/seed/banner/800/400';

export function HomeBannerSection() {
  return (
    <View style={styles.wrap}>
      <Image source={{uri: BANNER_IMAGE}} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>[功能] 朋友圈</Text>
        <Text style={styles.subtitle}>一键分享，高效触达客户</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>立即体验</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: homeDashboardTheme.bannerGradientEnd,
    shadowColor: homeDashboardTheme.bannerGradientStart,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {...StyleSheet.absoluteFillObject, opacity: 0.65},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {position: 'absolute', left: 20, top: 28},
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.38)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  subtitle: {color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 8},
  cta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  ctaText: {
    color: homeDashboardTheme.bannerGradientStart,
    fontSize: 13,
    fontWeight: '600',
  },
});

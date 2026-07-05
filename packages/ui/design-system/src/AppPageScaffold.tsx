import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {colors} from './theme';

export type AppPageLayout =
  | 'standard'
  | 'fullBleed'
  | 'edgeToEdge'
  | 'mainTabRoot';

export interface AppPageScaffoldProps {
  children: React.ReactNode;
  navBar?: React.ReactNode;
  layout?: AppPageLayout;
  backgroundColor?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function AppPageScaffold({
  children,
  navBar,
  layout = 'standard',
  backgroundColor = colors.background,
  style,
  contentStyle,
}: AppPageScaffoldProps) {
  const showNavBar =
    navBar != null && layout !== 'edgeToEdge' && layout !== 'mainTabRoot';

  if (layout === 'fullBleed') {
    return (
      <View style={[styles.root, {backgroundColor}, style]}>
        <View style={[styles.fullBleedBody, contentStyle]}>{children}</View>
        {showNavBar ? <View style={styles.fullBleedNav}>{navBar}</View> : null}
      </View>
    );
  }

  if (layout === 'edgeToEdge' || layout === 'mainTabRoot') {
    return (
      <View style={[styles.root, {backgroundColor}, style, contentStyle]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.root, {backgroundColor}, style]}>
      {showNavBar ? navBar : null}
      <View style={[styles.body, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  fullBleedBody: {
    ...StyleSheet.absoluteFillObject,
  },
  fullBleedNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

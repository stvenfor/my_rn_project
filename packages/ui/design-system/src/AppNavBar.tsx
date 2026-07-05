import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from './theme';

export type AppNavBarStyle = 'solid' | 'dark' | 'transparent';

export const APP_NAV_BAR_HEIGHT = 44;

export interface AppNavBarProps {
  title?: string;
  titleComponent?: React.ReactNode;
  leading?: React.ReactNode;
  right?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  style?: AppNavBarStyle;
  backgroundColor?: string;
  foregroundColor?: string;
  centerTitle?: boolean;
  barStyle?: ViewStyle;
}

function resolveColors(
  variant: AppNavBarStyle,
  backgroundColor?: string,
  foregroundColor?: string,
) {
  if (backgroundColor && foregroundColor) {
    return {backgroundColor, foregroundColor};
  }
  switch (variant) {
    case 'dark':
      return {backgroundColor: '#000000', foregroundColor: colors.onDark};
    case 'transparent':
      return {backgroundColor: 'transparent', foregroundColor: colors.text};
    case 'solid':
    default:
      return {backgroundColor: colors.background, foregroundColor: colors.text};
  }
}

export function AppNavBar({
  title,
  titleComponent,
  leading,
  right,
  showBackButton = false,
  onBack,
  style = 'solid',
  backgroundColor,
  foregroundColor,
  centerTitle = true,
  barStyle,
}: AppNavBarProps) {
  const insets = useSafeAreaInsets();
  const palette = resolveColors(style, backgroundColor, foregroundColor);

  React.useEffect(() => {
    if (style !== 'dark' || typeof StatusBar.setBarStyle !== 'function') {
      return undefined;
    }
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, [style]);

  const renderLeading = () => {
    if (leading !== undefined) {
      return <View style={styles.sideSlot}>{leading}</View>;
    }
    if (showBackButton) {
      return (
        <Pressable
          style={styles.sideSlot}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="返回">
          <Text style={[styles.backGlyph, {color: palette.foregroundColor}]}>
            ‹
          </Text>
        </Pressable>
      );
    }
    return <View style={styles.sideSlot} />;
  };

  const renderTitle = () => {
    if (titleComponent) {
      return (
        <View
          style={[
            styles.titleArea,
            centerTitle ? styles.titleCenter : styles.titleStart,
          ]}>
          {titleComponent}
        </View>
      );
    }
    if (!title) {
      return <View style={styles.titleArea} />;
    }
    return (
      <View
        style={[
          styles.titleArea,
          centerTitle ? styles.titleCenter : styles.titleStart,
        ]}>
        <Text
          style={[styles.titleText, {color: palette.foregroundColor}]}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          backgroundColor: palette.backgroundColor,
        },
        style === 'solid' && styles.solidBorder,
        barStyle,
      ]}>
      <View style={styles.toolbar}>
        {renderLeading()}
        {renderTitle()}
        <View style={styles.sideSlot}>{right ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  solidBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  toolbar: {
    height: APP_NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sideSlot: {
    minWidth: 44,
    height: APP_NAV_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  backGlyph: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
  },
  titleArea: {
    flex: 1,
    justifyContent: 'center',
    minHeight: APP_NAV_BAR_HEIGHT,
    paddingHorizontal: 4,
  },
  titleCenter: {
    alignItems: 'center',
  },
  titleStart: {
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
  },
});

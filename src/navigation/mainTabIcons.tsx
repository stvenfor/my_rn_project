import React from 'react';
import {StyleSheet, View} from 'react-native';

interface IconProps {
  color: string;
  size?: number;
  filled?: boolean;
}

function HomeIcon({color, size = 24, filled = false}: IconProps) {
  const scale = size / 24;
  return (
    <View style={[styles.iconBox, {width: size, height: size}]}>
      <View
        style={[
          styles.homeRoof,
          {
            borderBottomColor: color,
            borderLeftWidth: 8 * scale,
            borderRightWidth: 8 * scale,
            borderBottomWidth: 7 * scale,
            marginBottom: 1 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.homeBody,
          {
            width: 14 * scale,
            height: 10 * scale,
            borderColor: color,
            backgroundColor: filled ? color : 'transparent',
          },
        ]}
      />
    </View>
  );
}

function ChatIcon({color, size = 24, filled = false}: IconProps) {
  const scale = size / 24;
  return (
    <View style={[styles.iconBox, {width: size, height: size}]}>
      <View
        style={[
          styles.chatBubble,
          {
            width: 18 * scale,
            height: 14 * scale,
            borderColor: color,
            backgroundColor: filled ? color : 'transparent',
            borderRadius: 8 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.chatTail,
          {
            borderTopColor: filled ? color : color,
            borderLeftWidth: 4 * scale,
            borderRightWidth: 4 * scale,
            borderTopWidth: 5 * scale,
            marginTop: -1 * scale,
            marginLeft: 4 * scale,
            opacity: filled ? 1 : 0.9,
          },
        ]}
      />
    </View>
  );
}

function CommunityIcon({color, size = 24, filled = false}: IconProps) {
  const scale = size / 24;
  const dot = 7 * scale;
  return (
    <View
      style={[
        styles.iconBox,
        styles.communityRow,
        {width: size, height: size},
      ]}>
      <View
        style={[
          styles.communityDot,
          {
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            borderColor: color,
            backgroundColor: filled ? color : 'transparent',
          },
        ]}
      />
      <View style={styles.communityPair}>
        <View
          style={[
            styles.communityDot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            },
          ]}
        />
        <View
          style={[
            styles.communityDot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              marginLeft: 2 * scale,
            },
          ]}
        />
      </View>
    </View>
  );
}

function MineIcon({color, size = 24, filled = false}: IconProps) {
  const scale = size / 24;
  const head = 8 * scale;
  return (
    <View style={[styles.iconBox, {width: size, height: size}]}>
      <View
        style={[
          styles.personHead,
          {
            width: head,
            height: head,
            borderRadius: head / 2,
            borderColor: color,
            backgroundColor: filled ? color : 'transparent',
          },
        ]}
      />
      <View
        style={[
          styles.personBody,
          {
            width: 16 * scale,
            height: 8 * scale,
            borderColor: color,
            backgroundColor: filled ? color : 'transparent',
            borderTopLeftRadius: 8 * scale,
            borderTopRightRadius: 8 * scale,
            marginTop: 2 * scale,
          },
        ]}
      />
    </View>
  );
}

const ICON_RENDERERS: Record<string, (props: IconProps) => React.ReactElement> =
  {
    home: props => <HomeIcon {...props} filled={false} />,
    'home-filled': props => <HomeIcon {...props} filled />,
    chat: props => <ChatIcon {...props} filled={false} />,
    'chat-filled': props => <ChatIcon {...props} filled />,
    community: props => <CommunityIcon {...props} filled={false} />,
    'community-filled': props => <CommunityIcon {...props} filled />,
    mine: props => <MineIcon {...props} filled={false} />,
    'mine-filled': props => <MineIcon {...props} filled />,
  };

export function MainTabIcon({
  icon,
  selectedIcon,
  selected,
  color,
  size = 24,
}: {
  icon: string;
  selectedIcon: string;
  selected: boolean;
  color: string;
  size?: number;
}) {
  const key = selected ? selectedIcon : icon;
  const renderer = ICON_RENDERERS[key] ?? ICON_RENDERERS[icon];
  if (!renderer) {
    return <View style={{width: size, height: size}} />;
  }
  return renderer({color, size, filled: selected});
}

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: 'transparent',
  },
  homeBody: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  chatBubble: {
    borderWidth: 1.5,
  },
  chatTail: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'flex-start',
  },
  communityRow: {
    justifyContent: 'center',
  },
  communityPair: {
    flexDirection: 'row',
    marginTop: 1,
  },
  communityDot: {
    borderWidth: 1.5,
  },
  personHead: {
    borderWidth: 1.5,
  },
  personBody: {
    borderWidth: 1.5,
    borderTopWidth: 1.5,
  },
});

import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';

type Props = {
  colors: string[];
  style?: ViewStyle;
  children?: React.ReactNode;
  horizontal?: boolean;
};

/** RN 0.72 无 linear-gradient 依赖时，用分层色块近似渐变。 */
export function HxbGradient({
  colors,
  style,
  children,
  horizontal = true,
}: Props) {
  const stops = colors.length >= 2 ? colors : [colors[0] ?? '#2F7BFF', '#6FCDFF'];
  return (
    <View style={[styles.root, {backgroundColor: stops[0]}, style]}>
      {stops.slice(1).map((color, index) => {
        const t = (index + 1) / (stops.length - 1 || 1);
        return (
          <View
            key={`${color}-${index}`}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              horizontal
                ? {
                    left: `${Math.max(0, (t - 0.35) * 100)}%`,
                    backgroundColor: color,
                    opacity: 0.55 + index * 0.12,
                  }
                : {
                    top: `${Math.max(0, (t - 0.35) * 100)}%`,
                    backgroundColor: color,
                    opacity: 0.5 + index * 0.1,
                  },
            ]}
          />
        );
      })}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
});

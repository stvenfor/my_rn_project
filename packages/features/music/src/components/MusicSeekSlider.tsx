import React, {useCallback, useMemo} from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import {supportsNativeSlider} from '../utils/nativeCapabilities';
import {musicTheme} from '../theme/musicTheme';

export interface MusicSeekSliderProps {
  value: number;
  maximumValue: number;
  onSlidingComplete: (value: number) => void;
}

function JsSeekSlider({
  value,
  maximumValue,
  onSlidingComplete,
}: MusicSeekSliderProps) {
  const [trackWidth, setTrackWidth] = React.useState(0);
  const progress =
    maximumValue > 0 ? Math.min(Math.max(value / maximumValue, 0), 1) : 0;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const seekAt = useCallback(
    (event: GestureResponderEvent) => {
      if (trackWidth <= 0 || maximumValue <= 0) {
        return;
      }
      const ratio = Math.min(
        Math.max(event.nativeEvent.locationX / trackWidth, 0),
        1,
      );
      onSlidingComplete(Math.round(ratio * maximumValue));
    },
    [maximumValue, onSlidingComplete, trackWidth],
  );

  return (
    <Pressable onPress={seekAt} onLayout={onLayout} style={styles.track}>
      <View style={[styles.fillBase, styles.inactive]} />
      <View
        style={[styles.fillBase, styles.active, {width: `${progress * 100}%`}]}
      />
      <View
        style={[
          styles.thumb,
          {left: Math.max(0, trackWidth * progress - THUMB_SIZE / 2)},
        ]}
      />
    </Pressable>
  );
}

export function MusicSeekSlider(props: MusicSeekSliderProps) {
  const NativeSlider = useMemo(() => {
    if (!supportsNativeSlider) {
      return null;
    }
    try {
      return require('@react-native-community/slider')
        .default as React.ComponentType<{
        style?: object;
        minimumValue: number;
        maximumValue: number;
        value: number;
        onSlidingComplete: (value: number) => void;
        minimumTrackTintColor?: string;
        maximumTrackTintColor?: string;
        thumbTintColor?: string;
      }>;
    } catch {
      return null;
    }
  }, []);

  if (NativeSlider) {
    return (
      <NativeSlider
        style={styles.nativeSlider}
        minimumValue={0}
        maximumValue={props.maximumValue}
        value={Math.min(props.value, props.maximumValue)}
        onSlidingComplete={props.onSlidingComplete}
        minimumTrackTintColor={musicTheme.sliderActiveTrack}
        maximumTrackTintColor={musicTheme.sliderInactiveTrack}
        thumbTintColor={musicTheme.sliderThumb}
      />
    );
  }

  return <JsSeekSlider {...props} />;
}

const THUMB_SIZE = 16;

const styles = StyleSheet.create({
  nativeSlider: {
    width: '100%',
    height: 40,
  },
  track: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  fillBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  inactive: {
    backgroundColor: musicTheme.sliderInactiveTrack,
  },
  active: {
    backgroundColor: musicTheme.sliderActiveTrack,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: musicTheme.sliderThumb,
    top: (40 - THUMB_SIZE) / 2,
  },
});

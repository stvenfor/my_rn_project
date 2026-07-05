import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import Video from 'react-native-video';
import type {ShortVideoItem} from './shortVideoModels';
import {shortVideoPageCellStyles} from './shortVideoPageCellStyles';
import {useShortVideoGestures} from './useShortVideoGestures';

interface ShortVideoNativePageCellProps {
  item: ShortVideoItem;
  isActive: boolean;
  overlay?: React.ReactNode;
  onDoubleTapLike?: () => void;
  onTogglePlayPause?: (playing: boolean) => void;
}

export function ShortVideoNativePageCell({
  item,
  isActive,
  overlay,
  onDoubleTapLike,
  onTogglePlayPause,
}: ShortVideoNativePageCellProps) {
  const [initialized, setInitialized] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    onTogglePlayPause?.(isActive && playing);
  }, [initialized, isActive, onTogglePlayPause, playing]);

  useEffect(() => {
    if (isActive && initialized) {
      setPlaying(true);
    }
    if (!isActive) {
      setPlaying(false);
    }
  }, [initialized, isActive]);

  const {showPauseIcon, showLikeBurst, handlePress} = useShortVideoGestures({
    onDoubleTapLike,
    onSingleTap: () => setPlaying(current => !current),
  });

  const showCover = !initialized || failed;
  const paused = !isActive || !playing;

  return (
    <View style={shortVideoPageCellStyles.root}>
      {showCover && item.coverUrl ? (
        <Image
          source={{uri: item.coverUrl}}
          style={shortVideoPageCellStyles.cover}
          resizeMode="cover"
        />
      ) : null}
      {!failed ? (
        <Video
          source={{uri: item.url}}
          style={shortVideoPageCellStyles.video}
          resizeMode="cover"
          repeat
          paused={paused}
          poster={item.coverUrl}
          posterResizeMode="cover"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onLoad={() => {
            setInitialized(true);
            setFailed(false);
            if (isActive) {
              setPlaying(true);
            }
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={shortVideoPageCellStyles.errorPanel}>
          <Text style={shortVideoPageCellStyles.errorText}>视频加载失败</Text>
        </View>
      )}
      {!initialized && !failed ? (
        <ActivityIndicator
          color="#FFFFFF"
          style={shortVideoPageCellStyles.loader}
        />
      ) : null}
      <Pressable
        style={shortVideoPageCellStyles.gestureLayer}
        onPress={handlePress}
      />
      {showPauseIcon && paused && initialized ? (
        <View
          style={shortVideoPageCellStyles.pauseIconWrap}
          pointerEvents="none">
          <Text style={shortVideoPageCellStyles.pauseIcon}>▶</Text>
        </View>
      ) : null}
      {showLikeBurst ? (
        <View
          style={shortVideoPageCellStyles.likeBurstWrap}
          pointerEvents="none">
          <Text style={shortVideoPageCellStyles.likeBurstIcon}>♥</Text>
        </View>
      ) : null}
      {overlay}
    </View>
  );
}

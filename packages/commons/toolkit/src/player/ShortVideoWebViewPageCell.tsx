import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import type {ShortVideoItem} from './shortVideoModels';
import {shortVideoPageCellStyles} from './shortVideoPageCellStyles';
import {useShortVideoGestures} from './useShortVideoGestures';

interface ShortVideoWebViewPageCellProps {
  item: ShortVideoItem;
  isActive: boolean;
  overlay?: React.ReactNode;
  onDoubleTapLike?: () => void;
  onTogglePlayPause?: (playing: boolean) => void;
}

function buildVideoHtml(url: string): string {
  const escaped = url.replace(/"/g, '&quot;');
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #000; height: 100%; overflow: hidden; }
      video { width: 100%; height: 100%; object-fit: cover; background: #000; }
    </style>
  </head>
  <body>
    <video id="player" src="${escaped}" playsinline webkit-playsinline loop muted autoplay></video>
    <script>
      const player = document.getElementById('player');
      player.addEventListener('loadeddata', function () {
        player.muted = false;
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage('ready');
        }
      });
      player.addEventListener('error', function () {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage('error');
        }
      });
      player.play().catch(function () {});
    </script>
  </body>
</html>`;
}

export function ShortVideoWebViewPageCell({
  item,
  isActive,
  overlay,
  onDoubleTapLike,
  onTogglePlayPause,
}: ShortVideoWebViewPageCellProps) {
  const webRef = useRef<WebView>(null);
  const [initialized, setInitialized] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  const html = useMemo(() => buildVideoHtml(item.url), [item.url]);

  useEffect(() => {
    if (!initialized || !webRef.current) {
      return;
    }
    const script =
      isActive && playing
        ? "document.getElementById('player').play(); true;"
        : "document.getElementById('player').pause(); true;";
    webRef.current.injectJavaScript(script);
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
    onSingleTap: () => {
      const script = playingRef.current
        ? "document.getElementById('player').pause(); true;"
        : "document.getElementById('player').play(); true;";
      webRef.current?.injectJavaScript(script);
      setPlaying(current => !current);
    },
  });

  const showCover = !initialized || failed;

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
        <WebView
          ref={webRef}
          source={{html}}
          style={shortVideoPageCellStyles.webview}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
          onMessage={event => {
            if (event.nativeEvent.data === 'ready') {
              setInitialized(true);
              setFailed(false);
              if (isActive) {
                setPlaying(true);
              }
            }
            if (event.nativeEvent.data === 'error') {
              setFailed(true);
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
      {showPauseIcon && (!isActive || !playing) && initialized ? (
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

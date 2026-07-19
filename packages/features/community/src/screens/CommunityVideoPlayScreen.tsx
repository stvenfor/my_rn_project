import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {
  escapeHtmlAttr,
  sanitizeHttpUrl,
  WEBVIEW_VIDEO_TEARDOWN_JS,
} from '@commons/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, colors} from '@ui/design-system';

export function CommunityVideoPlayScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.communityVideoPlay>) {
  const rawUrl = route.params?.url ?? '';
  const safeUrl = useMemo(() => sanitizeHttpUrl(rawUrl), [rawUrl]);
  const [initialized, setInitialized] = useState(false);
  const [failed, setFailed] = useState(!safeUrl);
  const [playing, setPlaying] = useState(true);
  const webRef = useRef<WebView>(null);

  const html = useMemo(() => {
    if (!safeUrl) {
      return '';
    }
    const src = escapeHtmlAttr(safeUrl);
    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #000; height: 100%; }
      video { width: 100%; height: 100%; object-fit: contain; background: #000; }
    </style>
  </head>
  <body>
    <video id="player" src="${src}" playsinline webkit-playsinline autoplay></video>
  </body>
</html>`;
  }, [safeUrl]);

  useEffect(() => {
    if (!initialized || !safeUrl) {
      return;
    }
    const webview = webRef.current;
    return () => {
      webview?.injectJavaScript(WEBVIEW_VIDEO_TEARDOWN_JS);
    };
  }, [initialized, safeUrl]);

  const togglePlay = () => {
    const script = playing
      ? "document.getElementById('player').pause(); true;"
      : "document.getElementById('player').play(); true;";
    webRef.current?.injectJavaScript(script);
    setPlaying(current => !current);
  };

  return (
    <AppPageScaffold
      layout="fullBleed"
      backgroundColor="#000000"
      navBar={
        <AppNavBar
          style="dark"
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      {failed || !safeUrl ? (
        <Text style={styles.errorText}>视频加载失败</Text>
      ) : (
        <>
          {!initialized ? (
            <ActivityIndicator color="#FFFFFF" style={styles.loader} />
          ) : null}
          <WebView
            ref={webRef}
            source={{html}}
            style={styles.webview}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            onLoadEnd={() => setInitialized(true)}
            onError={() => setFailed(true)}
          />
          {initialized ? (
            <Pressable style={styles.overlay} onPress={togglePlay}>
              {!playing ? (
                <View style={styles.playBadge}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              ) : null}
            </Pressable>
          ) : null}
        </>
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: colors.onDark,
    fontSize: 28,
    marginLeft: 4,
  },
  errorText: {
    color: colors.onDark,
    textAlign: 'center',
    fontSize: 16,
    marginTop: '50%',
  },
});

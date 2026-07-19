import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {
  escapeHtmlAttr,
  sanitizeHttpUrl,
  WEBVIEW_VIDEO_TEARDOWN_JS,
} from '@commons/toolkit';

interface Props {
  videoUrl: string;
  subtitleEn?: string;
  subtitleZh?: string;
  onBack?: () => void;
  showWatermark?: boolean;
}

function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Flutter `PlayableVideoHeader` — WebView player + overlays.
 * Scrubber is UI-only (tap toggle); full native seek marked Degraded on WebView.
 */
export function PlayableVideoHeader({
  videoUrl,
  subtitleEn,
  subtitleZh,
  onBack,
  showWatermark = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const height = (width * 9) / 16;
  const webRef = useRef<WebView>(null);
  const [initialized, setInitialized] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [positionMs] = useState(0);
  const [durationMs] = useState(0);

  const safeUrl = useMemo(() => sanitizeHttpUrl(videoUrl), [videoUrl]);

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
      html, body { margin: 0; padding: 0; background: #000; height: 100%; overflow: hidden; }
      video { width: 100%; height: 100%; object-fit: contain; background: #000; }
    </style>
  </head>
  <body>
    <video id="player" src="${src}" playsinline webkit-playsinline autoplay></video>
  </body>
</html>`;
  }, [safeUrl]);

  useEffect(() => {
    if (!safeUrl) {
      setFailed(true);
    }
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

  const progressRatio =
    durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;
  const progressFillStyle = {width: `${progressRatio * 100}%` as const};

  return (
    <View style={[styles.root, {height}]}>
      {failed || !safeUrl ? (
        <Text style={styles.error}>视频加载失败</Text>
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
          <Pressable style={styles.tapLayer} onPress={togglePlay} />
        </>
      )}

      <Pressable
        style={[styles.backBtn, {top: insets.top + 4}]}
        onPress={onBack}
        hitSlop={8}>
        <Text style={styles.backGlyph}>‹</Text>
      </Pressable>

      {showWatermark ? (
        <View style={[styles.watermark, {top: insets.top + 8}]}>
          <Text style={styles.wmTitle}>英语趣配音</Text>
          <Text style={styles.wmSub}>FUN DUBBING</Text>
        </View>
      ) : null}

      {subtitleEn || subtitleZh ? (
        <View style={styles.subtitleBlock}>
          {subtitleEn ? (
            <Text style={styles.subtitleEn}>{subtitleEn}</Text>
          ) : null}
          {subtitleZh ? (
            <Text style={styles.subtitleZh}>{subtitleZh}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.controlsBar}>
        <Text style={styles.ctrlIcon}>{playing ? '❚❚' : '▶'}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, progressFillStyle]} />
        </View>
        <Text style={styles.time}>
          {formatMs(positionMs)} / {formatMs(durationMs)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  webview: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    zIndex: 2,
  },
  tapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 80,
  },
  backBtn: {
    position: 'absolute',
    left: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {color: '#FFFFFF', fontSize: 28, marginTop: -2},
  watermark: {
    position: 'absolute',
    right: 12,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  wmTitle: {color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600'},
  wmSub: {color: 'rgba(255,255,255,0.55)', fontSize: 9, marginTop: 2},
  subtitleBlock: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 44,
    zIndex: 10,
    alignItems: 'center',
  },
  subtitleEn: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  subtitleZh: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  controlsBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  ctrlIcon: {color: '#FFFFFF', fontSize: 12, width: 22},
  track: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  fill: {height: '100%', backgroundColor: '#4CD964'},
  time: {color: '#FFFFFF', fontSize: 10, minWidth: 72, textAlign: 'right'},
});

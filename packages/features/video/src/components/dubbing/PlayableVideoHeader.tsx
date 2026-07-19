import React, {useMemo, useRef, useState} from 'react';
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

  const html = useMemo(
    () => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #000; height: 100%; overflow: hidden; }
      video { width: 100%; height: 100%; object-fit: contain; background: #000; }
    </style>
  </head>
  <body>
    <video id="player" src="${videoUrl}" playsinline webkit-playsinline autoplay></video>
  </body>
</html>`,
    [videoUrl],
  );

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
      {failed ? (
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
  webview: {...StyleSheet.absoluteFillObject, backgroundColor: '#000'},
  tapLayer: {...StyleSheet.absoluteFillObject},
  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 80,
  },
  backBtn: {
    position: 'absolute',
    left: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  backGlyph: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
  },
  watermark: {
    position: 'absolute',
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 3,
  },
  wmTitle: {color: '#FFFFFF', fontSize: 10, textAlign: 'right'},
  wmSub: {color: 'rgba(255,255,255,0.7)', fontSize: 8, textAlign: 'right'},
  subtitleBlock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 48,
    zIndex: 3,
  },
  subtitleEn: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.54)',
    textShadowRadius: 4,
  },
  subtitleZh: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.54)',
    textShadowRadius: 4,
  },
  controlsBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 3,
  },
  ctrlIcon: {color: '#FFFFFF', fontSize: 12, width: 20},
  track: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  fill: {height: 3, backgroundColor: '#52C41A'},
  time: {color: '#FFFFFF', fontSize: 10},
});

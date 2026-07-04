import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {VIDEO_MOCK_SOURCES} from '@commons/toolkit';
import {
  ListRow,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';

export function VideoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.video>) {
  const {t} = useTranslation();
  return (
    <ScreenContainer>
      <SectionTitle title={t('videoTitle')} />
      <Text style={styles.body}>{t('videoDesc')}</Text>
      <ListRow
        title={t('shortVideoTitle')}
        subtitle={t('shortVideoSubtitle')}
        onPress={() => navigation.navigate(RoutePath.shortVideo)}
      />
    </ScreenContainer>
  );
}

export function ShortVideoScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.shortVideo>) {
  const {t} = useTranslation();
  const videos = useMemo(
    () =>
      VIDEO_MOCK_SOURCES.map(v => ({
        id: String(v.id),
        title: v.title,
        author: v.category,
        url: v.url,
        desc: v.desc,
      })),
    [],
  );

  return (
    <ScreenContainer>
      <SectionTitle title={t('shortVideoTitle')} />
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListRow
            title={item.title}
            subtitle={`${item.author} · ${item.desc}`}
            onPress={() =>
              navigation.navigate(RoutePath.shortVideoPlay, {
                videoId: item.id,
                url: item.url,
                title: item.title,
              })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}

export function ShortVideoPlayScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.shortVideoPlay>) {
  const {t} = useTranslation();
  const videoId = route.params?.videoId ?? 'unknown';
  const url =
    route.params?.url ??
    VIDEO_MOCK_SOURCES.find(v => String(v.id) === videoId)?.url ??
    '';
  const title = route.params?.title ?? videoId;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(true);
    return () => setPlaying(false);
  }, [url]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('shortVideoPlayTitle')} />
      <View style={styles.player}>
        <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.url}>{url}</Text>
        <Text style={styles.hint}>{t('videoPlayerActiveHint')}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {...typography.body, marginBottom: 12},
  player: {
    marginTop: 24,
    aspectRatio: 9 / 16,
    maxHeight: 420,
    backgroundColor: colors.surfacePlayer,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  playIcon: {fontSize: 48, color: colors.onDark, marginBottom: 12},
  title: {...typography.subtitle, color: colors.onDark, textAlign: 'center'},
  url: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
});

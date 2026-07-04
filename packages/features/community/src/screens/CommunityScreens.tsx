import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {
  RoutePath,
  type MainTabScreenProps,
  type RootStackScreenProps,
} from '@core/navigation';
import {
  ListRow,
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';
import {
  loadCommunityFeed,
  selectCommunityError,
  selectCommunityFeed,
  selectCommunityLoading,
} from '../communitySlice';

type CommunityDispatch = ThunkDispatch<
  {community: {feed: unknown[]; loading: boolean; error: string | null}},
  unknown,
  UnknownAction
>;

const MOCK_IMAGES = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
];

export function CommunityScreen({
  navigation,
}: MainTabScreenProps<'CommunityTab'>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<CommunityDispatch>();
  const feed = useSelector(selectCommunityFeed);
  const loading = useSelector(selectCommunityLoading);
  const error = useSelector(selectCommunityError);

  useEffect(() => {
    dispatch(loadCommunityFeed());
  }, [dispatch]);

  return (
    <ScreenContainer>
      <SectionTitle title={t('communityTitle')} />
      <PrimaryButton
        title={t('publish')}
        onPress={() => navigation.navigate(RoutePath.communityPublish)}
      />
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={feed}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ListRow
              title={item.author}
              subtitle={`${item.content} · ${item.likes} likes · ${item.source}`}
              onPress={() => {
                if (item.videoUrl) {
                  navigation.navigate(RoutePath.communityVideoPlay, {
                    url: item.videoUrl,
                    title: item.author,
                  });
                } else if (item.images?.length) {
                  navigation.navigate(RoutePath.imagePreview, {
                    uris: item.images,
                    initialIndex: 0,
                  });
                }
              }}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

export function CommunityPublishScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.communityPublish>) {
  const {t} = useTranslation();
  const [content, setContent] = useState('');

  return (
    <ScreenContainer>
      <SectionTitle title={t('publish')} />
      <TextInput
        style={styles.input}
        placeholder={t('publishPlaceholder')}
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Text style={styles.hint}>{t('publishImageHint')}</Text>
      <View style={styles.previewRow}>
        {MOCK_IMAGES.map(uri => (
          <View key={uri} style={styles.thumb}>
            <Text style={styles.thumbLabel}>IMG</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        title={t('publishSubmit')}
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

export function CommunityVideoPlayScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.communityVideoPlay>) {
  const {t} = useTranslation();
  const url = route.params?.url ?? '';
  const title = route.params?.title ?? t('communityVideoPlay');

  return (
    <ScreenContainer>
      <SectionTitle title={title} />
      <Text style={styles.hint}>{t('communityVideoFacadeHint')}</Text>
      <Text style={styles.videoUrl}>{url}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 12,
    ...typography.body,
  },
  hint: {...typography.caption, color: colors.textMuted, marginBottom: 12},
  previewRow: {flexDirection: 'row', gap: 8, marginBottom: 16},
  thumb: {
    width: 72,
    height: 72,
    backgroundColor: colors.divider,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbLabel: {...typography.caption},
  error: {...typography.body, color: colors.error},
  videoUrl: {...typography.caption, marginTop: 8},
});

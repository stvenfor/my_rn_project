import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {chatTheme} from '../theme/chatTheme';

const {width, height} = Dimensions.get('window');

export function ImagePreviewScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.imagePreview>) {
  const navigation = useNavigation();
  const uris =
    route.params?.uris && route.params.uris.length > 0
      ? route.params.uris
      : route.params?.imageUrl
      ? [route.params.imageUrl]
      : [];
  const initialIndex = Math.min(
    Math.max(route.params?.initialIndex ?? 0, 0),
    Math.max(uris.length - 1, 0),
  );
  const [index, setIndex] = useState(initialIndex);
  const listRef = useRef<FlatList<string>>(null);

  const title = uris.length > 1 ? `${index + 1}/${uris.length}` : undefined;

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index && next >= 0 && next < uris.length) {
      setIndex(next);
    }
  };

  return (
    <AppPageScaffold
      layout="fullBleed"
      backgroundColor={chatTheme.previewBlack}
      navBar={
        <AppNavBar
          style="dark"
          title={title}
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      {uris.length === 0 ? (
        <View style={styles.empty} />
      ) : (
        <FlatList
          ref={listRef}
          data={uris}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          keyExtractor={(item, i) => `${item}-${i}`}
          onMomentumScrollEnd={onMomentumEnd}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.page}>
              <Image
                source={{uri: item}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
        />
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  empty: {flex: 1},
  page: {
    width,
    height: height - 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width, height: height * 0.7},
});

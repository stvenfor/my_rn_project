import React, {useState} from 'react';
import {Dimensions, FlatList, Image, Pressable, StyleSheet} from 'react-native';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {ScreenContainer, SectionTitle} from '@ui/design-system';

const {width} = Dimensions.get('window');

export function ImagePreviewScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.imagePreview>) {
  const uris = route.params?.uris ?? [];
  const initialIndex = route.params?.initialIndex ?? 0;
  const [index, setIndex] = useState(initialIndex);

  return (
    <ScreenContainer>
      <SectionTitle title={`${index + 1} / ${uris.length}`} />
      <Image
        source={{uri: uris[index]}}
        style={styles.image}
        resizeMode="contain"
      />
      <FlatList
        horizontal
        data={uris}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        renderItem={({item, index: i}) => (
          <Pressable onPress={() => setIndex(i)}>
            <Image
              source={{uri: item}}
              style={[styles.thumb, i === index && styles.thumbActive]}
            />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  image: {width: width - 32, height: width, marginBottom: 16},
  thumb: {
    width: 56,
    height: 56,
    marginRight: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  thumbActive: {opacity: 1, borderWidth: 2, borderColor: '#4A90E2'},
});

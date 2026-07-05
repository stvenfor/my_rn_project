import React from 'react';
import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {communityTheme} from '../theme/communityTheme';

interface ImageGridProps {
  images: string[];
  postId: string;
}

const screenWidth = Dimensions.get('window').width;

function openPreview(
  navigation: StackNavigationProp<RootStackParamList>,
  images: string[],
  index: number,
) {
  navigation.navigate(RoutePath.imagePreview, {
    uris: images,
    initialIndex: index,
  });
}

function SingleImage({
  url,
  images,
  index,
}: {
  url: string;
  images: string[];
  index: number;
}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const maxWidth = screenWidth * communityTheme.singleImageMaxWidthRatio;

  return (
    <Pressable onPress={() => openPreview(navigation, images, index)}>
      <Image
        source={{uri: url}}
        style={[styles.singleImage, {maxWidth}]}
        resizeMode="cover"
      />
    </Pressable>
  );
}

function RowImages({urls}: {urls: string[]}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.row}>
      {urls.map((url, index) => (
        <View
          key={`${url}-${index}`}
          style={[styles.rowItem, index > 0 && styles.rowItemGap]}>
          <Pressable
            style={styles.square}
            onPress={() => openPreview(navigation, urls, index)}>
            <Image source={{uri: url}} style={styles.fill} resizeMode="cover" />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function GridImages({urls, columns}: {urls: string[]; columns: number}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.grid}>
      {urls.map((url, index) => (
        <Pressable
          key={`${url}-${index}`}
          style={[
            styles.gridItem,
            {
              width: `${100 / columns}%`,
              paddingRight:
                (index + 1) % columns === 0 ? 0 : communityTheme.imageGap,
              paddingBottom: communityTheme.imageGap,
            },
          ]}
          onPress={() => openPreview(navigation, urls, index)}>
          <Image
            source={{uri: url}}
            style={styles.gridImage}
            resizeMode="cover"
          />
        </Pressable>
      ))}
    </View>
  );
}

export function ImageGrid({images}: ImageGridProps) {
  if (images.length === 0) {
    return null;
  }
  const count = images.length;

  if (count === 1) {
    return <SingleImage url={images[0]} images={images} index={0} />;
  }
  if (count <= 3) {
    return <RowImages urls={images} />;
  }
  if (count === 4) {
    return <GridImages urls={images} columns={2} />;
  }
  return <GridImages urls={images} columns={3} />;
}

const styles = StyleSheet.create({
  singleImage: {
    width: '100%',
    maxHeight: communityTheme.singleImageMaxHeight,
    borderRadius: communityTheme.imageRadiusSingle,
    backgroundColor: communityTheme.dividerColor,
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
  },
  rowItemGap: {
    marginLeft: communityTheme.imageGap,
  },
  square: {
    aspectRatio: 1,
    borderRadius: communityTheme.imageRadiusGrid,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {},
  gridImage: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: communityTheme.imageRadiusGrid,
    backgroundColor: communityTheme.dividerColor,
  },
});

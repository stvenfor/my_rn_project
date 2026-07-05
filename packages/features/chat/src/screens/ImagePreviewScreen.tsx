import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
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
  const imageUrl =
    route.params?.imageUrl ??
    route.params?.uris?.[route.params?.initialIndex ?? 0] ??
    '';
  const [scale, setScale] = useState(1);

  return (
    <AppPageScaffold
      layout="fullBleed"
      backgroundColor={chatTheme.previewBlack}
      navBar={
        <AppNavBar
          style="dark"
          showBackButton
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView
        contentContainerStyle={styles.scroll}
        maximumZoomScale={4}
        minimumZoomScale={0.5}
        centerContent
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pinchGestureEnabled
        onScrollEndDrag={e => {
          const zoom = (e.nativeEvent as {zoomScale?: number}).zoomScale;
          if (zoom) {
            setScale(zoom);
          }
        }}>
        <Image
          source={{uri: imageUrl}}
          style={[styles.image, {transform: [{scale}]}]}
          resizeMode="contain"
        />
      </ScrollView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height - 80,
  },
  image: {width: width, height: height * 0.7},
});

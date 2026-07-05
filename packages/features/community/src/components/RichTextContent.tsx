import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {parseRichText} from '../services/richTextParser';
import {communityTheme, communityTypography} from '../theme/communityTheme';

interface RichTextContentProps {
  content: string;
  numberOfLines?: number;
}

export function RichTextContent({
  content,
  numberOfLines,
}: RichTextContentProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const segments = parseRichText(content);

  return (
    <Text style={communityTypography.body} numberOfLines={numberOfLines}>
      {segments.map((segment, index) => {
        if (segment.type === 'mention') {
          return (
            <Text
              key={`${segment.type}-${index}`}
              style={styles.link}
              onPress={() =>
                AppToast.show(`用户主页：@${segment.payload ?? ''}`)
              }>
              {segment.text}
            </Text>
          );
        }
        if (segment.type === 'hashtag') {
          return (
            <Text
              key={`${segment.type}-${index}`}
              style={styles.link}
              onPress={() => AppToast.show(`话题：#${segment.payload ?? ''}`)}>
              {segment.text}
            </Text>
          );
        }
        if (segment.type === 'link') {
          return (
            <Text
              key={`${segment.type}-${index}`}
              style={styles.linkUnderline}
              onPress={() =>
                navigation.navigate(RoutePath.web, {
                  url: segment.payload ?? segment.text,
                  title: '链接',
                })
              }>
              {segment.text}
            </Text>
          );
        }
        return <Text key={`plain-${index}`}>{segment.text}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {
    color: communityTheme.linkColor,
    fontWeight: '500',
  },
  linkUnderline: {
    color: communityTheme.linkColor,
    textDecorationLine: 'underline',
  },
});

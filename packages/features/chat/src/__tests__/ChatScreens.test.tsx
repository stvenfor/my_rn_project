import React from 'react';
import renderer from 'react-test-renderer';
import {ChatScreen} from '../screens/ChatScreen';
import {ChatDetailScreen} from '../screens/ChatDetailScreen';
import {ImagePreviewScreen} from '../screens/ImagePreviewScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({
      chat: {conversations: [], loading: false, error: null},
      chatDetail: {
        messages: [],
        loading: false,
        inputText: '',
        inputPanelMode: 'text',
        isRecordingVoice: false,
        recordDurationSeconds: 0,
        playingVoiceId: null,
        actionSheetMessage: null,
      },
    }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: jest.fn()}),
  useFocusEffect: (cb: () => void) => {
    cb();
  },
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    chatDetail: 'ChatDetail',
    imagePreview: 'ImagePreview',
  },
}));

describe('Chat screens smoke', () => {
  it('renders chat list', () => {
    const navigation = {navigate: jest.fn()};
    const tree = renderer
      .create(
        <ChatScreen
          navigation={navigation as never}
          route={{key: 'k', name: 'ChatTab', params: undefined}}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders chat detail', () => {
    const navigation = {navigate: jest.fn(), goBack: jest.fn()};
    const tree = renderer
      .create(
        <ChatDetailScreen
          navigation={navigation as never}
          route={{
            key: 'k',
            name: 'ChatDetail',
            params: {
              conversationId: 'private_mock_peer_01',
              title: 'Mock',
              portraitUrl: 'https://example.com/a.png',
              isOnline: true,
            },
          }}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders image preview', () => {
    const tree = renderer
      .create(
        <ImagePreviewScreen
          navigation={{goBack: jest.fn()} as never}
          route={{
            key: 'k',
            name: 'ImagePreview',
            params: {imageUrl: 'https://example.com/img.png'},
          }}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });
});

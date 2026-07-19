import React from 'react';
import renderer from 'react-test-renderer';
import {FriendScreen} from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: jest.fn()}),
}));

describe('FriendScreen smoke', () => {
  it('renders stub label', () => {
    const tree = renderer.create(<FriendScreen />).toJSON();
    expect(tree).toBeTruthy();
  });
});

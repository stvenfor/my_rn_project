import React from 'react';
import renderer from 'react-test-renderer';
import {PayScreen} from '../PayScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: jest.fn()}),
}));

jest.mock('../payService', () => ({
  getPayService: () => ({
    pay: jest.fn(async () => ({transactionId: 'mock_tx_1'})),
  }),
}));

describe('PayScreen smoke', () => {
  it('renders pay methods', () => {
    const tree = renderer.create(<PayScreen />).toJSON();
    expect(tree).toBeTruthy();
  });
});

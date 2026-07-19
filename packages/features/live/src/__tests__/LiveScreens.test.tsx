import React from 'react';
import renderer from 'react-test-renderer';
import {LiveScreen} from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('@core/realtime', () => ({
  getRealtimeAdapter: () => ({
    connect: jest.fn(async () => undefined),
    disconnect: jest.fn(),
    subscribe: () => () => undefined,
    sendSignal: jest.fn(async () => undefined),
    getConnectionState: () => 'connected',
    getSignals: () => [],
  }),
}));

describe('LiveScreen smoke', () => {
  it('renders room list rows', () => {
    const navigation = {navigate: jest.fn(), goBack: jest.fn()};
    const tree = renderer
      .create(
        <LiveScreen navigation={navigation as never} route={{} as never} />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });
});

import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {HomeStrategyScreen} from '../screens/HomeStrategyScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

describe('HomeStrategyScreen', () => {
  it('renders Flutter-aligned intro, gauge label, and footnote', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HomeStrategyScreen
          navigation={{goBack: jest.fn()} as never}
          route={{key: 'k', name: 'HomeStrategy', params: undefined}}
        />,
      );
    });
    const text = tree!.root
      .findAllByType(require('react-native').Text)
      .map(n => String(n.props.children))
      .join('\n');
    expect(text).toContain('大类资产九宫格策略');
    expect(text).toContain('63 中立');
    expect(text).toContain('在恐慌时买入、贪婪时卖出');
  });
});

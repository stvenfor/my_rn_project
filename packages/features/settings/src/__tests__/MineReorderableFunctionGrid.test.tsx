import React from 'react';
import renderer from 'react-test-renderer';
import {MineReorderableFunctionGrid} from '../components/MineReorderableFunctionGrid';
import type {MineFunctionItem} from '../models/mineFunctionItem';

jest.mock('react-native-gesture-handler', () => {
  const ReactMock = require('react');
  const {View} = require('react-native');

  const createHandler = (displayName: string) => {
    const Handler = ReactMock.forwardRef(
      ({children, ...props}: {children?: React.ReactNode}, ref: unknown) =>
        ReactMock.createElement(View, {...props, ref, testID: displayName}, children),
    );
    Handler.displayName = displayName;
    return Handler;
  };

  return {
    PanGestureHandler: createHandler('PanGestureHandler'),
    TapGestureHandler: createHandler('TapGestureHandler'),
    State: {END: 5, ACTIVE: 4, FAILED: 1, CANCELLED: 3},
  };
});

jest.mock('../assets/settingsAssets', () => ({
  mineFunctionIcons: {
    sms: 1,
    calculator: 2,
  },
}));

const sampleItems: MineFunctionItem[] = [
  {
    id: 'sms',
    title: '短信模板',
    subtitle: '一键发送 轻松快捷',
    accentColor: '#E8F8EF',
    iconColor: '#52C41A',
    iconKey: 'sms',
  },
  {
    id: 'calculator',
    title: '购车计算器',
    subtitle: '全款/贷款/保险全能算',
    accentColor: '#E8F0FF',
    iconColor: '#1890FF',
    iconKey: 'calculator',
  },
];

describe('MineReorderableFunctionGrid', () => {
  it('renders gesture-handler cells for each item', () => {
    const tree = renderer.create(
      <MineReorderableFunctionGrid
        items={sampleItems}
        onReorder={jest.fn()}
        onItemTap={jest.fn()}
        onDragActiveChange={jest.fn()}
      />,
    );

    const panHandlers = tree.root.findAllByProps({testID: 'PanGestureHandler'});
    expect(panHandlers.length).toBeGreaterThanOrEqual(sampleItems.length);
  });
});

import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {HomeClubTabContent} from '../components/HomeClubTabContent';

describe('HomeClubTabContent', () => {
  it('exposes community entry via join and footer CTA', () => {
    const onOpenCommunity = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HomeClubTabContent onOpenCommunity={onOpenCommunity} />,
      );
    });
    const labels = tree!.root
      .findAllByType(require('react-native').Text)
      .map(node => node.props.children)
      .flat();
    expect(labels).toContain('进入社区查看更多');
    expect(labels).toContain('+ 加入');

    const pressables = tree!.root.findAllByType(
      require('react-native').Pressable,
    );
    act(() => {
      pressables[0].props.onPress?.();
    });
    act(() => {
      pressables[pressables.length - 1].props.onPress?.();
    });
    expect(onOpenCommunity).toHaveBeenCalledTimes(2);
  });
});

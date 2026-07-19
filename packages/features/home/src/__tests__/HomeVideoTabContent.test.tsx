import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {HomeVideoTabContent} from '../components/HomeVideoTabContent';

describe('HomeVideoTabContent', () => {
  it('matches Flutter daily/course structure markers', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<HomeVideoTabContent onOpenDubbing={jest.fn()} />);
    });
    const labels = tree!.root
      .findAllByType(require('react-native').Text)
      .map(node => String(node.props.children))
      .join(' ');
    expect(labels).toContain('直播中');
    expect(labels).toContain('回放');
    expect(labels).toContain('V 会员专属');
    expect(labels).toContain('进入配音视频专区');
  });
});

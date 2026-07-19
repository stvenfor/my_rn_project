import React from 'react';
import {Text} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {MediaSourceBottomSheet} from '../components/MediaSourceBottomSheet';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 34, left: 0, right: 0}),
}));

jest.mock('../components/mineIcons', () => ({
  MineIcon: () => null,
}));

describe('MediaSourceBottomSheet', () => {
  it('calls onClose when cancel is pressed', () => {
    const onClose = jest.fn();
    const onPick = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <MediaSourceBottomSheet visible onPick={onPick} onClose={onClose} />,
      );
    });

    const cancel = tree!.root.findByProps({testID: 'media-source-cancel'});
    act(() => {
      cancel.props.onPress();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <MediaSourceBottomSheet visible onPick={jest.fn()} onClose={onClose} />,
      );
    });

    const backdrop = tree!.root.findByProps({
      testID: 'media-source-backdrop',
    });
    act(() => {
      backdrop.props.onPress();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onPick for gallery and camera', () => {
    const onPick = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <MediaSourceBottomSheet visible onPick={onPick} onClose={jest.fn()} />,
      );
    });

    act(() => {
      tree!.root.findByProps({testID: 'media-source-gallery'}).props.onPress();
      tree!.root.findByProps({testID: 'media-source-camera'}).props.onPress();
    });

    expect(onPick).toHaveBeenCalledWith('gallery');
    expect(onPick).toHaveBeenCalledWith('camera');
  });

  it('renders cancel label', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <MediaSourceBottomSheet
          visible
          onPick={jest.fn()}
          onClose={jest.fn()}
        />,
      );
    });
    const labels = tree!.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(labels).toContain('取消');
  });
});

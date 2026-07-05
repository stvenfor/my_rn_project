import React from 'react';
import {Pressable, Text} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {AppNavBar} from '../AppNavBar';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 20, bottom: 0, left: 0, right: 0}),
}));

function findText(tree: renderer.ReactTestRendererJSON | null, text: string) {
  if (!tree) {
    return null;
  }
  if (tree.type === 'Text' && tree.children?.includes(text)) {
    return tree;
  }
  if (!tree.children) {
    return null;
  }
  for (const child of tree.children) {
    if (typeof child === 'string') {
      continue;
    }
    const found = findText(child, text);
    if (found) {
      return found;
    }
  }
  return null;
}

function findNodeByAccessibilityLabel(
  tree: renderer.ReactTestRendererJSON | null,
  label: string,
): {onPress?: () => void} | null {
  if (!tree) {
    return null;
  }
  if (tree.props?.accessibilityLabel === label) {
    return tree.props;
  }
  if (!tree.children) {
    return null;
  }
  for (const child of tree.children) {
    if (typeof child === 'string') {
      continue;
    }
    const found = findNodeByAccessibilityLabel(child, label);
    if (found) {
      return found;
    }
  }
  return null;
}

describe('AppNavBar', () => {
  it('renders title text', () => {
    const tree = renderer.create(<AppNavBar title="社区" />).toJSON();
    expect(findText(tree, '社区')).toBeTruthy();
  });

  it('renders titleComponent instead of title string', () => {
    const tree = renderer
      .create(
        <AppNavBar
          titleComponent={<Text testID="custom-title">自定义标题</Text>}
        />,
      )
      .toJSON();
    expect(findText(tree, '自定义标题')).toBeTruthy();
  });

  it('shows back button and calls onBack', () => {
    const onBack = jest.fn();
    const root = renderer.create(
      <AppNavBar title="设置" showBackButton onBack={onBack} />,
    );
    const back = root.root.findByProps({accessibilityLabel: '返回'});
    act(() => {
      back.props.onPress();
    });
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('prefers leading over default back button', () => {
    const onBack = jest.fn();
    const root = renderer.create(
      <AppNavBar
        title="全部服务"
        showBackButton
        onBack={onBack}
        leading={<Text testID="custom-leading">返回</Text>}
      />,
    );
    expect(findNodeByAccessibilityLabel(root.toJSON(), '返回')).toBeNull();
    expect(findText(root.toJSON(), '返回')).toBeTruthy();
  });

  it('renders right action slot', () => {
    const tree = renderer
      .create(
        <AppNavBar
          title="社区"
          right={
            <Pressable accessibilityLabel="发布">
              <Text>⊕</Text>
            </Pressable>
          }
        />,
      )
      .toJSON();
    expect(findNodeByAccessibilityLabel(tree, '发布')).toBeTruthy();
  });

  it('applies safe area top inset padding', () => {
    const tree = renderer.create(<AppNavBar title="微信" />).toJSON();
    expect(tree?.props?.style).toEqual(
      expect.arrayContaining([expect.objectContaining({paddingTop: 20})]),
    );
  });

  it('uses dark style foreground on back glyph', () => {
    const root = renderer.create(
      <AppNavBar style="dark" showBackButton onBack={jest.fn()} />,
    );
    act(() => {});
    const backGlyph = findText(root.toJSON(), '‹');
    expect(backGlyph?.props?.style).toEqual(
      expect.arrayContaining([expect.objectContaining({color: '#FFFFFF'})]),
    );
  });
});

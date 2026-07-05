import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import {ScreenContainer, SectionTitle} from '../index';

describe('deprecated layout helpers', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    warnSpy.mockClear();
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('warns once when ScreenContainer is used', () => {
    renderer.create(
      <ScreenContainer>
        <Text>legacy</Text>
      </ScreenContainer>,
    );
    renderer.create(
      <ScreenContainer>
        <Text>legacy again</Text>
      </ScreenContainer>,
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('ScreenContainer is deprecated');
    expect(warnSpy.mock.calls[0][0]).toContain('AppPageScaffold');
  });

  it('warns once when SectionTitle is used', () => {
    renderer.create(<SectionTitle title="旧标题" />);
    renderer.create(<SectionTitle title="又一个" />);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('SectionTitle is deprecated');
    expect(warnSpy.mock.calls[0][0]).toContain('AppNavBar');
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import {
  HomeLearningReportScreen,
  HomeCheckInMallScreen,
  HomeAllServicesScreen,
} from '../screens/HomeScreens';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    bfuiTemplate: 'BfuiTemplate',
    musicList: 'MusicList',
    shortVideo: 'ShortVideo',
  },
}));

describe('HomeScreens smoke', () => {
  it('renders learning report', () => {
    const tree = renderer.create(<HomeLearningReportScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders check-in mall', () => {
    const tree = renderer.create(<HomeCheckInMallScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders all services', () => {
    const navigation = {navigate: jest.fn()};
    const tree = renderer
      .create(
        <HomeAllServicesScreen
          navigation={navigation as never}
          route={{key: 'k', name: 'HomeAllServices', params: undefined}}
        />,
      )
      .toJSON();
    expect(tree).toBeTruthy();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import {HomeLearningReportScreen} from '../screens/HomeLearningReportScreen';
import {HomeCheckInMallScreen} from '../screens/HomeCheckInMallScreen';
import {HomeAllServicesScreen} from '../screens/HomeAllServicesScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: jest.fn()}),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({
      allServices: {favoriteItems: [], isEditing: false},
    }),
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    bfuiTemplate: 'BfuiTemplate',
    musicList: 'MusicList',
    homeAllServices: 'HomeAllServices',
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
    const navigation = {navigate: jest.fn(), goBack: jest.fn()};
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

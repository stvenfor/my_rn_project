import React from 'react';
import renderer from 'react-test-renderer';
import {MineScreen} from '../screens/MineScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 44, bottom: 34, left: 0, right: 0}),
}));

jest.mock('react-native-gesture-handler', () => {
  const ReactMock = require('react');
  const RN = require('react-native');
  const createHandler = (displayName: string) => {
    const Handler = ReactMock.forwardRef(
      ({children, ...props}: {children?: React.ReactNode}, ref: unknown) =>
        ReactMock.createElement(
          RN.View,
          {...props, ref, testID: displayName},
          children,
        ),
    );
    Handler.displayName = displayName;
    return Handler;
  };
  return {
    ScrollView: RN.ScrollView,
    PanGestureHandler: createHandler('PanGestureHandler'),
    TapGestureHandler: createHandler('TapGestureHandler'),
    State: {END: 5, ACTIVE: 4, FAILED: 1, CANCELLED: 3},
  };
});

jest.mock('../components/MineReorderableFunctionGrid', () => ({
  MineReorderableFunctionGrid: ({items}: {items: Array<{id: string}>}) => {
    const {View, Text} = require('react-native');
    return (
      <View testID="MineReorderableFunctionGrid">
        {items.map(item => (
          <Text key={item.id}>{item.id}</Text>
        ))}
      </View>
    );
  },
}));

jest.mock('../assets/settingsAssets', () => ({
  mineFunctionIcons: {
    sms: 1,
    calculator: 2,
    used_car: 3,
    short_video: 4,
    after_sales: 5,
    qr_pay: 6,
    qa: 7,
    poster: 8,
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn: (state: unknown) => unknown) =>
    fn({
      mine: {
        profile: {
          displayName: '访客',
          avatarUrl: null,
          roleBadge: '未登录',
          storeName: '登录后查看门店信息',
          maskedPhone: '— — —',
          stats: [
            {value: '0', label: '加入天数'},
            {value: '0', label: '员工数'},
            {value: '0', label: '店铺天数'},
            {value: '0', label: '累计客户'},
          ],
        },
        functions: [
          {
            id: 'sms',
            title: '短信模板',
            subtitle: '一键发送 轻松快捷',
            accentColor: '#E8F8EF',
            iconColor: '#52C41A',
            iconKey: 'sms',
          },
        ],
        selectedStoreId: 'ward_longding',
        initialized: true,
      },
    }),
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    settings: 'Settings',
    mineHttpTest: 'MineHttpTest',
    personalizedSettings: 'PersonalizedSettings',
    login: 'Login',
    shortVideo: 'ShortVideo',
    homeUsedCarList: 'HomeUsedCarList',
  },
  LoginRedirect: {
    setPending: jest.fn(),
    clear: jest.fn(),
    peek: jest.fn(),
    takePending: jest.fn(),
  },
}));

describe('MineScreen', () => {
  it('renders guest profile header, quick services, functions, and menu list', () => {
    const tree = renderer.create(
      <MineScreen
        navigation={{navigate: jest.fn()} as never}
        route={{key: 'mine', name: 'MineTab', params: undefined}}
        isLoggedIn={false}
        user={null}
        onLogout={async () => {}}
        onUpdateAvatar={() => {}}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});

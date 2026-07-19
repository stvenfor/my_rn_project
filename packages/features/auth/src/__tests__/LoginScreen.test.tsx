import React from 'react';
import renderer from 'react-test-renderer';
import {LoginScreen} from '../screens/LoginScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn: (state: unknown) => unknown) =>
    fn({
      auth: {
        user: null,
        isLoading: false,
        agreedPrivacy: true,
        credentialMode: 'email',
        email: '454655062@qq.com',
        phone: '13477525645',
        password: '123456',
        confirmPassword: '123456',
        displayName: '',
        otpCode: '',
        otpCooldownSeconds: 0,
        phoneOtpSent: false,
        pendingEmail: '',
        pendingPhone: '',
      },
    }),
}));

jest.mock('@ui/design-system', () => {
  const {View} = require('react-native');
  return {
    AppPageScaffold: ({children}: {children: React.ReactNode}) => (
      <View>{children}</View>
    ),
    AppToast: {show: jest.fn()},
  };
});

jest.mock('../utils/authGreeting', () => ({
  buildAuthGreeting: () => '下午好，欢迎使用i车商',
}));

describe('LoginScreen', () => {
  it('renders login greeting snapshot', () => {
    const navigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    };
    const tree = renderer
      .create(
        <LoginScreen navigation={navigation as never} route={{} as never} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

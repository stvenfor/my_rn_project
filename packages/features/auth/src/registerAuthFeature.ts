import type {FeatureRegistration, StackScreenComponent} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {authReducer} from './authSlice';
import {LoginScreen} from './screens/LoginScreen';
import {LoginPasswordScreen} from './screens/LoginPasswordScreen';
import {LoginOtpScreen} from './screens/LoginOtpScreen';
import {RegisterScreen} from './screens/RegisterScreen';

export function registerAuthFeature(): FeatureRegistration {
  return {
    moduleId: 'auth',
    reducer: {key: 'auth', reducer: authReducer},
    routes: [
      {name: RoutePath.login, component: LoginScreen as StackScreenComponent},
      {
        name: RoutePath.loginPassword,
        component: LoginPasswordScreen as StackScreenComponent,
      },
      {
        name: RoutePath.loginOtp,
        component: LoginOtpScreen as StackScreenComponent,
      },
      {
        name: RoutePath.register,
        component: RegisterScreen as StackScreenComponent,
      },
    ],
  };
}

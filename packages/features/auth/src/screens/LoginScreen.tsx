import React, {useMemo} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {
  AuthFilledInput,
  AuthPrimaryButton,
} from '../components/AuthFormControls';
import {AuthLockIcon, AuthMailIcon} from '../components/AuthIcons';
import {AuthPrivacyRow} from '../components/AuthPrivacyRow';
import {
  AuthSegmentedControl,
  LOGIN_SEGMENTS,
} from '../components/AuthSegmentedControl';
import {LoginFooterLinks} from '../components/LoginFooterLinks';
import {PhoneOtpFormSection} from '../components/PhoneOtpFormSection';
import {
  canLoginWithEmailPassword,
  canLoginWithPhoneOtp,
  loginWithPasswordThunk,
  selectAgreedPrivacy,
  selectAuthEmail,
  selectAuthLoading,
  selectAuthPassword,
  selectCanLoginWithEmail,
  selectCanLoginWithPhoneOtp,
  selectCredentialMode,
  switchCredentialMode,
  togglePrivacy,
  updateEmail,
  updatePassword,
  verifyPhoneOtpThunk,
  type AuthState,
} from '../authSlice';
import {isAccountNotRegisteredFailure} from '../models/authFailure';
import {navigateAfterAuth} from '../services/authNavigation';
import {buildAuthGreeting} from '../utils/authGreeting';
import {authTextStyles, authTheme} from '../theme/authTheme';
import {normalizeDigits} from '../utils/phoneAuthUtils';

type AuthDispatch = ThunkDispatch<{auth: AuthState}, unknown, UnknownAction>;

export function LoginScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.login>) {
  const dispatch = useDispatch<AuthDispatch>();
  const insets = useSafeAreaInsets();
  const credentialMode = useSelector(selectCredentialMode);
  const email = useSelector(selectAuthEmail);
  const password = useSelector(selectAuthPassword);
  const agreedPrivacy = useSelector(selectAgreedPrivacy);
  const isLoading = useSelector(selectAuthLoading);
  const canEmail = useSelector(selectCanLoginWithEmail);
  const canPhone = useSelector(selectCanLoginWithPhoneOtp);
  const authState = useSelector((state: {auth: AuthState}) => state.auth);
  const greeting = useMemo(() => buildAuthGreeting(), []);

  const enabled =
    !isLoading && (credentialMode === 'email' ? canEmail : canPhone);

  const showLoginFailure = (error: unknown) => {
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as {message: string}).message)
        : '操作失败，请稍后重试';
    AppToast.show(message);
    if (isAccountNotRegisteredFailure(error)) {
      Alert.alert('提示', message, [
        {text: '取消', style: 'cancel'},
        {
          text: '去注册',
          onPress: () => navigation.navigate(RoutePath.register),
        },
      ]);
    }
  };

  const onPrimaryPress = async () => {
    if (credentialMode === 'email') {
      const validationError = canLoginWithEmailPassword(authState);
      if (validationError) {
        AppToast.show(validationError);
        return;
      }
      const result = await dispatch(loginWithPasswordThunk({email, password}));
      if (loginWithPasswordThunk.fulfilled.match(result)) {
        navigateAfterAuth(navigation);
        return;
      }
      if (loginWithPasswordThunk.rejected.match(result)) {
        showLoginFailure(result.payload);
      }
      return;
    }

    const validationError = canLoginWithPhoneOtp(authState);
    if (validationError) {
      AppToast.show(validationError);
      return;
    }

    const result = await dispatch(
      verifyPhoneOtpThunk({
        phone: normalizeDigits(authState.pendingPhone || authState.phone),
        otp: authState.otpCode,
      }),
    );
    if (verifyPhoneOtpThunk.fulfilled.match(result)) {
      navigateAfterAuth(navigation);
      return;
    }
    if (verifyPhoneOtpThunk.rejected.match(result)) {
      showLoginFailure(result.payload);
    }
  };

  return (
    <AppPageScaffold layout="edgeToEdge" backgroundColor={authTheme.background}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 32,
              paddingBottom: 24 + insets.bottom,
            },
          ]}>
          <Text style={authTextStyles.largeTitle}>{greeting}</Text>
          <View style={styles.gap8} />
          <Text style={authTextStyles.subtitle}>登录以继续使用</Text>
          <View style={styles.gap40} />
          <AuthSegmentedControl
            value={credentialMode}
            segments={LOGIN_SEGMENTS}
            onChange={mode =>
              dispatch(switchCredentialMode(mode as 'email' | 'phone'))
            }
          />
          <View style={styles.gap24} />
          {credentialMode === 'email' ? (
            <View>
              <AuthFilledInput
                value={email}
                onChangeText={value => dispatch(updateEmail(value))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="邮箱"
                prefix={<AuthMailIcon />}
              />
              <View style={styles.gap16} />
              <AuthFilledInput
                value={password}
                onChangeText={value => dispatch(updatePassword(value))}
                secureTextEntry
                placeholder="密码"
                prefix={<AuthLockIcon />}
              />
            </View>
          ) : (
            <PhoneOtpFormSection />
          )}
          <View style={styles.gap24} />
          <AuthPrivacyRow
            checked={agreedPrivacy}
            onToggle={value => dispatch(togglePrivacy(value))}
          />
          <View style={styles.gap32} />
          <AuthPrimaryButton
            title="登录"
            onPress={onPrimaryPress}
            disabled={!enabled}
            loading={isLoading}
          />
          <View style={styles.gap24} />
          <LoginFooterLinks navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  scrollContent: {
    paddingHorizontal: authTheme.horizontalPadding,
  },
  gap8: {height: 8},
  gap16: {height: 16},
  gap24: {height: 24},
  gap32: {height: 32},
  gap40: {height: 40},
});

import React, {useMemo} from 'react';
import {
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
import {AuthPhoneInput, AuthPrimaryButton, AuthUnderlineInput} from '../components/AuthFormControls';
import {AuthPrivacyRow} from '../components/AuthPrivacyRow';
import {AuthSegmentedControl} from '../components/AuthSegmentedControl';
import {LoginFooterLinks} from '../components/LoginFooterLinks';
import {
  canProceedToPassword,
  canSendPhoneOtp,
  sendPhoneOtpThunk,
  selectAgreedPrivacy,
  selectAuthEmail,
  selectAuthLoading,
  selectAuthPhone,
  selectCredentialMode,
  setPendingEmail,
  switchCredentialMode,
  togglePrivacy,
  updateEmail,
  updatePhone,
  type AuthState,
} from '../authSlice';
import {buildAuthGreeting} from '../utils/authGreeting';
import {authTheme} from '../theme/authTheme';

type AuthDispatch = ThunkDispatch<{auth: AuthState}, unknown, UnknownAction>;

export function LoginScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.login>) {
  const dispatch = useDispatch<AuthDispatch>();
  const insets = useSafeAreaInsets();
  const credentialMode = useSelector(selectCredentialMode);
  const email = useSelector(selectAuthEmail);
  const phone = useSelector(selectAuthPhone);
  const agreedPrivacy = useSelector(selectAgreedPrivacy);
  const isLoading = useSelector(selectAuthLoading);
  const authState = useSelector((state: {auth: AuthState}) => state.auth);
  const greeting = useMemo(() => buildAuthGreeting(), []);

  const onPrimaryPress = async () => {
    if (credentialMode === 'email') {
      const validationError = canProceedToPassword(authState);
      if (validationError) {
        AppToast.show(validationError);
        return;
      }
      dispatch(setPendingEmail(email));
      navigation.navigate(RoutePath.loginPassword, {email: email.trim()});
      return;
    }

    const validationError = canSendPhoneOtp(authState);
    if (validationError) {
      AppToast.show(validationError);
      return;
    }

    const result = await dispatch(sendPhoneOtpThunk({phone}));
    if (sendPhoneOtpThunk.fulfilled.match(result)) {
      AppToast.show('验证码已发送');
      navigation.navigate(RoutePath.loginOtp, {phone: result.payload.phone});
      return;
    }

    if (sendPhoneOtpThunk.rejected.match(result)) {
      const error = result.payload;
      AppToast.show(
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '操作失败，请稍后重试',
      );
    }
  };

  return (
    <AppPageScaffold
      layout="edgeToEdge"
      backgroundColor={authTheme.screenBackground}>
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
              paddingTop: insets.top + 48,
              paddingBottom: 24 + insets.bottom,
            },
          ]}>
          <Text style={styles.greeting}>{greeting}</Text>
          <View style={styles.gap32} />
          <AuthSegmentedControl
            value={credentialMode}
            onChange={mode => dispatch(switchCredentialMode(mode))}
          />
          <View style={styles.gap32} />
          {credentialMode === 'email' ? (
            <AuthUnderlineInput
              value={email}
              onChangeText={value => dispatch(updateEmail(value))}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="请输入邮箱"
              prefix={<Text style={styles.prefixIcon}>✉</Text>}
            />
          ) : (
            <AuthPhoneInput
              value={phone}
              onChangeText={value => dispatch(updatePhone(value))}
            />
          )}
          <View style={styles.gap24} />
          <AuthPrivacyRow
            checked={agreedPrivacy}
            onToggle={value => dispatch(togglePrivacy(value))}
          />
          <View style={styles.gap32} />
          <AuthPrimaryButton
            title={credentialMode === 'email' ? '下一步' : '获取验证码'}
            onPress={onPrimaryPress}
            loading={isLoading}
          />
          <View style={styles.gap20} />
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
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: authTheme.titleBlack,
    lineHeight: 34,
  },
  gap32: {height: 32},
  gap24: {height: 24},
  gap20: {height: 20},
  prefixIcon: {
    fontSize: 18,
    color: authTheme.textGray,
  },
});

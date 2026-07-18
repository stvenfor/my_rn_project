import React, {useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {USE_MOCK_AUTH} from '@core/config';
import {MOCK_OTP} from '@core/supabase';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  AuthPrimaryButton,
  AuthUnderlineInput,
} from '../components/AuthFormControls';
import {
  selectAuthLoading,
  selectAuthOtpCode,
  selectCanResendOtp,
  selectIsOtpValid,
  selectMaskedPendingPhone,
  selectOtpCooldownSeconds,
  selectPendingPhone,
  sendPhoneOtpThunk,
  tickOtpCooldown,
  updateOtpCode,
  verifyPhoneOtpThunk,
} from '../authSlice';
import {navigateAfterAuth} from '../services/authNavigation';
import {authTheme} from '../theme/authTheme';
import {isOtpValid} from '../utils/authValidation';
import {isValidChinaMobile, normalizeDigits} from '../utils/phoneAuthUtils';

type AuthDispatch = ThunkDispatch<{auth: unknown}, unknown, UnknownAction>;

const MOCK_TEST_PHONE = '13400000000';

/** Legacy route — white underline style; main login no longer navigates here. */
export function LoginOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.loginOtp>) {
  const dispatch = useDispatch<AuthDispatch>();
  const otpCode = useSelector(selectAuthOtpCode);
  const isLoading = useSelector(selectAuthLoading);
  const otpValid = useSelector(selectIsOtpValid);
  const canResend = useSelector(selectCanResendOtp);
  const cooldownSeconds = useSelector(selectOtpCooldownSeconds);
  const maskedPhone = useSelector(selectMaskedPendingPhone);
  const pendingPhone = useSelector(selectPendingPhone);
  const routePhone = route.params?.phone ?? '';
  const targetPhone =
    pendingPhone.length > 0 ? pendingPhone : normalizeDigits(routePhone);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      dispatch(tickOtpCooldown());
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds, dispatch]);

  const onVerify = async () => {
    if (!isOtpValid(otpCode)) {
      AppToast.show('请输入 6 位验证码');
      return;
    }
    if (!isValidChinaMobile(targetPhone)) {
      AppToast.show('手机号无效');
      return;
    }

    const result = await dispatch(
      verifyPhoneOtpThunk({phone: targetPhone, otp: otpCode}),
    );

    if (verifyPhoneOtpThunk.fulfilled.match(result)) {
      navigateAfterAuth(navigation);
      return;
    }

    if (verifyPhoneOtpThunk.rejected.match(result)) {
      const error = result.payload;
      AppToast.show(
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '操作失败，请稍后重试',
      );
    }
  };

  const onResend = async () => {
    if (!canResend) {
      return;
    }
    if (!isValidChinaMobile(targetPhone)) {
      AppToast.show('手机号无效');
      return;
    }

    const result = await dispatch(sendPhoneOtpThunk({phone: targetPhone}));
    if (sendPhoneOtpThunk.fulfilled.match(result)) {
      AppToast.show('验证码已重新发送');
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
    <AppPageScaffold backgroundColor={authTheme.legacyScreenBackground}>
      <AppNavBar
        showBackButton
        onBack={() => navigation.goBack()}
        backgroundColor={authTheme.legacyScreenBackground}
        foregroundColor={authTheme.titleBlack}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>输入验证码</Text>
          <View style={styles.gap12} />
          <Text style={styles.subtitle}>验证码已发送至 {maskedPhone}</Text>
          {USE_MOCK_AUTH ? (
            <>
              <View style={styles.gap8} />
              <Text style={styles.mockHint}>
                测试号 {MOCK_TEST_PHONE}，验证码 {MOCK_OTP}
              </Text>
            </>
          ) : null}
          <View style={styles.gap40} />
          <AuthUnderlineInput
            autoFocus
            value={otpCode}
            onChangeText={value =>
              dispatch(updateOtpCode(value.replace(/\D/g, '').slice(0, 6)))
            }
            keyboardType="number-pad"
            maxLength={6}
            placeholder="6 位验证码"
            style={styles.otpInput}
          />
          <View style={styles.gap16} />
          <View style={styles.resendRow}>
            <Pressable
              accessibilityRole="button"
              disabled={!canResend}
              onPress={onResend}>
              <Text
                style={[
                  styles.resendText,
                  !canResend && styles.resendTextDisabled,
                ]}>
                {cooldownSeconds > 0
                  ? `${cooldownSeconds}s 后重发`
                  : '重新发送'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.gap24} />
          <AuthPrimaryButton
            title="登录"
            onPress={onVerify}
            disabled={!otpValid}
            loading={isLoading}
            legacy
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  scrollContent: {
    paddingHorizontal: authTheme.legacyHorizontalPadding,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: authTheme.titleBlack,
  },
  gap12: {height: 12},
  gap8: {height: 8},
  gap40: {height: 40},
  gap16: {height: 16},
  gap24: {height: 24},
  subtitle: {
    fontSize: 14,
    color: authTheme.textGray,
  },
  mockHint: {
    fontSize: 13,
    color: authTheme.primaryBlue,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
  },
  resendRow: {
    alignItems: 'flex-end',
  },
  resendText: {
    fontSize: 14,
    color: authTheme.primaryBlue,
  },
  resendTextDisabled: {
    color: authTheme.textGray,
  },
});

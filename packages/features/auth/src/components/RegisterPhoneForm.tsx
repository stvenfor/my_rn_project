import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {AuthPhoneInput, AuthPrimaryButton} from './AuthFormControls';
import {AuthPrivacyRow} from './AuthPrivacyRow';
import {
  canSendPhoneOtp,
  sendPhoneOtpThunk,
  selectAgreedPrivacy,
  selectAuthLoading,
  selectAuthPhone,
  togglePrivacy,
  updatePhone,
  type AuthState,
} from '../authSlice';
import {authTheme} from '../theme/authTheme';

type AuthDispatch = ThunkDispatch<{auth: unknown}, unknown, UnknownAction>;

interface RegisterPhoneFormProps {
  navigation: RootStackScreenProps<typeof RoutePath.register>['navigation'];
  bottomInset: number;
}

export function RegisterPhoneForm({
  navigation,
  bottomInset,
}: RegisterPhoneFormProps) {
  const dispatch = useDispatch<AuthDispatch>();
  const phone = useSelector(selectAuthPhone);
  const agreedPrivacy = useSelector(selectAgreedPrivacy);
  const isLoading = useSelector(selectAuthLoading);
  const authState = useSelector((state: {auth: AuthState}) => state.auth);

  const onGetOtp = async () => {
    const validationError = canSendPhoneOtp(authState);
    if (validationError) {
      AppToast.show(validationError);
      return;
    }

    const result = await dispatch(
      sendPhoneOtpThunk({phone, fromRegister: true}),
    );

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: 24 + bottomInset},
        ]}>
        <Text style={styles.title}>手机号 + 短信验证码注册</Text>
        <Text style={styles.subtitle}>首次验证通过后将自动创建账号</Text>
        <View style={styles.gap24} />
        <AuthPhoneInput
          value={phone}
          onChangeText={value => dispatch(updatePhone(value))}
        />
        <View style={styles.gap24} />
        <AuthPrivacyRow
          checked={agreedPrivacy}
          onToggle={value => dispatch(togglePrivacy(value))}
        />
        <View style={styles.gap24} />
        <AuthPrimaryButton
          title="获取验证码"
          onPress={onGetOtp}
          loading={isLoading}
        />
        <Text
          style={styles.secondaryLink}
          onPress={() => navigation.navigate(RoutePath.login)}>
          已有账号？去登录
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  scrollContent: {
    paddingHorizontal: authTheme.horizontalPadding,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: authTheme.titleBlack,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: authTheme.textGray,
  },
  gap24: {height: 24},
  secondaryLink: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: authTheme.primaryBlue,
  },
});

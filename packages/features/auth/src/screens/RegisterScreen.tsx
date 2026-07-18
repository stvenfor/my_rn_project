import React, {useState} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {AuthBackButton} from '../components/AuthBackButton';
import {AuthPrimaryButton} from '../components/AuthFormControls';
import {
  AuthGroupedFormCard,
  AuthGroupedTextField,
  AuthPasswordToggle,
} from '../components/AuthGroupedForm';
import {AuthPrivacyRow} from '../components/AuthPrivacyRow';
import {
  AuthSegmentedControl,
  REGISTER_SEGMENTS,
} from '../components/AuthSegmentedControl';
import {PhoneOtpFormSection} from '../components/PhoneOtpFormSection';
import {
  canLoginWithPhoneOtp,
  canRegisterWithEmail,
  registerWithEmailThunk,
  selectAgreedPrivacy,
  selectAuthConfirmPassword,
  selectAuthDisplayName,
  selectAuthEmail,
  selectAuthLoading,
  selectAuthPassword,
  selectIsRegisterPasswordMatch,
  selectCanLoginWithPhoneOtp,
  togglePrivacy,
  updateConfirmPassword,
  updateDisplayName,
  updateEmail,
  updatePassword,
  verifyPhoneOtpThunk,
  type AuthState,
} from '../authSlice';
import {isEmailConfirmationFailure} from '../models/authFailure';
import {navigateAfterAuth} from '../services/authNavigation';
import {authTextStyles, authTheme} from '../theme/authTheme';
import {isPasswordValid} from '../utils/authValidation';
import {normalizeDigits} from '../utils/phoneAuthUtils';

type AuthDispatch = ThunkDispatch<{auth: AuthState}, unknown, UnknownAction>;
type RegisterTab = 'email' | 'phone';

export function RegisterScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.register>) {
  const dispatch = useDispatch<AuthDispatch>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RegisterTab>('email');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const email = useSelector(selectAuthEmail);
  const displayName = useSelector(selectAuthDisplayName);
  const password = useSelector(selectAuthPassword);
  const confirmPassword = useSelector(selectAuthConfirmPassword);
  const agreedPrivacy = useSelector(selectAgreedPrivacy);
  const isLoading = useSelector(selectAuthLoading);
  const canEmailRegister = useSelector(selectIsRegisterPasswordMatch);
  const canPhoneRegister = useSelector(selectCanLoginWithPhoneOtp);
  const authState = useSelector((state: {auth: AuthState}) => state.auth);

  const enabled = activeTab === 'email' ? canEmailRegister : canPhoneRegister;

  const onRegister = async () => {
    if (activeTab === 'email') {
      const validationError = canRegisterWithEmail(authState);
      if (validationError) {
        AppToast.show(validationError);
        return;
      }
      if (!isPasswordValid(password)) {
        AppToast.show('请输入至少6位密码');
        return;
      }
      if (password !== confirmPassword) {
        AppToast.show('两次密码不一致');
        return;
      }

      const result = await dispatch(
        registerWithEmailThunk({
          email,
          password,
          displayName: displayName || undefined,
        }),
      );
      if (registerWithEmailThunk.fulfilled.match(result)) {
        AppToast.show('注册成功');
        navigateAfterAuth(navigation);
        return;
      }
      if (registerWithEmailThunk.rejected.match(result)) {
        const error = result.payload;
        if (error && isEmailConfirmationFailure(error)) {
          AppToast.show(
            typeof error === 'object' && 'message' in error
              ? String(error.message)
              : '操作失败，请稍后重试',
          );
          return;
        }
        AppToast.show(
          error && typeof error === 'object' && 'message' in error
            ? String(error.message)
            : '操作失败，请稍后重试',
        );
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
        fromRegister: true,
      }),
    );
    if (verifyPhoneOtpThunk.fulfilled.match(result)) {
      AppToast.show('注册成功');
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
              paddingTop: insets.top + 8,
              paddingBottom: 24 + insets.bottom,
            },
          ]}>
          <AuthBackButton onPress={() => navigation.goBack()} />
          <View style={styles.gap8} />
          <Text style={authTextStyles.largeTitle}>创建账号</Text>
          <View style={styles.gap8} />
          <Text style={authTextStyles.subtitle}>选择注册方式并填写信息</Text>
          <View style={styles.gap32} />
          <AuthSegmentedControl
            value={activeTab}
            segments={[...REGISTER_SEGMENTS]}
            onChange={mode => setActiveTab(mode as RegisterTab)}
          />
          <View style={styles.gap24} />
          {activeTab === 'email' ? (
            <View>
              <Text style={authTextStyles.sectionLabel}>账号信息</Text>
              <View style={styles.gap8} />
              <AuthGroupedFormCard>
                <AuthGroupedTextField
                  value={email}
                  onChangeText={value => dispatch(updateEmail(value))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="邮箱"
                />
                <AuthGroupedTextField
                  value={displayName}
                  onChangeText={value => dispatch(updateDisplayName(value))}
                  placeholder="昵称（可选）"
                />
                <AuthGroupedTextField
                  value={password}
                  onChangeText={value => dispatch(updatePassword(value))}
                  secureTextEntry={!passwordVisible}
                  placeholder="密码（至少 6 位）"
                  suffix={
                    <AuthPasswordToggle
                      visible={passwordVisible}
                      onToggle={() => setPasswordVisible(v => !v)}
                    />
                  }
                />
                <AuthGroupedTextField
                  value={confirmPassword}
                  onChangeText={value => dispatch(updateConfirmPassword(value))}
                  secureTextEntry={!confirmVisible}
                  placeholder="确认密码"
                  suffix={
                    <AuthPasswordToggle
                      visible={confirmVisible}
                      onToggle={() => setConfirmVisible(v => !v)}
                    />
                  }
                />
              </AuthGroupedFormCard>
            </View>
          ) : (
            <PhoneOtpFormSection fromRegister />
          )}
          <View style={styles.gap24} />
          <AuthPrivacyRow
            checked={agreedPrivacy}
            onToggle={value => dispatch(togglePrivacy(value))}
          />
          <View style={styles.gap32} />
          <AuthPrimaryButton
            title="注册"
            onPress={onRegister}
            disabled={!enabled}
            loading={isLoading}
          />
          <View style={styles.gap16} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(RoutePath.login)}
            style={styles.loginLinkHit}>
            <Text
              style={[
                authTextStyles.caption,
                {color: authTheme.accent, textAlign: 'center'},
              ]}>
              已有账号？去登录
            </Text>
          </Pressable>
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
  loginLinkHit: {
    minHeight: 44,
    justifyContent: 'center',
  },
});

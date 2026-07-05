import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppToast} from '@ui/design-system';
import {AuthPrimaryButton} from './AuthFormControls';
import {AuthPrivacyRow} from './AuthPrivacyRow';
import {
  registerWithEmailThunk,
  selectAgreedPrivacy,
  selectAuthConfirmPassword,
  selectAuthDisplayName,
  selectAuthEmail,
  selectAuthLoading,
  selectAuthPassword,
  selectIsRegisterPasswordMatch,
  togglePrivacy,
  updateConfirmPassword,
  updateDisplayName,
  updateEmail,
  updatePassword,
} from '../authSlice';
import {authTheme} from '../theme/authTheme';
import {navigateAfterAuth} from '../services/authNavigation';
import type {AuthFailure} from '@core/domain';
import {isEmailConfirmationFailure, mapAuthError} from '../models/authFailure';

type AuthDispatch = ThunkDispatch<{auth: unknown}, unknown, UnknownAction>;

interface RegisterEmailFormProps {
  navigation: RootStackScreenProps<typeof RoutePath.register>['navigation'];
  bottomInset: number;
}

export function RegisterEmailForm({
  navigation,
  bottomInset,
}: RegisterEmailFormProps) {
  const dispatch = useDispatch<AuthDispatch>();
  const email = useSelector(selectAuthEmail);
  const displayName = useSelector(selectAuthDisplayName);
  const password = useSelector(selectAuthPassword);
  const confirmPassword = useSelector(selectAuthConfirmPassword);
  const agreedPrivacy = useSelector(selectAgreedPrivacy);
  const isLoading = useSelector(selectAuthLoading);
  const canRegister = useSelector(selectIsRegisterPasswordMatch);

  const onRegister = async () => {
    if (!agreedPrivacy) {
      AppToast.show('请先阅读并同意隐私条款');
      return;
    }
    if (!canRegister) {
      AppToast.show('两次密码不一致或长度不符合要求');
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
      const error = result.payload as AuthFailure | undefined;
      if (error && isEmailConfirmationFailure(error)) {
        AppToast.show(error.message);
        return;
      }
      AppToast.show(error?.message ?? '操作失败，请稍后重试');
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
        <Text style={styles.title}>邮箱 + 密码注册</Text>
        <TextInput
          style={styles.outlineInput}
          placeholder="name@example.com"
          placeholderTextColor={authTheme.inputHint}
          value={email}
          onChangeText={value => dispatch(updateEmail(value))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.outlineInput}
          placeholder="昵称（可选）"
          placeholderTextColor={authTheme.inputHint}
          value={displayName}
          onChangeText={value => dispatch(updateDisplayName(value))}
        />
        <TextInput
          style={styles.outlineInput}
          placeholder="8-16 位"
          placeholderTextColor={authTheme.inputHint}
          value={password}
          onChangeText={value => dispatch(updatePassword(value))}
          secureTextEntry
        />
        <TextInput
          style={styles.outlineInput}
          placeholder="确认密码"
          placeholderTextColor={authTheme.inputHint}
          value={confirmPassword}
          onChangeText={value => dispatch(updateConfirmPassword(value))}
          secureTextEntry
        />
        <AuthPrivacyRow
          checked={agreedPrivacy}
          onToggle={value => dispatch(togglePrivacy(value))}
        />
        <View style={styles.gap24} />
        <AuthPrimaryButton
          title="注册"
          onPress={onRegister}
          disabled={!canRegister}
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
    marginBottom: 24,
  },
  outlineInput: {
    borderWidth: 1,
    borderColor: authTheme.dividerGray,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: authTheme.titleBlack,
    marginBottom: 16,
  },
  gap24: {height: 24},
  secondaryLink: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: authTheme.primaryBlue,
  },
});

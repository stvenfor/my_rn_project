import React from 'react';
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
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  AuthPrimaryButton,
  AuthUnderlineInput,
} from '../components/AuthFormControls';
import {LoginFooterLinks} from '../components/LoginFooterLinks';
import {
  loginWithPasswordThunk,
  selectAuthLoading,
  selectAuthPassword,
  selectIsPasswordValid,
  selectPendingEmail,
  updatePassword,
} from '../authSlice';
import {isAccountNotRegisteredFailure} from '../models/authFailure';
import {navigateAfterAuth} from '../services/authNavigation';
import {authTheme} from '../theme/authTheme';
import {isPasswordValid} from '../utils/authValidation';

type AuthDispatch = ThunkDispatch<{auth: unknown}, unknown, UnknownAction>;

/** Legacy route — white underline style; main login no longer navigates here. */
export function LoginPasswordScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.loginPassword>) {
  const dispatch = useDispatch<AuthDispatch>();
  const pendingEmail = useSelector(selectPendingEmail);
  const password = useSelector(selectAuthPassword);
  const isLoading = useSelector(selectAuthLoading);
  const passwordValid = useSelector(selectIsPasswordValid);
  const email = route.params?.email || pendingEmail;

  const onLogin = async () => {
    if (!isPasswordValid(password)) {
      AppToast.show('请输入至少6位密码');
      return;
    }

    const result = await dispatch(
      loginWithPasswordThunk({
        email,
        password,
      }),
    );

    if (loginWithPasswordThunk.fulfilled.match(result)) {
      navigateAfterAuth(navigation);
      return;
    }

    if (loginWithPasswordThunk.rejected.match(result)) {
      const error = result.payload;
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
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
          <Text style={styles.title}>请输入你的密码</Text>
          <View style={styles.gap40} />
          <AuthUnderlineInput
            autoFocus={password.length === 0}
            secureTextEntry
            value={password}
            onChangeText={value => dispatch(updatePassword(value))}
            placeholder="至少6位密码"
            style={styles.passwordInput}
          />
          <View style={styles.gap40} />
          <AuthPrimaryButton
            title="登录"
            onPress={onLogin}
            disabled={!passwordValid}
            loading={isLoading}
            legacy
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
    paddingHorizontal: authTheme.legacyHorizontalPadding,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: authTheme.titleBlack,
  },
  passwordInput: {
    fontSize: 18,
  },
  gap40: {height: 40},
  gap20: {height: 20},
});

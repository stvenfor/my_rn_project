import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {getAuthService, MOCK_OTP} from '@core/supabase';
import {
  PrimaryButton,
  ScreenContainer,
  SectionTitle,
  colors,
  typography,
} from '@ui/design-system';
import {useDispatch} from 'react-redux';
import {setUser} from '../authSlice';

export function LoginScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.login>) {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <ScreenContainer>
      <SectionTitle title={t('login')} />
      <TextInput
        style={styles.input}
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <PrimaryButton
        title="邮箱密码登录"
        onPress={() => navigation.navigate(RoutePath.loginPassword, {email})}
      />
      <View style={styles.gap} />
      <TextInput
        style={styles.input}
        placeholder="手机号"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <PrimaryButton
        title="短信验证码登录"
        onPress={() => navigation.navigate(RoutePath.loginOtp, {phone})}
      />
      <View style={styles.gap} />
      <PrimaryButton
        title="注册"
        onPress={() => navigation.navigate(RoutePath.register)}
      />
      <Text style={styles.hint}>Mock OTP: {MOCK_OTP}</Text>
    </ScreenContainer>
  );
}

export function LoginPasswordScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.loginPassword>) {
  const dispatch = useDispatch();
  const email = route.params?.email ?? '';
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      const user = await getAuthService().signInWithPassword(email, password);
      dispatch(setUser(user));
      navigation.reset({index: 0, routes: [{name: RoutePath.main}]});
    } catch (error) {
      Alert.alert(
        '登录失败',
        error instanceof Error ? error.message : '未知错误',
      );
    }
  };

  return (
    <ScreenContainer>
      <SectionTitle title="密码登录" />
      <Text style={styles.label}>{email}</Text>
      <TextInput
        style={styles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <PrimaryButton title="登录" onPress={onLogin} />
    </ScreenContainer>
  );
}

export function LoginOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.loginOtp>) {
  const dispatch = useDispatch();
  const phone = route.params?.phone ?? '';
  const [otp, setOtp] = useState('');

  const onLogin = async () => {
    try {
      const user = await getAuthService().signInWithOtp(phone, otp);
      dispatch(setUser(user));
      navigation.reset({index: 0, routes: [{name: RoutePath.main}]});
    } catch (error) {
      Alert.alert(
        '登录失败',
        error instanceof Error ? error.message : '未知错误',
      );
    }
  };

  return (
    <ScreenContainer>
      <SectionTitle title="验证码登录" />
      <Text style={styles.label}>{phone}</Text>
      <TextInput
        style={styles.input}
        placeholder="6 位验证码"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <PrimaryButton title="登录" onPress={onLogin} />
    </ScreenContainer>
  );
}

export function RegisterScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.register>) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    try {
      const user = await getAuthService().signUpWithEmail(email, password);
      dispatch(setUser(user));
      navigation.reset({index: 0, routes: [{name: RoutePath.main}]});
    } catch (error) {
      Alert.alert(
        '注册失败',
        error instanceof Error ? error.message : '未知错误',
      );
    }
  };

  return (
    <ScreenContainer>
      <SectionTitle title="注册" />
      <TextInput
        style={styles.input}
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <PrimaryButton title="注册" onPress={onRegister} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  gap: {height: 16},
  label: {...typography.body, marginBottom: 8},
  hint: {...typography.caption, marginTop: 16, color: colors.textSecondary},
});

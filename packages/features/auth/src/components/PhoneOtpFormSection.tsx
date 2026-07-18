import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {USE_MOCK_AUTH} from '@core/config';
import {MOCK_OTP} from '@core/supabase';
import {AppToast} from '@ui/design-system';
import {
  canSendPhoneOtp,
  selectAuthOtpCode,
  selectAuthPhone,
  selectCanResendOtp,
  selectMaskedPendingPhone,
  selectOtpCooldownSeconds,
  selectPhoneOtpSent,
  sendPhoneOtpThunk,
  tickOtpCooldown,
  updateOtpCode,
  updatePhone,
  type AuthState,
} from '../authSlice';
import {AuthFilledInput} from './AuthFormControls';
import {AuthPhoneIcon, AuthSmsIcon} from './AuthIcons';
import {authTextStyles, authTheme} from '../theme/authTheme';

type AuthDispatch = ThunkDispatch<{auth: AuthState}, unknown, UnknownAction>;

const MOCK_TEST_PHONE = '13400000000';

interface PhoneOtpFormSectionProps {
  fromRegister?: boolean;
}

export function PhoneOtpFormSection({
  fromRegister = false,
}: PhoneOtpFormSectionProps) {
  const dispatch = useDispatch<AuthDispatch>();
  const phone = useSelector(selectAuthPhone);
  const otpCode = useSelector(selectAuthOtpCode);
  const cooldown = useSelector(selectOtpCooldownSeconds);
  const canResend = useSelector(selectCanResendOtp);
  const otpSent = useSelector(selectPhoneOtpSent);
  const maskedPhone = useSelector(selectMaskedPendingPhone);
  const authState = useSelector((state: {auth: AuthState}) => state.auth);
  const validationError = canSendPhoneOtp(authState);
  const sendDisabled = !canResend || validationError != null;

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      dispatch(tickOtpCooldown());
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown, dispatch]);

  const onSendOtp = async () => {
    if (validationError) {
      AppToast.show(validationError);
      return;
    }

    const result = await dispatch(sendPhoneOtpThunk({phone, fromRegister}));
    if (sendPhoneOtpThunk.fulfilled.match(result)) {
      AppToast.show('验证码已发送');
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
    <View>
      <View style={styles.phoneRow}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+86</Text>
        </View>
        <View style={styles.phoneField}>
          <AuthFilledInput
            value={phone}
            onChangeText={value =>
              dispatch(updatePhone(value.replace(/\D/g, '').slice(0, 11)))
            }
            keyboardType="phone-pad"
            maxLength={11}
            placeholder="手机号"
            prefix={<AuthPhoneIcon />}
            style={styles.phoneInput}
          />
        </View>
      </View>
      <View style={styles.gap16} />
      <View style={styles.otpRow}>
        <View style={styles.otpField}>
          <AuthFilledInput
            value={otpCode}
            onChangeText={value =>
              dispatch(updateOtpCode(value.replace(/\D/g, '').slice(0, 6)))
            }
            keyboardType="number-pad"
            maxLength={6}
            placeholder="验证码"
            prefix={<AuthSmsIcon />}
            style={styles.otpInput}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={sendDisabled}
          onPress={onSendOtp}
          style={styles.sendBtn}>
          <Text
            style={[
              styles.sendBtnText,
              sendDisabled && styles.sendBtnTextDisabled,
            ]}>
            {cooldown > 0 ? `${cooldown}s` : '获取验证码'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.gap8} />
      {otpSent && maskedPhone ? (
        <Text style={authTextStyles.caption}>验证码已发送至 {maskedPhone}</Text>
      ) : USE_MOCK_AUTH ? (
        <Text style={[authTextStyles.caption, {color: authTheme.accent}]}>
          测试号 {MOCK_TEST_PHONE}，验证码 {MOCK_OTP}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    height: authTheme.fieldHeight,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radiusMd,
    borderWidth: 0.5,
    borderColor: authTheme.separator,
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 17,
    fontWeight: '500',
    color: authTheme.labelPrimary,
  },
  phoneField: {
    flex: 1,
  },
  phoneInput: {
    letterSpacing: 0.5,
  },
  gap16: {height: 16},
  gap8: {height: 8},
  otpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  otpField: {
    flex: 1,
  },
  otpInput: {
    letterSpacing: 6,
  },
  sendBtn: {
    height: authTheme.fieldHeight,
    marginLeft: 12,
    paddingHorizontal: 16,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radiusMd,
    borderWidth: 0.5,
    borderColor: authTheme.separator,
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: authTheme.accent,
  },
  sendBtnTextDisabled: {
    color: authTheme.labelTertiary,
  },
});

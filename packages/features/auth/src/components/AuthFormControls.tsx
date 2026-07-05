import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import {authTheme} from '../theme/authTheme';

interface AuthUnderlineInputProps extends TextInputProps {
  prefix?: React.ReactNode;
}

export function AuthUnderlineInput({
  prefix,
  style,
  ...rest
}: AuthUnderlineInputProps) {
  return (
    <View style={styles.row}>
      {prefix ? <View style={styles.prefix}>{prefix}</View> : null}
      <TextInput
        placeholderTextColor={authTheme.inputHint}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

interface AuthPhoneInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function AuthPhoneInput({value, onChangeText}: AuthPhoneInputProps) {
  return (
    <View style={styles.phoneRow}>
      <View style={styles.countryCode}>
        <Text style={styles.countryCodeText}>+86</Text>
      </View>
      <View style={styles.phoneInputWrap}>
        <AuthUnderlineInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          maxLength={11}
          placeholder="请输入手机号"
          style={styles.phoneInput}
        />
      </View>
    </View>
  );
}

interface AuthPrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AuthPrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: AuthPrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        {backgroundColor: isDisabled ? authTheme.buttonDisabled : authTheme.primaryBlue},
      ]}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: authTheme.dividerGray,
    paddingBottom: 8,
  },
  prefix: {
    marginRight: 8,
    paddingBottom: 2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: authTheme.titleBlack,
    paddingVertical: 0,
    minHeight: 28,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  countryCode: {
    backgroundColor: authTheme.countryCodeBg,
    borderRadius: authTheme.countryCodeRadius,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 16,
    color: authTheme.titleBlack,
  },
  phoneInputWrap: {
    flex: 1,
  },
  phoneInput: {
    fontSize: 20,
    letterSpacing: 1.2,
  },
  button: {
    width: '100%',
    height: authTheme.buttonHeight,
    borderRadius: authTheme.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import {authTextStyles, authTheme} from '../theme/authTheme';

interface AuthFilledInputProps extends TextInputProps {
  prefix?: React.ReactNode;
  focusedBorder?: boolean;
}

export function AuthFilledInput({
  prefix,
  style,
  focusedBorder: _focusedBorder,
  ...rest
}: AuthFilledInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.filledField,
        focused && styles.filledFieldFocused,
        {height: authTheme.fieldHeight},
      ]}>
      {prefix ? <View style={styles.prefix}>{prefix}</View> : null}
      <TextInput
        placeholderTextColor={authTheme.labelTertiary}
        style={[styles.filledInput, style]}
        {...rest}
        onFocus={e => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
    </View>
  );
}

/** Legacy underline input for LoginPassword / LoginOtp pages. */
interface AuthUnderlineInputProps extends TextInputProps {
  prefix?: React.ReactNode;
}

export function AuthUnderlineInput({
  prefix,
  style,
  ...rest
}: AuthUnderlineInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.underlineRow, focused && styles.underlineRowFocused]}>
      {prefix ? <View style={styles.prefix}>{prefix}</View> : null}
      <TextInput
        placeholderTextColor={authTheme.inputHint}
        style={[styles.underlineInput, style]}
        {...rest}
        onFocus={e => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
    </View>
  );
}

interface AuthPrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Use legacy white-page button metrics (h=48, r=4). */
  legacy?: boolean;
}

export function AuthPrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  legacy = false,
}: AuthPrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const height = legacy ? authTheme.legacyButtonHeight : authTheme.buttonHeight;
  const radius = legacy ? authTheme.legacyButtonRadius : authTheme.radiusLg;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          height,
          borderRadius: radius,
          backgroundColor: isDisabled
            ? authTheme.buttonDisabled
            : authTheme.accent,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text
          style={[
            authTextStyles.buttonLabel,
            isDisabled && {color: 'rgba(255,255,255,0.8)'},
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filledField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radiusMd,
    borderWidth: 0.5,
    borderColor: authTheme.separator,
    paddingHorizontal: 16,
  },
  filledFieldFocused: {
    borderWidth: 1.5,
    borderColor: authTheme.accent,
  },
  prefix: {
    marginRight: 8,
  },
  filledInput: {
    flex: 1,
    ...authTextStyles.fieldText,
    paddingVertical: 0,
  },
  underlineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: authTheme.dividerGray,
    paddingBottom: 8,
  },
  underlineRowFocused: {
    borderBottomColor: authTheme.primaryBlue,
  },
  underlineInput: {
    flex: 1,
    fontSize: 18,
    color: authTheme.titleBlack,
    paddingVertical: 0,
    minHeight: 28,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

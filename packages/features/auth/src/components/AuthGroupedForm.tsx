import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  Pressable,
} from 'react-native';
import {AuthEyeIcon} from './AuthIcons';
import {authTextStyles, authTheme} from '../theme/authTheme';

interface AuthGroupedTextFieldProps extends TextInputProps {
  suffix?: React.ReactNode;
}

export function AuthGroupedTextField({
  style,
  suffix,
  ...rest
}: AuthGroupedTextFieldProps) {
  return (
    <View style={styles.fieldRow}>
      <TextInput
        placeholderTextColor={authTheme.labelTertiary}
        style={[styles.fieldInput, style]}
        {...rest}
      />
      {suffix}
    </View>
  );
}

interface AuthGroupedFormCardProps {
  children: React.ReactNode;
}

export function AuthGroupedFormCard({children}: AuthGroupedFormCardProps) {
  const items = React.Children.toArray(children);
  const rows: React.ReactNode[] = [];
  items.forEach((child, index) => {
    rows.push(
      <View key={`field-${index}`} style={styles.fieldWrap}>
        {child}
      </View>,
    );
    if (index < items.length - 1) {
      rows.push(<View key={`div-${index}`} style={styles.divider} />);
    }
  });

  return <View style={styles.card}>{rows}</View>;
}

interface AuthPasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function AuthPasswordToggle({
  visible,
  onToggle,
}: AuthPasswordToggleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? '隐藏密码' : '显示密码'}
      onPress={onToggle}
      hitSlop={8}
      style={styles.toggleHit}>
      <AuthEyeIcon
        size={20}
        color={authTheme.labelSecondary}
        crossed={visible}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radiusMd,
    overflow: 'hidden',
  },
  fieldWrap: {
    height: authTheme.fieldHeight,
    justifyContent: 'center',
  },
  fieldRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fieldInput: {
    flex: 1,
    ...authTextStyles.fieldText,
    paddingVertical: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: authTheme.separator,
  },
  toggleHit: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

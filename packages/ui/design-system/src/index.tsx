import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing, typography} from './theme';

export {colors, spacing, typography, lightTheme, darkTheme} from './theme';
export type {AppTheme} from './theme';

let loadingHandler: ((visible: boolean, message?: string) => void) | null =
  null;

export function registerLoadingHandler(
  handler: (visible: boolean, message?: string) => void,
): void {
  loadingHandler = handler;
}

export const AppLoading = {
  show(message?: string) {
    loadingHandler?.(true, message);
  },
  hide() {
    loadingHandler?.(false);
  },
  async run<T>(task: () => Promise<T>, message = '加载中'): Promise<T> {
    AppLoading.show(message);
    try {
      return await task();
    } finally {
      AppLoading.hide();
    }
  },
};

let toastHandler: ((message: string) => void) | null = null;

export function registerToastHandler(handler: (message: string) => void): void {
  toastHandler = handler;
}

export const AppToast = {
  show(message: string) {
    toastHandler?.(message);
  },
};

export function ToastPortal() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    registerToastHandler(text => {
      setMessage(text);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setMessage(null), 2200);
    });
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <Modal transparent visible animationType="fade" pointerEvents="none">
      <View style={styles.toastOverlay}>
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

export function LoadingPortal() {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('加载中');

  React.useEffect(() => {
    registerLoadingHandler((v, msg) => {
      setVisible(v);
      if (msg) {
        setMessage(msg);
      }
    });
  }, []);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

export function ScreenContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Text style={styles.primaryButton} onPress={onPress}>
      {title}
    </Text>
  );
}

export function SectionTitle({title}: {title: string}) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export function ListRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Text style={styles.listRow} onPress={onPress}>
      <Text style={styles.listRowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.listRowSubtitle}>{subtitle}</Text> : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
  },
  message: {...typography.body, marginTop: spacing.sm},
  screen: {flex: 1, padding: spacing.md, backgroundColor: colors.background},
  primaryButton: {
    ...typography.subtitle,
    color: '#fff',
    backgroundColor: colors.primary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {...typography.title, marginBottom: spacing.md},
  listRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  listRowTitle: {...typography.subtitle},
  listRowSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  toastOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 72,
  },
  toastBox: {
    backgroundColor: 'rgba(0,0,0,0.78)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    maxWidth: '85%',
  },
  toastText: {...typography.body, color: '#fff', textAlign: 'center'},
});

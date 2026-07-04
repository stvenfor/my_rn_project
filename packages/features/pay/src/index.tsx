import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  AppToast,
  ListRow,
  ScreenContainer,
  SectionTitle,
  typography,
} from '@ui/design-system';
import {getPayService} from './payService';

const PAY_METHODS = [
  {id: 'wechat', label: '微信支付'},
  {id: 'alipay', label: '支付宝'},
  {id: 'mock', label: 'Mock 支付（开发）'},
];

export function PayScreen() {
  const {t} = useTranslation();

  const handlePay = async (methodId: string, label: string) => {
    if (methodId === 'mock') {
      const result = await getPayService().pay(methodId, 9900);
      AppToast.show(`${t('payMockSuccess')}: ${result.transactionId}`);
      return;
    }
    AppToast.show(`${label} · ${t('paySdkDeferredHint')}`);
  };

  return (
    <ScreenContainer>
      <SectionTitle title={t('payTitle')} />
      <View style={styles.center}>
        <Text style={styles.moduleLabel}>{t('payModuleLabel')}</Text>
      </View>
      {PAY_METHODS.map(method => (
        <ListRow
          key={method.id}
          title={method.label}
          subtitle={
            method.id === 'mock' ? t('payMockSuccess') : t('paySdkDeferredHint')
          }
          onPress={() => handlePay(method.id, method.label)}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {alignItems: 'center', marginBottom: 16},
  moduleLabel: {...typography.body},
});

export {registerPayFeature} from './registerPayFeature';

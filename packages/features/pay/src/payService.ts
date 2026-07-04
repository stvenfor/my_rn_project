export interface PayResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface PayService {
  pay(methodId: string, amountCents: number): Promise<PayResult>;
}

export class MockPayService implements PayService {
  async pay(methodId: string, amountCents: number): Promise<PayResult> {
    return {
      success: true,
      transactionId: `mock_tx_${Date.now()}`,
      message: `${methodId} · ¥${(amountCents / 100).toFixed(2)}`,
    };
  }
}

let service: PayService = new MockPayService();

export function getPayService(): PayService {
  return service;
}

export function configurePayService(next?: PayService): void {
  service = next ?? new MockPayService();
}

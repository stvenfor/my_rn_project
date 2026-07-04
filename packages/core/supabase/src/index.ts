import type {AuthService, User} from '@core/domain';
import {USE_MOCK_AUTH} from '@core/config';
import {configureAuthSessionService} from './sessionService';

const MOCK_OTP = '123456';

class MockAuthService implements AuthService {
  async signInWithPassword(email: string, _password: string): Promise<User> {
    return {id: 'mock-1', email, displayName: email.split('@')[0]};
  }
  async signInWithOtp(phone: string, otp: string): Promise<User> {
    if (otp !== MOCK_OTP) {
      throw {code: 'invalid_otp', message: '验证码错误，Mock 固定为 123456'};
    }
    return {id: 'mock-phone', phone, displayName: phone};
  }
  async signUpWithEmail(email: string, password: string): Promise<User> {
    return this.signInWithPassword(email, password);
  }
  async signUpWithPhone(phone: string, otp: string): Promise<User> {
    return this.signInWithOtp(phone, otp);
  }
  async sendOtp(_phone: string): Promise<void> {
    // Mock: no-op
  }
  async signOut(): Promise<void> {}
}

let authService: AuthService = new MockAuthService();

export function getAuthService(): AuthService {
  return authService;
}

export function configureAuthService(service?: AuthService): void {
  if (service) {
    authService = service;
  } else if (!USE_MOCK_AUTH) {
    authService = new MockAuthService();
  } else {
    authService = new MockAuthService();
  }
  configureAuthSessionService();
}

export {
  configureAuthSessionService,
  getAuthSessionService,
} from './sessionService';

export {MOCK_OTP};

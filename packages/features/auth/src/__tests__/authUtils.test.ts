import {
  isValidChinaMobile,
  maskChinaMobile,
  normalizeDigits,
  toE164China,
} from '../utils/phoneAuthUtils';
import {
  isOtpValid,
  isPasswordValid,
  validateEmail,
} from '../utils/authValidation';
import {buildAuthGreeting} from '../utils/authGreeting';

describe('phoneAuthUtils', () => {
  it('validates china mobile', () => {
    expect(isValidChinaMobile('13477525645')).toBe(true);
    expect(isValidChinaMobile('23477525645')).toBe(false);
  });

  it('normalizes digits', () => {
    expect(normalizeDigits('134 7752 5645')).toBe('13477525645');
  });

  it('formats e164 china', () => {
    expect(toE164China('13477525645')).toBe('+8613477525645');
  });

  it('masks phone', () => {
    expect(maskChinaMobile('13477525645')).toBe('134****5645');
  });
});

describe('authValidation', () => {
  it('validates email', () => {
    expect(validateEmail('454655062@qq.com')).toBe(true);
    expect(validateEmail('bad')).toBe(false);
  });

  it('validates password length (>=6, Flutter AuthController)', () => {
    expect(isPasswordValid('123456')).toBe(true);
    expect(isPasswordValid('12345')).toBe(false);
    expect(isPasswordValid('12345678901234567')).toBe(true);
  });

  it('validates otp', () => {
    expect(isOtpValid('123456')).toBe(true);
    expect(isOtpValid('12')).toBe(false);
  });
});

describe('authGreeting', () => {
  it('returns greeting text', () => {
    expect(buildAuthGreeting()).toMatch(/好，欢迎使用i车商/);
  });
});

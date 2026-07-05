const CHINA_MOBILE = /^1[3-9]\d{9}$/;

export function isValidChinaMobile(raw: string): boolean {
  const digits = raw.replace(/\s+/g, '');
  return CHINA_MOBILE.test(digits);
}

export function normalizeDigits(raw: string): string {
  return raw.replace(/\s+/g, '');
}

export function toE164China(raw: string): string {
  const digits = normalizeDigits(raw);
  if (digits.startsWith('+86')) {
    return digits;
  }
  if (digits.startsWith('86') && digits.length === 13) {
    return `+${digits}`;
  }
  return `+86${digits}`;
}

export function maskChinaMobile(phone: string): string {
  const digits = normalizeDigits(phone);
  if (digits.length !== 11) {
    return phone;
  }
  return `${digits.slice(0, 3)}****${digits.slice(7)}`;
}

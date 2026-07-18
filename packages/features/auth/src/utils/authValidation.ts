export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(raw: string): boolean {
  return EMAIL_PATTERN.test(raw.trim());
}

/** Flutter AuthController: password.length >= 6 (no max). */
export function isPasswordValid(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export function isOtpValid(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

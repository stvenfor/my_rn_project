export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 16;

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(raw: string): boolean {
  return EMAIL_PATTERN.test(raw.trim());
}

export function isPasswordValid(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

export function isOtpValid(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

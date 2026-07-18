import type {AuthFailure} from '@core/domain';

export function mapAuthError(error: unknown): AuthFailure {
  if (
    error != null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  ) {
    return error as AuthFailure;
  }
  if (error instanceof Error) {
    return {code: 'unknown', message: error.message};
  }
  return {code: 'unknown', message: '操作失败，请稍后重试'};
}

export function isEmailConfirmationFailure(error: unknown): boolean {
  const failure = mapAuthError(error);
  return (
    failure.code === 'email_confirmation' ||
    failure.message.includes('验证邮件')
  );
}

/** Flutter AccountNotRegisteredFailure → dialog「去注册」. */
export function isAccountNotRegisteredFailure(error: unknown): boolean {
  const failure = mapAuthError(error);
  return (
    failure.code === 'account_not_registered' ||
    failure.message.includes('未注册') ||
    failure.message.includes('账号不存在')
  );
}

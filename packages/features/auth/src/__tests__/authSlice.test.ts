import {
  authReducer,
  canProceedToPassword,
  canSendPhoneOtp,
  loadAuthSession,
  logout,
  selectIsLoggedIn,
  selectIsPasswordValid,
  selectMaskedPendingPhone,
  selectUser,
  setUser,
  startOtpCooldown,
  tickOtpCooldown,
} from '../authSlice';

describe('authSlice', () => {
  const baseState = {auth: authReducer(undefined, {type: '@@INIT'})};

  it('setUser stores user', () => {
    const user = {id: '1', email: 'a@test.com', displayName: 'A'};
    const next = authReducer(baseState.auth, setUser(user));
    expect(selectUser({auth: next})).toEqual(user);
    expect(selectIsLoggedIn({auth: next})).toBe(true);
  });

  it('logout clears user', () => {
    const loggedIn = authReducer(
      baseState.auth,
      setUser({id: '1', email: 'a@test.com'}),
    );
    const next = authReducer(loggedIn, logout());
    expect(selectUser({auth: next})).toBeNull();
    expect(selectIsLoggedIn({auth: next})).toBe(false);
  });

  it('validates email login prerequisites', () => {
    const state = {...baseState.auth, email: 'bad'};
    expect(canProceedToPassword(state)).toBe('请输入有效的邮箱');
  });

  it('validates phone otp prerequisites', () => {
    const state = {...baseState.auth, phone: '123'};
    expect(canSendPhoneOtp(state)).toBe('请输入有效的手机号');
  });

  it('tracks otp cooldown', () => {
    let state = authReducer(baseState.auth, startOtpCooldown(2));
    expect(state.otpCooldownSeconds).toBe(2);
    state = authReducer(state, tickOtpCooldown());
    expect(state.otpCooldownSeconds).toBe(1);
  });

  it('masks pending phone', () => {
    const withPhone = {...baseState.auth, pendingPhone: '13477525645'};
    expect(selectMaskedPendingPhone({auth: withPhone})).toBe('134****5645');
  });

  it('selects password validity', () => {
    expect(selectIsPasswordValid({auth: baseState.auth})).toBe(false);
  });

  it('loadAuthSession hydrates user into state', () => {
    const user = {id: '1', email: 'a@test.com'};
    const next = authReducer(
      baseState.auth,
      loadAuthSession.fulfilled(user, '', undefined),
    );
    expect(selectUser({auth: next})).toEqual(user);
  });
});

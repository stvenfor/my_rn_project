import {
  authReducer,
  logout,
  selectIsLoggedIn,
  selectUser,
  setUser,
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
});

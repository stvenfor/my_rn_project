import {createAuthTabListener} from '../authGuard';

describe('authGuard', () => {
  it('prevents tab press when not logged in', () => {
    const navigate = jest.fn();
    const listener = createAuthTabListener(false, navigate);
    const event = {preventDefault: jest.fn()};
    listener.tabPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
  });

  it('allows tab press when logged in', () => {
    const navigate = jest.fn();
    const listener = createAuthTabListener(true, navigate);
    const event = {preventDefault: jest.fn()};
    listener.tabPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});

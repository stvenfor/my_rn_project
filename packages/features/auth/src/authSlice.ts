import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {User} from '@core/domain';
import {
  getAuthService,
  getAuthSessionService,
  restoreAuthSessionFromStorage,
} from '@core/supabase';
import type {AuthCredentialMode} from './models/authCredentialMode';
import {mapAuthError} from './models/authFailure';
import {isValidChinaMobile, normalizeDigits} from './utils/phoneAuthUtils';
import {
  isOtpValid,
  isPasswordValid,
  validateEmail,
} from './utils/authValidation';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  agreedPrivacy: boolean;
  credentialMode: AuthCredentialMode;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  otpCode: string;
  otpCooldownSeconds: number;
  phoneOtpSent: boolean;
  pendingEmail: string;
  pendingPhone: string;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  agreedPrivacy: true,
  credentialMode: 'email',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  otpCode: '',
  otpCooldownSeconds: 0,
  phoneOtpSent: false,
  pendingEmail: '',
  pendingPhone: '',
};

export const sendPhoneOtpThunk = createAsyncThunk(
  'auth/sendPhoneOtp',
  async (
    params: {phone: string; fromRegister?: boolean},
    {rejectWithValue},
  ) => {
    try {
      const normalized = normalizeDigits(params.phone);
      await getAuthService().sendOtp(normalized);
      return {phone: normalized, fromRegister: params.fromRegister ?? false};
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  },
);

export const verifyPhoneOtpThunk = createAsyncThunk(
  'auth/verifyPhoneOtp',
  async (
    params: {phone: string; otp: string; fromRegister?: boolean},
    {rejectWithValue},
  ) => {
    try {
      const user = await getAuthService().signInWithOtp(
        normalizeDigits(params.phone),
        params.otp.trim(),
      );
      await getAuthSessionService().setUser(user);
      return {user, fromRegister: params.fromRegister ?? false};
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  },
);

export const loginWithPasswordThunk = createAsyncThunk(
  'auth/loginWithPassword',
  async (params: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const user = await getAuthService().signInWithPassword(
        params.email.trim(),
        params.password,
      );
      await getAuthSessionService().setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  },
);

export const registerWithEmailThunk = createAsyncThunk(
  'auth/registerWithEmail',
  async (
    params: {
      email: string;
      password: string;
      displayName?: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const user = await getAuthService().signUpWithEmail(
        params.email.trim(),
        params.password,
        params.displayName?.trim() || undefined,
      );
      await getAuthSessionService().setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await getAuthService().signOut();
  await getAuthSessionService().clearSession();
});

export const loadAuthSession = createAsyncThunk('auth/loadSession', async () =>
  restoreAuthSessionFromStorage(),
);

export const updateUserSession = createAsyncThunk(
  'auth/updateUserSession',
  async (user: User) => {
    await getAuthSessionService().setUser(user);
    return user;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    switchCredentialMode(state, action: PayloadAction<AuthCredentialMode>) {
      state.credentialMode = action.payload;
    },
    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload.trim();
    },
    updatePhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    updatePassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    updateConfirmPassword(state, action: PayloadAction<string>) {
      state.confirmPassword = action.payload;
    },
    updateDisplayName(state, action: PayloadAction<string>) {
      state.displayName = action.payload.trim();
    },
    updateOtpCode(state, action: PayloadAction<string>) {
      state.otpCode = action.payload;
    },
    togglePrivacy(state, action: PayloadAction<boolean>) {
      state.agreedPrivacy = action.payload;
    },
    setPendingEmail(state, action: PayloadAction<string>) {
      state.pendingEmail = action.payload.trim();
    },
    setPendingPhone(state, action: PayloadAction<string>) {
      state.pendingPhone = action.payload;
    },
    startOtpCooldown(state, action: PayloadAction<number>) {
      state.otpCooldownSeconds = action.payload;
    },
    tickOtpCooldown(state) {
      if (state.otpCooldownSeconds > 0) {
        state.otpCooldownSeconds -= 1;
      }
    },
    resetOtpCode(state) {
      state.otpCode = '';
    },
    setPhoneOtpSent(state, action: PayloadAction<boolean>) {
      state.phoneOtpSent = action.payload;
    },
  },
  extraReducers: builder => {
    const setLoading = (state: AuthState, loading: boolean) => {
      state.isLoading = loading;
    };

    builder
      .addCase(sendPhoneOtpThunk.pending, state => {
        setLoading(state, true);
      })
      .addCase(sendPhoneOtpThunk.fulfilled, (state, action) => {
        setLoading(state, false);
        state.pendingPhone = action.payload.phone;
        state.otpCooldownSeconds = 60;
        state.phoneOtpSent = true;
      })
      .addCase(sendPhoneOtpThunk.rejected, state => {
        setLoading(state, false);
      })
      .addCase(verifyPhoneOtpThunk.pending, state => {
        setLoading(state, true);
      })
      .addCase(verifyPhoneOtpThunk.fulfilled, (state, action) => {
        setLoading(state, false);
        state.user = action.payload.user;
      })
      .addCase(verifyPhoneOtpThunk.rejected, state => {
        setLoading(state, false);
      })
      .addCase(loginWithPasswordThunk.pending, state => {
        setLoading(state, true);
      })
      .addCase(loginWithPasswordThunk.fulfilled, (state, action) => {
        setLoading(state, false);
        state.user = action.payload;
        state.pendingEmail = action.payload.email ?? state.email;
      })
      .addCase(loginWithPasswordThunk.rejected, state => {
        setLoading(state, false);
      })
      .addCase(registerWithEmailThunk.pending, state => {
        setLoading(state, true);
      })
      .addCase(registerWithEmailThunk.fulfilled, (state, action) => {
        setLoading(state, false);
        state.user = action.payload;
      })
      .addCase(registerWithEmailThunk.rejected, state => {
        setLoading(state, false);
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null;
      })
      .addCase(loadAuthSession.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserSession.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {
  setUser,
  logout,
  switchCredentialMode,
  updateEmail,
  updatePhone,
  updatePassword,
  updateConfirmPassword,
  updateDisplayName,
  updateOtpCode,
  togglePrivacy,
  setPendingEmail,
  setPendingPhone,
  startOtpCooldown,
  tickOtpCooldown,
  resetOtpCode,
  setPhoneOtpSent,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectIsLoggedIn = (state: {auth: AuthState}) =>
  state.auth.user != null;

export const selectUser = (state: {auth: AuthState}) => state.auth.user;

export const selectAuthLoading = (state: {auth: AuthState}) =>
  state.auth.isLoading;

export const selectAgreedPrivacy = (state: {auth: AuthState}) =>
  state.auth.agreedPrivacy;

export const selectCredentialMode = (state: {auth: AuthState}) =>
  state.auth.credentialMode;

export const selectAuthEmail = (state: {auth: AuthState}) => state.auth.email;

export const selectAuthPhone = (state: {auth: AuthState}) => state.auth.phone;

export const selectAuthPassword = (state: {auth: AuthState}) =>
  state.auth.password;

export const selectAuthConfirmPassword = (state: {auth: AuthState}) =>
  state.auth.confirmPassword;

export const selectAuthDisplayName = (state: {auth: AuthState}) =>
  state.auth.displayName;

export const selectAuthOtpCode = (state: {auth: AuthState}) =>
  state.auth.otpCode;

export const selectOtpCooldownSeconds = (state: {auth: AuthState}) =>
  state.auth.otpCooldownSeconds;

export const selectPhoneOtpSent = (state: {auth: AuthState}) =>
  state.auth.phoneOtpSent;

export const selectPendingEmail = (state: {auth: AuthState}) =>
  state.auth.pendingEmail;

export const selectPendingPhone = (state: {auth: AuthState}) =>
  state.auth.pendingPhone;

export const selectIsPasswordValid = (state: {auth: AuthState}) =>
  isPasswordValid(state.auth.password);

export const selectIsRegisterPasswordMatch = (state: {auth: AuthState}) =>
  isPasswordValid(state.auth.password) &&
  state.auth.password === state.auth.confirmPassword;

export const selectIsOtpValid = (state: {auth: AuthState}) =>
  isOtpValid(state.auth.otpCode);

export const selectCanResendOtp = (state: {auth: AuthState}) =>
  state.auth.otpCooldownSeconds <= 0 && !state.auth.isLoading;

export const selectCanLoginWithEmail = (state: {auth: AuthState}) =>
  !state.auth.isLoading &&
  validateEmail(state.auth.email) &&
  isPasswordValid(state.auth.password);

export const selectCanLoginWithPhoneOtp = (state: {auth: AuthState}) =>
  !state.auth.isLoading &&
  state.auth.agreedPrivacy &&
  isValidChinaMobile(state.auth.phone) &&
  isOtpValid(state.auth.otpCode);

export const selectMaskedPendingPhone = (state: {auth: AuthState}) => {
  const phone =
    state.auth.pendingPhone.length > 0
      ? state.auth.pendingPhone
      : state.auth.phone;
  const digits = normalizeDigits(phone);
  if (digits.length !== 11) {
    return phone;
  }
  return `${digits.slice(0, 3)}****${digits.slice(7)}`;
};

/** @deprecated Prefer canLoginWithEmailPassword; kept for legacy callers. */
export function canProceedToPassword(state: AuthState): string | null {
  if (!state.agreedPrivacy) {
    return '请先阅读并同意隐私条款';
  }
  if (!validateEmail(state.email)) {
    return '请输入有效的邮箱';
  }
  return null;
}

export function canLoginWithEmailPassword(state: AuthState): string | null {
  if (!state.agreedPrivacy) {
    return '请先阅读并同意隐私条款';
  }
  if (!validateEmail(state.email)) {
    return '请输入有效的邮箱';
  }
  if (!isPasswordValid(state.password)) {
    return '请输入至少6位密码';
  }
  return null;
}

export function canSendPhoneOtp(state: AuthState): string | null {
  if (!state.agreedPrivacy) {
    return '请先阅读并同意隐私条款';
  }
  if (!isValidChinaMobile(state.phone)) {
    return '请输入有效的手机号';
  }
  if (state.otpCooldownSeconds > 0 || state.isLoading) {
    return '请稍后再试';
  }
  return null;
}

export function canLoginWithPhoneOtp(state: AuthState): string | null {
  if (!state.agreedPrivacy) {
    return '请先阅读并同意隐私条款';
  }
  if (!isValidChinaMobile(state.phone)) {
    return '请输入有效的手机号';
  }
  if (!isOtpValid(state.otpCode)) {
    return '请输入 6 位验证码';
  }
  return null;
}

export function canRegisterWithEmail(state: AuthState): string | null {
  if (!state.agreedPrivacy) {
    return '请先阅读并同意隐私条款';
  }
  if (!validateEmail(state.email)) {
    return '请输入有效的邮箱';
  }
  if (!isPasswordValid(state.password)) {
    return '请输入至少6位密码';
  }
  if (state.password !== state.confirmPassword) {
    return '两次密码不一致';
  }
  return null;
}

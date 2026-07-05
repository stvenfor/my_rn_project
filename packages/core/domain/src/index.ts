export type AppEnv = 'test' | 'staging' | 'production';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName?: string;
  avatar?: string;
}

export interface AuthFailure {
  code: string;
  message: string;
}

export interface AuthService {
  signInWithPassword(email: string, password: string): Promise<User>;
  signInWithOtp(phone: string, otp: string): Promise<User>;
  signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<User>;
  signUpWithPhone(phone: string, otp: string): Promise<User>;
  sendOtp(phone: string): Promise<void>;
  signOut(): Promise<void>;
}

export interface UserService {
  getCurrentUser(): User | null;
  isLoggedIn(): boolean;
  setUser(user: User | null): void;
}

export interface EnvironmentService {
  currentEnv: AppEnv;
  baseUrl: string;
  label: string;
  setEnv(env: AppEnv): Promise<void>;
}

/** Single session contract shared by auth feature and core adapters (R-013). */
export interface AuthSessionService {
  getUser(): User | null;
  setUser(user: User | null): Promise<void>;
  clearSession(): Promise<void>;
  isLoggedIn(): boolean;
}

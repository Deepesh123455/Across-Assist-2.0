import { api } from '../lib/axios';
import { getSessionToken } from '../lib/session';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phone?: string | null;
  role: string;
  clientType?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  onboardingDone?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionData {
  sessionToken?: string | null;
  recommendation?: Record<string, unknown> | null;
  formData?: Record<string, unknown> | null;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  sessionData: SessionData;
}

export const authService = {
  async signup(data: {
    name: string;
    email: string;
    companyName: string;
    phone?: string;
    password: string;
    clientType?: string;
  }): Promise<AuthResponse> {
    const sessionToken = getSessionToken();
    const res = await api.post('auth/signup', { ...data, sessionToken });
    return res.data.data as AuthResponse;
  },

  /** Step 1: Request an OTP for the given email. Returns cooldown in seconds. */
  async sendOtp(email: string): Promise<{ cooldownSeconds: number }> {
    const res = await api.post('auth/otp/send', { email });
    return res.data.data as { cooldownSeconds: number };
  },

  /** Step 2: Verify the submitted OTP code. Returns full AuthResponse on success. */
  async verifyOtp(email: string, code: string): Promise<AuthResponse> {
    const sessionToken = getSessionToken();
    const res = await api.post('auth/otp/verify', { email, code, sessionToken });
    return res.data.data as AuthResponse;
  },

  /**
   * Demo bypass — skips OTP, returns real tokens for any registered email.
   * Used when the "Demo Mode" checkbox is checked on the login page.
   */
  async demoLogin(email: string): Promise<AuthResponse> {
    const sessionToken = getSessionToken();
    const res = await api.post('auth/otp/demo-login', { email, sessionToken });
    return res.data.data as AuthResponse;
  },

  /**
   * Abort the OTP flow for this email — "Wrong email?" escape hatch.
   * Deletes all Redis keys so the user gets a completely fresh start.
   */
  async abortOtp(email: string): Promise<void> {
    await api.post('auth/otp/abort', { email }).catch(() => {});
  },

  async getMe() {
    const res = await api.get('auth/me');
    return res.data.data;
  },

  async checkEmail(email: string): Promise<{ exists: boolean }> {
    const res = await api.get(`auth/check-email?email=${encodeURIComponent(email)}`);
    return res.data.data as { exists: boolean };
  },

  async logout(): Promise<void> {
    await api.post('auth/logout').catch(() => {});
  },
};

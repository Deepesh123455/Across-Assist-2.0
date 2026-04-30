import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api } from '../lib/axios';
import { saveSessionToken, saveRecommendation, saveFormData } from '../lib/session';
import type { AuthUser, AuthTokens, SessionData } from '../services/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionData: SessionData | null;
  login: (user: AuthUser, tokens: AuthTokens, sessionData?: SessionData | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        const data = res.data.data;
        setUser(data.user);
        const sd: SessionData = {
          sessionToken: data.sessionToken,
          recommendation: data.recommendation,
          formData: data.formData,
        };
        setSessionData(sd);
        if (data.sessionToken) saveSessionToken(data.sessionToken);
        if (data.recommendation) saveRecommendation(data.recommendation);
        if (data.formData) saveFormData(data.formData as Record<string, unknown>);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback((userData: AuthUser, tokens: AuthTokens, sd?: SessionData | null) => {
    setUser(userData);
    setSessionData(sd ?? null);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    if (sd?.sessionToken) saveSessionToken(sd.sessionToken);
    if (sd?.recommendation) saveRecommendation(sd.recommendation);
    if (sd?.formData) saveFormData(sd.formData as Record<string, unknown>);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionData(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, sessionData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

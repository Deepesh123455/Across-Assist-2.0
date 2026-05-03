export const SESSION_KEY = 'aa_session';
export const EMAIL_KEY = 'aa_email';
export const FORM_DATA_KEY = 'aa_form_data';
export const RECOMMENDATION_KEY = 'aa_recommendation';
export const CHAT_HISTORY_KEY = 'aa_chat_history';
export const AUTH_KEY = 'aa_auth';

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveSession = (data: Record<string, unknown>) => {
  const existing = getSession() || {};
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
};

export const saveFormData = (data: Record<string, unknown>) => {
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
  saveSession({ formData: data });
};

export const getFormData = () => {
  const raw = localStorage.getItem(FORM_DATA_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveRecommendation = (rec: unknown) => {
  localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(rec));
  saveSession({ recommendation: rec, intentLevel: 'HIGH' });
};

export const getRecommendation = () => {
  const raw = localStorage.getItem(RECOMMENDATION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveChatHistory = (messages: unknown[]) => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
};

export const getChatHistory = () => {
  const raw = localStorage.getItem(CHAT_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveEmail = (email: string) => {
  localStorage.setItem(EMAIL_KEY, email);
  saveSession({ email });
};

export const getEmail = () => localStorage.getItem(EMAIL_KEY);

export const isLoggedIn = (): Record<string, unknown> | null => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

export const login = (userData: Record<string, unknown>) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ ...userData, loggedInAt: new Date().toISOString() }));
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const clearAll = () => {
  [
    SESSION_KEY,
    EMAIL_KEY,
    FORM_DATA_KEY,
    RECOMMENDATION_KEY,
    CHAT_HISTORY_KEY,
    AUTH_KEY,
    SESSION_TOKEN_KEY,
    SOCIAL_PROOF_KEY,
    'accessToken',
    'refreshToken',
    'aa_onboarding',
    'aa_recommendation_cache',
    'aa_bundle_slug',
    'aa_onboarding_segment',
    'aa_enquiries',
  ].forEach((k) => localStorage.removeItem(k));
};

// ─── Backend session token (DB session.id) ────────────────────────────────────

export const SESSION_TOKEN_KEY = 'aa_session_token';
export const SOCIAL_PROOF_KEY = 'aa_social_proof';

export const getSessionToken = (): string | null => localStorage.getItem(SESSION_TOKEN_KEY);

export const saveSessionToken = (token: string): void =>
  localStorage.setItem(SESSION_TOKEN_KEY, token);

export const getSocialProof = () => {
  const raw = localStorage.getItem(SOCIAL_PROOF_KEY);
  return raw ? (JSON.parse(raw) as SocialProof) : null;
};

export const saveSocialProof = (data: unknown): void =>
  localStorage.setItem(SOCIAL_PROOF_KEY, JSON.stringify(data));

export interface SocialProofClient {
  name: string;
  logoUrl: string | null;
  tier: string;
  monthlyUnits: number | null;
  testimonial: string | null;
}

export interface SocialProof {
  totalClients: number;
  totalMonthlyUnits: number;
  displayStat: string;
  topClients: SocialProofClient[];
}

export const registerBeforeUnload = (sessionToken: string): void => {
  window.addEventListener('beforeunload', () => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/sessions/mark-inactive`;
    navigator.sendBeacon(url, JSON.stringify({ sessionToken }));
  });
};

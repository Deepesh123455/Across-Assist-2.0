import { api } from './axios';

// ─── Types (kept identical — nothing downstream breaks) ───────────────────────

export interface RecommendationInput {
  partnerType: string;
  products: string[];
  volume: string;
  goal: string;
  distribution: string;
}

export interface RecommendationResult {
  bundleName: string;
  products: string[];
  projectedAnnualRevenue: number;
  reasons: string[];
  similarClients: string[];
  objectionHandle: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Blocked-message guard (kept for UI-side pre-check) ──────────────────────

const BLOCKED_PATTERNS = [
  /ignore (previous|above|all) instructions/i,
  /you are now/i,
  /pretend you are/i,
  /jailbreak/i,
  /DAN mode/i,
  /reveal your (prompt|instructions)/i,
  /forget your instructions/i,
];

export const BLOCKED_RESPONSE =
  "I'm specifically here to help with gadget protection bundles for institutional clients. What would you like to know about our protection plans or revenue model?";

export function isBlockedMessage(msg: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(msg));
}

// ─── API calls (pure proxy — no Groq SDK, no direct API calls, no API key) ───

export async function getProtectionRecommendation(
  input: RecommendationInput,
): Promise<RecommendationResult> {
  const sessionToken = localStorage.getItem('aa_session_token');

  const response = await api.post('/recommendations/generate', {
    sessionToken,
    ...input,
  });

  const { sessionToken: returnedToken, recommendation, socialProof } =
    response.data.data as {
      sessionToken: string;
      recommendation: RecommendationResult;
      socialProof: unknown;
    };

  localStorage.setItem('aa_session_token', returnedToken);
  localStorage.setItem('aa_social_proof', JSON.stringify(socialProof));

  return recommendation;
}

export async function sendChatMessage(
  _history: ChatMessage[],
  userMessage: string,
  _sessionContext?: Record<string, unknown>,
): Promise<string> {
  if (isBlockedMessage(userMessage)) return BLOCKED_RESPONSE;

  const sessionToken = localStorage.getItem('aa_session_token');
  if (!sessionToken) {
    throw new Error('No session found. Please complete the recommendation form first.');
  }

  const response = await api.post('/chat/message', { sessionToken, message: userMessage });
  return response.data.data.message as string;
}

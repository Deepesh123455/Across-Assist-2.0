import { useState, useCallback, useEffect, useRef } from 'react';
import { onboardingService, Segment, Question, RecommendationResult } from '../services/onboarding.service';
import { getSessionToken, saveSessionToken } from '../lib/session';

const LS_KEY = 'aa_onboarding';

interface OnboardingState {
  segment: Segment | null;
  questions: Question[];
  currentIndex: number;          // 0-based index of current question
  answers: Record<string, string>;
  phase: 'idle' | 'segment-select' | 'questioning' | 'analyzing' | 'complete';
  recommendation: RecommendationResult | null;
  error: string | null;
}

const DEFAULT_STATE: OnboardingState = {
  segment: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  phase: 'segment-select',
  recommendation: null,
  error: null,
};

function loadFromStorage(): OnboardingState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<OnboardingState>;
      const merged: OnboardingState = { ...DEFAULT_STATE, ...stored };

      // ── Sanitize stuck/stale phases ──────────────────────────────────────────
      // If we landed here with 'complete' or 'analyzing' but have no cached
      // recommendation, the previous flow failed. Reset gracefully.
      if (merged.phase === 'complete' || merged.phase === 'analyzing') {
        const cached = localStorage.getItem('aa_recommendation_cache');
        if (!cached) {
          // Keep the segment + answers so the user can continue, but restart
          // from the last unanswered question (or segment select if no segment).
          merged.phase = merged.segment ? 'questioning' : 'segment-select';
          // If we have answers, figure out where to resume
          if (merged.segment && merged.answers) {
            merged.currentIndex = Object.keys(merged.answers).length;
          } else {
            merged.currentIndex = 0;
          }
        }
      }

      // If 'questioning' but questions array is empty (questions are loaded
      // async), we keep the phase — selectSegment will re-fetch them. But if
      // there's no segment at all, fall back to segment-select.
      if (merged.phase === 'questioning' && !merged.segment) {
        merged.phase = 'segment-select';
        merged.currentIndex = 0;
      }

      return merged;
    }
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function saveToStorage(state: Partial<OnboardingState>) {
  try {
    const existing = loadFromStorage();
    localStorage.setItem(LS_KEY, JSON.stringify({ ...existing, ...state }));
  } catch { /* ignore */ }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(loadFromStorage);

  // ── Mirror live state into refs so useCallback closures always see fresh values ──
  // This avoids the classic stale-closure problem without adding deps to useCallback.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // The active session token. Kept in a ref so every answer call gets the latest
  // value regardless of when React batches the state update.
  const sessionTokenRef = useRef<string | null>(getSessionToken());

  // Persist phase/answers/segment on every change
  useEffect(() => {
    saveToStorage({
      segment: state.segment,
      currentIndex: state.currentIndex,
      answers: state.answers,
      phase: state.phase === 'complete' ? 'complete' : state.phase,
    });
  }, [state.segment, state.currentIndex, state.answers, state.phase]);

  const selectSegment = useCallback(async (segment: Segment) => {
    setState((s) => ({ ...s, segment, phase: 'questioning', error: null }));
    try {
      const { questions } = await onboardingService.getQuestions(segment);
      setState((s) => ({ ...s, questions }));
    } catch (_e) {
      setState((s) => ({ ...s, error: 'Failed to load questions. Please try again.' }));
    }
  }, []);

  const submitAnswer = useCallback(async (questionId: string, answer: string) => {
    // Read from ref — always the latest committed state, no stale closure
    const { segment, answers, currentIndex, questions } = stateRef.current;
    if (!segment) return;

    const newAnswers = { ...answers, [questionId]: answer };
    const nextIndex  = currentIndex + 1;
    const isLast     = nextIndex >= questions.length;

    // Optimistically advance UI
    setState((s) => ({
      ...s,
      answers: newAnswers,
      currentIndex: nextIndex,
      phase: isLast ? 'analyzing' : 'questioning',
      error: null,
    }));

    try {
      // sessionTokenRef holds the authoritative current token — updated synchronously
      const res = await onboardingService.saveAnswer(
        sessionTokenRef.current,
        segment,
        questionId,
        answer,
      );

      // If the backend issued a new session token (first answer or post-login merge),
      // persist it immediately so subsequent calls use the same session.
      if (res.sessionToken && res.sessionToken !== sessionTokenRef.current) {
        sessionTokenRef.current = res.sessionToken;
        saveSessionToken(res.sessionToken);
      }

      if (isLast) {
        const activeToken = sessionTokenRef.current;
        if (!activeToken) {
          throw new Error('Session token unavailable. Please refresh and try again.');
        }

        const rec = await onboardingService.getRecommendation(activeToken, segment);

        // Persist for BundlesPage — multiple fallback keys
        localStorage.setItem('aa_bundle_slug', rec.bundleSlug);
        localStorage.setItem('aa_onboarding_segment', segment);
        localStorage.setItem('aa_recommendation_cache', JSON.stringify(rec));

        setState((s) => ({ ...s, recommendation: rec, phase: 'complete' }));
      }
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : '';
      const errorMsg = raw.includes('Session token')
        ? raw
        : 'Something went wrong. Please try again.';

      // Revert so user can re-answer the last question
      setState((s) => ({
        ...s,
        phase: 'questioning',
        currentIndex: isLast ? currentIndex : nextIndex,
        error: errorMsg,
      }));
    }
  }, []); // No state deps — all reads go through stateRef

  const reset = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem('aa_recommendation_cache');
    sessionTokenRef.current = null;
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    progress: state.questions.length > 0 ? (state.currentIndex / state.questions.length) * 100 : 0,
    selectSegment,
    submitAnswer,
    reset,
  };
}

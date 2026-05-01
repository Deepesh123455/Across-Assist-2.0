import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { SegmentSelector } from '../components/onboarding/SegmentSelector';
import { QuestionCard } from '../components/onboarding/QuestionCard';
import { ProgressBar } from '../components/onboarding/ProgressBar';
import { AnalyzingState } from '../components/onboarding/AnalyzingState';
import { ROUTES } from '../constants/routes';
import PageTransition from '../components/PageTransition';
import type { Segment } from '../services/onboarding.service';
import logoImg from '../assets/images/logo-for-white-bg.png';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const {
    segment, phase, currentQuestion, currentIndex,
    questions, error,
    selectSegment, submitAnswer, recommendation,
  } = useOnboarding();

  // ── If the user already has a completed recommendation, go straight to /bundles ──
  // This fires immediately on mount (no delay) so returning users are never shown
  // the segment selector unnecessarily.
  useEffect(() => {
    if (phase === 'complete' && recommendation) {
      navigate(ROUTES.BUNDLES, { replace: true });
    }
  }, [phase, recommendation, navigate]);

  // If we resumed into 'questioning' but questions haven't been loaded yet
  // (they are fetched async), re-trigger the segment selection to load them.
  useEffect(() => {
    if (phase === 'questioning' && segment && questions.length === 0) {
      selectSegment(segment);
    }
  }, [phase, segment, questions.length, selectSegment]);

  // Don't render anything while we are about to redirect
  if (phase === 'complete' && recommendation) return null;

  // Determine what to show in the main area
  let showSegmentSelect = phase === 'segment-select';
  const showQuestioning   = phase === 'questioning' && questions.length > 0 && currentQuestion != null;
  const showReloading     = phase === 'questioning' && questions.length === 0;
  const showAnalyzing     = phase === 'analyzing';
  const showComplete      = false; // We never reach this — already redirected above

  // Fallback: if somehow we are in a ghost state, force segment selector
  if (!showSegmentSelect && !showQuestioning && !showReloading && !showAnalyzing && !showComplete) {
    showSegmentSelect = true;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-inter">

        {/* Top bar */}
        <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="Across Assist" className="h-8 w-auto" />
            <span className="text-slate-200">|</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Partner Onboarding</span>
          </div>
          {authUser && (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {authUser.name} · {authUser.companyName}
            </div>
          )}
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">

            {/* Segment selection */}
            {showSegmentSelect && (
              <motion.div key="segment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SegmentSelector onSelect={(s: Segment) => selectSegment(s)} />
              </motion.div>
            )}

            {/* Questions reloading after page refresh */}
            {showReloading && (
              <motion.div key="reloading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center py-32 gap-3 text-slate-400 font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                Resuming your session…
              </motion.div>
            )}

            {/* Questioning */}
            {showQuestioning && (
              <motion.div key={`questioning-${currentIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProgressBar
                  currentStep={currentIndex + 1}
                  totalSteps={questions.length}
                  segment={segment}
                />
                <QuestionCard
                  question={currentQuestion!}
                  questionNumber={currentIndex + 1}
                  segment={segment}
                  onAnswer={submitAnswer}
                />
              </motion.div>
            )}

            {/* Analyzing — only shown while awaiting API response */}
            {showAnalyzing && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalyzingState />
              </motion.div>
            )}

            {/* Complete — brief success then auto-navigate */}
            {showComplete && (
              <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-20">
                <div className="text-6xl mb-6">✅</div>
                <h2 className="text-3xl font-black text-zinc-900 mb-3">Profile Analysed!</h2>
                <p className="text-slate-500 font-medium mb-8">Taking you to your personalised bundle recommendation…</p>
                <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin mx-auto" />
              </motion.div>
            )}

          </AnimatePresence>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

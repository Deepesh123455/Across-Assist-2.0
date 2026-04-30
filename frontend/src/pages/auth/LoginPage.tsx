import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, AlertTriangle, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import PageTransition from '../../components/PageTransition';

const OTP_LEN = 6;
const COOLDOWN = 30;

function maskEmail(e: string) {
  const [l, d] = e.split('@');
  if (!d) return e;
  return `${l.slice(0, 2)}${'*'.repeat(Math.max(0, l.length - 2))}@${d}`;
}

interface OtpBoxProps { value: string[]; onChange: (v: string[]) => void; disabled?: boolean; hasError?: boolean; }

function OtpBox({ value, onChange, disabled, hasError }: OtpBoxProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) { const n = [...value]; n[i] = ''; onChange(n); }
      else if (i > 0) { focus(i - 1); const n = [...value]; n[i - 1] = ''; onChange(n); }
    } else if (e.key === 'ArrowLeft' && i > 0) focus(i - 1);
    else if (e.key === 'ArrowRight' && i < OTP_LEN - 1) focus(i + 1);
  };

  const onChangeBox = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    if (raw.length > 1) {
      const d = raw.slice(0, OTP_LEN).split('');
      const n = Array(OTP_LEN).fill('');
      d.forEach((c, j) => { n[j] = c; });
      onChange(n); focus(Math.min(d.length, OTP_LEN - 1)); return;
    }
    const n = [...value]; n[i] = raw; onChange(n);
    if (i < OTP_LEN - 1) focus(i + 1);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (!t) return;
    const n = Array(OTP_LEN).fill('');
    t.split('').forEach((c, i) => { n[i] = c; });
    onChange(n); focus(Math.min(t.length, OTP_LEN - 1));
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={onPaste}>
      {Array.from({ length: OTP_LEN }).map((_, i) => (
        <input key={i} ref={el => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] ?? ''} disabled={disabled}
          onChange={e => onChangeBox(e, i)} onKeyDown={e => onKey(e, i)}
          onFocus={e => e.target.select()}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-40
            ${hasError
              ? 'border-red-400 bg-red-50 text-red-600'
              : value[i]
                ? 'border-[#1A56DB] text-[#0F172A]'
                : 'border-[#E2E8F0] text-[#0F172A] focus:border-[#1A56DB] focus:ring-2 focus:ring-blue-100'
            }`}
        />
      ))}
    </div>
  );
}

const slide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [otpErr, setOtpErr] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const [secs, setSecs] = useState(0);
  const [lockSecs, setLockSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (lockRef.current)  clearInterval(lockRef.current);
  }, []);

  const startCooldown = useCallback((s: number) => {
    setSecs(s);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() =>
      setSecs(p => { if (p <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; } return p - 1; }), 1000);
  }, []);

  const startLock = useCallback((s: number) => {
    setLockSecs(s);
    if (lockRef.current) clearInterval(lockRef.current);
    lockRef.current = setInterval(() =>
      setLockSecs(p => { if (p <= 1) { clearInterval(lockRef.current!); lockRef.current = null; return 0; } return p - 1; }), 1000);
  }, []);

  const validateEmail = (v: string) => {
    if (!v.trim()) { setEmailErr('Email is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setEmailErr('Enter a valid email address.'); return false; }
    setEmailErr(''); return true;
  };

  // ── Step 1 submit ──────────────────────────────────────────────────────────
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateEmail(email)) return;

    // If demo mode is on, skip OTP entirely and login right here
    if (demoMode) {
      setEmailLoading(true);
      try {
        const r = await authService.demoLogin(email.trim().toLowerCase());
        authLogin(r.user, r.tokens, r.sessionData);
        toast('Demo login successful!', 'success');
        navigate('/dashboard');
      } catch (err: any) {
        setEmailErr(err?.response?.data?.error ?? 'Demo login failed. Check the email.');
      } finally { setEmailLoading(false); }
      return;
    }

    setEmailLoading(true);
    try {
      const r = await authService.sendOtp(email.trim().toLowerCase());
      startCooldown(r.cooldownSeconds ?? COOLDOWN);
      setStep('otp'); setDigits(Array(OTP_LEN).fill('')); setOtpErr('');
    } catch (err: any) {
      const st = err?.response?.status;
      const cd = err?.response?.data?.cooldownSeconds;
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Something went wrong.';
      if (st === 429 && cd) { startCooldown(cd); setStep('otp'); setDigits(Array(OTP_LEN).fill('')); setOtpErr(''); }
      else setEmailErr(msg);
    } finally { setEmailLoading(false); }
  };

  // ── Step 2 submit ──────────────────────────────────────────────────────────
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LEN) { setOtpErr('Please enter all 6 digits.'); return; }
    setOtpLoading(true); setOtpErr('');
    try {
      const r = await authService.verifyOtp(email.trim().toLowerCase(), code);
      authLogin(r.user, r.tokens, r.sessionData);
      toast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const st = err?.response?.status;
      const rem = err?.response?.data?.remainingSeconds;
      const msg = err?.response?.data?.error ?? 'Incorrect code. Try again.';
      if (st === 403 && rem) startLock(rem);
      setOtpErr(msg); setDigits(Array(OTP_LEN).fill(''));
    } finally { setOtpLoading(false); }
  };

  const handleResend = async () => {
    if (secs > 0) return;
    setOtpErr(''); setDigits(Array(OTP_LEN).fill(''));
    try {
      const r = await authService.sendOtp(email.trim().toLowerCase());
      startCooldown(r.cooldownSeconds ?? COOLDOWN);
      toast('New code sent! Check your inbox.', 'success');
    } catch (err: any) { setOtpErr(err?.response?.data?.error ?? 'Could not resend.'); }
  };

  const handleWrongEmail = async () => {
    await authService.abortOtp(email.trim().toLowerCase());
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (lockRef.current)  { clearInterval(lockRef.current);  lockRef.current  = null; }
    setStep('email'); setEmail(''); setEmailErr('');
    setDigits(Array(OTP_LEN).fill('')); setOtpErr(''); setSecs(0); setLockSecs(0);
  };

  // ── Shared demo checkbox ───────────────────────────────────────────────────
  const DemoCheckbox = () => (
    <button
      type="button"
      onClick={() => { setDemoMode(d => !d); setOtpErr(''); }}
      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all text-left
        ${demoMode ? 'border-[#F97316] bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/50'}`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
        ${demoMode ? 'bg-[#F97316] border-[#F97316]' : 'bg-white border-slate-300'}`}>
        {demoMode && (
          <svg viewBox="0 0 12 10" className="w-3 h-3">
            <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div>
        <p className={`text-sm font-bold flex items-center gap-1.5 ${demoMode ? 'text-[#F97316]' : 'text-slate-700'}`}>
          <Zap className="w-4 h-4" /> Demo Mode
        </p>
        <p className="text-xs text-slate-500 mt-0.5">Skip OTP — login instantly for demo purposes.</p>
      </div>
    </button>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <Link to="/">
              <img src="/src/assets/images/logo-for-white-bg.png" alt="Across Assist" className="h-10 w-auto" />
            </Link>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: EMAIL ── */}
            {step === 'email' && (
              <motion.div key="step-email" {...slide}>
                <div className="mb-8">
                  <h1 className="text-3xl font-manrope font-extrabold text-[#0F172A] mb-2">Login</h1>
                  <p className="text-slate-500 text-sm">Enter your email and we'll send you a one-time code.</p>
                </div>

                <form onSubmit={handleSend} noValidate className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-bold text-[#0F172A] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        id="login-email" type="email" autoComplete="email" autoFocus
                        value={email} placeholder="john@company.com"
                        onChange={e => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                        onBlur={() => email && validateEmail(email)}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all text-sm placeholder:text-slate-400 bg-slate-50 focus:bg-white
                          ${emailErr ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#1A56DB] focus:ring-2 focus:ring-blue-100'}`}
                      />
                    </div>
                    <AnimatePresence>
                      {emailErr && (
                        <motion.p key="eerr" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />{emailErr}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Demo checkbox */}
                  <DemoCheckbox />

                  {/* Submit */}
                  <button
                    id="send-otp-btn" type="submit" disabled={emailLoading}
                    className={`w-full font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 text-base text-white shadow-lg
                      ${demoMode
                        ? 'bg-[#F97316] hover:bg-orange-600 shadow-orange-200'
                        : 'bg-[#1A56DB] hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    {emailLoading
                      ? <><RefreshCw className="w-4 h-4 animate-spin" />{demoMode ? 'Logging in…' : 'Sending code…'}</>
                      : demoMode
                        ? <><Zap className="w-4 h-4" />Login with Demo →</>
                        : 'Send Verification Code →'
                    }
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 'otp' && (
              <motion.div key="step-otp" {...slide}>
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                    <Mail className="text-[#1A56DB] w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-manrope font-extrabold text-[#0F172A] mb-2">Enter your code</h1>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{maskEmail(email)}</span>.
                    Expires in <span className="text-[#F97316] font-semibold">10 min</span>.
                  </p>
                </div>

                <form onSubmit={handleVerify} noValidate className="space-y-5">
                  {/* OTP boxes */}
                  <OtpBox value={digits} onChange={setDigits} disabled={otpLoading || lockSecs > 0} hasError={!!otpErr} />

                  <AnimatePresence>
                    {otpErr && (
                      <motion.div key="oerr" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 font-medium">{otpErr}</p>
                      </motion.div>
                    )}
                    {lockSecs > 0 && (
                      <motion.div key="lock" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-800 font-medium">
                          Locked — try again in <span className="font-bold">{Math.floor(lockSecs / 60)}:{String(lockSecs % 60).padStart(2, '0')}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verify button */}
                  <button id="verify-otp-btn" type="submit"
                    disabled={otpLoading || lockSecs > 0 || digits.join('').length < OTP_LEN}
                    className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base">
                    {otpLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Verifying…</> : 'Verify & Login →'}
                  </button>

                  {/* Resend */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Didn't receive it?</span>
                      <button id="resend-otp-btn" type="button" onClick={handleResend}
                        disabled={secs > 0 || otpLoading}
                        className={`font-bold transition-all ${secs > 0 || otpLoading ? 'text-slate-400 cursor-not-allowed' : 'text-[#1A56DB] hover:underline'}`}>
                        {secs > 0 ? `Resend in ${secs}s` : 'Resend code'}
                      </button>
                    </div>
                    <AnimatePresence>
                      {secs > 0 && (
                        <motion.div key="cdbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-[200px]">
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-[#1A56DB] rounded-full"
                              initial={{ width: '100%' }}
                              animate={{ width: `${(secs / COOLDOWN) * 100}%` }}
                              transition={{ duration: 1, ease: 'linear' }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Wrong email */}
                  <div className="border-t border-slate-100 pt-4">
                    <button id="wrong-email-btn" type="button" onClick={handleWrongEmail}
                      className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-[#1A56DB] font-medium transition-colors group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Wrong email? Start over
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

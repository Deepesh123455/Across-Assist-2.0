import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, CheckCircle2, Clock, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { authService } from '../services/auth.service';
import { onboardingService, RecommendationResult, AddOn } from '../services/onboarding.service';
import { getSessionToken } from '../lib/session';
import { ROUTES } from '../constants/routes';
import PageTransition from '../components/PageTransition';

const SEGMENT_LABELS: Record<string, string> = {
  travel: 'Travel Partner',
  gadget: 'Gadget & Appliances Partner',
  automobile: 'Automobile Partner',
};

const SEGMENT_COLOR: Record<string, string> = {
  travel: 'bg-blue-100 text-blue-700 border-blue-200',
  gadget: 'bg-purple-100 text-purple-700 border-purple-200',
  automobile: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();

  const [profileStatus, setProfileStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getSessionToken();
      if (!token) { setLoading(false); return; }
      try {
        const data = await onboardingService.getProfileStatus(token);
        setProfileStatus(data);
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await authService.logout();
    authLogout();
    navigate('/');
  };

  const segment = profileStatus?.segment;
  const isComplete = profileStatus?.isComplete ?? false;
  const currentStep = profileStatus?.currentStep ?? 0;
  const totalSteps = profileStatus?.totalSteps ?? 12;
  const pct = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
  const rec: RecommendationResult | null = profileStatus?.recommendation ?? null;

  const answers = profileStatus?.answers ?? {};

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-zinc-50 font-inter">
        {authUser && (
          <DashboardSidebar
            userName={authUser.name}
            companyName={authUser.companyName || 'Corporate Partner'}
            initials={getInitials(authUser.name)}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 ${authUser ? 'lg:ml-72' : ''} overflow-y-auto`}>
          <div className="max-w-4xl mx-auto px-8 py-12 space-y-10">

            {/* Header */}
            <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
                <User className="w-4 h-4" />
                Your Profile
              </div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                {authUser?.name ?? 'Partner Profile'}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {authUser?.companyName ?? ''} · Onboarding Status
              </p>
            </motion.header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !profileStatus ? (
              /* No session yet */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-[#1A56DB]" />
                </div>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">No Onboarding Data Yet</h2>
                <p className="text-slate-500 mb-8">Start the onboarding questionnaire to get your personalized bundle recommendation.</p>
                <button
                  onClick={() => {
                    localStorage.removeItem('aa_onboarding');
                    localStorage.removeItem('aa_recommendation_cache');
                    localStorage.removeItem('aa_session_token');
                    navigate(ROUTES.ONBOARDING);
                  }}
                  className="bg-[#1A56DB] text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  Start Onboarding
                </button>
              </motion.div>
            ) : isComplete && rec ? (
              /* Completed — show recommendation summary */
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border ${segment ? SEGMENT_COLOR[segment] : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {SEGMENT_LABELS[segment] ?? 'Partner'}
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Onboarding Complete
                  </div>
                </div>

                {/* Active Bundle Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Active Bundle</div>
                      <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{rec.bundleName}</h2>
                      {rec.bundleTagline && <p className="text-slate-500 mt-1">{rec.bundleTagline}</p>}
                    </div>
                    <div className="bg-blue-50 text-[#1A56DB] p-3 rounded-2xl">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {rec.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                          {p.iconEmoji ?? '🛡️'}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-sm">{p.name}</div>
                          {p.isAnchor && <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Anchor Product</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Annual Revenue', value: rec.metrics.projectedAnnualRevenue >= 10_000_000
                          ? `₹${(rec.metrics.projectedAnnualRevenue / 10_000_000).toFixed(2)} Cr`
                          : `₹${rec.metrics.projectedAnnualRevenue.toLocaleString('en-IN')}` },
                      { label: 'Attach Rate', value: `${(rec.metrics.attachRate * 100).toFixed(0)}%` },
                      { label: 'Plan Value', value: `₹${rec.metrics.planValue.toLocaleString('en-IN')}` },
                      { label: 'Rev. Share', value: `${(rec.metrics.revenueShare * 100).toFixed(0)}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                        <div className="text-xl font-black text-[#1A56DB]">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Add-ons summary */}
                  {rec.addOns.length > 0 && (
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Available Add-Ons</div>
                      <div className="flex flex-wrap gap-2">
                        {rec.addOns.map((a: AddOn) => (
                          <span key={a.id} className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            {a.icon} {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(ROUTES.BUNDLES)}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    View Full Bundle Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

            ) : (
              /* Incomplete onboarding */
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Onboarding In Progress
                      </div>
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                        {segment ? SEGMENT_LABELS[segment] : 'Questionnaire not started'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-[#1A56DB]">{pct}%</div>
                      <div className="text-xs text-slate-400 font-bold">Complete</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <motion.div
                      className="h-full bg-[#1A56DB] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                  </div>

                  <p className="text-slate-500 text-sm font-medium mb-2">
                    {currentStep} of {totalSteps} questions answered
                  </p>

                  {/* Answered questions summary */}
                  {Object.keys(answers).length > 0 && (
                    <div className="mt-6 space-y-2">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Your Answers So Far</div>
                      {Object.entries(answers).slice(0, 5).map(([qId, ans]) => (
                        <div key={qId} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-slate-600 font-medium capitalize">{qId.replace(/_/g, ' ')}: <span className="text-zinc-900 font-bold">{String(ans)}</span></span>
                        </div>
                      ))}
                      {Object.keys(answers).length > 5 && (
                        <p className="text-xs text-slate-400 pl-7">+{Object.keys(answers).length - 5} more answered</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(ROUTES.ONBOARDING)}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Zap className="w-4 h-4" />
                    {currentStep > 0 ? 'Resume Onboarding' : 'Start Onboarding'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </PageTransition>
  );
}

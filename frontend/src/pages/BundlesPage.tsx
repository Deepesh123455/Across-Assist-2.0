import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Zap, CheckCircle2, TrendingUp, Users,
  MessageSquare, ExternalLink, Package, Star, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { onboardingService, RecommendationResult, AddOn } from '../services/onboarding.service';
import { AddOnCard } from '../components/AddOnCard';
import { DashboardSidebar } from '../components/DashboardSidebar';
import PageTransition from '../components/PageTransition';
import { authService } from '../services/auth.service';
import { getSessionToken } from '../lib/session';
import { ROUTES } from '../constants/routes';

const SEGMENT_THEME: Record<string, { accent: string; badge: string; bg: string }> = {
  travel:     { accent: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700 border-blue-200',     bg: 'from-blue-50 to-indigo-50/50' },
  gadget:     { accent: 'text-purple-600',  badge: 'bg-purple-100 text-purple-700 border-purple-200', bg: 'from-purple-50 to-violet-50/50' },
  automobile: { accent: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bg: 'from-emerald-50 to-teal-50/50' },
};

function fmt(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Try multiple strategies to load the recommendation:
 * 1. In-memory cache (passed via location state) — fastest
 * 2. localStorage cache written by useOnboarding immediately after recommendation
 * 3. Backend profile status endpoint — authoritative but slowest
 * 4. Redirect to onboarding if all fail
 */
async function loadRecommendation(sessionToken: string | null): Promise<RecommendationResult | null> {
  // Strategy 2: localStorage cache written by the onboarding hook
  try {
    const cached = localStorage.getItem('aa_recommendation_cache');
    if (cached) {
      const parsed = JSON.parse(cached) as RecommendationResult;
      if (parsed?.bundleSlug) return parsed;
    }
  } catch { /* ignore */ }

  // Strategy 3: backend fetch
  if (sessionToken) {
    try {
      const status = await onboardingService.getProfileStatus(sessionToken);
      if (status?.recommendation) return status.recommendation as RecommendationResult;
    } catch { /* ignore */ }
  }

  return null;
}

export default function BundlesPage() {
  const navigate   = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();

  const [rec, setRec]                     = useState<RecommendationResult | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [retrying, setRetrying]           = useState(false);

  const segment = localStorage.getItem('aa_onboarding_segment') ?? 'gadget';
  const theme   = SEGMENT_THEME[segment] ?? SEGMENT_THEME['gadget'];

  const load = async (showRetry = false) => {
    if (showRetry) setRetrying(true); else setLoading(true);
    setError(null);

    const sessionToken = getSessionToken();
    const result = await loadRecommendation(sessionToken);

    if (result) {
      setRec(result);
      const defaults = new Set<string>(
        (result.addOns as AddOn[]).filter((a: AddOn) => a.isDefault).map((a: AddOn) => a.id),
      );
      setSelectedAddOns(defaults);
    } else {
      // If we genuinely have nothing, redirect back
      if (!showRetry) {
        navigate(ROUTES.ONBOARDING, { replace: true });
      } else {
        setError('Could not load your recommendation. Please complete onboarding again.');
      }
    }

    setLoading(false);
    setRetrying(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addOnTotal = rec?.addOns
    .filter((a) => selectedAddOns.has(a.id))
    .reduce((sum, a) => sum + a.price, 0) ?? 0;

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await authService.logout();
    authLogout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-sm">Loading your recommendation...</p>
        </div>
      </div>
    );
  }

  if (error || !rec) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md space-y-4">
          <p className="text-red-600 font-bold">{error ?? 'Recommendation not found.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => load(true)}
              disabled={retrying}
              className="flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying…' : 'Retry'}
            </button>
            <button
              onClick={() => navigate(ROUTES.ONBOARDING)}
              className="bg-[#1A56DB] text-white font-black px-8 py-3 rounded-2xl"
            >
              Redo Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics    = rec.metrics;
  const whyReasons = Array.isArray(rec.whyThisBundle) ? rec.whyThisBundle : [];

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

          {/* Hero Banner */}
          <div className={`bg-gradient-to-br ${theme.bg} border-b border-slate-100`}>
            <div className="max-w-6xl mx-auto px-8 py-12">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border mb-6 ${theme.badge}`}>
                  <Zap className="w-3 h-3 fill-current" /> AI-Powered Recommendation
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-3">
                  {rec.bundleName}
                </h1>
                {rec.bundleTagline && (
                  <p className="text-slate-500 text-xl font-medium mb-8">{rec.bundleTagline}</p>
                )}

                {/* Key metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Est. Annual Revenue', value: fmt(metrics.projectedAnnualRevenue), icon: TrendingUp },
                    { label: 'Attach Rate',          value: `${(metrics.attachRate * 100).toFixed(0)}%`, icon: Star },
                    { label: 'Plan Value',            value: `₹${metrics.planValue.toLocaleString('en-IN')}`, icon: Package },
                    { label: 'Revenue Share',         value: `${(metrics.revenueShare * 100).toFixed(0)}%`, icon: Users },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${theme.accent}`} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                      </div>
                      <div className={`text-2xl font-black ${theme.accent} tracking-tight`}>{value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 py-12 space-y-12 pb-24">

            {/* Included Products */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-6 flex items-center gap-2">
                <ShieldCheck className={`w-6 h-6 ${theme.accent}`} />
                Included in Your Bundle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rec.products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                    className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                        {product.iconEmoji ?? '🛡️'}
                      </div>
                      {product.isAnchor && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 border border-orange-200 px-2 py-1 rounded-lg">
                          Anchor
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-zinc-900 mb-1">{product.name}</h3>
                    {product.tagline && <p className="text-slate-500 text-sm leading-relaxed">{product.tagline}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Strategic Rationale */}
            {whyReasons.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-blue-600/15 blur-[80px] rounded-full" />
                  <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Why This Bundle
                  </h2>
                  <ul className="space-y-4">
                    {whyReasons.map((reason: string, i: number) => (
                      <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  {rec.objectionHandler && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Common Objection Handled</p>
                      <p className="text-slate-300 text-sm italic">"{rec.objectionHandler}"</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Add-Ons */}
            {rec.addOns.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Contextual Add-Ons
                  </h2>
                  {selectedAddOns.size > 0 && (
                    <motion.div
                      key={addOnTotal}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-[#1A56DB] text-white text-sm font-black px-5 py-2 rounded-full"
                    >
                      +{fmt(addOnTotal)} selected
                    </motion.div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rec.addOns.map((addon) => (
                    <AddOnCard
                      key={addon.id}
                      addon={addon}
                      isSelected={selectedAddOns.has(addon.id)}
                      onToggle={toggleAddOn}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Similar Clients */}
            {rec.similarClients.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-6 flex items-center gap-2">
                  <Users className={`w-6 h-6 ${theme.accent}`} />
                  Similar Partners Using This Bundle
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rec.similarClients.map((client, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-xs font-black text-slate-500">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="font-bold text-zinc-900 text-sm">{client.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{client.tier}</div>
                      {client.monthlyUnits && (
                        <div className="text-xs text-slate-500 mt-1">
                          {client.monthlyUnits.toLocaleString('en-IN')} units/mo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

          </div>

          {/* Sticky CTA bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-8 py-5 flex items-center justify-between z-50 lg:left-72">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bundle Value</div>
              <div className="text-2xl font-black text-zinc-900">
                ₹{metrics.planValue.toLocaleString('en-IN')}
                {addOnTotal > 0 && (
                  <span className="text-[#1A56DB]"> + {fmt(addOnTotal)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ROUTES.CHAT)}
                className="hidden md:flex items-center gap-2 border-2 border-slate-200 hover:border-[#1A56DB] text-slate-700 hover:text-[#1A56DB] font-bold px-6 py-3 rounded-2xl transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI Advisor
              </button>
              <button
                onClick={() => navigate(ROUTES.CONTACT)}
                className="flex items-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:translate-y-[-1px]"
              >
                Finalize Commercials <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

        </main>
      </div>
    </PageTransition>
  );
}

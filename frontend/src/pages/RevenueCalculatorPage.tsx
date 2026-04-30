import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { getFormData } from '../lib/session';
import PageTransition from '../components/PageTransition';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

type ShareType = 'oem' | 'retailer' | 'nbfc';

const shareConfig: Record<ShareType, { label: string; rate: number; desc: string }> = {
  oem:      { label: 'OEM / Brand',    rate: 0.25, desc: '₹300 per ₹1,200 plan' },
  retailer: { label: 'Retailer',       rate: 0.21, desc: '₹250 per ₹1,200 plan' },
  nbfc:     { label: 'NBFC / Fintech', rate: 0.08, desc: '₹100 per ₹1,200 plan' },
};

const VOLUME_MAP: Record<string, number> = {
  'Under 5K units': 5000, '5K–50K': 25000, '50K–5L': 100000, '5L+ units': 500000,
};
const PARTNER_TO_SHARE: Record<string, ShareType> = {
  'OEM/Brand': 'oem', 'Retailer': 'retailer', 'NBFC/Fintech': 'nbfc',
  'Marketplace': 'retailer', 'Telecom': 'retailer',
};

function formatINR(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}
function formatUnits(v: number) {
  if (v >= 100_000) return `${(v / 100_000).toFixed(1)}L`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    cancelAnimationFrame(rafRef.current);
    startRef.current = 0;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 350, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else { setDisplay(to); fromRef.current = to; }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <span className="tabular-nums">{format(display)}</span>;
}

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-brand-dark font-body">{label}</span>
        <span className="font-heading text-base font-extrabold text-[#1A56DB] tracking-tight">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1"
        style={{ background: `linear-gradient(to right, #1A56DB ${pct}%, #E2E8F0 ${pct}%)` }}
      />
      <div className="flex justify-between text-[10px] text-brand-textSecondary font-medium">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function RevenueCalculatorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();
  const saved = getFormData();

  const initUnits = saved?.monthlyVolume ? (VOLUME_MAP[saved.monthlyVolume] ?? 10000) : 10000;
  const initShare: ShareType = saved?.clientType ? (PARTNER_TO_SHARE[saved.clientType] ?? 'retailer') : 'retailer';

  const [units, setUnits] = useState<number>(location.state?.units ?? initUnits);
  const [attach, setAttach] = useState<number>(30);
  const [planVal, setPlanVal] = useState<number>(1200);
  const [share, setShare] = useState<ShareType>(location.state?.share ?? initShare);

  const plansSold = Math.round(units * attach / 100);
  const annualRevenue = plansSold * 12 * planVal;
  const annualEarnings = Math.round(annualRevenue * shareConfig[share].rate);

  const handleLogout = async () => {
    await authService.logout();
    authLogout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const results = [
    { label: 'Plans Sold / Month', value: plansSold, format: (n: number) => n.toLocaleString('en-IN'), sub: `${attach}% of ${formatUnits(units)} units`, accent: false },
    { label: 'Total Plan Revenue / Year', value: annualRevenue, format: formatINR, sub: `@ ₹${planVal.toLocaleString()} avg plan value`, accent: false },
    { label: 'Your Earnings / Year', value: annualEarnings, format: formatINR, sub: `${Math.round(shareConfig[share].rate * 100)}% share · ${shareConfig[share].desc}`, accent: true },
  ];

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

        <main className={`flex-1 ${authUser ? 'lg:ml-72' : ''} min-h-screen pb-20`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="max-w-xl mb-12"
            >
              <span className="bg-orange-50 text-[#F97316] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-orange-100">
                Revenue Calculator
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mt-6 mb-4">
                Calculate Your <span className="text-[#1A56DB]">Revenue Opportunity</span>
              </h1>
              <p className="font-medium text-slate-500 text-lg leading-relaxed">
                Drag the sliders to model your potential annual earnings from Across Assist protection plans.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl bg-white"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                <div className="p-8 lg:p-12 space-y-10 bg-white">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2">Adjust Your Parameters</h3>
                    <p className="text-sm text-slate-500 font-medium">Move sliders to model different scenarios.</p>
                  </div>
                  
                  <div className="space-y-8">
                    <Slider label="Monthly Unit Sales" value={units} min={1000} max={1000000} step={1000} format={formatUnits} onChange={setUnits} />
                    <Slider label="Plan Attachment Rate" value={attach} min={10} max={60} step={1} format={(v) => `${v}%`} onChange={setAttach} />
                    <Slider label="Average Plan Value" value={planVal} min={800} max={2500} step={100} format={(v) => `₹${v.toLocaleString()}`} onChange={setPlanVal} />
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-widest">Your Partner Type</p>
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(shareConfig) as ShareType[]).map((k) => (
                        <button key={k} onClick={() => setShare(k)}
                          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                            share === k 
                              ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20 scale-105' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                          }`}
                        >
                          {shareConfig[k].label}
                          <span className={`ml-2 text-xs font-medium ${share === k ? 'text-blue-100' : 'text-slate-400'}`}>
                            {Math.round(shareConfig[k].rate * 100)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex flex-col gap-6 bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2">Revenue Projection</h3>
                    <p className="text-sm text-slate-500 font-medium">Updates in real time as you move the sliders.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {results.map((r) => (
                      <div key={r.label} className={`rounded-3xl p-8 transition-all ${
                        r.accent 
                          ? 'bg-gradient-to-br from-[#1A56DB] to-[#1e40af] text-white shadow-xl shadow-blue-500/20 border border-blue-400/20' 
                          : 'bg-white border border-slate-100 shadow-sm'
                      }`}>
                        <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-2 ${r.accent ? 'text-blue-200' : 'text-slate-400'}`}>{r.label}</p>
                        <p className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-2 ${r.accent ? 'text-white' : 'text-[#F97316]'}`}>
                          <AnimatedNumber value={r.value} format={r.format} />
                        </p>
                        <p className={`text-sm font-bold ${r.accent ? 'text-blue-100/70' : 'text-slate-500'}`}>{r.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4">
                    <button 
                      onClick={() => navigate(`${ROUTES.CONTACT}?type=revenue-model`)} 
                      className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      Get a Custom Revenue Model <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate(ROUTES.ADVISOR)} 
                      className="w-full text-sm text-[#1A56DB] font-bold text-center hover:bg-blue-50 py-3 rounded-xl transition-colors"
                    >
                      Want AI-powered bundle recommendations? →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ShareType = 'oem' | 'retailer' | 'nbfc';

const shareConfig: Record<ShareType, { label: string; rate: number; desc: string }> = {
  oem:      { label: 'OEM / Brand',    rate: 0.25, desc: '₹300 per ₹1,200 plan' },
  retailer: { label: 'Retailer',       rate: 0.21, desc: '₹250 per ₹1,200 plan' },
  nbfc:     { label: 'NBFC / Fintech', rate: 0.08, desc: '₹100 per ₹1,200 plan' },
};

function formatINR(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatUnits(v: number) {
  if (v >= 100_000) return `${(v / 100_000).toFixed(1)}L`;
  if (v >= 1_000)   return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

/* Animated number that smoothly transitions when value changes */
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
    const duration = 350;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
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

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-brand-dark font-body">{label}</span>
        <span className="font-heading text-base font-extrabold text-brand-blue tracking-tight">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1"
        style={{ background: `linear-gradient(to right, #1A56DB ${pct}%, #E2E8F0 ${pct}%)` }}
      />
      <div className="flex justify-between text-[10px] text-brand-textSecondary font-medium">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function Calculator() {
  const [units, setUnits]       = useState(10000);
  const [attach, setAttach]     = useState(30);
  const [planVal, setPlanVal]   = useState(1200);
  const [share, setShare]       = useState<ShareType>('retailer');

  const plansSold      = Math.round(units * attach / 100);
  const annualRevenue  = plansSold * 12 * planVal;
  const annualEarnings = Math.round(annualRevenue * shareConfig[share].rate);

  const results = [
    {
      label: 'Plans Sold / Month',
      value: plansSold,
      format: (n: number) => n.toLocaleString('en-IN'),
      sub: `${attach}% of ${formatUnits(units)} units`,
      accent: false,
    },
    {
      label: 'Total Plan Revenue / Year',
      value: annualRevenue,
      format: formatINR,
      sub: `@ ₹${planVal.toLocaleString()} avg plan value`,
      accent: false,
    },
    {
      label: `Your Earnings / Year`,
      value: annualEarnings,
      format: formatINR,
      sub: `${Math.round(shareConfig[share].rate * 100)}% share · ${shareConfig[share].desc}`,
      accent: true,
    },
  ];

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mb-10"
        >
          <span className="section-label">Revenue Calculator</span>
          <h2 className="section-title mt-3 mb-4">Calculate Your Revenue Opportunity</h2>
          <p className="font-body text-brand-textSecondary text-base leading-relaxed">
            Drag the sliders to model your potential annual earnings from Across Assist protection plans.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 8px 40px rgba(0,0,0,0.07)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

            {/* ── Sliders ───────────────────────────────────── */}
            <div className="p-8 lg:p-10 space-y-8 bg-white">
              <div>
                <h3 className="font-heading text-base font-extrabold text-brand-dark tracking-tight mb-0.5">Adjust Your Parameters</h3>
                <p className="text-xs text-brand-textSecondary font-body">Move sliders to model different scenarios.</p>
              </div>

              <Slider
                label="Monthly Unit Sales"
                value={units} min={1000} max={1000000} step={1000}
                format={formatUnits}
                onChange={setUnits}
              />
              <Slider
                label="Plan Attachment Rate"
                value={attach} min={10} max={60} step={1}
                format={(v) => `${v}%`}
                onChange={setAttach}
              />
              <Slider
                label="Average Plan Value"
                value={planVal} min={800} max={2500} step={100}
                format={(v) => `₹${v.toLocaleString()}`}
                onChange={setPlanVal}
              />

              {/* Partner type toggle */}
              <div>
                <p className="text-sm font-semibold text-brand-dark mb-3 font-body">Your Partner Type</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(shareConfig) as ShareType[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setShare(k)}
                      className={`pill-btn text-sm ${share === k ? 'pill-btn-active' : 'pill-btn-inactive'}`}
                    >
                      {shareConfig[k].label}
                      <span className={`ml-1.5 text-xs font-normal ${share === k ? 'opacity-75' : 'text-brand-textSecondary'}`}>
                        {Math.round(shareConfig[k].rate * 100)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Results ───────────────────────────────────── */}
            <div className="p-8 lg:p-10 flex flex-col gap-5" style={{ background: 'linear-gradient(160deg, #F8FAFF 0%, #fafafa 100%)' }}>
              <div>
                <h3 className="font-heading text-base font-extrabold text-brand-dark tracking-tight mb-0.5">Revenue Projection</h3>
                <p className="text-xs text-brand-textSecondary font-body">Updates in real time as you move the sliders.</p>
              </div>

              {results.map((r) => (
                <AnimatePresence key={r.label} mode="wait">
                  <motion.div
                    key={r.value}
                    layout
                    className="rounded-2xl p-5"
                    style={r.accent ? {
                      background: 'linear-gradient(135deg, #1A56DB 0%, #2563eb 100%)',
                      boxShadow: '0 4px 20px rgba(26,86,219,0.2)',
                    } : {
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-1 ${r.accent ? 'text-blue-200' : 'text-brand-textSecondary'}`}>
                      {r.label}
                    </p>
                    <p className={`font-heading text-[2rem] font-extrabold tracking-tight leading-none mb-1 ${r.accent ? 'text-white' : 'text-brand-orange'}`}>
                      <AnimatedNumber value={r.value} format={r.format} />
                    </p>
                    <p className={`text-xs font-medium ${r.accent ? 'text-blue-200' : 'text-brand-textSecondary'}`}>{r.sub}</p>
                  </motion.div>
                </AnimatePresence>
              ))}

              <p className="text-[10px] leading-relaxed text-brand-textSecondary font-body mt-auto">
                * Based on industry-average attachment rates. Actual results may vary. Contact us for a bespoke revenue model.
              </p>

              <button
                onClick={() => document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-orange w-full justify-center py-3.5 rounded-2xl text-sm"
              >
                Get a Custom Revenue Model →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

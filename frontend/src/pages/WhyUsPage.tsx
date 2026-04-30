import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Map, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

function CountUp({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let t0: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{end >= 10000 ? count.toLocaleString('en-IN') : count.toLocaleString()}{suffix}
    </span>
  );
}

const WhyUsPage = () => {
  const navigate = useNavigate();

  const STATS = [
    { value: 10, suffix: '+', label: 'Years Experience' },
    { value: 400, suffix: '+', label: 'Service Centers' },
    { value: 12000, suffix: '+', label: 'Retail POS' },
    { value: 150000, suffix: '+', label: 'Claims Settled' },
    { value: 95, suffix: '%+', label: 'Approval Rate' },
    { value: 4, suffix: ' Days', label: 'Avg. Settlement Time' },
    { value: 20, suffix: '+', label: 'States Covered' },
    { value: 20, suffix: '+', label: 'Languages Supported' },
    { value: 100, suffix: '+', label: 'Institutional Partners' },
  ];

  const TIMELINE = [
    { phase: 'Phase 1', title: 'Commercial Alignment', desc: 'Finalizing revenue share, customized bundle pricing, and legal sign-off.' },
    { phase: 'Phase 2', title: 'API Integration', desc: 'Plug & play integration with your POS or digital journey (usually under 48 hours).' },
    { phase: 'Phase 3', title: 'Sales Training', desc: 'Our team trains your ground staff or digital teams on objection handling and pitches.' },
    { phase: 'Phase 4', title: 'Pilot Launch', desc: 'Controlled rollout in select stores or digital segments to monitor attachment rates.' },
    { phase: 'Phase 5', title: 'Nationwide Scale', desc: 'Full-scale rollout across all your touchpoints with continuous AI-driven optimization.' },
  ];

  return (
    <PageTransition>
      <div className="bg-[#F8FAFC] min-h-screen pb-20 font-inter">
        {/* Hero & Stats Section */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center bg-[#FFF7ED] text-[#F97316] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Our Network Strength
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-[#0F172A] mb-6">
              Built on <span className="text-[#1A56DB]">Scale.</span><br />
              Proven by <span className="text-[#1A56DB]">Numbers.</span>
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-16">
              We've built the most robust gadget protection network in India, ensuring your customers get seamless service while you get guaranteed revenue.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
              {STATS.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-3xl lg:text-4xl font-manrope font-extrabold text-[#1A56DB] mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={1500 + idx * 100} />
                  </div>
                  <div className="text-sm font-semibold text-[#475569]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Brands Choose Us */}
        <section className="py-16 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex bg-[#FFF7ED] text-[#F97316] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                The Across Assist Advantage
              </div>
              <h2 className="text-3xl lg:text-4xl font-manrope font-extrabold text-[#0F172A]">Why Brands Choose Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#E2E8F0] mb-6 shadow-sm">
                  <TrendingUp className="w-7 h-7 text-[#F97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Fastest Growing</h3>
                <p className="text-[#475569]">Experiencing 30-40% YoY growth. Trusted by over 100+ institutional partners from NBFCs to top OEMs.</p>
              </div>
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#E2E8F0] mb-6 shadow-sm">
                  <ShieldCheck className="w-7 h-7 text-[#F97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Highest Claim Ratio</h3>
                <p className="text-[#475569]">Industry-leading 95%+ claims approval rate with an average 4-day settlement timeframe ensuring zero customer friction.</p>
              </div>
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#E2E8F0] mb-6 shadow-sm">
                  <Map className="w-7 h-7 text-[#F97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Pan-India Reach</h3>
                <p className="text-[#475569]">Seamlessly serving customers across 20+ states with localized support in 20+ languages.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-manrope font-extrabold text-[#0F172A]">Go Live in 5 Simple Steps</h2>
            </div>

            <div className="space-y-6">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm items-start md:items-center">
                  <div className="flex-shrink-0 w-24">
                    <div className="text-sm font-bold text-[#F97316] uppercase tracking-wider">{item.phase}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1A56DB] flex items-center justify-center font-bold text-xl flex-shrink-0 hidden md:flex">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0F172A] mb-1">{item.title}</h4>
                    <p className="text-[#475569] text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto bg-[#0F172A] rounded-3xl p-10 md:p-16 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-manrope font-extrabold text-white mb-6">Ready to Partner?</h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto">
              Join the fastest-growing 360° protection platform in India and unlock a new high-margin revenue stream.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/advisor')}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/20 inline-flex items-center justify-center gap-2"
              >
                Get Bundle Recommendation <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-full transition-all text-center"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default WhyUsPage;
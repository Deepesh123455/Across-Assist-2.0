import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import AnimatedParticles from './AnimatedParticles';
import {
  badgeVariants,
  heroTitleVariants,
  buttonVariants,
  floatingVariants,
  easing,
} from '../lib/animations';

interface StatItem { value: number; prefix?: string; suffix: string; label: string }

const stats: StatItem[] = [
  { value: 100, suffix: '+', label: 'Institutional Clients' },
  { value: 5, suffix: 'Mn+', label: 'Lives Insured' },
  { value: 12, prefix: '$', suffix: 'Mn+', label: 'AUM' },
  { value: 95, suffix: '%+', label: 'Claims Approved' },
  { value: 150000, suffix: '+', label: 'Claims Settled' },
];

function CountUp({ end, prefix = '', suffix = '', duration = 2200 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
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

const HeroCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 32, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.55, ease: easing.swift }}
    className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-72 xl:w-80"
  >
    <motion.div
      variants={floatingVariants}
      animate="animate"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(26,86,219,0.15), transparent)',
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div
        className="relative rounded-3xl p-6 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-brand-textSecondary tracking-widest uppercase">Platform Snapshot</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        {[
          { label: 'Claims Approval Rate', value: '95%', color: 'bg-emerald-500', width: 'w-[95%]' },
          { label: 'Partner Retention', value: '92%', color: 'bg-brand-blue', width: 'w-[92%]' },
          { label: 'Claim Settlement Speed', value: '4 days avg', color: 'bg-brand-orange', width: 'w-[88%]' },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-brand-textSecondary font-medium">{row.label}</span>
              <span className="text-xs font-bold text-brand-dark">{row.value}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                className={`h-full ${row.color} rounded-full ${row.width}`}
              />
            </div>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100 grid grid-cols-2 gap-3">
          {[{ val: '400+', lbl: 'Service Centers' }, { val: '20+', lbl: 'States Covered' }].map((s) => (
            <motion.div
              key={s.lbl}
              className="text-center py-2 rounded-xl bg-slate-50/80"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-heading text-lg font-extrabold text-brand-blue">{s.val}</div>
              <div className="text-[10px] text-brand-textSecondary mt-0.5">{s.lbl}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative pt-[88px] pb-12 lg:pb-16 overflow-hidden bg-white mesh-gradient">
      {/* Decorative noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />

      {/* Animated particles background */}
      <AnimatedParticles />

      {/* Static background elements */}
      <div
        className="absolute inset-0 bg-dots-fade pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(26,86,219,0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Large decorative blurs */}
      <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative lg:pr-80 xl:pr-96">

          {/* Badge with enhanced animation */}
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6"
          >
            <motion.div
              className="flex items-center gap-2.5 px-5 py-2.5 mt-2 rounded-full glass-enterprise"
              whileHover={{
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="w-2.5 h-2.5 rounded-full bg-brand-orange flex-shrink-0"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] font-black text-brand-blue tracking-widest uppercase">Global Enterprise Standard</span>
            </motion.div>
          </motion.div>

          {/* Main headline with split-text effect */}
          <motion.h1
            variants={heroTitleVariants}
            initial="hidden"
            animate="visible"
            className="font-heading pt-2 font-black leading-[1.15] tracking-[-0.04em] mb-6 balance"
            style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)' }}
          >
            <div className="overflow-hidden mb-2">
              <motion.span
                className="block text-slate-900"
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                India's Fastest Growing
              </motion.span>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.span
                className="block text-gradient-blue"
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                360° Protection
              </motion.span>
            </div>
            <div className="overflow-hidden mb-2">
              <div className="relative inline-block pb-4">
                <motion.span
                  className="block text-gradient-blue"
                  initial={{ y: '100%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Platform
                </motion.span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-brand-orange via-brand-blue to-brand-orange"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.9, ease: easing.smooth }}
                  style={{ originX: 0 }}
                />
              </div>
            </div>
          </motion.h1>

          {/* Subheading with refined typography */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easing.smooth }}
            className="font-body text-lg md:text-xl text-slate-600/90 leading-relaxed mb-8 max-w-2xl font-medium"
          >
            Powering gadget, travel, and automotive protection for{' '}
            <span className="font-extrabold text-slate-900 border-b-2 border-brand-orange/30">
              5 Million+ lives
            </span>{' '}
            across India's largest institutional brands.
          </motion.p>

          {/* CTA Buttons with premium styling */}
          <motion.div
            className="flex flex-wrap gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <motion.button
              onClick={() => navigate(ROUTES.LOGIN)}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className="btn-primary text-sm px-10 py-4.5 group"
            >
              <span className="relative z-10">Get Started →</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ skewX: '-20deg' }}
              />
            </motion.button>
            <motion.button
              onClick={() => navigate(ROUTES.LOGIN)}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className="btn-secondary text-sm px-10 py-4.5"
            >
              Explore Plans
            </motion.button>
          </motion.div>

          {/* Stats section with enhanced visuals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easing.smooth }}
          >
            <div className="pt-10 border-t border-slate-200/60">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-col group cursor-default"
                  >
                    <motion.div
                      className="font-heading text-3xl font-black text-brand-orange leading-none tracking-tighter mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CountUp end={stat.value} prefix={stat.prefix ?? ''} suffix={stat.suffix} duration={2000 + i * 150} />
                    </motion.div>
                    <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase opacity-80 group-hover:text-brand-blue group-hover:opacity-100 transition-all">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Card with enhanced Enterprise styling */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-72 xl:w-80 animate-float">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}


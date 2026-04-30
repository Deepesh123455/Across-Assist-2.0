import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { easing, scrollRevealVariants } from '../lib/animations';

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  desc: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const stats: Stat[] = [
  { value: 150000, suffix: '+', label: 'Claims Settled', desc: 'Successfully resolved across all product lines', icon: '🏆', iconBg: 'rgba(249,115,22,0.1)', iconColor: '#F97316' },
  { value: 400, suffix: '+', label: 'ASC Network', desc: 'Authorized service centers for mobile, gadgets & appliances', icon: '🔧', iconBg: 'rgba(26,86,219,0.08)', iconColor: '#1A56DB' },
  { value: 12000, suffix: '+', label: 'Retail POS Covered', desc: 'Active point-of-sale integrations across India', icon: '🏪', iconBg: 'rgba(5,150,105,0.08)', iconColor: '#059669' },
  { value: 2200, suffix: '+', label: 'On-field Agents', desc: 'Dedicated support agents in major cities', icon: '👥', iconBg: 'rgba(124,58,237,0.08)', iconColor: '#7C3AED' },
  { value: 95, suffix: '%+', label: 'Claims Approved', desc: 'Industry-leading claim approval rate', icon: '✅', iconBg: 'rgba(5,150,105,0.08)', iconColor: '#059669' },
  { value: 20, suffix: '+', label: 'States Served', desc: 'Pan-India presence across all major states', icon: '🗺️', iconBg: 'rgba(26,86,219,0.08)', iconColor: '#1A56DB' },
  { value: 25, suffix: '', label: 'Strategic Partners', desc: 'Pan India distribution partners', icon: '🤝', iconBg: 'rgba(249,115,22,0.1)', iconColor: '#F97316' },
  { value: 24, suffix: '×7', label: 'Global Alarm Center', desc: 'Round-the-clock monitoring & support', icon: '📡', iconBg: 'rgba(239,68,68,0.08)', iconColor: '#ef4444' },
  { value: 20, suffix: '+', label: 'Language Support', desc: 'Customer assistance in regional languages', icon: '🗣️', iconBg: 'rgba(245,158,11,0.08)', iconColor: '#d97706' },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let t0: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 1600, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * stat.value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  const formatted = stat.value >= 10000 ? n.toLocaleString('en-IN') : n.toLocaleString();
  return <span ref={ref} className="tabular-nums">{stat.prefix ?? ''}{formatted}{stat.suffix}</span>;
}

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1, ease: easing.smooth } } };
const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easing.swift },
  },
};

export default function NetworkStats() {
  return (
    <section id="network" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: easing.smooth }}
          >
            Our Network
          </motion.span>
          <motion.h2
            className="section-title mt-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: easing.swift }}
          >
            Built on Scale. Proven by Numbers.
          </motion.h2>
          <motion.p
            className="font-body text-brand-textSecondary text-base leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease: easing.smooth }}
          >
            The infrastructure, reach, and trust that makes Across Assist India's most reliable protection partner.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="group relative bg-white rounded-3xl p-5 lg:p-6 flex items-start gap-5 transition-all duration-300 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: stat.iconColor,
              }}
              whileHover={{
                y: -6,
                boxShadow: `0 0 0 1px ${stat.iconColor}18, 0 12px 32px rgba(0,0,0,0.12)`,
              }}
              transition={{ duration: 0.3, ease: easing.smooth }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderLeftColor = `${stat.iconColor}60`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderLeftColor = stat.iconColor;
              }}
            >
              {/* Animated background blob */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${stat.iconColor}08, transparent 70%)`,
                  transition: 'opacity 0.4s ease',
                }}
              />

              <motion.div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: stat.iconBg }}
                whileHover={{ scale: 1.15, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 },
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.div className="min-w-0 relative z-10" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                <motion.div
                  className="font-heading text-2xl lg:text-3xl font-extrabold leading-none tracking-tight mb-1"
                  style={{ color: stat.iconColor }}
                  whileInView={{ scale: [0.85, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
                >
                  <Counter stat={stat} />
                </motion.div>
                <motion.div
                  className="font-heading text-sm font-black text-slate-900 mb-1 tracking-tight transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                  style={{ '--hover-color': stat.iconColor } as React.CSSProperties}
                >
                  {stat.label}
                </motion.div>
                <motion.div
                  className="text-xs text-slate-500 font-medium font-body leading-snug group-hover:text-slate-700 transition-colors"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {stat.desc}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

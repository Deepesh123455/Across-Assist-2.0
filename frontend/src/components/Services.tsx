import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { easing, scrollRevealVariants } from '../lib/animations';

interface ServiceCard {
  icon: string;
  iconBg: string;
  title: string;
  tagline: string;
  accentColor: string;
  bullets: string[];
}

const services: ServiceCard[] = [
  {
    icon: '🛡️',
    iconBg: 'rgba(26,86,219,0.08)',
    accentColor: '#1A56DB',
    title: 'Accidental & Liquid Damage',
    tagline: 'Full damage cover for every device',
    bullets: [
      'Mobile, Laptop & Tablet — accidental damage',
      'Smartwatch & TV — liquid damage cover',
      'Brand-authorized service centers only',
      'Avg. 4-day claim settlement',
    ],
  },
  {
    icon: '📱',
    iconBg: 'rgba(249,115,22,0.08)',
    accentColor: '#F97316',
    title: 'Screen Damage Protection (OTSR)',
    tagline: 'One-time screen replacement guarantee',
    bullets: [
      'Single screen replacement, no questions asked',
      'Brand-authorized repair centers nationwide',
      'Covers cracked, shattered & touch failures',
      'Instant policy activation at POS',
    ],
  },
  {
    icon: '🔧',
    iconBg: 'rgba(16,185,129,0.08)',
    accentColor: '#059669',
    title: 'Extended Warranty',
    tagline: 'Protection beyond OEM warranty',
    bullets: [
      'Appliances, Mobile, Laptop, Tablet & TV',
      'Home AMC — Annual Maintenance Contract',
      'Burglary & theft cover included',
      '400+ ASC network for seamless claims',
    ],
  },
  {
    icon: '🔒',
    iconBg: 'rgba(139,92,246,0.08)',
    accentColor: '#7C3AED',
    title: 'Cyber Protection',
    tagline: 'Digital security for modern users',
    bullets: [
      'Real-time antivirus & data security',
      'Password manager & vault protection',
      'Digital theft insurance cover',
      'Identity theft assistance — 24×7 support',
    ],
  },
];

function Card({ s, i, progress, range, targetScale }: { s: ServiceCard, i: number, progress: any, range: [number, number], targetScale: number }) {
  const navigate = useNavigate();
  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div 
      className="sticky flex items-center justify-center"
      style={{ top: `calc(4vh + ${i * 32}px)` }}
    >
      <motion.article
        style={{ scale }}
        className="group relative bg-white rounded-3xl p-6 lg:p-8 overflow-hidden cursor-default border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] max-w-4xl w-full"
      >
        {/* Subtle radial glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${s.accentColor}05 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:shadow-2xl shrink-0 border border-slate-50"
              style={{
                background: `linear-gradient(135deg, white, ${s.iconBg})`,
                boxShadow: `0 10px 25px -5px ${s.accentColor}20`,
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="group-hover:scale-110 transition-transform duration-500">
                {s.icon}
              </span>
            </motion.div>
            
            <div className="text-right">
              <motion.p
                className="font-bold text-[11px] uppercase tracking-[0.2em] opacity-60"
                style={{ color: s.accentColor }}
              >
                {s.tagline}
              </motion.p>
            </div>
          </div>

          <h3 className="font-heading text-2xl font-black text-slate-900 tracking-tight mb-6 group-hover:text-brand-blue transition-colors duration-300">
            {s.title}
          </h3>

          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 group/bullet">
                  <span 
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 group-hover/bullet:scale-110"
                    style={{
                      background: `${s.accentColor}15`,
                      color: s.accentColor,
                    }}
                  >
                    ✓
                  </span>
                  <span className="text-base text-slate-600 font-semibold group-hover/bullet:text-slate-900 transition-colors">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-slate-50 flex justify-start">
              <motion.button
                onClick={() => navigate(ROUTES.LOGIN)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group/btn relative px-8 py-3.5 rounded-xl bg-[#2960DC] text-white font-bold text-sm shadow-[0_12px_24px_-8px_rgba(41,96,220,0.4)] hover:shadow-[0_20px_32px_-12px_rgba(41,96,220,0.5)] transition-all duration-300 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine" />
                
                <span className="relative flex items-center gap-3">
                  Explore Full Scope
                  <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative accent background */}
        <div 
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-[0.02] group-hover:opacity-[0.05] blur-3xl pointer-events-none transition-all duration-1000 group-hover:scale-150"
          style={{ background: s.accentColor }}
        />
      </motion.article>
    </div>
  );
}

export default function Services() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section id="services" ref={container} className="pt-8 pb-24 bg-white relative h-[300vh] z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mb-12 text-center mx-auto"
        >
          <span className="section-label">Core Offerings</span>
          <motion.h2
            className="section-title mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: easing.swift }}
          >
            Protect{' '}
            <span className="relative inline-block pb-2">
              <span className="text-gradient-blue">Every Dimension</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: easing.smooth }}
                className="absolute bottom-0 left-0 right-0 h-1.5 rounded-full bg-brand-orange origin-left"
              />
            </span>
          </motion.h2>
          <motion.p
            className="font-body text-slate-600 text-lg md:text-xl leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: easing.smooth }}
          >
            Comprehensive, tech-enabled protection solutions purpose-built for India's largest institutional brands and their customers.
          </motion.p>
        </motion.div>

        <div className="relative">
          {services.map((s, i) => {
            const targetScale = 1 - ( (services.length - i) * 0.05);
            return (
              <Card 
                key={s.title} 
                i={i} 
                s={s} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

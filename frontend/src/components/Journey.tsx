import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { easing, scrollRevealVariants } from '../lib/animations';

const steps = [
  {
    n: 1,
    icon: '🛍️',
    title: 'Customer Selects Device',
    desc: 'Customer visits a retail store or OEM/NBFC partner portal and selects their new device.',
    color: '#1A56DB',
    bg: 'rgba(26,86,219,0.08)',
  },
  {
    n: 2,
    icon: '🤝',
    title: 'Retailer Introduces Plan',
    desc: "The partner presents Across Assist's 360° protection plan — tailored to the device and customer profile.",
    color: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    n: 3,
    icon: '💳',
    title: 'Customer Pays',
    desc: 'Payment via Cash, Card, or NBFC EMI. Zero friction — protection is embedded at the point of sale.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
  {
    n: 4,
    icon: '✅',
    title: 'Policy Activated Instantly',
    desc: 'Policy goes live in real time. Customer receives SMS + email confirmation. Coverage begins immediately.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
];

export default function Journey() {
  const navigate = useNavigate();
  return (
    <section id="journey" className="py-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #F8FAFF 100%)' }}>
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
            How It Works
          </motion.span>
          <motion.h2
            className="section-title mt-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: easing.swift }}
          >
            Seamless Onboarding in 4 Steps
          </motion.h2>
          <motion.p
            className="font-body text-brand-textSecondary text-base leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease: easing.smooth }}
          >
            From device purchase to instant policy activation — frictionless for the customer, seamless for the partner.
          </motion.p>
        </motion.div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting dashed line */}
            <div className="absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px pointer-events-none">
              <svg width="100%" height="2" className="overflow-visible">
                <line x1="0" y1="1" x2="100%" y2="1"
                  stroke="#F97316" strokeWidth="1.5" strokeDasharray="8 6" strokeOpacity="0.45" />
              </svg>
            </div>

            <div className="grid grid-cols-4 gap-5 relative z-10">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 32, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: easing.swift }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle with glow effect */}
                  <motion.div
                    className="w-11 h-11 rounded-full flex items-center justify-center mb-5 ring-4 ring-white font-heading text-lg font-extrabold text-white flex-shrink-0 z-10 relative"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                      boxShadow: `0 0 0 4px white, 0 4px 12px ${s.color}30`,
                    }}
                    whileHover={{ scale: 1.2, boxShadow: `0 0 0 4px white, 0 0 24px ${s.color}50` }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
                    }}
                  >
                    {s.n}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: `0 0 0 4px ${s.color}20` }}
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 0.2 }}
                    />
                  </motion.div>

                  {/* Card with enhanced hover effects */}
                  <motion.div
                    className="w-full rounded-2xl p-5 text-left group cursor-default"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow: `0 0 0 1px ${s.color}20, 0 12px 28px ${s.color}15`,
                    }}
                    transition={{ duration: 0.3, ease: easing.smooth }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3.5"
                      style={{ background: s.bg }}
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.icon}
                    </motion.div>
                    <h3 className="font-heading text-[15px] font-black text-slate-900 mb-2 leading-tight tracking-tight transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                      style={{ '--hover-color': s.color } as React.CSSProperties}>
                      {s.title}
                    </h3>
                    <motion.p
                      className="text-[13px] text-slate-500 font-medium font-body leading-relaxed group-hover:text-slate-700 transition-colors"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {s.desc}
                    </motion.p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical stepper */}
        <div className="lg:hidden space-y-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -32, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easing.swift }}
              className="flex gap-4 relative"
            >
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-11 bottom-0 w-px pointer-events-none">
                  <svg width="2" height="100%" className="overflow-visible">
                    <motion.line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="100%"
                      stroke="#F97316"
                      strokeWidth="1.5"
                      strokeDasharray="6 5"
                      strokeOpacity="0.4"
                      animate={{ strokeOpacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </svg>
                </div>
              )}

              {/* Circle with animation */}
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm font-extrabold text-white flex-shrink-0 z-10 mt-1 relative"
                style={{
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                  boxShadow: `0 4px 12px ${s.color}30`,
                }}
                whileHover={{ scale: 1.2 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 },
                }}
              >
                {s.n}
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex-1 rounded-2xl p-5 mb-4 group"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                whileHover={{
                  y: -4,
                  boxShadow: `0 0 0 1px ${s.color}20, 0 8px 16px ${s.color}12`,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.span
                    className="text-xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {s.icon}
                  </motion.span>
                  <motion.h3
                    className="font-heading text-sm font-extrabold text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                    style={{ '--hover-color': s.color } as React.CSSProperties}
                  >
                    {s.title}
                  </motion.h3>
                </div>
                <motion.p
                  className="text-sm text-brand-textSecondary font-body leading-relaxed group-hover:text-slate-700 transition-colors"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {s.desc}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <motion.button
            onClick={() => navigate(ROUTES.LOGIN)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group/btn relative px-10 py-4 rounded-2xl bg-[#F97C26] text-white font-heading font-bold text-lg shadow-[0_20px_40px_-10px_rgba(249,124,38,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(249,124,38,0.4)] transition-all duration-300 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine" />
            
            <span className="relative flex items-center gap-3">
              Start Your Journey
              <span className="text-xl group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

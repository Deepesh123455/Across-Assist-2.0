import { motion } from 'framer-motion';
import { easing, scrollRevealVariants } from '../lib/animations';

interface LogoItem {
  name: string;
  color: string;
  bg: string;
  src: string;
}

const row1: LogoItem[] = [
  { name: 'Cashify', color: '#22C55E', bg: '#f0fdf4', src: '/logos/iddUkrWLn6_1776795427151.png' },
  { name: 'ICICI Bank', color: '#F97316', bg: '#fff7ed', src: '/logos/id0cwZB6-t_1776795440121.png' },
  { name: 'IDFC First Bank', color: '#1A56DB', bg: '#eff6ff', src: '/logos/idNGRcLrSk_1776795471038.jpeg' },
  { name: 'TVS Credit', color: '#0F172A', bg: '#f8fafc', src: '/logos/idemk1UFy2_1776795486101.png' },
  { name: 'Home Credit', color: '#E11D48', bg: '#fff1f5', src: '/logos/idvKaY9v_L_1776795511453.jpeg' },
  { name: 'DMI Finance', color: '#7C3AED', bg: '#f5f3ff', src: '/logos/idHUVVKsMO_logos.jpeg' },
  { name: 'Corvell', color: '#ffffff', bg: '#4a4a4a', src: '/logos/idpPtw8XH2_logos.jpeg' },
  { name: 'Mastercard', color: '#EB001B', bg: '#fff5f5', src: '/logos/Icon.jpeg' },
  { name: 'Visa', color: '#1A1F71', bg: '#eef0ff', src: '/logos/idDpIqdw_U_1776795592929.png' },
  { name: 'Hero Insurance', color: '#E11D48', bg: '#fff1f5', src: '/logos/idfoZolilC_logos.jpeg' },
];

const row2: LogoItem[] = [
  { name: 'SBI General', color: '#002D72', bg: '#eef1ff', src: '/logos/Icon (1).jpeg' },
  { name: 'Aditya Birla', color: '#E31837', bg: '#fff5f5', src: '/logos/idhnoyBhFo_logos.jpeg' },
  { name: 'MakeMyTrip', color: '#EE2D37', bg: '#fff5f5', src: '/logos/idw4GO7GNB_1776796055652.png' },
  { name: 'Goibibo', color: '#E91E8C', bg: '#fff0f8', src: '/logos/Logo Alternative.png' },
  { name: 'TVS Motors', color: '#0F172A', bg: '#f8fafc', src: '/logos/id6tzCGelb_1776796084631.png' },
  { name: 'Spinny', color: '#ffffff', bg: '#3d1460', src: '/logos/iduhiux0gK_1776796106479.jpeg' },
  { name: 'Ola', color: '#14B82D', bg: '#f8f8f8', src: '/logos/idquM7QfYI_logos.jpeg' },
  { name: 'Michelin', color: '#003473', bg: '#eef1ff', src: '/logos/Icon (2).jpeg' },
  { name: 'Montra Electric', color: '#22C55E', bg: '#f0fdf4', src: '/logos/idmIVPipUR_logos.jpeg' },
  { name: 'GoMechanic', color: '#F97316', bg: '#fff7ed', src: '/logos/idKCK-6jKi_1776796218774.jpeg' },
  { name: 'FPay', color: '#1A56DB', bg: '#eff6ff', src: '/logos/logo.png' },
];

function LogoCard({ logo }: { logo: LogoItem }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[156px] h-[72px] flex items-center justify-center rounded-2xl px-4 cursor-default overflow-hidden group"
      style={{
        background: logo.bg,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        minWidth: '156px',
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: `0 0 0 1px ${logo.color}15, 0 8px 20px rgba(0,0,0,0.08)`,
      }}
      transition={{ duration: 0.3, ease: easing.smooth }}
    >
      <motion.img
        src={logo.src}
        alt={logo.name}
        className="max-h-10 w-auto max-w-full object-contain select-none pointer-events-none group-hover:scale-110 transition-transform duration-300"
        draggable={false}
        whileHover={{ rotate: [0, -2, 2, -1, 0] }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

function MarqueeRow({ logos, direction }: { logos: LogoItem[]; direction: 'left' | 'right' }) {
  const doubled = [...logos, ...logos];
  const totalW = doubled.length * (156 + 14);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0.85) 40%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, white 0%, rgba(255,255,255,0.85) 40%, transparent 100%)' }} />

      <div
        className={`flex gap-3.5 py-1.5 marquee-track ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}
        style={{ width: `${totalW}px` }}
      >
        {doubled.map((logo, i) => (
          <LogoCard key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section id="clients" className="pt-12 pb-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: easing.smooth }}
          >
            Trusted By India's Leading Brands
          </motion.span>
          <motion.h2
            className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-dark mt-3 mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: easing.swift }}
          >
            100+ Institutional Partners Across India
          </motion.h2>
          <motion.p
            className="font-body text-brand-textSecondary text-base max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease: easing.smooth }}
          >
            From major NBFCs and telecom operators to automotive OEMs and fintech unicorns.
          </motion.p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3.5">
        <MarqueeRow logos={row1} direction="left" />
        <MarqueeRow logos={row2} direction="right" />
      </div>
    </section>
  );
}

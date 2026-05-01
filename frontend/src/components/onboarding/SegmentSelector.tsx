import { motion } from 'framer-motion';
import type { Segment } from '../../services/onboarding.service';

interface SegmentCard {
  id: Segment;
  label: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  ring: string;
}

const SEGMENTS: SegmentCard[] = [
  {
    id: 'travel',
    label: 'Travel',
    description: 'OTA · Offline Agency · Corporate Travel · Holiday Packages',
    icon: '✈️',
    color: 'text-blue-600',
    gradient: 'from-blue-50 to-blue-100/60 hover:from-blue-100 hover:to-blue-200/60 border-blue-200 hover:border-blue-400',
    ring: 'ring-blue-500/30',
  },
  {
    id: 'gadget',
    label: 'Gadget & Appliances',
    description: 'OEM · Retailer · Marketplace · NBFC · Distributor',
    icon: '📱',
    color: 'text-purple-600',
    gradient: 'from-purple-50 to-purple-100/60 hover:from-purple-100 hover:to-purple-200/60 border-purple-200 hover:border-purple-400',
    ring: 'ring-purple-500/30',
  },
  {
    id: 'automobile',
    label: 'Automobile',
    description: 'OEM · Dealer Network · NBFC · Fleet Operator · Marketplace',
    icon: '🚗',
    color: 'text-emerald-600',
    gradient: 'from-emerald-50 to-emerald-100/60 hover:from-emerald-100 hover:to-emerald-200/60 border-emerald-200 hover:border-emerald-400',
    ring: 'ring-emerald-500/30',
  },
];

interface Props {
  onSelect: (segment: Segment) => void;
}

export function SegmentSelector({ onSelect }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Step 1 of 13
        </div>
        <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight mb-3">
          What type of client are you?
        </h2>
        <p className="text-slate-500 text-lg font-medium">
          Select your primary business vertical to get a tailored protection bundle.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SEGMENTS.map((seg, i) => (
          <motion.button
            key={seg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(seg.id)}
            id={`segment-${seg.id}`}
            className={`group relative bg-gradient-to-br ${seg.gradient} border-2 rounded-[2rem] p-8 text-left cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl`}
          >
            <div className="text-5xl mb-5">{seg.icon}</div>
            <h3 className={`text-xl font-black ${seg.color} mb-2 tracking-tight`}>{seg.label}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{seg.description}</p>
            <div className={`absolute bottom-5 right-5 w-8 h-8 rounded-full bg-white ${seg.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md`}>
              <span className="text-sm font-black">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

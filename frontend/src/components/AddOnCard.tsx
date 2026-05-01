import { motion } from 'framer-motion';
import type { AddOn } from '../services/onboarding.service';

interface Props {
  addon: AddOn;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function AddOnCard({ addon, isSelected, onToggle }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(addon.id)}
      id={`addon-${addon.id}`}
      className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#1A56DB] bg-blue-50 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md'
      }`}
    >
      {/* Checkbox */}
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
        isSelected ? 'bg-[#1A56DB] border-[#1A56DB]' : 'border-slate-300'
      }`}>
        {isSelected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{addon.icon}</span>
            <h4 className="font-bold text-zinc-900 text-sm leading-tight">{addon.name}</h4>
            {addon.isDefault && (
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            )}
          </div>
          <span className="text-[#1A56DB] font-black text-sm whitespace-nowrap">+₹{addon.price}</span>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">{addon.description}</p>
      </div>
    </motion.button>
  );
}

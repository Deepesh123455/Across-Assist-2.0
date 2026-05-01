import { motion } from 'framer-motion';

interface Props {
  currentStep: number;  // 1-based
  totalSteps: number;
  segment: string | null;
}

const SEGMENT_COLOR: Record<string, string> = {
  travel:     'bg-blue-500',
  gadget:     'bg-purple-500',
  automobile: 'bg-emerald-500',
};

const SEGMENT_LABEL: Record<string, string> = {
  travel:     'Travel',
  gadget:     'Gadget & Appliances',
  automobile: 'Automobile',
};

export function ProgressBar({ currentStep, totalSteps, segment }: Props) {
  const pct = Math.min((currentStep / totalSteps) * 100, 100);
  const barColor = segment ? (SEGMENT_COLOR[segment] ?? 'bg-blue-500') : 'bg-blue-500';

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {segment && (
            <span className={`w-2 h-2 rounded-full ${barColor}`} />
          )}
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
            {segment ? SEGMENT_LABEL[segment] : 'Onboarding'}
          </span>
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
          Question {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

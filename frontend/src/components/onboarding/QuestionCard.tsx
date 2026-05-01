import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../../services/onboarding.service';

interface Props {
  question: Question;
  questionNumber: number;
  segment: string | null;
  onAnswer: (questionId: string, answer: string) => void;
}

const OPTION_COLORS: Record<string, { base: string; hover: string; selected: string; dot: string }> = {
  travel: {
    base:     'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50',
    hover:    'hover:shadow-blue-500/10',
    selected: 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10',
    dot:      'bg-blue-500',
  },
  gadget: {
    base:     'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50',
    hover:    'hover:shadow-purple-500/10',
    selected: 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10',
    dot:      'bg-purple-500',
  },
  automobile: {
    base:     'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50',
    hover:    'hover:shadow-emerald-500/10',
    selected: 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10',
    dot:      'bg-emerald-500',
  },
};

const DEFAULT_COLORS = OPTION_COLORS['travel'];

export function QuestionCard({ question, questionNumber, segment, onAnswer }: Props) {
  const colors = segment ? (OPTION_COLORS[segment] ?? DEFAULT_COLORS) : DEFAULT_COLORS;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="mb-10">
          <div className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">
            Question {questionNumber}
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
            {question.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, idx) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.id, option)}
              id={`option-${question.id}-${idx}`}
              className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left ${colors.base} hover:shadow-lg ${colors.hover}`}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-slate-300 group-hover:border-current flex-shrink-0 transition-all group-hover:${colors.dot.replace('bg-', 'border-')}`}>
                <div className={`w-full h-full rounded-full ${colors.dot} scale-0 group-hover:scale-100 transition-transform`} />
              </div>
              <span className="font-bold text-zinc-800 text-sm leading-snug">{option}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';

const DOTS = [0, 1, 2, 3, 4, 5];

export function AnalyzingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto text-center py-20"
    >
      {/* Neural network animation */}
      <div className="relative w-32 h-32 mx-auto mb-10">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200"
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-2 border-dashed border-purple-200"
        />
        {/* Core */}
        <div className="absolute inset-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            🧠
          </motion.div>
        </div>
        {/* Orbiting dots */}
        {DOTS.map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400"
            animate={{
              x: [0, Math.cos((i / DOTS.length) * Math.PI * 2) * 56],
              y: [0, Math.sin((i / DOTS.length) * Math.PI * 2) * 56],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 2, delay: i * 0.33, repeat: Infinity }}
            style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
          />
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black text-zinc-900 tracking-tight mb-3"
      >
        Analyzing your partner profile...
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-slate-500 font-medium leading-relaxed mb-8"
      >
        Our rule engine is matching your profile with the optimal Across Assist bundle.
        This takes just a moment.
      </motion.p>

      {/* Animated steps */}
      {['Profiling business model', 'Matching protection needs', 'Selecting optimal bundle', 'Calculating revenue metrics'].map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.25 }}
          className="flex items-center gap-3 text-sm text-slate-500 font-medium mb-2 justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.25, repeat: Infinity, repeatDelay: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
          />
          {step}
        </motion.div>
      ))}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function AIEngine() {
  const navigate = useNavigate();

  return (
    <section id="ai-engine" className="py-12 lg:py-20 overflow-hidden relative z-0" style={{ background: 'linear-gradient(180deg, #F8FAFF 0%, #ffffff 100%)' }}>
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-brand-blue/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-1/3 h-1/2 bg-brand-orange/5 blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Centered — copy */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            AI-POWERED ADVISOR
          </span>

          <h2 className="section-title text-4xl lg:text-5xl mb-8">Find Your Perfect Bundle</h2>

          <p className="font-body text-slate-600 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            Our AI advisor — trained on 10+ years of Across Assist bundle performance — analyzes your profile and surfaces the highest-revenue protection combo for your specific business.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
          {[
            {
              title: "Personalised to your type & volume",
              desc: "OEM, NBFC, Retailer, Telecom or Marketplace",
              icon: "🎯"
            },
            {
              title: "Backed by real attachment data",
              desc: "Industry benchmarks across 100+ partners",
              icon: "📊"
            },
            {
              title: "Revenue projections included",
              desc: "Model your growth with precision data",
              icon: "💰"
            },
            {
              title: "Real client examples",
              desc: "See who's already using this combo",
              icon: "👥"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4"
            >
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="group relative px-12 py-5 rounded-2xl bg-[#2960DC] text-white font-black text-lg shadow-[0_20px_50px_-12px_rgba(41,96,220,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(41,96,220,0.6)] transition-all duration-300 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />

            <span className="relative flex items-center gap-3">
              Launch Intelligence Engine
              <span className="text-2xl group-hover:translate-x-2 transition-transform duration-500">→</span>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Services from '../components/Services';
import AIEngine from '../components/AIEngine';
import Journey from '../components/Journey';
import NetworkStats from '../components/NetworkStats';
import { ROUTES } from '../constants/routes';

import calculatorPreview from '../assets/images/calculator-preview.png';

const CalculatorTeaser = () => {
  const navigate = useNavigate();
  return (
    <section id="calculator" className="py-12 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-brand-orange/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
          {/* Left — Illustration (Starts at top) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-brand-blue/5 blur-[80px] -z-10 rounded-full" />
            <div className="bg-white rounded-[2.5rem] p-0 shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-slate-100/80 overflow-hidden group">
              <div className="aspect-video overflow-hidden bg-slate-50">
                <motion.img
                  src={calculatorPreview}
                  alt="Revenue Calculator Preview"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right — Copy (Offset down from top) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 lg:pt-16"
          >
            <span className="section-label">Revenue Calculator</span>
            <h2 className="section-title mt-4 mb-6">Calculate Your Revenue Opportunity</h2>
            <p className="font-body text-slate-600 text-lg leading-relaxed mb-10 max-w-xl font-medium">
              Model your potential annual earnings from Across Assist protection plans using our interactive calculator. See how your volume translates to bottom-line growth.
            </p>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="btn-primary px-10 py-5 group shadow-[0_20px_40px_-10px_rgba(26,86,219,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started with Calculator
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => (
  <div>
    <Hero />
    <Marquee />
    <Services />
    <AIEngine />
    <CalculatorTeaser />
    <Journey />
    <NetworkStats />
  </div>
);

export default HomePage;

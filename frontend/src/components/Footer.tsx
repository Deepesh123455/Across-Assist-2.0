import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import logoWhiteBg from '../assets/images/logo-for-white-bg.png';

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Clients', href: '#clients' },
  { label: 'Why Us', href: '#network' },
  { label: 'Revenue Calculator', href: '#calculator' },
  { label: 'AI Bundle Advisor', href: '#ai-engine' },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const FooterLogo = () => (
  <div>
    <img src={logoWhiteBg} alt="Across Assist" className="h-9 w-auto" />
    <div className="text-[8.5px] font-body font-semibold tracking-[0.2em] text-slate-400 uppercase mt-[5px]">
      Trust · Care · Protect
    </div>
  </div>
);

interface FormData { name: string; company: string; email: string; phone: string }
const empty: FormData = { name: '', company: '', email: '', phone: '' };

export default function Footer() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const sent = false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.CONTACT, { state: { prefill: form } });
    }, 400);
  };

  const inputCls = [
    'w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 font-body',
    'border focus:border-brand-blue/60 focus:bg-white/10',
  ].join(' ');

  return (
    <footer id="footer" style={{ background: '#0A1628' }}>
      {/* Subtle top gradient bar */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(26,86,219,0.5), rgba(249,115,22,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/8">

          {/* ── Brand ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FooterLogo />
            <p className="mt-5 text-sm text-slate-400 font-body leading-relaxed max-w-[260px]">
              India's fastest-growing 360° protection platform. Trusted by 100+ institutional brands, powering 5 Million+ lives.
            </p>
            <a
              href="https://www.acrossassist.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-blue hover:text-blue-400 transition-colors font-body"
            >
              🌐 www.acrossassist.com <span className="text-xs">↗</span>
            </a>

            <div className="flex flex-wrap gap-2 mt-6">
              {['24×7 Support', 'Pan India', '400+ ASCs'].map((t) => (
                <span key={t} className="text-[11px] font-medium text-slate-400 border border-white/10 rounded-full px-3 py-1 font-body">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Quick Links ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <h4 className="text-[10px] font-extrabold font-heading text-white uppercase tracking-[0.2em] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="group text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 font-body"
                  >
                    <span className="w-3 h-px bg-brand-orange opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:w-4" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-8 space-y-2">
              {[
                { icon: '🔐', label: 'ISO 27001 Certified' },
                { icon: '⚖️', label: 'IRDAI Compliant' },
                { icon: '🇮🇳', label: 'Made in India' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[11px] text-slate-500 font-body">
                  <span>{b.icon}</span>{b.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Partner form ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <h4 className="text-[10px] font-extrabold font-heading text-white uppercase tracking-[0.2em] mb-2">Partner With Us</h4>
            <p className="text-xs text-slate-500 font-body mb-5 leading-relaxed">
              Drop your details and our team will reach out within 24 hours.
            </p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-6 text-center"
                style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)' }}
              >
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-heading text-base font-extrabold text-emerald-400 mb-1">Thank You!</p>
                <p className="text-xs text-slate-400 font-body">Our team will reach out within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {([
                  { name: 'name',    placeholder: 'Your Name *',         type: 'text'  },
                  { name: 'company', placeholder: 'Company / Brand',      type: 'text'  },
                  { name: 'email',   placeholder: 'Work Email *',         type: 'email' },
                  { name: 'phone',   placeholder: 'Phone Number *',       type: 'tel'   },
                ] as const).map((f) => (
                  <input
                    key={f.name}
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={handleChange}
                    required={f.placeholder.includes('*')}
                    className={inputCls}
                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-orange w-full justify-center py-3 mt-1 rounded-xl text-sm disabled:opacity-60"
                >
                  {loading ? 'Submitting…' : 'Submit Enquiry →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 font-body">
            © {new Date().getFullYear()} Across Assist Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Claims Policy', 'Grievance'].map((l) => (
              <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-300 transition-colors font-body">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

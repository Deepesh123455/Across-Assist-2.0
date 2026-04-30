import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveSession } from '../lib/session';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../constants/routes';
import PageTransition from '../components/PageTransition';

type PartnerType = 'OEM/Brand' | 'NBFC/Fintech' | 'Retailer' | 'Marketplace' | 'Telecom';
const PARTNER_TYPES: PartnerType[] = ['OEM/Brand', 'NBFC/Fintech', 'Retailer', 'Marketplace', 'Telecom'];

interface FormState { name: string; company: string; email: string; phone: string; partnerType: PartnerType | ''; message: string }
const empty: FormState = { name: '', company: '', email: '', phone: '', partnerType: '', message: '' };

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isRevenueModel = new URLSearchParams(location.search).get('type') === 'revenue-model';
  const prefill = location.state?.prefill as Partial<FormState> | undefined;

  const [form, setForm] = useState<FormState>({
    ...empty,
    name: prefill?.name ?? '',
    email: prefill?.email ?? '',
    phone: prefill?.phone ?? '',
    company: prefill?.company ?? '',
    message: isRevenueModel ? "I'd like a custom revenue projection model built for my specific business." : '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isRevenueModel) setForm((p) => ({ ...p, message: "I'd like a custom revenue projection model built for my specific business." }));
  }, [isRevenueModel]);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const enquiries = JSON.parse(localStorage.getItem('aa_enquiries') || '[]');
    enquiries.push({ ...form, submittedAt: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('aa_enquiries', JSON.stringify(enquiries));
    saveSession({ contactFormSubmitted: true, contactData: form });
    toast('Enquiry submitted! We\'ll reach out within 24 hours.', 'success');
    setSubmitted(true);
  };

  const inputCls = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-xl text-sm text-brand-dark border outline-none transition-all duration-200 font-body bg-white ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
    }`;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left */}
            <div className="lg:col-span-2">
              <span className="section-label">GET IN TOUCH</span>
              <h1 className="section-title mt-3 mb-4">Let's Build Something Together</h1>
              <p className="font-body text-brand-textSecondary text-base leading-relaxed mb-8">
                Drop your details and our partnership team will reach out within 24 hours with a bespoke proposal.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '✅', text: 'Response within 24 hours' },
                  { icon: '👤', text: 'Dedicated relationship manager assigned' },
                  { icon: '📋', text: 'Bespoke commercial terms for your business' },
                ].map((t) => (
                  <div key={t.text} className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{t.icon}</span>
                    <span className="text-sm text-brand-dark font-medium font-body">{t.text}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 space-y-2 mb-6 border border-brand-border">
                {[
                  { icon: '🌐', text: 'www.acrossassist.com' },
                  { icon: '📧', text: 'partnerships@acrossassist.com' },
                  { icon: '📍', text: 'Gurugram, Haryana, India' },
                ].map((c) => (
                  <div key={c.text} className="flex gap-2 text-sm text-brand-textSecondary">
                    <span>{c.icon}</span>{c.text}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['ISO 27001 Certified', 'IRDAI Compliant', 'Made in India'].map((b) => (
                  <span key={b} className="text-[11px] font-medium text-slate-500 border border-slate-200 rounded-full px-3 py-1">{b}</span>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-brand-border p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                    <h3 className="font-heading text-2xl font-extrabold text-brand-dark mb-2">Thank You, {form.name.split(' ')[0]}!</h3>
                    <p className="text-brand-textSecondary mb-6">We've received your enquiry and will reach out within 24 hours.</p>
                    <button onClick={() => navigate(ROUTES.ADVISOR)} className="text-sm text-brand-blue font-semibold hover:underline">
                      In the meantime, explore our AI advisor →
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input placeholder="Your Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls('name')} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <input placeholder="Company / Brand *" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} className={inputCls('company')} />
                        {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                      </div>
                    </div>
                    <div>
                      <input type="email" placeholder="Work Email *" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputCls('email')} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className={inputCls('phone')} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-textSecondary mb-2">Partner Type</p>
                      <div className="flex flex-wrap gap-2">
                        {PARTNER_TYPES.map((t) => (
                          <button type="button" key={t} onClick={() => setForm((p) => ({ ...p, partnerType: t }))}
                            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                              form.partnerType === t ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-brand-textSecondary border-brand-border hover:border-brand-blue'
                            }`}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        placeholder="Message (optional)"
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm text-brand-dark border border-brand-border outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 font-body bg-white resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-orange w-full justify-center py-3.5 rounded-xl text-sm">
                      Submit Enquiry →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

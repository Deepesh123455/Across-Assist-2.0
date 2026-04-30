import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { getEmail } from '../../lib/session';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';
import PageTransition from '../../components/PageTransition';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const fromPartnerButton = state?.fromPartnerButton || false;
  const recommendationSummary = state?.recommendationSummary || null;

  const { login: authLogin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: state?.email || getEmail() || '',
    companyName: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.companyName || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    try {
      setIsSubmitting(true);
      const result = await authService.signup({
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        phone: formData.phone || undefined,
        password: formData.password,
        clientType: recommendationSummary?.clientType,
      });
      authLogin(result.user, result.tokens, result.sessionData);
      toast('Account created! Welcome to Across Assist.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row w-full min-h-screen font-inter bg-white overflow-x-hidden">

        {/* LEFT PANEL - WHITE BACKGROUND */}
        <div className="relative w-full lg:w-1/2 flex flex-col justify-center bg-white p-8 lg:p-12 xl:p-20 shrink-0 min-h-[400px] lg:min-h-screen border-r border-slate-100">
          <div className="relative z-10 w-full max-w-md xl:max-w-lg mx-auto text-slate-900">
            <Link to="/" className="inline-flex items-center gap-3 mb-10 lg:mb-14 hover:opacity-90 transition-opacity">
              <img src="/src/assets/images/logo-for-white-bg.png" alt="Across Assist" className="h-10 w-auto" />
            </Link>

            {fromPartnerButton && recommendationSummary ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="inline-block uppercase tracking-widest text-[10px] font-bold bg-[#F97316] text-white px-3 py-1.5 rounded-full mb-6">
                  Your AI Recommendation
                </div>
                <h2 className="text-3xl lg:text-4xl font-manrope font-extrabold mb-3 leading-tight">
                  {recommendationSummary.bundleName}
                </h2>
                <p className="text-blue-100 text-lg mb-8 font-medium">
                  For {recommendationSummary.clientType}
                </p>
                <p className="text-lg lg:text-xl font-medium leading-relaxed opacity-90">
                  You're one step away from unlocking your full proposal, revenue projections, and commission breakdown.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-slate-900 mb-8 leading-tight">
                  Join 100+ Institutional Partners
                </h2>
                <div className="space-y-8 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <BarChart3 className="text-[#F97316] w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-lg text-slate-900 mb-1">Highest Revenue Share</h4>
                      <p className="text-slate-500 text-sm leading-relaxed pr-4">Industry-leading commission structure tailored for your scale.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-[#F97316] w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-lg text-slate-900 mb-1">95%+ Claim Approval</h4>
                      <p className="text-slate-500 text-sm leading-relaxed pr-4">Seamless customer experience guaranteed across 400+ centers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Zap className="text-[#F97316] w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-lg text-slate-900 mb-1">Plug & Play Integration</h4>
                      <p className="text-slate-500 text-sm leading-relaxed pr-4">Go live within 48 hours with our robust API documentation.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - FORM (WHITE) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 xl:p-20 bg-white shrink-0 min-h-screen">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10 text-left">
              <h2 className="text-3xl lg:text-4xl font-manrope font-extrabold text-[#0F172A] mb-3">
                Create Account
              </h2>
              <p className="text-slate-500 text-lg">
                Enter your details to get started.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Work Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all pr-12 placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[36px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold text-lg py-3.5 rounded-xl transition-all mt-6 shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-[#1A56DB] font-bold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;

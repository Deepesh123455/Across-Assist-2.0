import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, ArrowRight, CheckCircle2, Lock, Calendar, Check,
  ShieldCheck, Info, ExternalLink, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import PageTransition from '../components/PageTransition';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { RevenueHero } from '../components/RevenueHero';

const normalizeRecommendation = (rec: any) => {
  if (!rec) return null;
  return {
    ...rec,
    objectionHandler: rec.objectionHandler ?? rec.objectionHandle ?? null,
    whyThisCombo: rec.whyThisCombo ?? rec.objectionHandle ?? [],
    products: rec.products ?? [],
  };
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, sessionData, logout: authLogout } = useAuth();

  const [recommendation, setRecommendation] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    setRecommendation(normalizeRecommendation(sessionData?.recommendation ?? null));
    setFormData(sessionData?.formData ?? null);
  }, [isAuthenticated, sessionData, navigate]);

  const handleLogout = async () => {
    await authService.logout();
    authLogout();
    navigate('/');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/advisor');
    showToast('Link copied to clipboard!');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const calculateRevenue = () => {
    if (!recommendation || !formData) return { cr: '0', text: '', shareAmount: 0, units: 0 };

    let units = 0;
    const vol = formData.monthlyVolume || '';
    if (vol.includes('5K') && vol.includes('Under')) units = 2500;
    else if (vol.includes('5K–50K') || vol.includes('5K_50K')) units = 27500;
    else if (vol.includes('50K–5L') || vol.includes('50K_5L')) units = 275000;
    else if (vol.includes('5L+')) units = 500000;
    else units = 10000;

    const attachRate = recommendation.attachmentRate || 0.30;
    const planValue = recommendation.recommendedPlanValue || 1200;

    let sharePct = 0;
    const type = (formData.clientType ?? authUser?.clientType ?? '').toLowerCase();
    if (type.includes('oem') || type.includes('brand')) sharePct = 0.25;
    else if (type.includes('retailer') || type.includes('marketplace')) sharePct = 0.208;
    else if (type.includes('nbfc') || type.includes('fintech')) sharePct = 0.083;
    else sharePct = 0.20;

    const annualRev = units * attachRate * planValue * sharePct * 12;
    const cr = (annualRev / 10000000).toFixed(2);

    return {
      cr,
      text: `Based on ${units.toLocaleString()} units/month at ${(attachRate * 100).toFixed(0)}% attach rate.`,
      shareAmount: Math.round(planValue * sharePct),
      units
    };
  };

  const revData = calculateRevenue();
  const clientTypeStr = formData?.clientType ?? authUser?.clientType ?? 'Strategic Partner';
  
  if (!authUser) return null;

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-zinc-50 font-inter overflow-hidden">
        
        <DashboardSidebar 
          userName={authUser.name}
          companyName={authUser.companyName || 'Corporate Partner'}
          initials={getInitials(authUser.name)}
          onLogout={handleLogout}
        />

        <main className="flex-1 lg:ml-72 h-screen overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#1A56DB]" />
                  Partner Dashboard
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
                  Welcome, <span className="text-[#1A56DB]">{authUser.name.split(' ')[0]}</span>
                </h1>
                <p className="text-zinc-500 font-medium text-lg">
                  Partnering with <span className="text-zinc-900 font-bold">{authUser.companyName || 'Corporate'}</span> since {new Date(authUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm"
              >
                <div className="px-4 py-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Type</div>
                  <div className="text-slate-900 font-bold text-sm">{clientTypeStr}</div>
                </div>
                <div className="h-10 w-[1px] bg-slate-100" />
                <button onClick={handleShare} className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </motion.div>
            </header>

            {recommendation ? (
              <div className="space-y-12 pb-20">
                {/* Revenue Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <RevenueHero 
                    amount={revData.cr}
                    subtitle={revData.text}
                    units={revData.units}
                  />
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Bundle Details - Left 2 Columns */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-2 space-y-8"
                  >
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8">
                        <div className="bg-blue-50 text-[#1A56DB] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3 fill-current" />
                          AI Recommendation
                        </div>
                      </div>

                      <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">
                        {recommendation.bundleName}
                      </h2>
                      <p className="text-slate-500 font-medium mb-10">Optimized for maximum conversion and customer retention.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {recommendation.products?.map((prod: any, idx: number) => (
                          <div key={idx} className="group relative bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${prod.isAnchor ? 'bg-orange-100 text-[#F97316]' : 'bg-blue-100 text-[#1A56DB]'}`}>
                                <ShieldCheck className="w-6 h-6" />
                              </div>
                              {prod.isAnchor && (
                                <span className="bg-[#F97316] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Anchor</span>
                              )}
                            </div>
                            <h4 className="text-zinc-900 font-bold text-lg mb-2">{prod.name}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4">{prod.reason}</p>
                            <div className="flex items-center gap-1 text-[#1A56DB] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Learn more <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full transition-transform group-hover:scale-110" />
                        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-300" />
                          Strategic Rationale
                        </h4>
                        <ul className="space-y-3">
                          {recommendation.whyThisCombo?.map((reason: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                              <CheckCircle2 className="w-5 h-5 text-[#F97316] shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sidebar Info - Right Column */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Share Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                      <h3 className="text-zinc-900 font-bold text-xl mb-4 text-nowrap">Revenue Split - ₹1,200 Plan</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Your Commission</span>
                          <span className="text-[#1A56DB] font-black text-xl">₹{revData.shareAmount}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-[#1A56DB]" style={{ width: '25%' }} />
                          <div className="h-full bg-orange-500" style={{ width: '15%' }} />
                          <div className="h-full bg-indigo-400" style={{ width: '20%' }} />
                          <div className="h-full bg-slate-200" style={{ width: '40%' }} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                          Optimized for {authUser.companyName || 'Partners'}
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate('/contact')}
                        className="w-full mt-8 bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                      >
                        Finalize Commercials <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Help Card */}
                    <div className="bg-[#1A56DB] rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20">
                      <h3 className="font-bold text-xl mb-2">Need Help?</h3>
                      <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                        Our commercial experts are available to discuss bundle fine-tuning and integration strategy.
                      </p>
                      <button 
                        onClick={() => navigate('/chat')}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors border border-white/20 backdrop-blur-sm"
                      >
                        Talk to AI Advisor
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Onboarding Journey */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 lg:p-12"
                >
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Your Integration Journey</h3>
                      <p className="text-slate-500 font-medium">Clear path to going live with Across Assist.</p>
                    </div>
                    <div className="hidden md:block bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Step 1 of 5 Complete
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.25rem] left-[2.25rem] right-[2.25rem] h-[2px] bg-slate-100 -z-0" />

                    <JourneyStep 
                      title="Recommendation" 
                      status="completed" 
                      icon={Check}
                    />
                    <JourneyStep 
                      title="Commercial Call" 
                      status="active" 
                      icon={Calendar}
                      cta="Book Call"
                      onCtaClick={() => navigate('/contact')}
                    />
                    <JourneyStep 
                      title="Agreement" 
                      status="pending" 
                      icon={Lock}
                    />
                    <JourneyStep 
                      title="Integration" 
                      status="pending" 
                      icon={Lock}
                    />
                    <JourneyStep 
                      title="Go Live" 
                      status="pending" 
                      icon={Zap}
                    />
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Empty State */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-12 lg:p-20 text-center max-w-4xl mx-auto my-20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-[#1A56DB]" />
                <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-[#1A56DB]">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">
                  Ready to Secure Your Revenue?
                </h2>
                <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                  Our AI advisor is ready to build a high-performance protection bundle tailored to your business model and customer base.
                </p>
                <button 
                  onClick={() => navigate('/advisor')} 
                  className="bg-[#1A56DB] hover:bg-blue-700 text-white font-black px-10 py-5 rounded-2xl transition-all duration-300 inline-flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:translate-y-[-2px]"
                >
                  Start AI Advisor <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

          </div>
        </main>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-8 right-8 bg-zinc-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 font-bold border border-white/10 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A56DB] flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

const JourneyStep = ({ title, status, icon: Icon, cta, onCtaClick }: any) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <div className="flex md:flex-col items-center gap-6 md:text-center z-10">
      <div className={`
        w-18 h-18 rounded-[1.5rem] flex items-center justify-center shrink-0 border-4 border-white transition-all duration-500
        ${isCompleted ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20' : ''}
        ${isActive ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20 ring-4 ring-orange-100' : ''}
        ${!isCompleted && !isActive ? 'bg-slate-50 text-slate-400 border-slate-100' : ''}
      `}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <div className={`font-black text-sm uppercase tracking-widest mb-1 ${isActive ? 'text-[#F97316]' : isCompleted ? 'text-zinc-900' : 'text-slate-400'}`}>
          {title}
        </div>
        {isActive && cta && (
          <button 
            onClick={onCtaClick}
            className="mt-2 bg-[#F97316] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
          >
            {cta} →
          </button>
        )}
        {!isActive && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status}</div>}
      </div>
    </div>
  );
};

export default DashboardPage;

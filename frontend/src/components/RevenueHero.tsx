import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, IndianRupee } from 'lucide-react';

interface RevenueHeroProps {
  amount: string;
  subtitle: string;
  units: number;
}

export const RevenueHero = ({ amount, subtitle, units }: RevenueHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A56DB] to-[#1e40af] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-blue-900/20 border border-blue-400/20">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-white">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <TrendingUp className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Growth Projections 2026</span>
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-blue-100 font-semibold text-lg opacity-80">Projected Annual Revenue</h3>
            <div className="flex items-baseline gap-4">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl lg:text-8xl font-black text-white tracking-tighter"
              >
                ₹{amount}
              </motion.span>
              <span className="text-3xl lg:text-4xl font-bold text-[#F97316]">Cr</span>
            </div>
          </div>

          <p className="text-blue-50 font-medium text-lg max-w-xl leading-relaxed opacity-90">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <StatCard 
            icon={Users} 
            label="Monthly Reach" 
            value={units.toLocaleString()} 
            color="white" 
          />
          <StatCard 
            icon={Target} 
            label="Target Attach" 
            value="30%" 
            color="orange" 
          />
          <StatCard 
            icon={IndianRupee} 
            label="Avg Plan Value" 
            value="₹1,200" 
            color="white" 
          />
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center backdrop-blur-md">
            <div className="text-center">
              <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1 text-nowrap">Industry Benchmark</div>
              <div className="text-white font-bold text-xl">+12.4%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => {
  const colors: Record<string, string> = {
    white: 'bg-white/10 text-white border-white/20',
    orange: 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/30',
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-3xl p-6 min-w-[160px] hover:bg-white/15 transition-all group backdrop-blur-md">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1 opacity-70">{label}</div>
      <div className="text-white font-bold text-2xl">{value}</div>
    </div>
  );
};

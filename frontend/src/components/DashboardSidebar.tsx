import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Calculator, MessageSquare, Download, Settings, LogOut, 
  ChevronRight, LucideIcon 
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import logoImg from '../assets/images/logo-for-white-bg.png';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'text-[#1A56DB]' 
          : 'text-slate-500 hover:text-[#1A56DB] hover:bg-slate-50'
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-[#1A56DB]' : 'group-hover:scale-110'}`} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </Link>
  );
};

interface DashboardSidebarProps {
  userName: string;
  companyName: string;
  initials: string;
  onLogout: () => void;
}

export const DashboardSidebar = ({ userName, companyName, initials, onLogout }: DashboardSidebarProps) => {
  const location = useLocation();

  const navLinks = [
    { to: ROUTES.DASHBOARD, icon: Home, label: 'My Recommendation' },
    { to: ROUTES.REVENUE_CALCULATOR, icon: Calculator, label: 'Revenue Calculator' },
    { to: ROUTES.CHAT, icon: MessageSquare, label: 'AI Chat' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Header / Logo Area */}
      <div className="p-8 pb-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-10 px-2">
          <img src={logoImg} alt="Across Assist" className="h-8 w-auto" />
        </Link>

        {/* User Profile Summary */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#2563eb] flex items-center justify-center text-white font-bold text-sm shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-slate-900 font-bold text-sm truncate">{userName}</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase truncate tracking-wider">{companyName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
        {navLinks.map((link) => (
          <NavItem 
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isActive={location.pathname === link.to}
          />
        ))}

        <div className="pt-8 space-y-1.5">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Account & Support</p>
          <NavItem 
            to="#" 
            icon={Download} 
            label="Download Proposal" 
            isActive={false} 
            onClick={() => console.log('Download')}
          />
          <NavItem 
            to="#" 
            icon={Settings} 
            label="Settings" 
            isActive={false} 
            onClick={() => console.log('Settings')}
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

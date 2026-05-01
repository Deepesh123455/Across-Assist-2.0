import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ROUTES } from '../constants/routes';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === ROUTES.CHAT || location.pathname === ROUTES.ADVISOR;
  const isHomePage = location.pathname === ROUTES.HOME;
  const isDashboardRoute = [
    ROUTES.DASHBOARD,
    ROUTES.REVENUE_CALCULATOR,
    ROUTES.CHAT,
    ROUTES.ADVISOR,
    ROUTES.ONBOARDING,
    ROUTES.BUNDLES,
    ROUTES.PROFILE,
  ].includes(location.pathname as any);

  return (
    <div className={`font-body ${isChatPage || isDashboardRoute ? 'min-h-screen flex flex-col' : 'min-h-screen'}`}>
      {!isDashboardRoute && <Navbar />}
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
      {!isChatPage && !isDashboardRoute && <Footer />}

      {/* Back button — all pages except home, chat and dashboard */}
      {!isHomePage && !isChatPage && !isDashboardRoute && (
        <button
          onClick={() => navigate(-1)}
          className="fixed top-[78px] left-4 z-40 flex items-center gap-1.5 text-sm font-semibold text-brand-dark bg-white/90 backdrop-blur-sm border border-slate-200 px-3.5 py-2 rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Floating chat button */}
      {!isChatPage && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <button
            onClick={() => navigate(ROUTES.CHAT)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #F97316, #1A56DB)' }}
            aria-label="Open AI Chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-brand-dark text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat with AI
          </span>
        </div>
      )}
    </div>
  );
};

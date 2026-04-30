import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import logoWhiteBg from '../assets/images/logo-for-white-bg.png';

const navLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Why Us', to: ROUTES.WHY_US },
  { label: 'Contact', to: ROUTES.CONTACT },
];

const Logo = () => (
  <Link to={ROUTES.HOME} className="flex-shrink-0">
    <img src={logoWhiteBg} alt="Across Assist" className="h-9 w-auto" />
  </Link>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled enough for background change
      setScrolled(currentScrollY > 40);

      // Determine visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down - Hide
      } else {
        setIsVisible(true); // Scrolling up or at top - Show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to: string) =>
    to === ROUTES.HOME ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[9999] left-0 right-0 top-0 pointer-events-none"
      >
        <div
          className={`pointer-events-auto mx-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'mt-3 max-w-5xl px-4' : 'mt-0 max-w-full px-0'
            }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ${scrolled
                ? 'h-14 px-5 rounded-2xl bg-white backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                : 'h-[68px] px-6 sm:px-8 lg:px-12 bg-transparent'
              }`}
          >
            <Logo />

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
                        ? 'text-brand-blue'
                        : 'text-brand-textSecondary hover:text-brand-dark hover:bg-slate-50'
                      }`}
                    style={active ? { background: 'rgba(240,244,255,0.7)' } : {}}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-blue"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="btn-orange text-sm px-5 py-2.5 rounded-full font-semibold"
              >
                Partner With Us
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px] rounded-xl hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-[1.5px] bg-brand-dark rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block h-[1.5px] bg-brand-dark rounded-full transition-all duration-300 ${mobileOpen ? 'w-0 opacity-0' : 'w-5'}`} />
              <span className={`block w-5 h-[1.5px] bg-brand-dark rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/60 overflow-hidden"
              style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.14)' }}
            >
              <div className="flex items-center justify-between p-4 border-b border-brand-border/50">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-brand-dark hover:bg-slate-200 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-3 space-y-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.to)
                          ? 'text-brand-blue bg-blue-50'
                          : 'text-brand-dark hover:bg-brand-bg/60 hover:text-brand-blue'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 pb-1 px-1">
                  <Link
                    to={ROUTES.LOGIN}
                    className="btn-orange w-full justify-center py-3 text-sm text-center block rounded-full"
                  >
                    Partner With Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

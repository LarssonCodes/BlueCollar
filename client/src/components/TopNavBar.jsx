import { useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

function TopNavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 h-16 bg-surface border-b border-outline-variant flex items-center">
      <div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="material-symbols-outlined text-primary text-2xl">build_circle</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">BlueCollar</span>
        </Link>

        {/* Center Nav Links - Public Only */}
        {!isAuthenticated && (
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/login" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">{t('nav.findJobs')}</Link>
            <Link to="/login" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">{t('nav.postJobs')}</Link>
            <Link to="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">{t('nav.about')}</Link>
          </div>
        )}

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-on-surface-variant/70 text-lg mr-1 select-none">language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border border-outline-variant/40 rounded-lg px-2.5 py-1.5 font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <option value="en" className="bg-surface text-on-surface">EN</option>
              <option value="hi" className="bg-surface text-on-surface">हिन्दी</option>
              <option value="mz" className="bg-surface text-on-surface">Mizo</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-outline-variant/30 cursor-pointer"
            title={t('nav.toggleTheme')}
          >
            <span className="material-symbols-outlined text-xl select-none">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface rounded-saas px-5 py-2 hover:bg-surface-container-low transition-all"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="font-label-md text-label-md bg-primary-container text-on-primary rounded-saas px-5 py-2 hover:bg-surface-tint transition-all shadow-level-1"
              >
                {t('nav.signUp')}
              </Link>
            </>
          ) : (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm font-medium bg-[#EFF6FF] text-[#2563EB]">
                {user?.role}
              </span>
              <Link
                to={user?.role === 'WORKER' ? '/worker/profile' : user?.role === 'EMPLOYER' ? '/employer/profile' : '/admin'}
                className="font-label-md text-label-md bg-primary-container text-on-primary rounded-saas px-4 py-2 hover:bg-surface-tint transition-all shadow-level-1 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">person</span>
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low transition-all cursor-pointer"
              >
                {t('nav.logout')}
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-on-surface p-1 focus:outline-none flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'menu'}</span>
        </button>

        {/* Mobile Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-12 left-0 right-0 bg-surface border-b border-outline-variant flex flex-col gap-4 p-4 md:hidden shadow-level-2 z-50 animate-none">
            {/* Theme Toggle in Mobile Menu */}
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
              <span className="font-body-sm text-body-sm text-on-surface-variant">{t('nav.themeMode')}</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 bg-surface-container border border-outline-variant/30 text-on-surface rounded-full px-3 py-1.5 font-label-sm text-label-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] select-none">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
            {/* Language Selector in Mobile Menu */}
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Language / भाषा / Ṭawng</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-surface border border-outline-variant/50 rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mz">Mizo</option>
              </select>
            </div>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-body-md text-body-md text-on-surface-variant py-2 border-b border-outline-variant/30"
                >
                  {t('nav.findJobs')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-body-md text-body-md text-on-surface-variant py-2 border-b border-outline-variant/30"
                >
                  {t('nav.postJobs')}
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="font-body-md text-body-md text-on-surface-variant py-2"
                >
                  {t('nav.about')}
                </Link>
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="font-label-md text-label-md text-center bg-transparent border border-outline-variant text-on-surface rounded-saas py-2.5 hover:bg-surface-container-low transition-all"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="font-label-md text-label-md text-center bg-primary-container text-on-primary rounded-saas py-2.5 hover:bg-surface-tint transition-all"
                  >
                    {t('nav.signUp')}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{t('nav.loggedInAs')}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-[#EFF6FF] text-[#2563EB]">
                    {user?.role}
                  </span>
                </div>
                <Link
                  to={user?.role === 'WORKER' ? '/worker/profile' : user?.role === 'EMPLOYER' ? '/employer/profile' : '/admin'}
                  onClick={() => setIsOpen(false)}
                  className="font-label-md text-label-md text-center bg-primary-container text-on-primary rounded-saas py-2.5 hover:bg-surface-tint transition-all shadow-level-1 flex items-center justify-center gap-1.5 animate-none"
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-label-md text-label-md text-center bg-transparent border border-outline-variant text-on-surface rounded-saas py-2.5 hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopNavBar;

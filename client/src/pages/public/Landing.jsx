import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import TopNavBar from '../../components/TopNavBar.jsx';
import Footer from '../../components/Footer.jsx';

function Landing() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  // Determine destinations based on auth state and role
  let findJobsPath = '/register';
  let postJobPath = '/register';

  if (isAuthenticated && user) {
    if (user.role === 'WORKER') {
      findJobsPath = '/worker/jobs';
      postJobPath = '/worker/dashboard';
    } else if (user.role === 'EMPLOYER') {
      findJobsPath = '/employer/dashboard';
      postJobPath = '/employer/jobs/new';
    } else if (user.role === 'ADMIN') {
      findJobsPath = '/admin';
      postJobPath = '/admin';
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-page-entry">
      <TopNavBar />

      {/* Hero Section */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          {/* Hero Text */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm mb-6 shadow-sm border border-outline-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">work</span>
              <span>{t('landing.dedicatedPortal')}</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-background max-w-xl mb-4 leading-tight tracking-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to={findJobsPath}
                className="font-label-md text-label-md text-center bg-primary-container text-on-primary rounded-saas px-8 py-3.5 hover:bg-surface-tint transition-all shadow-level-1 hover:shadow-level-2 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                {t('landing.findJobsBtn')}
              </Link>
              <Link
                to={postJobPath}
                className="font-label-md text-label-md text-center bg-transparent border border-outline-variant text-on-surface rounded-saas px-8 py-3.5 hover:bg-surface-container-low transition-all shadow-level-1 hover:shadow-level-2 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                {t('landing.postJobBtn')}
              </Link>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="md:col-span-5 hidden md:block">
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/20 border border-outline-variant/30 p-2 shadow-level-1">
              <img 
                alt="BlueCollar Hero Illustration" 
                className="w-full h-auto rounded-xl object-cover" 
                src="/hero_illustration.png"
              />
            </div>
          </div>
        </div>
      </section>      {/* Feature Section */}
      <section className="bg-surface-bright py-24 border-t border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg text-on-background text-center mb-12 font-bold">
            {t('landing.whyChoose')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-level-2 hover:-translate-y-1">
              <div className="h-48 bg-surface-container-low flex items-center justify-center p-6 border-b border-outline-variant/20 overflow-hidden">
                <img 
                  alt="Find Local Jobs Illustration" 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                  src="/find_jobs_illustration.png"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  {t('landing.feature1Title')}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {t('landing.feature1Desc')}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-level-2 hover:-translate-y-1">
              <div className="h-48 bg-surface-container-low flex items-center justify-center p-6 border-b border-outline-variant/20 overflow-hidden">
                <img 
                  alt="Hire Skilled Workers Illustration" 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                  src="/hire_workers_illustration.png"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-xl">handshake</span>
                  {t('landing.feature2Title')}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {t('landing.feature2Desc')}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-level-2 hover:-translate-y-1">
              <div className="h-48 bg-surface-container-low flex items-center justify-center p-6 border-b border-outline-variant/20 overflow-hidden">
                <img 
                  alt="Fast Hiring Process Illustration" 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                  src="/fast_hiring_illustration.png"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface text-xl">bolt</span>
                  {t('landing.feature3Title')}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {t('landing.feature3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-[#E2E8F0] p-stack-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant text-center">
              <div className="py-6 sm:py-0">
                <span className="block font-headline-xl text-headline-xl text-primary font-bold mb-2">10,000+</span>
                <span className="block font-body-md text-body-md text-on-surface-variant font-medium">{t('landing.statWorkers')}</span>
              </div>
              <div className="py-6 sm:py-0">
                <span className="block font-headline-xl text-headline-xl text-primary font-bold mb-2">5,000+</span>
                <span className="block font-body-md text-body-md text-on-surface-variant font-medium">{t('landing.statGigs')}</span>
              </div>
              <div className="py-6 sm:py-0">
                <span className="block font-headline-xl text-headline-xl text-primary font-bold mb-2">99%</span>
                <span className="block font-body-md text-body-md text-on-surface-variant font-medium">{t('landing.statSuccess')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { register, googleAuth } from '../../api/auth.js';

export default function Register() {
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('WORKER'); // 'WORKER' or 'EMPLOYER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleClient, setGoogleClient] = useState(null);

  const googleTokenCallback = async (tokenResponse) => {
    if (tokenResponse && tokenResponse.access_token) {
      setError('');
      setIsSubmitting(true);
      try {
        const res = await googleAuth({
          accessToken: tokenResponse.access_token,
          role: role
        });
        if (res.data && res.data.success) {
          const { token, user } = res.data.data;
          authLogin(token, user);
          if (!user.hasProfile) {
            navigate('/setup-role');
          } else if (user.role === 'WORKER') navigate('/worker/dashboard');
          else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
        }
      } catch (err) {
        setError(err.response?.data?.error || t('register.errorFailed'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const initGoogleClient = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return null;
    if (!window.google?.accounts?.oauth2) return null;
    return window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile',
      callback: googleTokenCallback,
    });
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (window.google?.accounts?.oauth2) {
      setGoogleClient(initGoogleClient());
      return;
    }

    const scriptEl = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (scriptEl) {
      const onLoad = () => setGoogleClient(initGoogleClient());
      scriptEl.addEventListener('load', onLoad);
      return () => scriptEl.removeEventListener('load', onLoad);
    }
  }, []);

  const handleGoogleRegister = () => {
    if (!agreeTerms) {
      setError(t('register.errorTerms'));
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      navigate('/auth/google/mock');
      return;
    }

    let client = googleClient;
    if (!client && window.google?.accounts?.oauth2) {
      client = initGoogleClient();
      setGoogleClient(client);
    }

    if (client) {
      client.requestAccessToken();
    } else {
      setError('Google Sign-In is unavailable. The page may still be loading — please wait a moment and try again.');
    }
  };

  const handleLinkedInLogin = () => {
    if (!agreeTerms) {
      setError(t('register.errorTerms'));
      return;
    }
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    if (!clientId) {
      console.log("No VITE_LINKEDIN_CLIENT_ID found. Using mock LinkedIn authentication.");
      navigate('/auth/linkedin/mock');
      return;
    }
    
    const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`;
    window.location.href = linkedinUrl;
  };


  const renderTermsLabel = () => {
    const text = t('register.termsLabel');
    const parts = text.split(/(\{terms\}|\{privacy\})/);
    return parts.map((part, index) => {
      if (part === '{terms}') {
        return (
          <Link key={index} className="font-label-md text-primary hover:underline" to="/terms">
            {t('register.terms')}
          </Link>
        );
      }
      if (part === '{privacy}') {
        return (
          <Link key={index} className="font-label-md text-primary hover:underline" to="/privacy">
            {t('register.privacy')}
          </Link>
        );
      }
      return part;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError(t('register.errorPasswordLength'));
      return;
    }

    if (!agreeTerms) {
      setError(t('register.errorTerms'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ email, password, role });
      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);
        
        if (!user.hasProfile) {
          navigate('/setup-role');
        } else if (user.role === 'WORKER') navigate('/worker/dashboard');
        else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || t('register.errorFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex antialiased animate-page-entry">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-on-surface">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Dawn Industrial Site" 
            className="w-full h-full object-cover opacity-35" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhDJnbELYjCscxtj9HPOwndnu3hEEUKOE0MsIOSRA5k-y_oxS4YiQyaV3BXIwmTaXq8-UAvUQSWdZdcEnaCHoD3pzKSqK0t915PQxsvjOjLbrdBWxHaixShSiwsEuUml_IxEmDpiLEv417__KpoTYNhGWUsC4quaagdk7Etm_sJnzieNvgaYKwvHBU3LmZbRGxH1zh6tWV6pdKlzIlUVN2g6Zdwag3dHWpjE5O3-Dal2ZNAlfVMa07PQyFKvnRRKIKfEoLD_esjOxi"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/80 to-transparent" />
        </div>

        {/* Content (Z-10) */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <span className="material-symbols-outlined text-inverse-primary text-[32px] fill">architecture</span>
            <span className="font-headline-md text-headline-md text-surface-container-lowest font-bold">BlueCollar</span>
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-surface-container-lowest mb-6 max-w-md whitespace-pre-line">
            {t('register.brandTitle')}
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant max-w-md leading-relaxed">
            {t('register.brandSubtitle')}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-on-surface bg-surface-variant flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdvO8Ehbr7IjpC-OWEPxxXqWEOqLXYfx_60QroaZtvEmjGRQasPiWjR7lgbl6ZHRQM4419i8LRf0c3j2FFbea_peBirvfRdzYDLIojsNQ0T4C0ed1CDn6SlF5TxUJmVR1x19Wrx9rfBtB-E2tRz42tDZL5_2ydXYQMQ2qwtYZ4REk9wm-POb8BsFEB2eu9TqQMjhytrjCNrossM1tqqJOyMhQyVTdYAXDOpsZC4VPCgrD78ov0YBZkhR7kG_A08DqiXTMHA1035MtB" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-on-surface bg-surface-variant flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK6lF3kE1x3RwpG8NzImFeJarsGlPO8IC0UC7iL08Z1PCvaYjlQTqmQ29KhLLko-K3UcweuQ9PeN3c8J3RgfZSWi0otzltaAcergQH9mnzrC2zM7xpgwMTDNLMH8p3NBGsKCYAL0JyfOHiypGqoew__xC081y8GvnFFkj_9qGHCkTYX1ek_XNNBkzBmCZYtyL0N7uN7yvi_fybnamoej1jEU9LPvfd1J8YUFo2ZrogFQPZptAHnQkV0pDu3G6XhmpfY1PhFmNKzAUW" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-on-surface bg-surface-container flex items-center justify-center">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">+2k</span>
            </div>
          </div>
          <p className="font-label-sm text-label-sm text-surface-variant">{t('register.professionalsJoined')}</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-lg bg-surface-container-lowest p-8 sm:p-10 rounded-xl shadow-level-2 border border-surface-container-highest">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <span className="material-symbols-outlined text-primary text-[28px] fill">architecture</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold">BlueCollar</span>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-1 font-bold">
              {t('register.title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold" htmlFor="email">
                  {t('register.emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold" htmlFor="password">
                  {t('register.passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                  {t('register.passwordLengthHint')}
                </p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-2 bg-surface-container-lowest cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                  {renderTermsLabel()}
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-error font-body-sm text-body-sm flex items-center gap-1.5 bg-error-container text-on-error-container p-3 rounded-lg border border-error/10">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? t('register.submitting') : t('register.submitButton')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-4 relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                {t('login.orContinueWith') || 'Or continue with'}
              </span>
            </div>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              className="flex items-center justify-center w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleGoogleRegister}
              disabled={isSubmitting}
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-label-sm text-label-sm text-on-surface">Google</span>
            </button>
            <button
              className="flex items-center justify-center w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleLinkedInLogin}
              disabled={isSubmitting}
            >
              <svg className="h-5 w-5 mr-2 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="font-label-sm text-label-sm text-on-surface">LinkedIn</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('register.haveAccount')}{' '}
              <Link to="/login" className="font-label-md text-primary hover:text-surface-tint font-semibold hover:underline transition-colors">
                {t('register.loginNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { login, googleAuth } from '../../api/auth.js';

export default function Login() {
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleClient, setGoogleClient] = useState(null);

  useEffect(() => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setError('');
            setIsSubmitting(true);
            try {
              const res = await googleAuth({ accessToken: tokenResponse.access_token });
              if (res.data && res.data.success) {
                const { token, user } = res.data.data;
                authLogin(token, user);
                
                if (!user.hasProfile && user.role !== 'ADMIN') {
                  navigate('/setup-role');
                } else if (user.role === 'WORKER') navigate('/worker/dashboard');
                else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
                else if (user.role === 'ADMIN') navigate('/admin');
              }
            } catch (err) {
              setError(err.response?.data?.error || t('login.errorFailed'));
            } finally {
              setIsSubmitting(false);
            }
          }
        },
      });
      setGoogleClient(client);
    }
  }, [authLogin, navigate, t]);

  const handleGoogleLogin = () => {
    if (googleClient) {
      googleClient.requestAccessToken();
    } else {
      setError('Google Sign-In is currently unavailable. Please verify the configuration.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);
        
        if (!user.hasProfile && user.role !== 'ADMIN') {
          navigate('/setup-role');
        } else if (user.role === 'WORKER') navigate('/worker/dashboard');
        else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
        else if (user.role === 'ADMIN') navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.error || t('login.errorFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md w-full flex items-center justify-center relative overflow-hidden animate-page-entry">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed opacity-20 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed opacity-20 blur-3xl z-0" />

      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        <span>{t('common.backToHome')}</span>
      </Link>

      {/* Login Card Container */}
      <main className="w-full max-w-md mx-margin-mobile md:mx-auto bg-surface-container-lowest rounded-xl shadow-level-2 border border-outline-variant p-stack-lg relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-on-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[28px] fill">work</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">
            {t('login.title')}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="email">
              {t('login.emailLabel')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-on-surface-variant transition-colors outline-none"
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-label-sm text-label-sm text-on-surface" htmlFor="password">
                {t('login.passwordLabel')}
              </label>
              <a className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">
                {t('login.forgotPassword')}
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-on-surface-variant transition-colors outline-none"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
          </div>

          {/* Keep me signed in */}
          <div className="flex items-center pt-1">
            <input
              className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface-container-lowest cursor-pointer"
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember-me">
              {t('login.keepSignedIn')}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-error font-body-sm text-body-sm flex items-center gap-1.5 bg-error-container text-on-error-container p-3 rounded-lg border border-error/10">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('login.loggingIn') : t('login.submitButton')}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-4 relative">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/60" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              {t('login.orContinueWith')}
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            className="flex items-center justify-center w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleGoogleLogin}
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
          <button className="flex items-center justify-center w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors" type="button">
            <svg className="h-5 w-5 mr-2 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="font-label-sm text-label-sm text-on-surface">LinkedIn</span>
          </button>
        </div>

        {/* Sign Up Links */}
        <div className="text-center rounded-lg bg-surface-container-low p-stack-md mt-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
            {t('login.noAccount')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 mt-2">
            <Link to="/register?role=WORKER" className="font-label-md text-label-md text-primary hover:text-surface-tint transition-colors flex items-center font-bold">
              {t('login.workerSignUp')}
              <span className="material-symbols-outlined text-[16px] ml-0.5">arrow_forward</span>
            </Link>
            <span className="hidden sm:inline text-outline-variant/60">|</span>
            <Link to="/register?role=EMPLOYER" className="font-label-md text-label-md text-secondary hover:text-on-secondary-container transition-colors flex items-center font-bold">
              {t('login.employerSignUp')}
              <span className="material-symbols-outlined text-[16px] ml-0.5">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

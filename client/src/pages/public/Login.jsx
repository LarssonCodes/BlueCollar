import { useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { login } from '../../api/auth.js';
import TopNavBar from '../../components/TopNavBar.jsx';
import Footer from '../../components/Footer.jsx';

function Login() {
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);
        // Navigate based on user role
        if (user.role === 'WORKER') {
          navigate('/worker/dashboard');
        } else if (user.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavBar />
      
      <div className="flex-grow flex items-center justify-center py-16 px-margin-mobile">
        <div className="max-w-md w-full bg-surface-container-lowest rounded-xl shadow-level-1 border border-[#E2E8F0] p-stack-lg flex flex-col gap-6">
          <div className="text-center">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold mb-2">
              {t('login.title')}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant block mb-1 font-semibold">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="font-body-md text-body-md border border-outline-variant rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant block mb-1 font-semibold">
                {t('login.passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="font-body-md text-body-md border border-outline-variant rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-error font-body-sm text-body-sm flex items-center gap-1.5 bg-error-container text-on-error-container p-3 rounded-lg border border-error/10">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-label-md text-label-md text-center bg-primary-container text-on-primary rounded-saas py-3.5 w-full hover:bg-surface-tint transition-all shadow-level-1 hover:shadow-level-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? t('login.loggingIn') : t('login.submitButton')}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-outline-variant/30">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                {t('login.registerNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;

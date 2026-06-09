import { useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { register } from '../../api/auth.js';
import TopNavBar from '../../components/TopNavBar.jsx';
import Footer from '../../components/Footer.jsx';

function Register() {
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState(null); // 'WORKER' or 'EMPLOYER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ email, password, role });
      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);
        // Navigate based on user role
        if (user.role === 'WORKER') {
          navigate('/worker/dashboard');
        } else if (user.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
              {t('register.title')}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role Selection */}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-2 font-semibold">
                {t('register.roleLabel')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Worker Card */}
                <div
                  onClick={() => setRole('WORKER')}
                  className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${
                    role === 'WORKER'
                      ? 'border-primary-container bg-primary-fixed text-primary shadow-level-1'
                      : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl mb-1 block">construction</span>
                  <span className="font-label-md text-label-md font-semibold">{t('register.workerCard')}</span>
                </div>

                {/* Employer Card */}
                <div
                  onClick={() => setRole('EMPLOYER')}
                  className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${
                    role === 'EMPLOYER'
                      ? 'border-primary-container bg-primary-fixed text-primary shadow-level-1'
                      : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl mb-1 block">storefront</span>
                  <span className="font-label-md text-label-md font-semibold">{t('register.employerCard')}</span>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant block mb-1 font-semibold">
                {t('register.emailLabel')}
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
                {t('register.passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('register.passwordPlaceholder')}
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
              {isSubmitting ? t('register.submitting') : t('register.submitButton')}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-outline-variant/30">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('register.haveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                {t('register.loginNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;

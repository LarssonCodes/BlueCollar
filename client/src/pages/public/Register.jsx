import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { register } from '../../api/auth.js';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select an account type');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ email, password, role });
      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);
        
        if (user.role === 'WORKER') navigate('/worker/dashboard');
        else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex antialiased">
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
          <h1 className="font-headline-xl text-headline-xl text-surface-container-lowest mb-6 max-w-md">
            Build your career.<br />Hire the best.
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant max-w-md leading-relaxed">
            The premier platform connecting skilled tradespeople with top-tier industrial and construction employers.
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
          <p className="font-label-sm text-label-sm text-surface-variant">Professionals joined this week</p>
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
              Create an account
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join the network of skilled professionals and top employers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection (Bento Style) */}
            <div className="space-y-2 mb-6">
              <label className="font-label-md text-label-md text-on-surface block font-bold">
                I am joining as a:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Worker Option */}
                <div
                  onClick={() => setRole('WORKER')}
                  className={`cursor-pointer p-4 rounded-lg border-2 bg-surface-container-lowest transition-all duration-200 flex flex-col items-start gap-3
                    ${role === 'WORKER' 
                      ? 'border-primary bg-surface-container-low/50' 
                      : 'border-outline-variant/60 hover:border-primary/50'}`}
                >
                  <span className={`material-symbols-outlined text-on-surface-variant transition-colors
                    ${role === 'WORKER' ? 'text-primary fill' : ''}`}>
                    handyman
                  </span>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Worker</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      I want to find jobs and manage my career.
                    </p>
                  </div>
                </div>

                {/* Employer Option */}
                <div
                  onClick={() => setRole('EMPLOYER')}
                  className={`cursor-pointer p-4 rounded-lg border-2 bg-surface-container-lowest transition-all duration-200 flex flex-col items-start gap-3
                    ${role === 'EMPLOYER' 
                      ? 'border-primary bg-surface-container-low/50' 
                      : 'border-outline-variant/60 hover:border-primary/50'}`}
                >
                  <span className={`material-symbols-outlined text-on-surface-variant transition-colors
                    ${role === 'EMPLOYER' ? 'text-primary fill' : ''}`}>
                    domain
                  </span>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Employer</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      I want to post jobs and hire talent.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-bold" htmlFor="email">
                  Email Address
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
                  Password
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
                  Must be at least 8 characters long.
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
                  I agree to the <a className="font-label-md text-primary hover:underline" href="#">Terms of Service</a> and <a className="font-label-md text-primary hover:underline" href="#">Privacy Policy</a>.
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
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="font-label-md text-primary hover:text-surface-tint font-semibold hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

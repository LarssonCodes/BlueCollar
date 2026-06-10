import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { googleAuth } from '../../api/auth.js';

export default function MockGoogleLogin() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAccount = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Authenticate via the backend Google Auth endpoint using our mock token
      const res = await googleAuth({
        accessToken: 'mock_google_token_123456',
        role: 'WORKER' // default role, user will pick actual role on /setup-role
      });

      if (res.data && res.data.success) {
        const { token, user } = res.data.data;
        authLogin(token, user);

        const setupCompleted = localStorage.getItem('bluecollar_setup_completed') === 'true' || user.role === 'EMPLOYER' || user.role === 'ADMIN';
        if (!user.hasProfile && !setupCompleted) {
          navigate('/setup-role');
        } else if (user.role === 'WORKER') {
          navigate('/worker/dashboard');
        } else if (user.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Mock Google auth error:', err);
      setError(err.response?.data?.error || 'Simulated Google Sign-In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-body-md text-on-surface antialiased p-4">
      {/* Google Login Container */}
      <main className="w-full max-w-[450px] bg-white rounded-lg shadow-md border border-slate-200 p-10 text-center flex flex-col items-center">
        
        {/* Google Logo */}
        <div className="mb-6 select-none">
          <svg className="w-16 h-16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </div>

        {/* Header */}
        <h1 className="text-xl font-medium text-slate-800 mb-1 font-headline-md">
          Sign in
        </h1>
        <p className="text-sm text-slate-600 mb-6 font-body-sm">
          to continue to <span className="font-semibold text-slate-800">BlueCollar (Sandbox)</span>
        </p>

        {/* Sandbox Indicator badge */}
        <span className="bg-orange-50 text-orange-600 border border-orange-200 font-label-sm text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider select-none mb-6">
          Google Sign-in Developer Sandbox
        </span>

        {/* Account Row Select Button */}
        <button
          onClick={handleSelectAccount}
          disabled={isSubmitting}
          className="w-full flex items-center gap-3.5 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer mb-6"
        >
          {/* Default user picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center">
            {isSubmitting ? (
              <span className="animate-spin material-symbols-outlined text-slate-500">sync</span>
            ) : (
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdvO8Ehbr7IjpC-OWEPxxXqWEOqLXYfx_60QroaZtvEmjGRQasPiWjR7lgbl6ZHRQM4419i8LRf0c3j2FFbea_peBirvfRdzYDLIojsNQ0T4C0ed1CDn6SlF5TxUJmVR1x19Wrx9rfBtB-E2tRz42tDZL5_2ydXYQMQ2qwtYZ4REk9wm-POb8BsFEB2eu9TqQMjhytrjCNrossM1tqqJOyMhQyVTdYAXDOpsZC4VPCgrD78ov0YBZkhR7kG_A08DqiXTMHA1035MtB"
                alt="Google Sandbox Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-grow overflow-hidden">
            <h3 className="font-label-md text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900">
              Google Sandbox User
            </h3>
            <p className="font-body-sm text-xs text-slate-500 truncate">
              google_user@example.com
            </p>
          </div>
        </button>

        {/* Error message */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-xs w-full mb-6 text-left flex items-start gap-1.5">
            <span className="material-symbols-outlined text-sm leading-none mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Footer buttons */}
        <div className="w-full flex justify-between items-center pt-2">
          <button
            onClick={handleCancel}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSelectAccount}
            disabled={isSubmitting}
            className="text-xs text-slate-500 hover:underline cursor-pointer"
          >
            Use Sandbox Account
          </button>
        </div>

      </main>

      <p className="text-[10px] text-slate-500 mt-6 max-w-sm text-center leading-relaxed">
        This is a sandbox consent page that bypasses the live Google client ID checks for development. Registering your own client ID in <code>client/.env</code> will restore the live Google OAuth login.
      </p>
    </div>
  );
}

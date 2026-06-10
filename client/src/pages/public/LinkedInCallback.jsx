import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { linkedinAuth } from '../../api/auth.js';

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError('Authorization code is missing from LinkedIn redirection.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await linkedinAuth({ code });
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
        console.error('LinkedIn auth error:', err);
        setError(err.response?.data?.error || 'LinkedIn authentication failed. Please try again.');
      }
    };

    exchangeCode();
  }, [searchParams, authLogin, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-on-surface antialiased">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-xl shadow-level-2 border border-surface-container-highest text-center">
        <div className="flex justify-center mb-6">
          <svg className="h-12 w-12 text-[#0A66C2] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>

        {error ? (
          <>
            <h2 className="font-headline-md text-headline-md text-error mb-3 font-bold">
              Authentication Failed
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="py-2.5 px-6 border border-transparent rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold animate-pulse">
              Authenticating...
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Connecting with LinkedIn. Please do not close this window.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

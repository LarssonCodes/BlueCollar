import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { updateRole } from '../../api/auth.js';

export default function SetupRole() {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('WORKER');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default selected role to match user's current role if they already have one
  useEffect(() => {
    if (user && user.role) {
      setRole(user.role === 'ADMIN' ? 'WORKER' : user.role);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body-md text-body-md text-on-surface-variant">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user already completed onboarding/profile creation, redirect them to dashboard
  if (user.hasProfile) {
    const dashboardPath = user.role === 'EMPLOYER' 
      ? '/employer/dashboard' 
      : user.role === 'ADMIN' 
        ? '/admin' 
        : '/worker/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // If the selected role is different from the current user role, update it on the backend
      if (role !== user.role) {
        await updateRole({ role });
      }
      
      // Update the user's role locally in the Auth Context
      updateUser({ role });

      // Navigate to the correct profile completion route
      if (role === 'WORKER') {
        navigate('/worker/profile');
      } else {
        navigate('/employer/profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update account role. Please try again.');
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

      {/* Setup Role Card */}
      <main className="w-full max-w-lg mx-margin-mobile md:mx-auto bg-surface-container-lowest rounded-xl shadow-level-2 border border-outline-variant p-stack-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-on-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[28px] fill">assignment_ind</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
            Account Setup
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Welcome to BlueCollar! Please tell us how you plan to use the platform to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="font-label-md text-label-md text-on-surface block font-bold text-center sm:text-left">
              Choose your Account Type
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Worker Option */}
              <div
                onClick={() => setRole('WORKER')}
                className={`cursor-pointer p-5 rounded-lg border-2 bg-surface-container-lowest transition-all duration-200 flex flex-col items-start gap-3 select-none
                  ${role === 'WORKER' 
                    ? 'border-primary bg-surface-container-low/50 shadow-sm' 
                    : 'border-outline-variant/60 hover:border-primary/50'}`}
              >
                <span className={`material-symbols-outlined text-on-surface-variant transition-colors text-3xl
                  ${role === 'WORKER' ? 'text-primary fill' : ''}`}>
                  handyman
                </span>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                    {t('register.workerCard') || 'Worker'}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {t('register.workerDesc') || 'I am looking for skilled trade jobs, gigs, and contracts.'}
                  </p>
                </div>
              </div>

              {/* Employer Option */}
              <div
                onClick={() => setRole('EMPLOYER')}
                className={`cursor-pointer p-5 rounded-lg border-2 bg-surface-container-lowest transition-all duration-200 flex flex-col items-start gap-3 select-none
                  ${role === 'EMPLOYER' 
                    ? 'border-primary bg-surface-container-low/50 shadow-sm' 
                    : 'border-outline-variant/60 hover:border-primary/50'}`}
              >
                <span className={`material-symbols-outlined text-on-surface-variant transition-colors text-3xl
                  ${role === 'EMPLOYER' ? 'text-primary fill' : ''}`}>
                  domain
                </span>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                    {t('register.employerCard') || 'Employer'}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {t('register.employerDesc') || 'I am looking to hire trade professionals, post jobs, and manage hires.'}
                  </p>
                </div>
              </div>
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
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Saving...' : 'Confirm & Continue'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      </main>
    </div>
  );
}

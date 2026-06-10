import { useNavigate } from 'react-router-dom';

export default function MockLinkedInLogin() {
  const navigate = useNavigate();

  const handleAllow = () => {
    // Redirect to the callback route with mock authorization code
    navigate('/auth/linkedin/callback?code=mock_code_123456');
  };

  const handleCancel = () => {
    // Redirect back to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-on-surface antialiased p-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none z-0" />

      {/* Main card */}
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-level-2 border border-outline-variant p-8 relative z-10">
        
        {/* LinkedIn Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <svg className="h-9 w-9 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM7.12 20.452H3.558V9H7.12v11.452zM5.339 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm15.113 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-[#0A66C2]">LinkedIn</span>
          </div>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider select-none mb-4 border border-[#BFDBFE]">
            Developer Sandbox
          </span>
          <h1 className="font-headline-md text-headline-sm text-on-surface font-bold">
            Sign in with LinkedIn
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
            <strong>BlueCollar (Dev)</strong> is requesting permission to access your LinkedIn profile information.
          </p>
        </div>

        {/* Permissions Request List */}
        <div className="bg-surface-container rounded-xl p-4 mb-6 border border-outline-variant/30 text-left">
          <h2 className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mb-3">
            Requested Permissions:
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#059669] text-base mt-0.5 select-none font-bold">check_circle</span>
              <span className="font-body-sm text-body-sm text-on-surface">
                <strong>Your name and photo</strong>
                <span className="block text-xs text-on-surface-variant/80 mt-0.5">Used to personalize your account profile.</span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#059669] text-base mt-0.5 select-none font-bold">check_circle</span>
              <span className="font-body-sm text-body-sm text-on-surface">
                <strong>Your primary email address</strong>
                <span className="block text-xs text-on-surface-variant/80 mt-0.5">Used as your login credential and for notification emails.</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Profile Mock Card */}
        <div className="border border-outline-variant/60 rounded-xl p-4 flex items-center gap-3.5 mb-8 bg-surface-container-lowest">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-outline-variant shadow-sm flex items-center justify-center bg-surface-container shrink-0">
            <span className="material-symbols-outlined text-2xl text-primary font-medium">person</span>
          </div>
          <div className="text-left overflow-hidden">
            <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">LinkedIn Member</h3>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">linkedin_user@example.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAllow}
            className="w-full py-3 px-4 rounded-lg font-label-md text-label-md text-on-primary bg-[#0A66C2] hover:bg-[#084e96] transition-colors cursor-pointer font-bold shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Allow & Continue</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
          
          <button
            onClick={handleCancel}
            className="w-full py-3 px-4 rounded-lg font-label-md text-label-md border border-outline-variant hover:bg-surface-container-low text-on-surface transition-colors cursor-pointer font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[10px] text-on-surface-variant/70 text-center mt-6 leading-relaxed">
          This is a simulated LinkedIn Sign-In consent screen for testing in the development environment. In production, users will be redirected to LinkedIn's official authorization website.
        </p>

      </main>
    </div>
  );
}

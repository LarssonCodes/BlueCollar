import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function NotFoundPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (!isAuthenticated || !user) {
      navigate('/');
    } else if (user.role === 'WORKER') {
      navigate('/worker/dashboard');
    } else if (user.role === 'EMPLOYER') {
      navigate('/employer/dashboard');
    } else if (user.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-background min-h-[60vh] max-w-md mx-auto animate-page-entry">
      <span className="material-symbols-outlined text-on-surface-variant text-5xl select-none">
        search_off
      </span>
      <h1 className="font-headline-md text-headline-md text-on-surface mt-4 font-semibold">
        Page Not Found
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={handleGoBack}
        type="button"
        className="bg-primary-container text-on-primary rounded-saas px-6 py-2.5 mt-6 font-label-md text-label-md hover:bg-surface-tint transition-all shadow-level-1 cursor-pointer min-h-[44px]"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default NotFoundPage;

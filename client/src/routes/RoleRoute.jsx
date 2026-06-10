import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const RoleRoute = ({ role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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

  const setupCompleted = localStorage.getItem('bluecollar_setup_completed') === 'true' || user.role === 'EMPLOYER' || user.role === 'ADMIN';

  if (!user.hasProfile && !setupCompleted) {
    const isProfilePage = location.pathname === '/worker/profile' || location.pathname === '/employer/profile';
    if (!isProfilePage) {
      return <Navigate to="/setup-role" replace />;
    }
  }

  if (user.role !== role) {
    // Redirect to correct role-based dashboard if they don't match the current route role
    if (user.role === 'WORKER') {
      return <Navigate to="/worker/dashboard" replace />;
    } else if (user.role === 'EMPLOYER') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const RoleRoute = ({ role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

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

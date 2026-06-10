import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';

function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body-md text-body-md text-on-surface-variant">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const isDashboardActive = location.pathname === '/admin';
  const isUsersActive = location.pathname.startsWith('/admin/users');
  const isJobsActive = location.pathname.startsWith('/admin/jobs');
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-grow md:ml-64 p-stack-md md:p-stack-lg min-h-screen flex flex-col bg-background pb-24 md:pb-stack-lg">
        <div key={location.pathname} className="max-w-container-max w-full mx-auto flex-grow flex flex-col animate-page-entry">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Bar - Mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-[#E2E8F0] flex justify-around items-center z-40 md:hidden">
        {/* Dashboard */}
        <Link
          to="/admin"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isDashboardActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isDashboardActive ? 'text-[28px]' : 'text-2xl'}`}>
            trending_up
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Dashboard</span>
        </Link>
        {/* Users */}
        <Link
          to="/admin/users"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isUsersActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isUsersActive ? 'text-[28px]' : 'text-2xl'}`}>
            people
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Users</span>
        </Link>
        {/* Jobs */}
        <Link
          to="/admin/jobs"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isJobsActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isJobsActive ? 'text-[28px]' : 'text-2xl'}`}>
            work
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Jobs</span>
        </Link>
        {/* Settings */}
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isSettingsActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isSettingsActive ? 'text-[28px]' : 'text-2xl'}`}>
            settings
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

export default AdminLayout;

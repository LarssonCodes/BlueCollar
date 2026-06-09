import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardActive = location.pathname === '/admin';
  const isUsersActive = location.pathname.startsWith('/admin/users');
  const isJobsActive = location.pathname.startsWith('/admin/jobs');
  const isSettingsActive = location.pathname === '/settings';

  const navItemClass = (isActive) =>
    isActive
      ? 'flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg translate-x-1 transition-transform font-label-md text-label-md shadow-level-1'
      : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md';

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-[#E2E8F0] flex flex-col fixed top-0 bottom-0 left-0 z-30 h-screen hidden md:flex">
      {/* Sidebar Top: Logo area */}
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col gap-1">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl select-none">build_circle</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">BlueCollar</span>
        </Link>
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">
          Admin Panel
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-grow flex flex-col gap-1.5 p-4">
        {/* Dashboard */}
        <Link to="/admin" className={navItemClass(isDashboardActive)}>
          <span className="material-symbols-outlined text-lg select-none">trending_up</span>
          <span>Dashboard</span>
        </Link>

        {/* Users */}
        <Link to="/admin/users" className={navItemClass(isUsersActive)}>
          <span className="material-symbols-outlined text-lg select-none">people</span>
          <span>Users</span>
        </Link>

        {/* Jobs */}
        <Link to="/admin/jobs" className={navItemClass(isJobsActive)}>
          <span className="material-symbols-outlined text-lg select-none">work</span>
          <span>Jobs</span>
        </Link>

        {/* Settings */}
        <Link to="/settings" className={navItemClass(isSettingsActive)}>
          <span className="material-symbols-outlined text-lg select-none">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 mt-auto border-t border-[#E2E8F0]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-lg transition-all font-label-md text-label-md text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg select-none">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

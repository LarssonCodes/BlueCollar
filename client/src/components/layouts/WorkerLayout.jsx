import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getProfile } from '../../api/worker.js';

const TRADE_LABELS = {
  ELECTRICIAN: 'Electrician', PLUMBER: 'Plumber', DRIVER: 'Driver',
  WELDER: 'Welder', MECHANIC: 'Mechanic', CONSTRUCTION: 'Construction', OTHER: 'Other'
};

function WorkerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data?.success) setProfileInfo(res.data.data);
      } catch { /* profile may not exist */ }
    };
    fetchProfile();
  }, []);

  // Profile completion calculation
  const getCompletion = () => {
    if (!profileInfo) return 0;
    const fields = ['fullName', 'phone', 'trade', 'pincode', 'city', 'state', 'bio', 'profilePicture'];
    const filled = fields.filter((f) => profileInfo[f] && String(profileInfo[f]).trim()).length;
    const hasSkills = profileInfo.skills && profileInfo.skills.length > 0 ? 1 : 0;
    return Math.round(((filled + hasSkills) / (fields.length + 1)) * 100);
  };
  const completion = getCompletion();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDashboardActive = location.pathname === '/worker/dashboard';
  const isProfileActive = location.pathname === '/worker/profile';
  const isBrowseJobsActive = location.pathname.startsWith('/worker/jobs');
  const isMyApplicationsActive = location.pathname === '/worker/applications';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop only */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col fixed top-0 bottom-0 left-0 z-30 hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">build_circle</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">BlueCollar</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="m-4 p-4 bg-surface-container-low rounded-lg flex flex-col gap-2 border border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30 flex items-center justify-center shrink-0">
              {profileInfo?.profilePicture ? (
                <img src={profileInfo.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
              )}
            </div>
            <div className="min-w-0">
              <span className="font-label-md text-label-md text-on-surface truncate block font-semibold">
                {profileInfo?.fullName || user?.email}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium truncate block">
                {profileInfo ? `${TRADE_LABELS[profileInfo.trade] || 'Worker'}${profileInfo.city ? ` • ${profileInfo.city}` : ''}` : 'Skilled Professional'}
              </span>
            </div>
          </div>
          {/* Profile Completion */}
          {profileInfo && (
            <div className="mt-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Profile</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{completion}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${completion === 100 ? 'bg-[#059669]' : 'bg-primary-container'}`}
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-grow flex flex-col gap-1 px-3">
          {/* Dashboard Link */}
          <Link
            to="/worker/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isDashboardActive
                ? 'font-label-md text-label-md bg-primary-container text-on-primary translate-x-1 shadow-level-1'
                : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>Dashboard</span>
          </Link>

          {/* Browse Jobs Link */}
          <Link
            to="/worker/jobs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isBrowseJobsActive
                ? 'font-label-md text-label-md bg-primary-container text-on-primary translate-x-1 shadow-level-1'
                : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span>Browse Jobs</span>
          </Link>

          {/* My Applications Link */}
          <Link
            to="/worker/applications"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isMyApplicationsActive
                ? 'font-label-md text-label-md bg-primary-container text-on-primary translate-x-1 shadow-level-1'
                : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
            <span>My Applications</span>
          </Link>

          {/* Profile Active */}
          <Link
            to="/worker/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isProfileActive
                ? 'font-label-md text-label-md bg-primary-container text-on-primary translate-x-1 shadow-level-1'
                : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            <span>Profile</span>
          </Link>

          {/* Settings Link */}
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isSettingsActive
                ? 'font-label-md text-label-md bg-primary-container text-on-primary translate-x-1 shadow-level-1'
                : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span>Settings</span>
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto mx-4 mb-4 font-label-md text-label-md border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2.5 text-center cursor-pointer transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-64 p-stack-md md:p-stack-lg min-h-screen flex flex-col pb-24 md:pb-stack-lg">
        {/* Outlet for nested pages */}
        <div className="max-w-container-max w-full mx-auto flex-grow flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Bar - Mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center z-40 md:hidden">
        {/* Dashboard */}
        <Link
          to="/worker/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isDashboardActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isDashboardActive ? 'text-[28px]' : 'text-2xl'}`}>
            dashboard
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Dashboard</span>
        </Link>
        {/* Browse */}
        <Link
          to="/worker/jobs"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isBrowseJobsActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isBrowseJobsActive ? 'text-[28px]' : 'text-2xl'}`}>
            work
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Browse</span>
        </Link>
        {/* Applications */}
        <Link
          to="/worker/applications"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isMyApplicationsActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isMyApplicationsActive ? 'text-[28px]' : 'text-2xl'}`}>
            assignment
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Applications</span>
        </Link>
        {/* Profile */}
        <Link
          to="/worker/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 h-full text-center min-h-[44px] ${
            isProfileActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined select-none ${isProfileActive ? 'text-[28px]' : 'text-2xl'}`}>
            person
          </span>
          <span className="font-label-sm text-label-sm leading-tight mt-0.5">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default WorkerLayout;

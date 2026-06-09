import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/public/Landing.jsx';
import Login from '../pages/public/Login.jsx';
import Register from '../pages/public/Register.jsx';
import WorkerDashboard from '../pages/worker/WorkerDashboard.jsx';
import WorkerProfilePage from '../pages/worker/WorkerProfilePage.jsx';
import BrowseJobsPage from '../pages/worker/BrowseJobsPage.jsx';
import JobDetailPage from '../pages/worker/JobDetailPage.jsx';
import MyApplicationsPage from '../pages/worker/MyApplicationsPage.jsx';
import EmployerDashboard from '../pages/employer/EmployerDashboard.jsx';
import EmployerProfilePage from '../pages/employer/EmployerProfilePage.jsx';
import MyJobsPage from '../pages/employer/MyJobsPage.jsx';
import PostJobPage from '../pages/employer/PostJobPage.jsx';
import JobApplicantsPage from '../pages/employer/JobApplicantsPage.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import AdminJobs from '../pages/admin/AdminJobs.jsx';
import RoleRoute from './RoleRoute.jsx';
import WorkerLayout from '../components/layouts/WorkerLayout.jsx';
import EmployerLayout from '../components/layouts/EmployerLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import SettingsPage from '../pages/public/SettingsPage.jsx';
import NotFoundPage from '../pages/public/NotFoundPage.jsx';
import HelpSupportPage from '../pages/public/HelpSupportPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function DynamicRoleLayout() {
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

  if (user.role === 'WORKER') {
    return <WorkerLayout />;
  }
  if (user.role === 'EMPLOYER') {
    return <EmployerLayout />;
  }
  if (user.role === 'ADMIN') {
    return <AdminLayout />;
  }

  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/support" element={<HelpSupportPage />} />

      {/* Worker Routes */}
      <Route element={<RoleRoute role="WORKER" />}>
        <Route element={<WorkerLayout />}>
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/profile" element={<WorkerProfilePage />} />
          <Route path="/worker/jobs" element={<BrowseJobsPage />} />
          <Route path="/worker/jobs/:id" element={<JobDetailPage />} />
          <Route path="/worker/applications" element={<MyApplicationsPage />} />
        </Route>
      </Route>

      {/* Employer Routes */}
      <Route element={<RoleRoute role="EMPLOYER" />}>
        <Route element={<EmployerLayout />}>
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/profile" element={<EmployerProfilePage />} />
          <Route path="/employer/jobs" element={<MyJobsPage />} />
          <Route path="/employer/jobs/new" element={<PostJobPage />} />
          <Route path="/employer/jobs/:id" element={<JobApplicantsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleRoute role="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
        </Route>
      </Route>

      {/* Shared Settings Route */}
      <Route element={<DynamicRoleLayout />}>
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch All Redirect */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getEmployerStats, getRecentEmployerJobs } from '../../api/employer';
import MetricCard from '../../components/MetricCard';
import EmployerProfileCompletionCard from '../../components/employer/EmployerProfileCompletionCard';
import RecentJobsTable from '../../components/employer/RecentJobsTable';

function EmployerDashboard() {
  const [stats, setStats] = useState({
    jobsPosted: 0,
    openJobs: 0,
    filledJobs: 0,
    totalApplicants: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, jobsRes, profileRes] = await Promise.all([
        getEmployerStats(),
        getRecentEmployerJobs(),
        getProfile().catch(err => {
          // If profile is not found (404), return a simulated success with null data
          if (err.response?.status === 404) {
            return { data: { success: true, data: null } };
          }
          throw err;
        })
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (jobsRes.data?.success) {
        setRecentJobs(jobsRes.data.data);
      }
      if (profileRes.data?.success) {
        setProfile(profileRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while loading dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
          Overview
        </h1>
        <div className="bg-surface-container-lowest rounded-xl border border-[#E2E8F0] p-12 text-center shadow-level-1 flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-error text-5xl select-none">error</span>
          <p className="font-body-md text-body-md text-error">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
      {/* Header Block */}
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
          Overview
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Here is your hiring activity.
        </p>
      </div>

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-gutter mt-2">
        {/* Left Column (col-span-8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-lg">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
            <MetricCard
              label="Jobs Posted"
              value={stats.jobsPosted}
              icon="work"
              iconColor="text-primary-container"
              iconBg="bg-tertiary-fixed"
              isLoading={loading}
            />
            <MetricCard
              label="Open"
              value={stats.openJobs}
              icon="trending_up"
              iconColor="text-[#059669]"
              iconBg="bg-[#D1FAE5]"
              isLoading={loading}
            />
            <MetricCard
              label="Filled"
              value={stats.filledJobs}
              icon="check_circle"
              iconColor="text-on-surface-variant"
              iconBg="bg-surface-container"
              isLoading={loading}
            />
            <MetricCard
              label="Total Applicants"
              value={stats.totalApplicants}
              icon="people"
              iconColor="text-[#EA580C]"
              iconBg="bg-[#FFF7ED]"
              isLoading={loading}
            />
          </div>

          {/* Recent Jobs Table */}
          <RecentJobsTable
            jobs={recentJobs}
            isLoading={loading}
          />
        </div>

        {/* Right Column (col-span-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-lg">
          {/* Quick Actions Card */}
          <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-stack-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm font-semibold">
              Quick Actions
            </h3>
            <Link
              to="/employer/jobs/new"
              className="bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint w-full font-semibold text-center block transition-colors"
            >
              Post a New Job
            </Link>
            <Link
              to="/employer/jobs"
              className="bg-transparent border border-outline-variant text-on-surface rounded-saas px-6 py-2.5 hover:bg-surface-container-low w-full mt-2 font-semibold text-center block transition-colors"
            >
              View All Jobs
            </Link>
          </div>

          {/* Profile Completion Card */}
          {!loading && (
            <EmployerProfileCompletionCard profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getWorkerStats, getRecentWorkerApplications } from '../../api/worker';
import { getJobs } from '../../api/jobs';
import MetricCard from '../../components/MetricCard';
import ProfileCompletionCard from '../../components/worker/ProfileCompletionCard';
import RecentApplicationsTable from '../../components/worker/RecentApplicationsTable';

const FALLBACK_RECOMMENDATIONS = {
  ELECTRICIAN: [
    { id: 'mock-e1', title: 'Commercial Electrician', employer: { fullName: 'Apex Build Co.' }, city: 'Austin', state: 'TX', payAmount: 45, payType: 'DAILY', type: 'GIG' },
    { id: 'mock-e2', title: 'Industrial Cable Specialist', employer: { fullName: 'VoltWorks Energy' }, city: 'Dallas', state: 'TX', payAmount: 55, payType: 'DAILY', type: 'CONTRACT' }
  ],
  PLUMBER: [
    { id: 'mock-p1', title: 'Commercial Plumber', employer: { fullName: 'WaterWorks City Co.' }, city: 'Austin', state: 'TX', payAmount: 40, payType: 'DAILY', type: 'NEW' },
    { id: 'mock-p2', title: 'Emergency Pipe Repair', employer: { fullName: 'Sarah Jenkins (Homeowner)' }, city: 'Renton', state: 'WA', payAmount: 200, payType: 'DAILY', type: 'GIG' }
  ],
  DEFAULT: [
    { id: 'mock-d1', title: 'Skilled General Contractor', employer: { fullName: 'BuildRight Construction' }, city: 'Round Rock', state: 'TX', payAmount: 35, payType: 'DAILY', type: 'URGENT' },
    { id: 'mock-d2', title: 'Local Project Assistant', employer: { fullName: 'Urban Developers' }, city: 'Houston', state: 'TX', payAmount: 30, payType: 'DAILY', type: 'GIG' }
  ]
};

function WorkerDashboard() {
  const [stats, setStats] = useState({
    applicationsSent: 0,
    shortlisted: 0,
    rejected: 0,
    activeJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, appsRes, profileRes] = await Promise.all([
        getWorkerStats(),
        getRecentWorkerApplications(),
        getProfile().catch(err => {
          // If profile is not found (404), return a simulated success with null data
          if (err.response?.status === 404) {
            return { data: { success: true, data: null } };
          }
          throw err;
        })
      ]);

      let activeProfile = null;
      if (profileRes.data?.success) {
        activeProfile = profileRes.data.data;
        setProfile(activeProfile);
      }

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (appsRes.data?.success) {
        setRecentApplications(appsRes.data.data);
      }

      // Fetch recommended jobs (either by trade or general list)
      const tradeParam = activeProfile?.trade ? { trade: activeProfile.trade } : {};
      const jobsRes = await getJobs(tradeParam).catch(err => {
        console.error('Failed to load recommended jobs', err);
        return { data: { success: true, data: { items: [] } } };
      });
      if (jobsRes.data?.success) {
        const items = jobsRes.data.data.items || [];
        setRecommendedJobs(items.slice(0, 2));
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

  const getRecommendations = () => {
    if (recommendedJobs.length > 0) return recommendedJobs;
    const tradeKey = profile?.trade || 'DEFAULT';
    return FALLBACK_RECOMMENDATIONS[tradeKey] || FALLBACK_RECOMMENDATIONS.DEFAULT;
  };

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
          Welcome back, here is your job search activity.
        </p>
      </div>

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-gutter mt-2">
        {/* Left Column (col-span-8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-lg">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
            <MetricCard
              label="Applications Sent"
              value={stats.applicationsSent}
              icon="send"
              iconColor="text-primary-container"
              iconBg="bg-tertiary-fixed"
              isLoading={loading}
            />
            <MetricCard
              label="Shortlisted"
              value={stats.shortlisted}
              icon="bookmark"
              iconColor="text-[#EA580C]"
              iconBg="bg-[#FFF7ED]"
              isLoading={loading}
            />
            <MetricCard
              label="Rejected"
              value={stats.rejected}
              icon="cancel"
              iconColor="text-error"
              iconBg="bg-error-container"
              isLoading={loading}
            />
            <MetricCard
              label="Active Opportunities"
              value={stats.activeJobs}
              icon="trending_up"
              iconColor="text-[#059669]"
              iconBg="bg-[#D1FAE5]"
              isLoading={loading}
            />
          </div>

          {/* Recent Applications Table */}
          <RecentApplicationsTable
            applications={recentApplications}
            isLoading={loading}
          />
        </div>

        {/* Right Column (col-span-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-lg">
          {/* Profile Completion Card */}
          {!loading && (
            <ProfileCompletionCard profile={profile} />
          )}

          {/* Recommended Jobs Card */}
          {!loading && (
            <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Recommended for You
                </h3>
                <span className="material-symbols-outlined text-on-surface-variant text-xl select-none">
                  auto_awesome
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {getRecommendations().map((job) => (
                  <Link
                    key={job.id}
                    to={job.id.startsWith('mock') ? '/worker/jobs' : `/worker/jobs/${job.id}`}
                    className="group border border-[#F1F5F9] p-3 rounded-lg hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),_0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:border-primary-container/20 transition-all cursor-pointer block"
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary-container transition-colors font-semibold truncate flex-1">
                        {job.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm whitespace-nowrap ${
                        job.type === 'GIG' || job.type === 'NEW' 
                          ? 'bg-[#EFF6FF] text-[#2563EB]' 
                          : 'bg-[#FFF7ED] text-[#EA580C]'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 truncate">
                      {job.employer?.fullName || 'Company'} • {job.city || 'Austin'}, {job.state || 'TX'}
                    </p>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] select-none">payments</span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        ₹ {job.payAmount.toLocaleString('en-IN')} / {job.payType === 'DAILY' ? 'day' : 'month'}
                      </span>
                    </div>
                  </Link>
                ))}
                
                <Link
                  to="/worker/jobs"
                  className="w-full text-center text-primary-container font-label-md text-label-md hover:underline py-2 transition-all mt-2 block"
                >
                  View All Recommendations
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;

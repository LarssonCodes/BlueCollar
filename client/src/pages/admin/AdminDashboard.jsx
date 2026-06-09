import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/admin.js';
import MetricCard from '../../components/MetricCard.jsx';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      await Promise.resolve();
      if (!active) return;

      setIsLoading(true);
      setError('');
      try {
        const res = await getAdminStats();
        if (!active) return;
        if (res.data && res.data.success) {
          setStats(res.data.data);
        } else {
          setError(res.data?.error || 'Failed to fetch platform statistics.');
        }
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(err.response?.data?.error || 'Failed to connect to the server.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Dashboard
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Platform overview
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Grid: 5 cards in a responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-stack-md">
        <MetricCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="group"
          iconColor="text-primary-container"
          iconBg="bg-tertiary-fixed"
          isLoading={isLoading}
        />
        <MetricCard
          label="Workers"
          value={stats?.totalWorkers ?? 0}
          icon="construction"
          iconColor="text-[#059669]"
          iconBg="bg-[#D1FAE5]"
          isLoading={isLoading}
        />
        <MetricCard
          label="Employers"
          value={stats?.totalEmployers ?? 0}
          icon="business"
          iconColor="text-[#EA580C]"
          iconBg="bg-[#FFF7ED]"
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Jobs"
          value={stats?.totalJobs ?? 0}
          icon="work"
          iconColor="text-on-surface-variant"
          iconBg="bg-surface-container"
          isLoading={isLoading}
        />
        <MetricCard
          label="Applications"
          value={stats?.totalApplications ?? 0}
          icon="assignment_turned_in"
          iconColor="text-primary-container"
          iconBg="bg-tertiary-fixed"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;

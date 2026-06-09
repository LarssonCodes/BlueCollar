import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkerApplications } from '../../api/applications';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Applied',
    bg: 'bg-surface-container-high',
    text: 'text-on-surface-variant',
    border: 'border-outline-variant',
    progressWidth: 'w-1/3',
    progressColor: 'bg-surface-variant',
    note: 'Application submitted',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#dbe1ff]',
    progressWidth: 'w-2/3',
    progressColor: 'bg-primary',
    note: 'Application under review',
  },
  REJECTED: {
    label: 'Not Selected',
    bg: 'bg-surface-dim',
    text: 'text-on-surface-variant',
    border: 'border-outline-variant',
    progressWidth: 'w-full',
    progressColor: 'bg-error/40',
    note: 'Application closed',
  },
};

const TRADE_ICON = {
  ELECTRICIAN: 'electric_bolt',
  PLUMBER: 'plumbing',
  DRIVER: 'local_shipping',
  WELDER: 'construction',
  MECHANIC: 'build',
  CONSTRUCTION: 'domain',
  OTHER: 'work',
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
}

function ApplicationCard({ app, onViewJob, onWithdraw }) {
  const status = app.status;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const isRejected = status === 'REJECTED';
  const isShortlisted = status === 'SHORTLISTED';
  const trade = app.job?.trade || 'OTHER';
  const icon = TRADE_ICON[trade] || 'work';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div
      className={`rounded-xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)] transition-shadow duration-300 overflow-hidden flex flex-col group
        ${isRejected ? 'bg-surface-container-low opacity-75 grayscale-[20%]' : 'bg-surface-container-lowest'}`}
    >
      <div className="p-6 flex-1 relative overflow-hidden">
        {/* Decorative accent for shortlisted */}
        {isShortlisted && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
        )}
        {/* Decorative accent for interviewing */}
        {status === 'INTERVIEWING' && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
        )}

        {/* Header row */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shrink-0">
              <span className="material-symbols-outlined text-outline">{icon}</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">
                {app.job?.title || 'Unknown Job'}
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                {app.job?.employer?.fullName || 'Employer'}
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
          <div>
            <p className="text-label-sm font-label-sm text-outline mb-1">Applied</p>
            <p className="text-body-sm font-body-sm text-on-surface">{formatDate(app.createdAt)}</p>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-outline mb-1">Location</p>
            <p className="text-body-sm font-body-sm text-on-surface">{app.job?.city || '—'}</p>
          </div>
        </div>

        {/* Progress bar */}
        {!isRejected && (
          <div className="relative z-10">
            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${cfg.progressWidth} ${cfg.progressColor}`} />
            </div>
            <p className="text-label-sm font-label-sm text-outline mt-2 text-right">{cfg.note}</p>
          </div>
        )}

        {/* Cover note snippet */}
        {app.coverNote && (
          <div className="relative z-10 mt-4 bg-surface rounded-lg p-3 border border-outline-variant/30">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Your cover note:</p>
            <p className="text-body-sm font-body-sm text-on-surface line-clamp-2">{app.coverNote}</p>
          </div>
        )}
      </div>

      {/* Card footer actions */}
      <div className={`border-t border-outline-variant p-4 flex justify-end gap-3 ${isRejected ? 'bg-surface' : 'bg-surface-bright'}`}>
        {isRejected ? (
          <button
            onClick={() => onWithdraw && onWithdraw(app)}
            className="px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors"
          >
            Archive
          </button>
        ) : (
          <>
            <button
              onClick={() => onWithdraw && onWithdraw(app)}
              className="px-4 py-2 text-on-surface border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors"
            >
              Withdraw
            </button>
            <button
              onClick={() => onViewJob(app.jobId)}
              className={`px-4 py-2 rounded-lg text-label-md font-label-md shadow-sm transition-colors
                ${isShortlisted
                  ? 'bg-primary text-on-primary hover:bg-surface-tint'
                  : 'bg-surface text-primary border border-primary-fixed hover:bg-surface-container-low'}`}
            >
              View Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-on-background' }) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] min-w-[100px]">
      <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">{label}</p>
      <p className={`text-headline-md font-headline-md ${color}`}>{value}</p>
    </div>
  );
}

const FILTER_OPTIONS = ['All Statuses', 'Applied', 'Shortlisted', 'Not Selected'];
const STATUS_MAP = {
  'All Statuses': null,
  'Applied': 'PENDING',
  'Shortlisted': 'SHORTLISTED',
  'Not Selected': 'REJECTED',
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Statuses');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getWorkerApplications();
        if (response.data?.success) {
          setApplications(response.data.data);
        } else {
          throw new Error(response.data?.error || 'Failed to load applications');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong while loading applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Stats
  const stats = useMemo(() => ({
    active: applications.filter(a => a.status === 'PENDING').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
  }), [applications]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = applications;
    const statusFilter = STATUS_MAP[activeFilter];
    if (statusFilter) list = list.filter(a => a.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.job?.title?.toLowerCase().includes(q) ||
        a.job?.employer?.fullName?.toLowerCase().includes(q) ||
        a.job?.city?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, activeFilter, searchQuery]);

  const handleViewJob = (jobId) => navigate(`/worker/jobs/${jobId}`);

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
        <header className="mb-stack-lg">
          <div className="h-9 bg-surface-container animate-pulse rounded w-48 mb-2" />
          <div className="h-5 bg-surface-container animate-pulse rounded w-72" />
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 h-52 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 gap-4 px-margin-mobile">
        <span className="material-symbols-outlined text-error text-5xl select-none">error</span>
        <p className="font-body-md text-body-md text-error">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="border border-outline-variant text-on-surface rounded-lg px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-background mb-stack-sm">
            My Applications
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Track the status of your recent job applications.
          </p>
        </div>

        {/* Quick Stats */}
        {applications.length > 0 && (
          <div className="flex gap-4">
            <StatCard label="Active" value={stats.active} color="text-primary" />
            <StatCard label="Shortlisted" value={stats.shortlisted} color="text-secondary-container" />
          </div>
        )}
      </header>

      {applications.length === 0 ? (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-6xl select-none">
            assignment_turned_in
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">No applications yet</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            Start browsing and applying for gigs today.
          </p>
          <button
            onClick={() => navigate('/worker/jobs')}
            className="bg-primary-container text-on-primary rounded-lg mt-4 px-6 py-2.5 font-label-md text-label-md hover:bg-surface-tint transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          {/* Filters & Search Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.05)] mb-stack-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md placeholder:text-outline"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-label-sm font-label-sm whitespace-nowrap transition-colors
                    ${activeFilter === f
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {filtered.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl select-none">search_off</span>
              <p className="font-body-md text-body-md text-on-surface-variant">No applications match your filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All Statuses'); }}
                className="text-primary font-label-md text-label-md hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
              {filtered.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onViewJob={handleViewJob}
                  onWithdraw={() => {/* future: implement withdraw */}}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { getEmployerJobs, deleteJob } from '../../api/jobs.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await getEmployerJobs();
      if (res.data && res.data.success) {
        setJobs(res.data.data || []);
      }
    } catch (err) {
      setError('Failed to fetch job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteJob(confirmDeleteId);
      if (res.data && res.data.success) {
        // Remove from local state
        setJobs(jobs.filter((j) => j.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 w-full mx-auto px-margin-mobile">
        <div className="flex justify-between items-center">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            My Jobs
          </h1>
          <div className="h-10 w-28 bg-surface-container animate-pulse rounded-saas"></div>
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container animate-pulse rounded-xl h-36 border border-[#E2E8F0]"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 w-full mx-auto px-margin-mobile">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            My Jobs
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manage your job postings, view applications, and track worker recruitment.
          </p>
        </div>
        <Link
          to="/employer/jobs/new"
          className="bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md shadow-level-1 hover:shadow-level-2 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Post a Job
        </Link>
      </div>

      {error && (
        <div className="bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest rounded-xl border border-[#E2E8F0] shadow-level-1 p-stack-md">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl">work_off</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mt-4 font-semibold">
            No jobs posted yet
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-sm">
            Post your first gig or contract to find skilled blue-collar workers in your area.
          </p>
          <Link
            to="/employer/jobs/new"
            className="mt-6 bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md shadow-level-1 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Post a Job Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md flex flex-col gap-4"
            >
              {/* Row 1: Title & Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {job.title}
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm font-semibold bg-surface-container text-on-surface-variant">
                  {job.trade.charAt(0) + job.trade.slice(1).toLowerCase()}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm font-semibold bg-surface-container text-on-surface-variant">
                  {job.type === 'GIG' ? 'Gig' : 'Contract'}
                </span>
                <StatusBadge status={job.status} />
              </div>

              {/* Row 2: Location, Pay, Dates */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span>{job.city}, {job.state}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-lg">payments</span>
                  <span>₹{job.payAmount} / {job.payType === 'DAILY' ? 'day' : 'month'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <span>Starts {formatDate(job.startDate)}</span>
                </div>
              </div>

              {/* Row 3: Meta & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-outline-variant/20 gap-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Posted on {formatDate(job.createdAt)}
                </span>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <Link
                    to={`/employer/jobs/${job.id}`}
                    className="border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-saas px-4 py-2 font-label-md text-label-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-lg">groups</span>
                    View Applicants
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(job.id)}
                    type="button"
                    className="text-error border border-error rounded-saas px-4 py-2 hover:bg-error-container hover:text-error transition-all font-label-md text-label-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Job Posting?"
          message="Are you sure you want to delete this job posting? This action is permanent and all candidate applications for this job will be lost."
          confirmLabel="Delete"
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default MyJobsPage;

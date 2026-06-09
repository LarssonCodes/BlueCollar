import { useState, useEffect } from 'react';
import { getAdminJobs, deleteAdminJob } from '../../api/admin.js';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Pagination from '../../components/Pagination.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchJobs = async () => {
      // Delay state updates to avoid synchronous setState inside useEffect
      await Promise.resolve();
      if (!active) return;

      setIsLoading(true);
      setError('');
      try {
        const res = await getAdminJobs({ page, limit: 20 });
        if (!active) return;
        if (res.data && res.data.success) {
          setJobs(res.data.data.jobs || []);
          setTotalPages(res.data.data.totalPages || 1);
        } else {
          setError(res.data?.error || 'Failed to fetch jobs list.');
        }
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(err.response?.data?.error || 'Failed to fetch jobs. Please try again.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchJobs();

    return () => {
      active = false;
    };
  }, [page]);

  const handleDeleteClick = (job) => {
    setDeleteTarget(job);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminJob(deleteTarget.id);
      if (res.data && res.data.success) {
        setJobs(jobs.filter((j) => j.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTrade = (tradeString) => {
    if (!tradeString) return '';
    return tradeString.charAt(0) + tradeString.slice(1).toLowerCase();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Job Management
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
        <div className="w-full overflow-x-auto -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-[#F1F5F9]">
              <tr>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Title</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Employer</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Trade</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Status</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">City</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Posted Date</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-[#F1F5F9] animate-pulse">
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-36"></div></td>
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-20"></div></td>
                    <td className="p-4"><div className="h-6 bg-surface-container rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-24"></div></td>
                    <td className="p-4"><div className="h-8 bg-surface-container rounded w-16"></div></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant text-5xl select-none">
                        work
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        No jobs found
                      </h3>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors">
                    <td className="p-4 font-medium">{job.title}</td>
                    <td className="p-4">{job.employer?.fullName || 'N/A'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm font-semibold bg-surface-container text-on-surface-variant">
                        {formatTrade(job.trade)}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="p-4">{job.city}</td>
                    <td className="p-4">{formatDate(job.createdAt)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteClick(job)}
                        className="text-error hover:bg-error-container hover:text-error rounded px-3 py-1 font-label-md text-label-md transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title={`Delete job?`}
          message="This will permanently delete the job and all associated applications. This action cannot be undone."
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default AdminJobs;

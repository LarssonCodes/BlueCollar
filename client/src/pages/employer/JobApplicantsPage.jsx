import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, fillJob } from '../../api/jobs';
import { getJobApplications, shortlistApplication, rejectApplication } from '../../api/applications';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';

/* ---- Contact Reveal Modal ---- */
function ContactModal({ applicant, onClose }) {
  if (!applicant) return null;
  const { fullName, phone, email } = applicant;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)] w-[90%] max-w-md p-6 animate-fade-in-up">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-headline-sm font-headline-sm text-on-background">{fullName}</h3>
            <p className="text-label-md font-label-md text-primary mt-1">Shortlisted Candidate</p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {phone && (
            <div className="flex items-center gap-4 p-4 bg-surface-bright rounded-xl border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Phone Number</p>
                <p className="text-body-lg font-body-lg font-medium text-on-background">+91 {phone}</p>
              </div>
            </div>
          )}
          {!phone && (
            <div className="flex items-center gap-4 p-4 bg-surface-bright rounded-xl border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-outline/10 flex items-center justify-center text-outline shrink-0">
                <span className="material-symbols-outlined">phone_disabled</span>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Phone Number</p>
                <p className="text-body-md font-body-md text-on-surface-variant italic">Not provided</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {phone && (
            <a
              href={`tel:+91${phone}`}
              className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-tint transition-colors text-center"
            >
              Call Now
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-outline-variant text-on-background py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Applicant Table Row ---- */
function ApplicantRow({ application, onShortlist, onReject, onViewContact, shortlistLoading, rejectLoading }) {
  const { worker, status, coverNote, createdAt } = application;
  const isPending = status === 'PENDING';
  const isShortlisted = status === 'SHORTLISTED';
  const isRejected = status === 'REJECTED';

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  const formatTrade = (t) => t ? t.charAt(0) + t.slice(1).toLowerCase() : '';
  const initials = worker?.fullName
    ? worker.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <tr
      className={`group transition-colors border-b border-outline-variant/30 last:border-0
        ${isShortlisted ? 'bg-primary-fixed/20 border-l-4 border-l-primary' : 'hover:bg-surface-bright'}
        ${isRejected ? 'opacity-60' : ''}`}
    >
      {/* Applicant */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-headline-sm shrink-0 select-none">
            {initials}
          </div>
          <div>
            <div className="text-body-md font-body-md font-medium text-on-background">{worker?.fullName || 'Worker'}</div>
            <div className="text-label-sm font-label-sm text-on-surface-variant">Applied {formatRelativeDate(createdAt)}</div>
          </div>
        </div>
      </td>

      {/* Trade */}
      <td className="p-4">
        <div className="text-body-md font-body-md text-on-background">{formatTrade(worker?.trade)}</div>
        <div className="text-label-sm font-label-sm text-on-surface-variant">{worker?.city || '—'}</div>
      </td>

      {/* Experience */}
      <td className="p-4 text-body-sm font-body-sm text-on-surface-variant whitespace-nowrap">
        {worker?.experience ?? '—'} {worker?.experience === 1 ? 'Year' : 'Years'}
      </td>

      {/* Cover Note */}
      <td className="p-4 max-w-xs">
        {coverNote ? (
          <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">{coverNote}</p>
        ) : (
          <span className="text-body-sm font-body-sm text-outline italic">No cover note</span>
        )}
      </td>

      {/* Status */}
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-label-sm font-label-sm
          ${isShortlisted ? 'bg-[#EFF6FF] text-[#2563EB]' : isRejected ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
          {isShortlisted ? 'Shortlisted' : isRejected ? 'Rejected' : 'Pending'}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 text-right">
        {isShortlisted ? (
          <button
            onClick={() => onViewContact(application)}
            className="text-label-md font-label-md text-primary hover:underline transition-colors"
          >
            View Contact
          </button>
        ) : isPending ? (
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onShortlist(application.id)}
              disabled={shortlistLoading === application.id}
              title="Shortlist"
              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
            <button
              onClick={() => onReject(application.id)}
              disabled={rejectLoading === application.id}
              title="Reject"
              className="p-1.5 text-error hover:bg-error-container rounded transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </button>
          </div>
        ) : (
          <span className="text-label-sm font-label-sm text-on-surface-variant italic">—</span>
        )}
      </td>
    </tr>
  );
}

/* ---- Main Page ---- */
export default function JobApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFillModal, setShowFillModal] = useState(false);
  const [filling, setFilling] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobRes, appsRes] = await Promise.all([getJobById(id), getJobApplications(id)]);
        if (jobRes.data?.success) setJob(jobRes.data.data);
        else throw new Error(jobRes.data?.error || 'Failed to fetch job details');
        if (appsRes.data?.success) setApplicants(appsRes.data.data);
        else throw new Error(appsRes.data?.error || 'Failed to fetch applicants');
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) setError('You are not authorized to view this page.');
        else if (err.response?.status === 404) setError('Job not found.');
        else setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplicants();
  }, [id]);

  const handleShortlist = async (appId) => {
    setShortlistLoading(appId);
    try {
      const response = await shortlistApplication(appId);
      if (response.data?.success) {
        const updated = response.data.data;
        setApplicants(prev => prev.map(app => app.id === appId ? { ...app, ...updated } : app));
        // Immediately show contact card
        if (updated.worker) setContactModal(updated.worker);
      } else throw new Error(response.data?.error || 'Failed to shortlist candidate.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Error shortlisting candidate.');
    } finally {
      setShortlistLoading(null);
    }
  };

  const handleReject = async (appId) => {
    setRejectLoading(appId);
    try {
      const response = await rejectApplication(appId);
      if (response.data?.success) {
        setApplicants(prev => prev.map(app => app.id === appId ? { ...app, ...response.data.data } : app));
      } else throw new Error(response.data?.error || 'Failed to reject candidate.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Error rejecting candidate.');
    } finally {
      setRejectLoading(null);
    }
  };

  const handleMarkFilled = async () => {
    setFilling(true);
    try {
      const response = await fillJob(id);
      if (response.data?.success) {
        setJob(prev => ({ ...prev, status: 'FILLED' }));
        setShowFillModal(false);
      } else throw new Error(response.data?.error || 'Failed to update job status.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Failed to update job status.');
    } finally {
      setFilling(false);
    }
  };

  const handleViewContact = (application) => {
    setContactModal(application.worker);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dateStr; }
  };

  // Stats
  const stats = useMemo(() => ({
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'PENDING').length,
    shortlisted: applicants.filter(a => a.status === 'SHORTLISTED').length,
    rejected: applicants.filter(a => a.status === 'REJECTED').length,
  }), [applicants]);

  const hasShortlistedCandidate = applicants.some(a => a.status === 'SHORTLISTED');
  const showFillBtn = job?.status === 'OPEN' && hasShortlistedCandidate;

  const filteredApplicants = useMemo(() => {
    if (!searchQuery.trim()) return applicants;
    const q = searchQuery.toLowerCase();
    return applicants.filter(a =>
      a.worker?.fullName?.toLowerCase().includes(q) ||
      a.worker?.city?.toLowerCase().includes(q) ||
      a.worker?.trade?.toLowerCase().includes(q) ||
      a.coverNote?.toLowerCase().includes(q)
    );
  }, [applicants, searchQuery]);

  // Loading
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin select-none">progress_activity</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !job) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-12 text-center gap-4 px-margin-mobile">
        <span className="material-symbols-outlined text-error text-6xl select-none">error</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Error occurred</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">{error}</p>
        <button
          onClick={() => navigate('/employer/jobs')}
          className="border border-outline-variant text-on-surface rounded-lg px-5 py-2.5 hover:bg-surface-container-low font-label-md text-label-md transition-colors"
        >
          ← Back to My Jobs
        </button>
      </div>
    );
  }

  const payPeriod = job.payType === 'DAILY' ? 'day' : 'month';

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
      {/* Back nav */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back to My Jobs</span>
        </button>
      </div>

      {/* Page Header */}
      <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
            Applicant Pipeline
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {job.title} · {job.city} · Starts {formatDate(job.startDate)}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusBadge status={job.trade} />
            <StatusBadge status={job.type} />
            <StatusBadge status={job.status} />
            <span className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-base">payments</span>
              ₹ {job.payAmount.toLocaleString('en-IN')} / {payPeriod}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search applicants..."
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-sm font-body-sm w-full md:w-64 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface-container-lowest"
            />
          </div>
          {/* Mark Filled */}
          {showFillBtn && (
            <button
              onClick={() => setShowFillModal(true)}
              className="bg-primary-container text-on-primary rounded-lg px-5 py-2.5 hover:bg-surface-tint font-label-md text-label-md transition-colors shadow-sm whitespace-nowrap"
            >
              Mark as Filled
            </button>
          )}
        </div>
      </header>

      {/* Stats Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total</span>
            <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
          </div>
          <div className="text-headline-md font-headline-md text-on-background">{stats.total}</div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending</span>
            <span className="material-symbols-outlined text-outline text-[20px]">schedule</span>
          </div>
          <div className="text-headline-md font-headline-md text-on-background">{stats.pending}</div>
        </div>
        <div className="bg-[#EFF6FF] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider">Shortlisted</span>
            <span className="material-symbols-outlined text-primary text-[20px]">star</span>
          </div>
          <div className="text-headline-md font-headline-md text-primary">{stats.shortlisted}</div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Rejected</span>
            <span className="material-symbols-outlined text-error text-[20px]">close</span>
          </div>
          <div className="text-headline-md font-headline-md text-on-background">{stats.rejected}</div>
        </div>
      </div>

      {/* Applicants Table */}
      {applicants.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-6xl select-none">group</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">No applications received yet</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Workers will appear here once they apply.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50">
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold">Applicant</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold">Trade / Location</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold">Experience</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold w-1/3">Cover Note</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredApplicants.map(app => (
                  <ApplicantRow
                    key={app.id}
                    application={app}
                    onShortlist={handleShortlist}
                    onReject={handleReject}
                    onViewContact={handleViewContact}
                    shortlistLoading={shortlistLoading}
                    rejectLoading={rejectLoading}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {filteredApplicants.length > 0 && (
            <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between text-body-sm text-on-surface-variant">
              <span>Showing {filteredApplicants.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Contact Modal */}
      {contactModal && (
        <ContactModal
          applicant={contactModal}
          onClose={() => setContactModal(null)}
        />
      )}

      {/* Fill Job Modal */}
      {showFillModal && (
        <ConfirmModal
          title="Mark Job as Filled"
          message="Are you sure you want to mark this job as filled? This will close the job and stop new applications."
          onConfirm={handleMarkFilled}
          onCancel={() => setShowFillModal(false)}
        />
      )}
    </div>
  );
}

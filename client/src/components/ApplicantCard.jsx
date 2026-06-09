import StatusBadge from './StatusBadge';

function ApplicantCard({ application, onShortlist, onReject }) {
  if (!application) return null;
  const { worker, status, coverNote } = application;

  const formatTrade = (t) => {
    if (!t) return '';
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  };

  const isPending = status === 'PENDING';
  const isShortlisted = status === 'SHORTLISTED';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-[#E2E8F0] shadow-level-1 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      {/* Left Side: Worker Info */}
      <div className="flex flex-col gap-2 flex-grow">
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface">
            {worker?.fullName || 'Worker'}
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {formatTrade(worker?.trade)} &bull; {worker?.experience || 0} years experience
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            City: {worker?.city || 'Unknown'}{worker?.pincode ? ` (${worker.pincode})` : ''}
          </p>
        </div>

        {/* Cover Note */}
        {coverNote && (
          <div className="mt-2 p-3 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/10">
            <span className="font-semibold text-on-surface-variant block mb-1 select-none">Cover Note:</span>
            <p className="whitespace-pre-wrap leading-relaxed">{coverNote}</p>
          </div>
        )}

        {/* Contact Reveal */}
        {isShortlisted && worker?.phone && (
          <div className="font-label-md text-label-md text-primary font-bold mt-2 flex items-center gap-1.5 select-all">
            <span className="material-symbols-outlined text-lg select-none">phone</span>
            <span>+91 {worker.phone}</span>
          </div>
        )}
      </div>

      {/* Right Side: Badges & Actions */}
      <div className="flex flex-col items-start md:items-end gap-3 min-w-[150px]">
        <StatusBadge status={status} />

        {isPending && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onReject(application.id)}
              className="border border-error text-error hover:bg-error-container/20 rounded-saas px-4 py-2 font-label-md text-label-md transition-colors cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={() => onShortlist(application.id)}
              className="border border-primary text-primary hover:bg-primary-container/10 rounded-saas px-4 py-2 font-label-md text-label-md transition-colors cursor-pointer"
            >
              Shortlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantCard;

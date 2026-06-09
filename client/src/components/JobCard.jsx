import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function JobCard({ job }) {
  if (!job) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const payPeriod = job.payType === 'DAILY' ? 'day' : 'month';

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md flex flex-col gap-stack-sm hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),_0_4px_6px_-2px_rgba(0,0,0,0.03)] transition-shadow">
      <div className="flex flex-col gap-1">
        <h3 className="font-label-md text-label-md text-on-surface font-bold">
          {job.title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          by {job.employer?.fullName || 'Employer'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={job.trade} />
        <StatusBadge status={job.type} />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
          <span className="material-symbols-outlined text-primary-container text-lg select-none">payments</span>
          <span>₹ {job.payAmount.toLocaleString('en-IN')} / {payPeriod}</span>
        </div>

        <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-lg select-none">location_on</span>
          <span>{job.city}{job.pincode ? `, ${job.pincode}` : ''}</span>
        </div>

        <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-lg select-none">event</span>
          <span>Starts {formatDate(job.startDate)}</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-[#F1F5F9] flex justify-between items-center">
        <Link
          to={`/worker/jobs/${job.id}`}
          className="bg-primary-container text-on-primary rounded-saas px-4 py-2 font-label-md text-label-md hover:bg-surface-tint transition-colors self-start"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;

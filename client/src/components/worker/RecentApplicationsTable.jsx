import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../StatusBadge';

function RecentApplicationsTable({ applications, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
        <div className="p-stack-md border-b border-[#F1F5F9]">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Recent Applications
          </h3>
        </div>
        <div className="p-stack-md flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-10 bg-surface-container animate-pulse rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
      <div className="p-stack-md border-b border-[#F1F5F9]">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Recent Applications
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-[#F1F5F9] select-none">
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Job Title</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Location</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Status</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-5xl select-none">
                      search_off
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mt-4">
                      No recent applications
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-xs">
                      Start browsing jobs to apply!
                    </p>
                    <Link
                      to="/worker/jobs"
                      className="mt-4 bg-primary-container text-on-primary rounded-saas px-6 py-2.5 font-label-md text-label-md hover:bg-surface-tint transition-colors inline-block"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const jobId = app.job?.id || app.jobId;
                return (
                  <tr
                    key={app.id}
                    className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/worker/jobs/${jobId}`}
                          className="text-primary hover:underline font-semibold font-body-md text-body-md"
                        >
                          {app.job?.title || 'Unknown Job'}
                        </Link>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {app.job?.employer?.fullName || 'Employer'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {app.job?.city || 'Unknown'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.status === 'PENDING' ? 'APPLIED' : app.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/worker/jobs/${jobId}`)}
                        className="text-on-surface-variant hover:text-primary-container p-1 rounded hover:bg-surface-container-high transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-lg select-none">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentApplicationsTable;

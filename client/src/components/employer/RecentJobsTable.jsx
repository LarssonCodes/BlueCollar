import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge';

function RecentJobsTable({ jobs, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
        <div className="p-stack-md border-b border-[#F1F5F9]">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Recent Jobs
          </h3>
        </div>
        <div className="p-stack-md flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 bg-surface-container animate-pulse rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
      <div className="p-stack-md border-b border-[#F1F5F9]">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          Recent Jobs
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-[#F1F5F9] select-none">
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Title</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Trade</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Type</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Status</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Posted Date</th>
              <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-5xl select-none">
                      work_off
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mt-4">
                      No jobs posted yet
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                      Post your first job to start hiring.
                    </p>
                    <Link
                      to="/employer/jobs/new"
                      className="mt-4 bg-primary-container text-on-primary rounded-saas px-6 py-2.5 font-label-md text-label-md hover:bg-surface-tint transition-colors inline-block font-semibold"
                    >
                      Post a Job
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const formattedDate = new Date(job.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
                return (
                  <tr
                    key={job.id}
                    className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        to={`/employer/jobs/${job.id}`}
                        className="text-primary hover:underline font-semibold font-body-md text-body-md"
                      >
                        {job.title}
                      </Link>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {job.city}
                      </div>
                    </td>
                    <td className="p-4 font-body-sm text-body-sm text-on-surface-variant capitalize">
                      {job.trade.toLowerCase()}
                    </td>
                    <td className="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {job.type}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {formattedDate}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/employer/jobs/${job.id}`}
                        className="font-label-md text-label-md text-primary-container hover:underline font-semibold"
                      >
                        View
                      </Link>
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

export default RecentJobsTable;

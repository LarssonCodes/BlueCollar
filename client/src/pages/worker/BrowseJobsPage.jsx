import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';

const TRADE_OPTIONS = [
  { value: 'ELECTRICIAN', label: 'Electrician', icon: 'electric_bolt' },
  { value: 'PLUMBER', label: 'Plumber', icon: 'plumbing' },
  { value: 'DRIVER', label: 'Driver', icon: 'local_shipping' },
  { value: 'WELDER', label: 'Welder', icon: 'construction' },
  { value: 'MECHANIC', label: 'Mechanic', icon: 'build' },
  { value: 'CONSTRUCTION', label: 'Construction', icon: 'domain' },
  { value: 'OTHER', label: 'Other', icon: 'work' }
];

function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local inputs synced with searchParams on change / load
  const [tradeInput, setTradeInput] = useState(searchParams.get('trade') || '');
  const [pincodeInput, setPincodeInput] = useState(searchParams.get('pincode') || '');
  const [typeInput, setTypeInput] = useState(searchParams.get('type') || '');
  const [sortInput, setSortInput] = useState('newest');

  // API State
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync inputs with URL params
  useEffect(() => {
    setTradeInput(searchParams.get('trade') || '');
    setPincodeInput(searchParams.get('pincode') || '');
    setTypeInput(searchParams.get('type') || '');
  }, [searchParams]);

  // Fetch jobs whenever URL search params change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const trade = searchParams.get('trade') || undefined;
        const pincode = searchParams.get('pincode') || undefined;
        const type = searchParams.get('type') || undefined;
        const page = parseInt(searchParams.get('page'), 10) || 1;

        const response = await getJobs({ trade, pincode, type, page });
        if (response.data?.success) {
          setJobs(response.data.data.items);
          setTotal(response.data.data.total);
          setTotalPages(response.data.data.totalPages);
        } else {
          throw new Error(response.data?.error || 'Failed to fetch jobs');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong while loading jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (tradeInput) newParams.set('trade', tradeInput);
    if (pincodeInput.trim()) newParams.set('pincode', pincodeInput.trim());
    if (typeInput) newParams.set('type', typeInput);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setTradeInput('');
    setPincodeInput('');
    setTypeInput('');
    setSearchParams({});
  };

  // Sort logic (local simulation)
  const sortedJobs = useMemo(() => {
    let list = [...jobs];
    if (sortInput === 'pay') {
      list.sort((a, b) => b.payAmount - a.payAmount);
    } else {
      // Default newest
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [jobs, sortInput]);

  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch { return dateStr; }
  };

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
      {/* 12-Column Grid Split (3 Sidebar / 9 Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-4 flex-grow">
        
        {/* Left Column: Sticky Sidebar Filters */}
        <aside className="lg:col-span-3 flex-shrink-0 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 h-fit sticky top-20 shadow-level-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Filters</h2>
            <button
              onClick={handleClearFilters}
              className="text-label-sm font-label-sm text-primary hover:underline"
            >
              Clear All
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trade Category */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">
                Trade Category
              </label>
              <select
                value={tradeInput}
                onChange={e => setTradeInput(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Trades</option>
                {TRADE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-t border-outline-variant/30" />

            {/* Pincode Location */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">
                Location (Pincode)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">location_on</span>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincodeInput}
                  onChange={e => setPincodeInput(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg pl-9 pr-3 py-2 bg-surface text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                />
              </div>
            </div>

            <hr className="border-t border-outline-variant/30" />

            {/* Job Type selection */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">
                Job Type
              </label>
              <div className="flex flex-col gap-2">
                {['', 'GIG', 'CONTRACT'].map(type => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="jobType"
                      checked={typeInput === type}
                      onChange={() => setTypeInput(type)}
                      className="rounded-full border-outline-variant text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-body-sm font-body-sm text-on-surface">
                      {type === '' ? 'All Types' : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-tint transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              <span>Apply Filters</span>
            </button>
          </form>
        </aside>

        {/* Right Column: Search Results */}
        <section className="lg:col-span-9 flex flex-col">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-headline-lg font-headline-lg text-on-background">
              {loading ? (
                'Searching...'
              ) : (
                <>Found <span className="text-primary">{total}</span> Jobs</>
              )}
            </h1>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-body-sm font-body-sm text-on-surface-variant">Sort by:</span>
              <select
                value={sortInput}
                onChange={e => setSortInput(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="pay">Highest Pay</option>
              </select>
            </div>
          </div>

          {/* Jobs Listing */}
          {loading ? (
            /* Loading Skeleton */
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 h-48 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : error ? (
            /* Error Display */
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-level-1">
              <span className="material-symbols-outlined text-error text-5xl select-none">error</span>
              <p className="font-body-md text-body-md text-error">{error}</p>
              <button
                onClick={handleSearch}
                className="border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors"
              >
                Retry
              </button>
            </div>
          ) : sortedJobs.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-level-1">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-6xl select-none">search_off</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">No jobs matched</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Try widening your pincode search or selecting a different trade category.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-primary-container text-on-primary rounded-saas px-5 py-2.5 hover:bg-surface-tint font-label-md text-label-md transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Results Vertical Flow - matching Stitch find_jobs list */
            <div className="flex-grow flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                {sortedJobs.map((job) => {
                  const payPeriod = job.payType === 'DAILY' ? 'day' : 'month';
                  return (
                    <article
                      key={job.id}
                      className="bg-surface-container-lowest shadow-level-1 rounded-xl p-6 border border-outline-variant/30 transition-all duration-300 hover:shadow-level-2 hover:-translate-y-0.5 flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <StatusBadge status={job.trade} />
                          {job.payAmount >= 800 && (
                            <span className="bg-[#FFF7ED] text-[#EA580C] px-2 py-0.5 rounded font-label-sm text-label-sm flex items-center gap-1 select-none font-semibold">
                              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                              Urgent
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-headline-sm font-headline-sm text-on-surface mb-1 font-bold group-hover:text-primary transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-body-md font-body-md text-on-surface-variant mb-4">
                          {job.employer?.fullName || 'Employer'}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-on-surface-variant font-body-sm text-body-sm">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {job.city}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-on-surface">
                            <span className="material-symbols-outlined text-base font-normal text-on-surface-variant">payments</span>
                            ₹ {job.payAmount.toLocaleString('en-IN')} / {payPeriod}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">work</span>
                            {job.type}
                          </span>
                        </div>
                        
                        <p className="text-body-sm font-body-sm text-on-surface-variant mt-4 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 mt-4 md:mt-0">
                        <span className="text-label-sm font-label-sm text-outline">
                          Starts {formatDate(job.startDate)}
                        </span>
                        <Link
                          to={`/worker/jobs/${job.id}`}
                          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-tint transition-all shadow-sm w-full md:w-auto text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default BrowseJobsPage;

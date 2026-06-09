import { useState, useEffect  } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';

const TRADE_OPTIONS = [
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'MECHANIC', label: 'Mechanic' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'OTHER', label: 'Other' }
];

function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local inputs synced with searchParams on change / load
  const [tradeInput, setTradeInput] = useState(searchParams.get('trade') || '');
  const [pincodeInput, setPincodeInput] = useState(searchParams.get('pincode') || '');
  const [typeInput, setTypeInput] = useState(searchParams.get('type') || '');

  // API State
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync inputs with URL params (e.g. if URL is updated externally, page is reloaded, or filters cleared)
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    newParams.set('page', '1'); // always reset to page 1 on new search
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
      {/* Title */}
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
        {!loading && jobs.length > 0 ? (
          <>Found <span className="text-primary">{total}</span> Jobs</>
        ) : (
          'Browse Jobs'
        )}
      </h1>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row md:items-center gap-4 mt-stack-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30"
      >
        {/* Trade Select */}
        <div className="flex-grow md:max-w-xs">
          <select
            value={tradeInput}
            onChange={(e) => setTradeInput(e.target.value)}
            className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest text-on-surface"
          >
            <option value="">All Trades</option>
            {TRADE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode Input */}
        <div className="relative flex-grow md:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant select-none">
            search
          </span>
          <input
            type="text"
            placeholder="Pincode"
            value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value)}
            className="border border-outline-variant rounded-lg pl-10 pr-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest text-on-surface"
          />
        </div>

        {/* Job Type Toggle */}
        <div className="flex rounded-saas overflow-hidden border border-outline-variant bg-surface-container-lowest self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTypeInput('')}
            className={`px-4 py-3 font-label-md text-label-md transition-colors ${
              typeInput === ''
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTypeInput('GIG')}
            className={`px-4 py-3 border-l border-outline-variant font-label-md text-label-md transition-colors ${
              typeInput === 'GIG'
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            GIG
          </button>
          <button
            type="button"
            onClick={() => setTypeInput('CONTRACT')}
            className={`px-4 py-3 border-l border-outline-variant font-label-md text-label-md transition-colors ${
              typeInput === 'CONTRACT'
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            CONTRACT
          </button>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md transition-colors text-center md:ml-auto"
        >
          Search
        </button>
      </form>

      {/* Main Content Area */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-stack-lg">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-surface-container animate-pulse rounded-xl h-48 border border-[#E2E8F0]"
            />
          ))}
        </div>
      ) : error ? (
        /* Error Display */
        <div className="flex flex-col items-center justify-center py-12 text-center gap-2 mt-stack-lg">
          <span className="material-symbols-outlined text-error text-5xl select-none">
            error
          </span>
          <p className="font-body-md text-body-md text-error">
            {error}
          </p>
          <button
            onClick={() => setSearchParams(searchParams)} // Retry
            className="border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors mt-2"
          >
            Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4 mt-stack-lg">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl select-none">
            search_off
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            No jobs match your filters
          </p>
          <button
            onClick={handleClearFilters}
            className="border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Results Grid */
        <div className="flex-grow flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-stack-lg">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default BrowseJobsPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById } from '../../api/jobs';
import { getWorkerApplications } from '../../api/applications';
import StatusBadge from '../../components/StatusBadge';
import ApplyModal from '../../components/ApplyModal';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const TRADE_REQUIREMENTS = {
  ELECTRICIAN: [
    'Valid Electrician License or Wireman Permit.',
    'Minimum of 2+ years of experience in residential or commercial wiring.',
    'Proficiency in reading blueprints and circuit schematics.',
    'Must possess own comprehensive set of professional-grade hand tools.',
    'Strong adherence to safety protocols and local electricity codes.'
  ],
  PLUMBER: [
    'Valid Plumber License or training certificate.',
    'Minimum of 2+ years of plumbing installation and repair experience.',
    'Expertise in pipe layouts, copper soldering, and drainage fittings.',
    'Must have own basic plumbing tools and safety gear.',
    'Ability to interpret drainage and layout schematics.'
  ],
  DRIVER: [
    'Valid commercial driving license (LMV/HMV) with clean driving record.',
    'Experience driving commercial delivery trucks or passenger cars.',
    'Familiarity with local city routes and logistics mapping.',
    'Basic knowledge of vehicle maintenance and safety checks.',
    'Good communication and time-management skills.'
  ],
  WELDER: [
    'Certified Welder (AWS or equivalent certification preferred).',
    'Experience in TIG/MIG welding structural steel or ironworks.',
    'Must be comfortable working with high-temperature tools and metals.',
    'Possess own welding helmet and standard safety equipment.',
    'Ability to interpret technical drawing layouts.'
  ],
  MECHANIC: [
    'IT/Diploma in Motor Vehicle Mechanics or ASE certification.',
    'Experience diagnosing and repairing engines, brakes, or transmissions.',
    'Proficiency in using mechanical hand tools and electronic scanning kits.',
    'Familiarity with workshop safety guidelines.',
    'Ability to perform routine troubleshooting.'
  ],
  CONSTRUCTION: [
    'Prior experience working on active construction or masonry sites.',
    'Familiarity with framing, concrete mixing, and material staging.',
    'Must be physically fit and comfortable working with scaffolding.',
    'Adherence to standard site safety guidelines (OSHA/NSC).',
    'Ability to coordinate with masonry and carpentry teams.'
  ],
  OTHER: [
    'Prior experience in the specified trade area.',
    'Ability to work independently with minimal supervision.',
    'Strong reliability, punctuality, and work ethic.',
    'Familiarity with standard tools required for the job.',
    'Strict adherence to client safety and code guidelines.'
  ]
};

const TRADE_BENEFITS = {
  ELECTRICIAN: ['Tool allowance support provided', 'Safety kit and gloves provided', 'Travel allowance for out-station gigs'],
  PLUMBER: ['Materials sourced by contractor', 'Uniform and safety gear provided', 'Performance bonus on early completion'],
  DRIVER: ['Fuel expenses covered', 'Health insurance coverage included', 'Daily food allowance during transit'],
  WELDER: ['Premium safety gear provided', 'Overtime pay rates active', 'Structured workshop safety training'],
  MECHANIC: ['Access to advanced workshop machinery', 'Skills enhancement certifications', 'Annual health check-up coverage'],
  CONSTRUCTION: ['Daily lunch and beverages on-site', 'Accident insurance coverage', 'Tool allowance program'],
  OTHER: ['Accident insurance cover', 'Travel allowance for long distances', 'On-site training support']
};

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleApplyClick = () => {
    if (user && !user.hasProfile) {
      setShowIncompleteProfileModal(true);
    } else {
      setShowApplyModal(true);
    }
  };

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobRes, appsRes] = await Promise.all([
          getJobById(id),
          getWorkerApplications().catch(err => {
            console.error('Failed to load worker applications', err);
            return { data: { success: true, data: [] } };
          })
        ]);

        if (jobRes.data?.success) {
          setJob(jobRes.data.data);
        } else {
          throw new Error(jobRes.data?.error || 'Failed to load job details');
        }

        if (appsRes.data?.success) {
          const applied = appsRes.data.data.some(app => app.jobId === id);
          setHasApplied(applied);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError('Job not found');
        } else {
          setError(err.message || 'Something went wrong while fetching job detail.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/worker/jobs');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin select-none">
            progress_activity
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-12 text-center gap-4 px-margin-mobile">
        <span className="material-symbols-outlined text-error text-6xl select-none">
          error
        </span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {error === 'Job not found' ? 'Job not found' : 'Failed to load job'}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          {error === 'Job not found'
            ? 'The job post you are looking for may have been filled, closed, or deleted.'
            : error}
        </p>
        <button
          onClick={() => navigate('/worker/jobs')}
          className="border border-outline-variant text-on-surface rounded-saas px-5 py-2.5 hover:bg-surface-container-low font-label-md text-label-md transition-colors"
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  const payPeriod = job.payType === 'DAILY' ? 'day' : 'month';
  const requirementsList = TRADE_REQUIREMENTS[job.trade] || TRADE_REQUIREMENTS.OTHER;
  const benefitsList = TRADE_BENEFITS[job.trade] || TRADE_BENEFITS.OTHER;

  return (
    <div className="flex-grow flex flex-col px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto w-full">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-body-sm text-body-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Search Results</span>
        </button>
      </div>

      {/* Two Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-stack-lg">
          {/* Card 1: Job Header Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 border border-outline-variant/30 flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={job.trade} />
                  {job.payAmount >= 800 && (
                    <span className="bg-[#FFF7ED] text-[#EA580C] px-2 py-1 rounded font-label-sm text-label-sm whitespace-nowrap flex items-center gap-1 font-semibold select-none">
                      <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                      Urgent
                    </span>
                  )}
                </div>
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                  {job.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-4 text-on-surface-variant">
                  {/* Employer Logo */}
                  <div className="w-12 h-12 bg-surface-container-low rounded border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
                    <span className="material-symbols-outlined text-3xl text-primary select-none">storefront</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {job.employer?.fullName || 'Apex Construction'}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 font-body-sm text-body-sm">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> {job.city}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">payments</span> ₹ {job.payAmount.toLocaleString('en-IN')} / {payPeriod}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">work</span> {job.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only Apply Action Button inside Header Card */}
            <div className="md:hidden border-t border-outline-variant/30 pt-4 flex gap-3">
              {hasApplied ? (
                <button
                  disabled
                  className="w-full bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-saas px-6 py-3 font-label-md text-label-md cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg select-none">check_circle</span>
                  <span>Applied</span>
                </button>
              ) : job.status !== 'OPEN' ? (
                <button
                  disabled
                  className="w-full bg-surface-container text-on-surface-variant rounded-saas px-6 py-3 font-label-md text-label-md cursor-not-allowed text-center"
                >
                  {job.status === 'FILLED' ? 'Filled' : 'Closed'}
                </button>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-[#EA580C] text-white rounded-saas px-6 py-3 font-label-md text-label-md hover:bg-opacity-90 text-center transition-all cursor-pointer shadow-level-1"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Details Description, Requirements, and Benefits */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 border border-outline-variant/30 flex flex-col gap-6">
            {/* Job Description */}
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface border-b border-surface-container pb-2 mb-4 font-semibold">
                Job Description
              </h2>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            {/* Requirements */}
            <section className="mt-4">
              <h2 className="font-headline-md text-headline-md text-on-surface border-b border-surface-container pb-2 mb-4 font-semibold">
                Requirements
              </h2>
              <ul className="font-body-md text-body-md text-on-surface-variant space-y-3">
                {requirementsList.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary mt-0.5 text-[20px] select-none">check_circle</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="mt-4">
              <h2 className="font-headline-md text-headline-md text-on-surface border-b border-surface-container pb-2 mb-4 font-semibold">
                Benefits
              </h2>
              <ul className="font-body-md text-body-md text-on-surface-variant space-y-3">
                {benefitsList.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary mt-0.5 text-[20px] select-none">health_and_safety</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Right Column (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-stack-lg">
          {/* Action Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 border border-outline-variant/30 hidden md:block">
            <div className="flex flex-col gap-3 mb-4">
              {hasApplied ? (
                <button
                  disabled
                  className="w-full bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-saas px-6 py-3 font-label-md text-label-md cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg select-none">check_circle</span>
                  <span>Applied</span>
                </button>
              ) : job.status !== 'OPEN' ? (
                <button
                  disabled
                  className="w-full bg-surface-container text-on-surface-variant rounded-saas px-6 py-3 font-label-md text-label-md cursor-not-allowed text-center"
                >
                  {job.status === 'FILLED' ? 'Filled' : 'Closed'}
                </button>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-[#EA580C] text-white rounded-saas px-6 py-3 font-label-md text-label-md hover:bg-opacity-90 text-center transition-all cursor-pointer shadow-level-1"
                >
                  Apply Now
                </button>
              )}

              <button className="w-full px-6 py-3 bg-transparent border border-outline-variant text-on-surface rounded-saas font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                Save Job
              </button>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[20px] text-tertiary select-none">schedule</span>
                <span>Posted recently</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[20px] text-tertiary select-none">group</span>
                <span>Direct application active</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[20px] text-tertiary select-none">event_busy</span>
                <span>Starts {formatDate(job.startDate)}</span>
              </div>
            </div>
          </div>

          {/* About the Employer Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-6 border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/20 pb-2 mb-4 font-semibold">
              About the Employer
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-surface-container-low rounded border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
                <span className="material-symbols-outlined text-4xl text-primary select-none font-medium">storefront</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {job.employer?.fullName || 'Employer'}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {job.employer?.companyName || 'General Contractor'}
                </p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-3">
              Contact verification is completed. Location coordinates are matched under local transport hubs for quick commute and gig execution.
            </p>
            <Link
              to="/worker/jobs"
              className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline transition-colors"
            >
              View Company Profile
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          onSuccess={() => {
            setHasApplied(true);
            setShowApplyModal(false);
          }}
          onClose={() => setShowApplyModal(false)}
        />
      )}

      {showIncompleteProfileModal && (
        <ConfirmModal
          isOpen={showIncompleteProfileModal}
          title="Profile Incomplete"
          message="Please complete your profile details first before applying for any jobs."
          confirmLabel="Complete Profile"
          confirmVariant="primary"
          onConfirm={() => navigate('/worker/profile')}
          onCancel={() => setShowIncompleteProfileModal(false)}
        />
      )}
    </div>
  );
}

export default JobDetailPage;

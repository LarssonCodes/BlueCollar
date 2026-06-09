import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/jobs.js';
import FormPageLayout from '../../components/layouts/FormPageLayout.jsx';

const TRADE_CATEGORIES = [
  { value: '', label: 'Select a trade...' },
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'MECHANIC', label: 'Mechanic' },
  { value: 'CONSTRUCTION', label: 'Construction Worker' },
  { value: 'OTHER', label: 'Other' }
];

const STEPS = [
  { number: 1, label: 'Job Details' },
  { number: 2, label: 'Requirements' },
  { number: 3, label: 'Budget & Schedule' }
];

const TIPS = {
  1: [
    { title: 'Be Specific:', text: 'Clear job titles attract more qualified candidates than vague ones.' },
    { title: 'Highlight Location:', text: 'Mention if the job is on-site at a specific facility or involves travel across sites.' },
    { title: 'Keep it Brief:', text: 'The short description should hook the worker; save deep details for the requirements step.' }
  ],
  2: [
    { title: 'List Must-Haves:', text: 'Separate essential skills from nice-to-haves so candidates self-filter accurately.' },
    { title: 'Be Realistic:', text: 'Requiring 10+ years for an entry-level gig will scare away good candidates.' },
    { title: 'Mention Certifications:', text: 'If the job needs specific licenses or safety certs, state them upfront.' }
  ],
  3: [
    { title: 'Market Rate:', text: 'Research local pay rates for the trade to stay competitive and attract quality workers.' },
    { title: 'Clear Timeline:', text: 'Specifying start and end dates helps workers plan and commit with confidence.' },
    { title: 'Daily vs Monthly:', text: 'Gig workers often prefer daily pay; contract roles suit monthly compensation.' }
  ]
};

function PostJobPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Step 1: Job Details ──
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('CONTRACT');
  const [description, setDescription] = useState('');

  // ── Step 2: Requirements ──
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [experience, setExperience] = useState('');
  const [requirements, setRequirements] = useState('');

  // ── Step 3: Budget & Schedule ──
  const [payAmount, setPayAmount] = useState('');
  const [payType, setPayType] = useState('DAILY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ── Validation per step ──
  const validateStep = (step) => {
    setError('');
    if (step === 1) {
      if (!title.trim()) { setError('Job title is required.'); return false; }
      if (!trade) { setError('Please select a trade category.'); return false; }
      if (!location.trim()) { setError('Job location is required.'); return false; }
      if (description.length > 500) { setError('Description must be under 500 characters.'); return false; }
    }
    if (step === 2) {
      if (!pincode.trim() || !/^\d{6}$/.test(pincode)) { setError('Pincode must be exactly 6 digits.'); return false; }
      if (!city.trim()) { setError('City is required.'); return false; }
      if (!state.trim()) { setError('State is required.'); return false; }
    }
    if (step === 3) {
      const pay = parseInt(payAmount, 10);
      if (isNaN(pay) || pay <= 0) { setError('Pay amount must be a positive number.'); return false; }
      if (!startDate) { setError('Start date is required.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleCancel = () => {
    navigate('/employer/jobs');
  };

  // ── Submit on final step ──
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    // Build full description combining short description + requirements
    const fullDescription = [
      description.trim(),
      requirements.trim() ? `\n\nRequirements:\n${requirements.trim()}` : '',
      experience ? `\nExperience needed: ${experience} years` : ''
    ].join('');

    const payload = {
      title: title.trim(),
      description: fullDescription || description.trim() || title.trim(),
      trade,
      type: type === 'FULL_TIME' ? 'CONTRACT' : type,
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      payAmount: parseInt(payAmount, 10),
      payType,
      startDate,
      endDate: endDate || null
    };

    setLoading(true);
    setError('');
    try {
      const res = await createJob(payload);
      if (res.data?.success) {
        navigate('/employer/jobs');
      } else {
        setError(res.data?.error || 'Failed to post job. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step label helpers ──
  const getStepButtonLabel = () => {
    if (currentStep === 1) return 'Next: Requirements';
    if (currentStep === 2) return 'Next: Budget & Schedule';
    return null; // Step 3 has its own submit button
  };

  const inputClass = 'border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50';
  const labelClass = 'font-label-md text-label-md text-on-surface mb-2 block font-semibold';

  return (
    <FormPageLayout
      title="Post a New Job"
      subtitle="Provide details, requirements, and budget details to find skilled workers."
      sidebar={
        <div className="flex flex-col gap-6">
          {/* Live Job Card Preview */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-primary-container/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none">
              Live Preview
            </div>
            <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 font-bold uppercase tracking-wider">
              Job Card Preview
            </h4>
            
            <div className="bg-surface-container-low/35 border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary-fixed px-2.5 py-0.5 rounded-full select-none">
                  {TRADE_CATEGORIES.find((t) => t.value === trade)?.label || 'Selected Trade'}
                </span>
                <span className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                  {type === 'GIG' ? 'Gig' : 'Contract'}
                </span>
              </div>
              
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate max-w-full">
                {title || 'Job Title'}
              </h3>
              
              <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">payments</span>
                  <span className="font-semibold text-on-surface">
                    {payAmount ? `₹${parseInt(payAmount).toLocaleString('en-IN')}` : '₹ Amount'} / {payType === 'DAILY' ? 'day' : 'month'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span>{city || 'City'}{state ? `, ${state}` : ''}{pincode ? ` (${pincode})` : ''}</span>
                </div>
                {startDate && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Starts: {startDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Stepper Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-level-1">
            <h4 className="font-label-md text-label-md text-on-surface font-bold mb-4 uppercase tracking-wider">
              Posting Progress
            </h4>
            
            <div className="flex flex-col gap-5 relative pl-4 border-l border-outline-variant/40 ml-2">
              {STEPS.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                return (
                  <div key={step.number} className="relative flex items-center gap-3">
                    {/* Circle Indicator on the left line */}
                    <div
                      className={`absolute -left-[27px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold select-none ${
                        isActive
                          ? 'border-secondary-container bg-secondary-container text-on-secondary'
                          : isCompleted
                          ? 'border-[#059669] bg-[#059669] text-white'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                      ) : (
                        step.number
                      )}
                    </div>
                    
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-primary font-bold' : isCompleted ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Tips Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-level-1">
            <h3 className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-lg">tips_and_updates</span>
              Step Tips
            </h3>
            <div className="flex flex-col gap-4">
              {TIPS[currentStep].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#059669] text-base shrink-0 mt-0.5">check_circle</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-semibold text-on-surface">{tip.title}</span>{' '}
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 shadow-level-1 flex flex-col gap-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-error-container text-error border border-error/20 rounded-lg p-3.5 font-body-sm text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* ═══════════ STEP 1: Job Details ═══════════ */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className={labelClass}>Job Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Electrician for Commercial Build"
                className={inputClass}
              />
            </div>

            {/* Trade + Location row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="trade" className={labelClass}>Trade Category</label>
                <select
                  id="trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23737686' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  {TRADE_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>Job Location Description</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 text-xl select-none">location_on</span>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State (e.g. Mumbai, Maharashtra)"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div>
              <span className={labelClass}>Job Type</span>
              <div className="flex gap-6 mt-1.5">
                {[
                  { value: 'CONTRACT', label: 'Contract' },
                  { value: 'GIG', label: 'Gig / One-off' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="jobType"
                      value={option.value}
                      checked={type === option.value}
                      onChange={() => setType(option.value)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="font-body-md text-body-md text-on-surface font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="description" className="font-label-md text-label-md text-on-surface font-semibold">Short Description</label>
                <span className={`font-label-sm text-label-sm ${description.length > 500 ? 'text-error' : 'text-on-surface-variant/60'}`}>
                  {description.length}/500
                </span>
              </div>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                placeholder="Briefly describe the scope of work, immediate needs, and overall project context..."
                className={`${inputClass} resize-y h-28`}
              />
            </div>
          </div>
        )}

        {/* ═══════════ STEP 2: Requirements ═══════════ */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            {/* Location breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pincode" className={labelClass}>Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit pincode"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>State</label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Auto-fill hint */}
            {location && !city && !state && (
              <button
                type="button"
                onClick={() => {
                  const parts = location.split(',').map(s => s.trim());
                  if (parts.length >= 2) { setCity(parts[0]); setState(parts[1]); }
                  else { setCity(parts[0]); }
                }}
                className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer self-start flex items-center gap-1 bg-primary-fixed/20 px-3 py-1.5 rounded-lg border border-primary/20 transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-sm leading-none">auto_fix_high</span>
                Auto-fill from "{location}"
              </button>
            )}

            {/* Experience */}
            <div>
              <label htmlFor="experience" className={labelClass}>
                Minimum Experience <span className="text-on-surface-variant/50 font-normal">(years, optional)</span>
              </label>
              <input
                id="experience"
                type="number"
                min={0}
                max={50}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 3"
                className={`${inputClass} max-w-[200px]`}
              />
            </div>

            {/* Detailed Requirements */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="requirements" className="font-label-md text-label-md text-on-surface font-semibold">
                  Detailed Requirements
                </label>
                <span className="font-label-sm text-label-sm text-on-surface-variant/60">
                  {requirements.length}/2000
                </span>
              </div>
              <textarea
                id="requirements"
                rows={6}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                maxLength={2000}
                placeholder="List required skills, certifications, tools to bring, physical requirements, safety training, etc..."
                className={`${inputClass} resize-y h-36`}
              />
            </div>
          </div>
        )}

        {/* ═══════════ STEP 3: Budget & Schedule ═══════════ */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            {/* Pay Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="payAmount" className={labelClass}>Pay Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-label-md text-label-md text-on-surface-variant/50 select-none">₹</span>
                  <input
                    id="payAmount"
                    type="number"
                    min={1}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="e.g. 800"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <span className={labelClass}>Pay Rate</span>
                <div className="flex gap-6 mt-1.5 py-1.5">
                  {[
                    { value: 'DAILY', label: 'Daily (Per Day)' },
                    { value: 'MONTHLY', label: 'Monthly' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="payType"
                        value={option.value}
                        checked={payType === option.value}
                        onChange={() => setPayType(option.value)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="font-body-md text-body-md text-on-surface font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className={labelClass}>Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="endDate" className={labelClass}>
                  End Date <span className="text-on-surface-variant/50 font-normal">(Optional)</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/20 mt-2">
              <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">preview</span>
                Job Posting Summary Confirmation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 font-body-sm text-body-sm">
                <div>
                  <span className="text-on-surface-variant">Title:</span>{' '}
                  <span className="text-on-surface font-semibold">{title || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Trade:</span>{' '}
                  <span className="text-on-surface font-semibold">{TRADE_CATEGORIES.find(t => t.value === trade)?.label || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Location:</span>{' '}
                  <span className="text-on-surface font-semibold">{city && state ? `${city}, ${state}` : location || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Type:</span>{' '}
                  <span className="text-on-surface font-semibold">{type === 'GIG' ? 'Gig / One-off' : type === 'CONTRACT' ? 'Contract' : 'Full-time'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Pay:</span>{' '}
                  <span className="text-on-surface font-semibold">{payAmount ? `₹${parseInt(payAmount).toLocaleString('en-IN')} / ${payType === 'DAILY' ? 'day' : 'month'}` : '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Start:</span>{' '}
                  <span className="text-on-surface font-semibold">{startDate || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Actions ── */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={currentStep === 1 ? handleCancel : handleBack}
          className="border border-outline-variant text-on-surface rounded-saas px-5 py-2.5 hover:bg-surface-container-low font-label-md text-label-md transition-colors cursor-pointer"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-secondary-container text-on-secondary rounded-saas px-6 py-2.5 hover:bg-secondary-container/90 font-label-md text-label-md transition-colors cursor-pointer flex items-center gap-2 shadow-level-1 hover:shadow-level-2"
          >
            {getStepButtonLabel()}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-secondary-container text-on-secondary rounded-saas px-6 py-2.5 hover:bg-secondary-container/90 font-label-md text-label-md transition-all cursor-pointer flex items-center gap-2 shadow-level-1 hover:shadow-level-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin material-symbols-outlined text-base select-none">sync</span>
                Posting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">check</span>
                Post Job
              </>
            )}
          </button>
        )}
      </div>
    </FormPageLayout>
  );
}

export default PostJobPage;

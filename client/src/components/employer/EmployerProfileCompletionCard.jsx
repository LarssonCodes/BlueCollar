import { Link } from 'react-router-dom';

function EmployerProfileCompletionCard({ profile }) {
  const checkFilled = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (typeof val === 'number') return val >= 0;
    return !!val;
  };

  let filledCount = 0;
  if (profile) {
    if (checkFilled(profile.fullName)) filledCount++;
    if (checkFilled(profile.companyName)) filledCount++;
    if (checkFilled(profile.phone)) filledCount++;
    if (checkFilled(profile.city)) filledCount++;
    if (checkFilled(profile.pincode)) filledCount++;
  }

  const completionPercent = Math.round((filledCount / 5) * 100);

  return (
    <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-4">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">
        Profile Completion
      </h3>

      <div className="flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-container h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        
        {/* Percentage Label */}
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 select-none">
          {completionPercent}% Completed
        </span>
      </div>

      {completionPercent < 100 && (
        <Link
          to="/employer/profile"
          className="bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md transition-colors text-center inline-block w-full"
        >
          Complete Profile
        </Link>
      )}
    </div>
  );
}

export default EmployerProfileCompletionCard;

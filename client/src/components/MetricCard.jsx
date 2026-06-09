
function MetricCard({ label, value, icon, iconColor, iconBg, isLoading }) {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-surface-container rounded-xl h-24 border border-[#E2E8F0]" />
    );
  }

  return (
    <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-2 select-none">
      <div className="flex justify-between items-start">
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
        <span className={`material-symbols-outlined text-xl p-1 rounded-md ${iconColor} ${iconBg}`}>
          {icon}
        </span>
      </div>
      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
        {value}
      </span>
    </div>
  );
}

export default MetricCard;

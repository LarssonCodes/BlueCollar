
function StatusBadge({ status }) {
  if (!status) return null;

  const getBadgeClasses = (s) => {
    const upper = s.toUpperCase();
    switch (upper) {
      case 'OPEN':
      case 'PENDING':
      case 'APPLIED':
      case 'NEW':
        return 'bg-[#EFF6FF] text-[#2563EB]';
      case 'SHORTLISTED':
      case 'INTERVIEWING':
      case 'URGENT':
        return 'bg-[#FFF7ED] text-[#EA580C]';
      case 'REJECTED':
        return 'bg-error-container text-error';
      case 'FILLED':
      case 'CLOSED':
        return 'bg-surface-container-high text-on-surface-variant';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  const formatStatus = (s) => {
    // Convert to Title Case, e.g., "SHORTLISTED" -> "Shortlisted"
    const lower = s.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm font-semibold ${getBadgeClasses(status)}`}>
      {formatStatus(status)}
    </span>
  );
}

export default StatusBadge;

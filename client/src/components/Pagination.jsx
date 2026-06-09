
function Pagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;

  const btnClass = "border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md transition-colors";
  const disabledBtnClass = `${btnClass} opacity-50 cursor-not-allowed hover:bg-transparent`;

  const handlePrev = () => {
    if (isFirstPage) return;
    if (onPrev) {
      onPrev();
    } else if (onPageChange) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (isLastPage) return;
    if (onNext) {
      onNext();
    } else if (onPageChange) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-stack-md mt-stack-lg">
      <button
        onClick={handlePrev}
        disabled={isFirstPage}
        className={isFirstPage ? disabledBtnClass : btnClass}
      >
        Previous
      </button>

      <span className="font-body-sm text-body-sm text-on-surface-variant select-none">
        Page {page} of {totalPages || 1}
      </span>

      <button
        onClick={handleNext}
        disabled={isLastPage}
        className={isLastPage ? disabledBtnClass : btnClass}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;



function ApiErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30 max-w-md mx-auto my-8 animate-in fade-in duration-200">
      <span className="material-symbols-outlined text-error text-3xl select-none">
        error_outline
      </span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-2 font-semibold">
        Something went wrong
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xs break-words">
        {message || 'An unexpected API error occurred.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 mt-4 font-label-md text-label-md transition-colors cursor-pointer min-h-[44px]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ApiErrorState;

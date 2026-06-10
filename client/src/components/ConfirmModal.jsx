import { useEffect  } from 'react';

function ConfirmModal({
  isOpen = true,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  loading = false,
  isLoading = false,
  confirmVariant = 'danger'
}) {
  const activeLoading = loading || isLoading;

  // Add ESC keydown listener and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg mx-4 border border-outline-variant/30 shadow-level-3 animate-in fade-in zoom-in-95 duration-150"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            type="button"
            className="border border-outline-variant text-on-surface rounded-saas px-6 py-2.5 hover:bg-surface-container-low font-label-md text-label-md cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={activeLoading}
            type="button"
            className={`${confirmVariant === 'primary' ? 'bg-primary text-on-primary hover:bg-surface-tint' : 'bg-error text-on-error hover:bg-opacity-90'} rounded-saas px-6 py-2.5 font-label-md text-label-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {activeLoading ? (
              <>
                <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                {confirmLabel === 'Delete' ? 'Deleting...' : 'Loading...'}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

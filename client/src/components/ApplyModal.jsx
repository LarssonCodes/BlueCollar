import { useState  } from 'react';
import { applyToJob } from '../api/applications';

function ApplyModal({ jobId, jobTitle, onSuccess, onClose }) {
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setCoverNote(text);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await applyToJob(jobId, { coverNote: coverNote.trim() || null });
      if (response.data?.success) {
        onSuccess(response.data.data);
      } else {
        throw new Error(response.data?.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Close on backdrop click (but not on modal card click)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg mx-4 shadow-level-2 border border-[#E2E8F0] flex flex-col gap-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
            Apply for {jobTitle}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Write a short note to the employer explaining your experience and why you are interested.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            value={coverNote}
            onChange={handleTextChange}
            placeholder="Introduce yourself and share details about your trade experience..."
            className="border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest text-on-surface resize-none"
            maxLength={500}
            disabled={submitting}
          />
          
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-right block select-none">
            {coverNote.length} / 500
          </span>

          {error && (
            <div className="mt-2 text-error font-body-sm text-body-sm text-left">
              {error}
            </div>
          )}

          <div className="flex justify-end items-center gap-3 mt-6 border-t border-[#F1F5F9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 font-label-md text-label-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-container text-on-primary rounded-saas hover:bg-surface-tint px-6 py-2 font-label-md text-label-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {submitting ? 'Applying...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;

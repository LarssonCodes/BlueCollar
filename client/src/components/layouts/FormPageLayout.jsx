import React from 'react';

function FormPageLayout({ title, subtitle, actions, sidebar, children, onBack }) {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 hover:bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-xl select-none leading-none">arrow_back</span>
            </button>
          )}
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (8 columns on large screens) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          {children}
        </div>

        {/* Right Column (4 columns on large screens) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 flex flex-col gap-6 w-full">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}

export default FormPageLayout;

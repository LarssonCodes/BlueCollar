import { useState, useEffect } from 'react';

function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="sticky top-0 z-50 bg-[#FFF7ED] text-[#EA580C] border-b border-[#EA580C] py-2 px-4 text-center font-label-md text-label-md flex items-center justify-center gap-2 select-none">
      <span className="material-symbols-outlined text-lg select-none">wifi_off</span>
      <span>You are offline. Please check your internet connection.</span>
    </div>
  );
}

export default OfflineBanner;

import { useEffect } from 'react';
import AppRoutes from './routes/index.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <OfflineBanner />
      <AppRoutes />
    </div>
  );
}

export default App;

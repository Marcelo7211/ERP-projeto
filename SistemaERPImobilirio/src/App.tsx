import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAppStore } from './store/useAppStore';
import './App.css';

// Lazy loading for code splitting
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const HomePage = lazy(() => import('./features/home/Home'));
const AboutPage = lazy(() => import('./features/about/About'));
const Properties = lazy(() => import('./features/properties/Properties'));
const Clientes = lazy(() => import('./features/clientes/Clientes'));
const Contratos = lazy(() => import('./features/contratos/Contratos'));
const Pipeline = lazy(() => import('./features/pipeline/Pipeline'));
const Settings = lazy(() => import('./features/settings/Settings'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--color-primary)]"></div>
  </div>
);

function App() {
  const { theme, config } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.setProperty('--color-primary', config.primaryColor);
  }, [theme, config]);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/imoveis" element={<Properties />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

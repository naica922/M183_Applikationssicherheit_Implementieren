import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TwoFactorPage from './pages/TwoFactorPage.jsx';
import Layout from './components/Layout.jsx';
import { useAuth } from './auth/AuthContext.jsx';

export default function App() {
  const { user, ready } = useAuth();

  // Wait for the silent refresh to settle so a reload does not flash the login
  // page for an already-authenticated user.
  if (!ready) {
    return <div className="loading">Loading…</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings/2fa" element={<TwoFactorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

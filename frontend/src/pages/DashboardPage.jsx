import { useAuth } from '../auth/AuthContext.jsx';

// Placeholder landing page after login. The vault overview is added in a later
// step; for now it confirms the authenticated session works.
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <h1>Welcome, {user.username}</h1>
      <p>Your vault will appear here.</p>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

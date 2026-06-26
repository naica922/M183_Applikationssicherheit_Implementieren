import { useAuth } from '../auth/AuthContext.jsx';

// Placeholder landing page after login. The vault overview is added in a later
// step; for now it confirms the authenticated session works.
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Welcome, {user.username}</h1>
      <p>Your vault will appear here.</p>
    </>
  );
}

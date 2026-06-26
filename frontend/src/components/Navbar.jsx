import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        SecurePass
      </Link>
      <div className="nav-links">
        <Link to="/">Vault</Link>
        <Link to="/settings/2fa">Two-Factor</Link>
        <span className="nav-user">{user.username}</span>
        <button type="button" className="link-button" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

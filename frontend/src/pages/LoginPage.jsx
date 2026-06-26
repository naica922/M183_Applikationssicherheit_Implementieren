import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpRequired, setTotpRequired] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password, totpRequired ? totpCode : undefined);
      navigate('/');
    } catch (err) {
      // The backend signals a missing/invalid second factor via the message.
      if (/totp/i.test(err.message)) {
        setTotpRequired(true);
        setError(totpRequired ? 'Invalid code. Please try again.' : '');
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-layout">
      <form className="card" onSubmit={onSubmit}>
        <h1>SecurePass</h1>
        <p className="subtitle">Log in to your vault</p>

        {error && <div className="alert">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Master password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {totpRequired && (
          <>
            <label htmlFor="totp">Authenticator code</label>
            <input
              id="totp"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              autoFocus
              required
            />
          </>
        )}

        <button type="submit" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>

        <p className="switch">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

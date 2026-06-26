import { useState } from 'react';
import * as api from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function TwoFactorPage() {
  const { user, setUser } = useAuth();
  const [setup, setSetup] = useState(null); // { otpauth, qrCode }
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(user.totpEnabled === true);
  const [busy, setBusy] = useState(false);

  async function startSetup() {
    setError('');
    setBusy(true);
    try {
      setSetup(await api.setupTwoFactor());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onEnable(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.enableTwoFactor(code);
      setSetup(null);
      setDone(true);
      setUser({ ...user, totpEnabled: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <>
        <h1>Two-Factor Authentication</h1>
        <p className="ok">2FA is enabled. You will be asked for a code at every login.</p>
      </>
    );
  }

  return (
    <>
      <h1>Two-Factor Authentication</h1>
      <p>Protect your vault with a time-based one-time code (TOTP).</p>

      {error && <div className="alert">{error}</div>}

      {!setup ? (
        <button type="button" onClick={startSetup} disabled={busy}>
          {busy ? 'Preparing…' : 'Set up 2FA'}
        </button>
      ) : (
        <form className="twofa" onSubmit={onEnable}>
          <p>1. Scan this QR code with your authenticator app:</p>
          <img className="qr" src={setup.qrCode} alt="2FA QR code" />
          <p>2. Enter the 6-digit code to confirm:</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            required
          />
          <button type="submit" disabled={busy}>
            {busy ? 'Verifying…' : 'Enable 2FA'}
          </button>
        </form>
      )}
    </>
  );
}

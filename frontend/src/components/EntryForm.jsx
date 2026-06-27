import { useState } from 'react';
import { generatePassword } from '../utils/passwordGenerator.js';

export default function EntryForm({ initial, onSave, onCancel }) {
  const isEdit = Boolean(initial?.id);
  const [website, setWebsite] = useState(initial?.website || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [password, setPassword] = useState(initial?.password || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSave({ website, username, password });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
        <h2>{isEdit ? 'Edit entry' : 'New entry'}</h2>

        {error && <div className="alert">{error}</div>}

        <label htmlFor="website">Website</label>
        <input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} required />

        <label htmlFor="entry-username">Username</label>
        <input
          id="entry-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="entry-password">Password</label>
        <input
          id="entry-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="link-button"
          onClick={() => setPassword(generatePassword())}
        >
          Generate strong password
        </button>

        <div className="modal-actions">
          <button type="button" className="link-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

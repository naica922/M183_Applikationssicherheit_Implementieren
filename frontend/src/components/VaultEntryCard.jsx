import { useState } from 'react';
import * as api from '../api/client.js';

export default function VaultEntryCard({ entry, onEdit, onDelete }) {
  const [password, setPassword] = useState(null);
  const [busy, setBusy] = useState(false);

  // The password is only fetched (and decrypted server-side) on demand, never
  // included in the list response.
  async function toggleReveal() {
    if (password) {
      setPassword(null);
      return;
    }
    setBusy(true);
    try {
      const data = await api.getVaultEntry(entry.id);
      setPassword(data.entry.password);
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    if (password) navigator.clipboard?.writeText(password);
  }

  return (
    <div className="entry-card">
      <div className="entry-main">
        <strong>{entry.website}</strong>
        <span className="muted">{entry.username}</span>
        {password && <code className="reveal">{password}</code>}
      </div>
      <div className="entry-actions">
        <button type="button" className="link-button" onClick={toggleReveal} disabled={busy}>
          {password ? 'Hide' : 'Show'}
        </button>
        {password && (
          <button type="button" className="link-button" onClick={copy}>
            Copy
          </button>
        )}
        <button type="button" className="link-button" onClick={() => onEdit(entry)}>
          Edit
        </button>
        <button type="button" className="link-button danger" onClick={() => onDelete(entry.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

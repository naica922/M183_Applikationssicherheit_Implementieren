import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client.js';
import VaultEntryCard from '../components/VaultEntryCard.jsx';

export default function VaultPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api.listVault();
      setEntries(data.entries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.deleteVaultEntry(id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="vault-header">
        <h1>Your vault</h1>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="muted">No entries yet.</p>
      ) : (
        <div className="entry-list">
          {entries.map((entry) => (
            <VaultEntryCard key={entry.id} entry={entry} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  );
}

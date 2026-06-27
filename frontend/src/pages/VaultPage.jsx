import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client.js';
import VaultEntryCard from '../components/VaultEntryCard.jsx';
import EntryForm from '../components/EntryForm.jsx';

export default function VaultPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (new) | entry (edit)

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

  async function onEdit(entry) {
    setError('');
    try {
      // Fetch the decrypted password so the form can be pre-filled.
      const data = await api.getVaultEntry(entry.id);
      setEditing(data.entry);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.deleteVaultEntry(id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function onSave(values) {
    if (editing?.id) {
      await api.updateVaultEntry(editing.id, values);
    } else {
      await api.createVaultEntry(values);
    }
    setEditing(null);
    await load();
  }

  return (
    <>
      <div className="vault-header">
        <h1>Your vault</h1>
        <button type="button" onClick={() => setEditing({})}>
          Add entry
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="muted">No entries yet. Add your first one.</p>
      ) : (
        <div className="entry-list">
          {entries.map((entry) => (
            <VaultEntryCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}

      {editing !== null && (
        <EntryForm initial={editing} onSave={onSave} onCancel={() => setEditing(null)} />
      )}
    </>
  );
}

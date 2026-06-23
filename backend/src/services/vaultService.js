import { encrypt } from './cryptoService.js';
import * as vaultRepo from '../repositories/vaultRepository.js';
import { logEvent } from '../repositories/auditRepository.js';
import { toPublicEntry, toEntryWithPassword } from '../models/vaultEntry.js';
import { httpError } from '../utils/httpError.js';

export async function listEntries(userId) {
  const rows = await vaultRepo.findByUser(userId);
  return rows.map(toPublicEntry);
}

export async function getEntry(userId, id) {
  const row = await vaultRepo.findByIdForUser(id, userId);
  if (!row) throw httpError(404, 'Entry not found.');
  return toEntryWithPassword(row);
}

export async function createEntry({ userId, website, username, password, ipAddress, userAgent }) {
  const row = await vaultRepo.createEntry({
    userId,
    website,
    username,
    password: encrypt(password),
  });
  await logEvent({
    userId,
    eventType: 'vault.entry_created',
    ipAddress,
    userAgent,
    metadata: { entryId: row.id },
  });
  return toPublicEntry(row);
}

export async function updateEntry({ userId, id, website, username, password, ipAddress, userAgent }) {
  const row = await vaultRepo.updateEntry({
    id,
    userId,
    website,
    username,
    password: encrypt(password),
  });
  if (!row) throw httpError(404, 'Entry not found.');
  await logEvent({
    userId,
    eventType: 'vault.entry_updated',
    ipAddress,
    userAgent,
    metadata: { entryId: id },
  });
  return toPublicEntry(row);
}

export async function deleteEntry({ userId, id, ipAddress, userAgent }) {
  const deleted = await vaultRepo.deleteEntry(id, userId);
  if (!deleted) throw httpError(404, 'Entry not found.');
  await logEvent({
    userId,
    eventType: 'vault.entry_deleted',
    ipAddress,
    userAgent,
    metadata: { entryId: id },
  });
}

import * as vaultService from '../services/vaultService.js';
import { validateVaultEntry, isUuid } from '../validators/vaultValidator.js';
import { httpError } from '../utils/httpError.js';

function ctx(req) {
  return { ipAddress: req.ip, userAgent: req.headers['user-agent'] || null };
}

// Rejects malformed ids early so they never reach the database layer.
function requireValidId(id) {
  if (!isUuid(id)) throw httpError(404, 'Entry not found.');
}

export async function list(req, res, next) {
  try {
    res.json({ entries: await vaultService.listEntries(req.user.id) });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    requireValidId(req.params.id);
    res.json({ entry: await vaultService.getEntry(req.user.id, req.params.id) });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { valid, errors, value } = validateVaultEntry(req.body);
    if (!valid) return res.status(400).json({ errors });

    const entry = await vaultService.createEntry({ userId: req.user.id, ...value, ...ctx(req) });
    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    requireValidId(req.params.id);
    const { valid, errors, value } = validateVaultEntry(req.body);
    if (!valid) return res.status(400).json({ errors });

    const entry = await vaultService.updateEntry({
      userId: req.user.id,
      id: req.params.id,
      ...value,
      ...ctx(req),
    });
    res.json({ entry });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    requireValidId(req.params.id);
    await vaultService.deleteEntry({ userId: req.user.id, id: req.params.id, ...ctx(req) });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

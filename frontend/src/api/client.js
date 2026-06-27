const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// The access token is kept in memory only (never localStorage) to limit the
// impact of XSS. It is restored on reload via the refresh-token cookie.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Reads the JS-readable CSRF cookie for the double-submit header required by
// the cookie-authenticated endpoints (refresh/logout).
function csrfHeader() {
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
  return match ? { 'X-CSRF-Token': decodeURIComponent(match[1]) } : {};
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false, csrf = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (csrf) Object.assign(headers, csrfHeader());

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || (data.errors && data.errors[0]) || 'Request failed.';
    throw new ApiError(message, res.status);
  }
  return data;
}

// Authenticated request that transparently refreshes the access token once on a
// 401 (e.g. after it expired) and then retries.
export async function authedRequest(path, opts = {}) {
  try {
    return await request(path, { ...opts, auth: true });
  } catch (err) {
    if (err.status === 401) {
      const data = await refresh();
      setAccessToken(data.accessToken);
      return request(path, { ...opts, auth: true });
    }
    throw err;
  }
}

export function register(username, password) {
  return request('/auth/register', { method: 'POST', body: { username, password } });
}

export function login(username, password, totpCode) {
  return request('/auth/login', { method: 'POST', body: { username, password, totpCode } });
}

export function setupTwoFactor() {
  return authedRequest('/auth/2fa/setup', { method: 'POST' });
}

export function enableTwoFactor(totpCode) {
  return authedRequest('/auth/2fa/enable', { method: 'POST', body: { totpCode } });
}

export function listVault() {
  return authedRequest('/vault');
}

export function getVaultEntry(id) {
  return authedRequest(`/vault/${id}`);
}

export function createVaultEntry(entry) {
  return authedRequest('/vault', { method: 'POST', body: entry });
}

export function updateVaultEntry(id, entry) {
  return authedRequest(`/vault/${id}`, { method: 'PUT', body: entry });
}

export function deleteVaultEntry(id) {
  return authedRequest(`/vault/${id}`, { method: 'DELETE' });
}

export function refresh() {
  return request('/auth/refresh', { method: 'POST', csrf: true });
}

export function logout() {
  return request('/auth/logout', { method: 'POST', csrf: true });
}

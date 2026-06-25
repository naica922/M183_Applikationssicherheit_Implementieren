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

export function register(username, password) {
  return request('/auth/register', { method: 'POST', body: { username, password } });
}

export function login(username, password, totpCode) {
  return request('/auth/login', { method: 'POST', body: { username, password, totpCode } });
}

export function refresh() {
  return request('/auth/refresh', { method: 'POST', csrf: true });
}

export function logout() {
  return request('/auth/logout', { method: 'POST', csrf: true });
}

import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/client.js';
import { decodeUserFromToken } from './jwt.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On load, try to restore the session from the refresh-token cookie so a page
  // reload does not log the user out.
  useEffect(() => {
    api
      .refresh()
      .then((data) => {
        api.setAccessToken(data.accessToken);
        setUser(decodeUserFromToken(data.accessToken));
      })
      .catch(() => {
        // No valid session – stay logged out.
      })
      .finally(() => setReady(true));
  }, []);

  async function register(username, password) {
    return api.register(username, password);
  }

  async function login(username, password, totpCode) {
    const data = await api.login(username, password, totpCode);
    api.setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }

  async function logout() {
    try {
      await api.logout();
    } catch {
      // Logout should always clear local state, even if the request fails.
    }
    api.setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, ready, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

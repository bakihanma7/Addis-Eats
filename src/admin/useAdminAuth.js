import { createContext, createElement, useContext, useMemo } from 'react';
import { createStore } from '../utils/createStore.js';

/**
 * Admin session (admin features 1 & 2) — context + sessionStorage, so
 * the admin stays logged in while the tab lives but the session ends
 * when the tab closes. Scope: only the /admin route group.
 */

const STORAGE_KEY = 'addis-eats-admin-session';

/** Demo credentials for the assignment build — shown on the login card. */
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'addis123',
};

const adminSessionStore = createStore({
  key: STORAGE_KEY,
  initial: null,
  persist: true,
  storage: globalThis.sessionStorage,
});

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const admin = adminSessionStore.useValue();

  const value = useMemo(
    () => ({
      admin,
      /** Returns true on success, false on wrong credentials. */
      login: (username, password) => {
        const isValid =
          username.trim().toLowerCase() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
        if (isValid) {
          adminSessionStore.set({ username: username.trim().toLowerCase(), loginAt: Date.now() });
        }
        return isValid;
      },
      logout: () => adminSessionStore.set(null),
    }),
    [admin]
  );

  // createElement (not JSX) because this module is plain .js —
  // the brief names it useAdminAuth.js.
  return createElement(AdminAuthContext.Provider, { value }, children);
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return context;
}

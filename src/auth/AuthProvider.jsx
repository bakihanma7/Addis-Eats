import { createContext, useContext, useMemo, useState } from 'react';
import { createStore } from '../utils/createStore.js';

const STORAGE_KEY = 'addis-eats-user';
const AuthContext = createContext(null);

const sessionStore = createStore({ key: STORAGE_KEY, initial: null, persist: true });

export function AuthProvider({ children }) {
  const user = sessionStore.useValue();

  const value = useMemo(
    () => ({
      user,
      signIn: (nextUser) => sessionStore.set(nextUser),
      signOut: () => sessionStore.set(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}

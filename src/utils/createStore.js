import { useSyncExternalStore } from 'react';

export function createStore({ key, initial, persist = false, storage = globalThis.localStorage }) {
  let state = initial;

  if (persist && storage) {
    try {
      const raw = storage.getItem(key);
      if (raw !== null) state = JSON.parse(raw);
    } catch {
      state = initial;
    }
  }

  const listeners = new Set();

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    return state;
  }

  function set(update) {
    const next = typeof update === 'function' ? update(state) : update;
    if (Object.is(next, state)) return;
    state = next;
    if (persist && storage) {
      try {
        storage.setItem(key, JSON.stringify(state));
      } catch {
        
      }
    }
    listeners.forEach((listener) => listener());
  }

  function reset() {
    if (persist && storage) {
      try {
        storage.removeItem(key);
      } catch {
        // ignore
      }
    }
    set(initial);
  }

  function useValue() {
    return useSyncExternalStore(subscribe, getSnapshot);
  }

  return { key, get: getSnapshot, set, reset, subscribe, getSnapshot, useValue };
}

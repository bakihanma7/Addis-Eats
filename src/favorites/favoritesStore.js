import { createStore } from '../utils/createStore.js';


const STORAGE_KEY = 'addis-eats-favorites';

export const favoritesStore = createStore({
  key: STORAGE_KEY,
  initial: [],
  persist: true,
});

export function isFavorite(dishId) {
  return favoritesStore.get().includes(dishId);
}

export function toggleFavorite(dishId) {
  favoritesStore.set((ids) =>
    ids.includes(dishId) ? ids.filter((id) => id !== dishId) : [...ids, dishId]
  );
}

export function useFavoriteIds() {
  return favoritesStore.useValue();
}

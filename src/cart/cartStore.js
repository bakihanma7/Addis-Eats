import { createStore } from '../utils/createStore.js';


const STORAGE_KEY = 'addis-eats-cart';

export const cartStore = createStore({
  key: STORAGE_KEY,
  initial: { lines: [] },
  persist: true,
});

export function addLine(dish, qty = 1) {
  cartStore.set((state) => {
    const existing = state.lines.find((line) => line.dishId === dish.id);
    if (existing) {
      return {
        lines: state.lines.map((line) =>
          line.dishId === dish.id ? { ...line, qty: Math.min(line.qty + qty, 99) } : line
        ),
      };
    }
    return {
      lines: [...state.lines, { dishId: dish.id, name: dish.name, price: dish.price, emoji: dish.emoji, qty }],
    };
  });
}

export function setQty(dishId, qty) {
  if (qty <= 0) return removeLine(dishId);
  cartStore.set((state) => ({
    lines: state.lines.map((line) => (line.dishId === dishId ? { ...line, qty: Math.min(qty, 99) } : line)),
  }));
}

export function increment(dishId) {
  cartStore.set((state) => ({
    lines: state.lines.map((line) => (line.dishId === dishId ? { ...line, qty: Math.min(line.qty + 1, 99) } : line)),
  }));
}

export function decrement(dishId) {
  cartStore.set((state) => {
    const line = state.lines.find((l) => l.dishId === dishId);
    if (!line) return state;
    if (line.qty <= 1) return { lines: state.lines.filter((l) => l.dishId !== dishId) };
    return { lines: state.lines.map((l) => (l.dishId === dishId ? { ...l, qty: l.qty - 1 } : l)) };
  });
}

export function removeLine(dishId) {
  cartStore.set((state) => ({ lines: state.lines.filter((line) => line.dishId !== dishId) }));
}

export function clearCart() {
  cartStore.set({ lines: [] });
}

export function reorderItems(items = []) {
  cartStore.set((state) => {
    let lines = [...state.lines];
    for (const item of items) {
      const existing = lines.find((line) => line.dishId === item.dishId);
      if (existing) {
        lines = lines.map((line) =>
          line.dishId === item.dishId ? { ...line, qty: Math.min(line.qty + item.qty, 99) } : line
        );
      } else {
        lines = [...lines, { ...item }];
      }
    }
    return { lines };
  });
}

export function countItems(lines = []) {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function subtotalOf(lines = []) {
  return lines.reduce((sum, line) => sum + line.qty * line.price, 0);
}

export function useCart() {
  return cartStore.useValue();
}

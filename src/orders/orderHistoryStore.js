import { createStore } from '../utils/createStore.js';


const STORAGE_KEY = 'addis-eats-orders';

export const ORDER_STATUSES = ['pending', 'preparing', 'delivering', 'delivered'];

export const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  delivering: 'On the way',
  delivered: 'Delivered',
};

export const orderHistoryStore = createStore({
  key: STORAGE_KEY,
  initial: [],
  persist: true,
});

export function addOrder(draft) {
  const createdAt = Date.now();
  let placed = null;

  orderHistoryStore.set((orders) => {
    const maxNumber = orders.reduce((max, order) => {
      const number = parseInt(String(order.id).replace(/\D/g, ''), 10);
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 1000);
    placed = { ...draft, id: `AE-${maxNumber + 1}`, status: 'pending', createdAt };
    return [placed, ...orders];
  });

  return placed;
}

export function updateOrderStatus(id, status) {
  orderHistoryStore.set((orders) => orders.map((order) => (order.id === id ? { ...order, status } : order)));
}

export function deleteOrder(id) {
  orderHistoryStore.set((orders) => orders.filter((order) => order.id !== id));
}

export function useOrders() {
  return orderHistoryStore.useValue();
}

export function totalRevenueOf(orders = []) {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export function itemCountOf(order) {
  return order.items.reduce((sum, item) => sum + item.qty, 0);
}

export function salesByDish(orders = []) {
  const sales = new Map();
  for (const order of orders) {
    for (const item of order.items) {
      const entry = sales.get(item.dishId) || { dishId: item.dishId, name: item.name, emoji: item.emoji, qty: 0, revenue: 0 };
      entry.qty += item.qty;
      entry.revenue += item.qty * item.price;
      sales.set(item.dishId, entry);
    }
  }
  return [...sales.values()].sort((a, b) => b.qty - a.qty);
}

export function statusCounts(orders = []) {
  const counts = { pending: 0, preparing: 0, delivering: 0, delivered: 0 };
  for (const order of orders) {
    if (order.status in counts) counts[order.status] += 1;
  }
  return counts;
}

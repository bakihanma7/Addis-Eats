const STORAGE_KEY = 'addis-eats-dishes';
const LATENCY_MS = 400;

function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDishes(dishes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  } catch {

  }
}

export async function fetchDishes() {
  await delay();
  const cached = readCache();
  if (cached) return cached;

  const res = await fetch('/menu-data.json');
  if (!res.ok) {
    throw new Error(`Could not load the menu (HTTP ${res.status}). Check your connection and try again.`);
  }
  const dishes = await res.json();
  saveDishes(dishes);
  return dishes;
}

export async function fetchDishById(id) {
  const dishes = await fetchDishes();
  return dishes.find((dish) => dish.id === id);
}

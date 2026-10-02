export const CATEGORIES = [
  { id: 'ethiopian', label: 'Ethiopian', emoji: '🍲', match: 'Ethiopian' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕', match: 'Pizza' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔', match: 'Burgers' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤', match: 'Drinks' },
];

export function categoryById(id) {
  return CATEGORIES.find((category) => category.id === id);
}

export default CATEGORIES;

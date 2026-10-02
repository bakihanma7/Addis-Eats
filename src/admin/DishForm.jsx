import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../checkout/Field.jsx';
import { CATEGORIES } from '../menu/categories.js';

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  emoji: '🍽️',
  description: '',
  ingredients: '',
  prepMinutes: '20',
  rating: '4.5',
  spicy: false,
  special: false,
};

export default function DishForm({ open, dish, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    setForm(
      dish
        ? {
            name: dish.name ?? '',
            category: dish.category ?? '',
            price: String(dish.price ?? ''),
            emoji: dish.emoji ?? '🍽️',
            description: dish.description ?? '',
            ingredients: (dish.ingredients ?? []).join(', '),
            prepMinutes: String(dish.prepMinutes ?? 20),
            rating: String(dish.rating ?? 4.5),
            spicy: Boolean(dish.spicy),
            special: Boolean(dish.special),
          }
        : EMPTY_FORM
    );
  }, [open, dish]);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Dish name is required.';
    else if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters.';
    if (!form.category) next.category = 'Choose a category.';
    const price = Number(form.price);
    if (!form.price.trim() || !Number.isFinite(price) || price <= 0) next.price = 'Enter a price greater than zero.';
    else if (price > 100000) next.price = 'That price looks too high.';
    const prep = Number(form.prepMinutes);
    if (!Number.isFinite(prep) || prep < 1 || prep > 240) next.prepMinutes = 'Prep time must be 1–240 minutes.';
    const rating = Number(form.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) next.rating = 'Rating must be between 0 and 5.';
    if (!form.description.trim()) next.description = 'A short description helps customers decide.';
    return next;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      emoji: form.emoji.trim() || '🍽️',
      description: form.description.trim(),
      ingredients: form.ingredients
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean),
      prepMinutes: Number(form.prepMinutes),
      rating: Number(form.rating),
      spicy: form.spicy,
      special: form.special,
    };
    onSave(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={dish ? `Edit “${dish.name}”` : 'Add a new dish'}
      width="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="dish-form" loading={saving}>
            {dish ? 'Save changes' : 'Add dish'}
          </Button>
        </>
      }
    >
      <form id="dish-form" className="form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <Field
            label="Dish name"
            name="dish-name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            placeholder="e.g. Doro Wat"
            autoFocus
          />
          <Field as="select" label="Category" name="dish-category" value={form.category} onChange={set('category')} error={errors.category}>
            <option value="">Choose a category…</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.match}>
                {category.label}
              </option>
            ))}
          </Field>
          <Field
            label="Price (ETB)"
            name="dish-price"
            type="number"
            min="1"
            step="1"
            value={form.price}
            onChange={set('price')}
            error={errors.price}
            placeholder="e.g. 420"
          />
          <Field
            label="Emoji"
            name="dish-emoji"
            value={form.emoji}
            onChange={set('emoji')}
            error={''}
            hint="Shown on the dish card tile."
            required={false}
          />
          <Field
            label="Prep time (minutes)"
            name="dish-prep"
            type="number"
            min="1"
            max="240"
            value={form.prepMinutes}
            onChange={set('prepMinutes')}
            error={errors.prepMinutes}
          />
          <Field
            label="Rating (0–5)"
            name="dish-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={set('rating')}
            error={errors.rating}
          />
        </div>

        <Field
          label="Description"
          name="dish-description"
          as="textarea"
          value={form.description}
          onChange={set('description')}
          error={errors.description}
          placeholder="One or two appetizing sentences…"
        />

        <Field
          label="Ingredients"
          name="dish-ingredients"
          as="textarea"
          value={form.ingredients}
          onChange={set('ingredients')}
          hint="Separate with commas — shown on the dish detail page."
          placeholder="Chicken, Berbere, Injera…"
          required={false}
        />

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={form.spicy} onChange={set('spicy')} /> Spicy 🌶
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={form.special} onChange={set('special')} /> Today&apos;s special ★
          </label>
        </div>
      </form>
    </Modal>
  );
}

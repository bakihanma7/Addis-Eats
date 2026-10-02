import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchDishById } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../ui/Spinner.jsx';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import FavoriteButton from '../favorites/FavoriteButton.jsx';
import { addLine } from '../cart/cartStore.js';
import { useToast } from '../ui/Toast.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function Dish() {
  const { id } = useParams();
  const { data: dish, loading, error } = useFetch(() => fetchDishById(id), [id]);
  const [qty, setQty] = useState(1);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="loading-block">
        <Spinner size="lg" label="Loading dish…" />
        <p>Plating your dish…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-block" role="alert">
        <span className="error-block__emoji" aria-hidden="true">
          🥲
        </span>
        <h2>We couldn&apos;t load this dish</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!dish) {
    return (
      <EmptyState
        emoji="🍽️"
        title="Dish not found"
        action={
          <Link to="/menu" className="btn btn--primary">
            Back to the menu
          </Link>
        }
      >
        This dish may have been removed from the menu. Plenty of others are waiting for you.
      </EmptyState>
    );
  }

  const onAddToCart = () => {
    addLine(dish, qty);
    toast(`${qty} × ${dish.name} added to cart`, 'success');
  };

  return (
    <section className="page">
      <Link to="/menu" className="back-link">
        ← Back to menu
      </Link>

      <div className="dish-hero">
        <div className="dish-hero__media">
          <span aria-hidden="true">{dish.emoji}</span>
        </div>

        <div>
          <div className="dish-hero__head">
            <h1 className="dish-hero__title">{dish.name}</h1>
            <FavoriteButton dishId={dish.id} dishName={dish.name} />
            <span className="dish-hero__price price">{formatCurrency(dish.price)}</span>
          </div>

          <div className="dish-card__meta" style={{ marginBottom: 12 }}>
            <span className="tag tag--category">{dish.category}</span>
            {dish.special && <span className="tag tag--special">★ Today&apos;s special</span>}
            {dish.spicy && <span className="tag tag--spicy">🌶 Spicy</span>}
            <span className="tag tag--rating">★ {dish.rating}</span>
          </div>

          <p>{dish.description}</p>

          <h2 style={{ fontSize: '1.1rem', margin: '18px 0 8px' }}>Ingredients</h2>
          <ul className="ingredient-list">
            {dish.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>

          <div className="add-to-cart-bar">
            <div className="qty-stepper" role="group" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty-stepper__value" aria-live="polite">
                {qty}
              </span>
              <button type="button" onClick={() => setQty((n) => Math.min(99, n + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <Button variant="primary" size="lg" onClick={onAddToCart}>
              Add {qty > 1 ? `${qty} ` : ''}to cart · {formatCurrency(dish.price * qty)}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

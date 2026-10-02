import { Link, useNavigate } from 'react-router-dom';
import { useCart, clearCart, subtotalOf, countItems } from './cartStore.js';
import CartPanel from './CartPanel.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { DELIVERY_AREAS } from '../utils/deliveryEstimate.js';

export default function Cart() {
  const { lines } = useCart();
  const navigate = useNavigate();
  const subtotal = subtotalOf(lines);
  const items = countItems(lines);
  const cheapestFee = Math.min(...DELIVERY_AREAS.map((area) => area.fee));

  if (lines.length === 0) {
    return (
      <section className="page">
        <h1 className="page__title">Your cart</h1>
        <p className="page__intro">Your tray is empty — for now.</p>
        <EmptyState
          emoji="🛒"
          title="Nothing in your cart yet"
          action={
            <Link to="/menu" className="btn btn--primary">
              Browse the menu
            </Link>
          }
        >
          Add a dish from any card, or tap the heart to save favorites for later.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Your cart</h1>
          <p className="menu-meta">
            <strong>{items}</strong> item{items === 1 ? '' : 's'} — total updates live as you adjust quantities.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      <div className="cart-layout">
        <div className="cart-panel">
          <CartPanel />
        </div>

        <aside className="card summary-card" aria-label="Order summary">
          <h2 className="summary-card__title">Order summary</h2>
          <div className="summary-row">
            <span>Subtotal ({items} items)</span>
            <strong className="price">{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong className="price">from {formatCurrency(cheapestFee)}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span className="price" style={{ color: 'var(--primary)' }}>
              {formatCurrency(subtotal + cheapestFee)}+
            </span>
          </div>
          <p className="summary-note">
            Delivery fee and estimated time depend on your area — exact figures show at checkout.
          </p>
          <Button variant="primary" size="lg" className="btn--block" onClick={() => navigate('/checkout')} style={{ marginTop: 16 }}>
            Proceed to checkout
          </Button>
          <p className="summary-note" style={{ textAlign: 'center' }}>
            <Link to="/menu">Add more dishes</Link>
          </p>
        </aside>
      </div>
    </section>
  );
}

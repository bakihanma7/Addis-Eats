import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { useCart, clearCart, subtotalOf, countItems } from '../cart/cartStore.js';
import { addOrder } from '../orders/orderHistoryStore.js';
import Field from './Field.jsx';
import DeliveryEstimate from './DeliveryEstimate.jsx';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { useToast } from '../ui/Toast.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { DELIVERY_AREAS, deliveryEstimate } from '../utils/deliveryEstimate.js';
import { validateCheckoutForm } from './validate.js';

export default function Checkout() {
  const { user } = useAuth();
  const { lines } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [areaId, setAreaId] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = subtotalOf(lines);
  const { fee, etaLabel, areaName } = deliveryEstimate(areaId);
  const total = subtotal + fee;

  if (placedOrder) {
    return (
      <section className="page">
        <div className="card confirmation">
          <span className="confirmation__emoji" role="img" aria-label="Celebration">
            🎉
          </span>
          <h1 className="page__title">Order confirmed!</h1>
          <p>
            Thank you, <strong>{placedOrder.customer.name}</strong>. Your food is on its way to{' '}
            <strong>{placedOrder.customer.areaName}</strong>.
          </p>
          <span className="confirmation__order-id">Order {placedOrder.id}</span>
          <p className="menu-meta" style={{ textAlign: 'center' }}>
            Estimated arrival: <strong>{placedOrder.etaLabel}</strong> · Paid total:{' '}
            <strong className="price">{formatCurrency(placedOrder.total)}</strong>
          </p>
          <p className="summary-note" style={{ textAlign: 'center' }}>
            We&apos;ll call {placedOrder.customer.phone} if the rider needs directions.
          </p>
          <div className="confirmation__actions">
            <Link to="/orders" className="btn btn--primary">
              View my orders
            </Link>
            <Link to="/menu" className="btn btn--outline">
              Order something else
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="page">
        <h1 className="page__title">Checkout</h1>
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          action={
            <Link to="/menu" className="btn btn--primary">
              Browse the menu
            </Link>
          }
        >
          Add at least one dish before checking out.
        </EmptyState>
      </section>
    );
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm({ name, phone, areaId, note });
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      toast('Please fix the highlighted fields', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = addOrder({
        customer: { name: name.trim(), phone: phone.trim(), areaId, areaName, note: note.trim() },
        items: lines.map(({ dishId, name: itemName, price, emoji, qty }) => ({ dishId, name: itemName, price, emoji, qty })),
        subtotal,
        deliveryFee: fee,
        total,
        etaLabel,
      });
      clearCart();
      setSubmitting(false);
      setPlacedOrder(order);
      toast(`Order ${order.id} placed`, 'success');
    }, 600);
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Checkout</h1>
          <p className="page__intro">
            Signing in as <strong>{user?.name}</strong> · {countItems(lines)} item
            {countItems(lines) === 1 ? '' : 's'} in your cart
          </p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="card card--tight" onSubmit={onSubmit} noValidate aria-label="Delivery details">
          <h2 style={{ fontSize: '1.15rem' }}>Delivery details</h2>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <Field
              label="Full name"
              name="checkout-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={errors.name}
              placeholder="e.g. Selam Bekele"
              autoComplete="name"
            />
            <Field
              label="Phone number"
              name="checkout-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              error={errors.phone}
              placeholder="0912345678"
              hint="We only call if the rider can't find you."
              autoComplete="tel"
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Field
              as="select"
              label="Delivery area"
              name="checkout-area"
              value={areaId}
              onChange={(event) => setAreaId(event.target.value)}
              error={errors.area}
              hint="Fee and delivery time update automatically."
            >
              <option value="">Choose an area…</option>
              {DELIVERY_AREAS.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} · {formatCurrency(area.fee)} · {area.etaMin}–{area.etaMax} min
                </option>
              ))}
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field
              as="textarea"
              label="Special instructions"
              name="checkout-note"
              required={false}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              error={errors.note}
              placeholder="e.g. Extra berbere on the side, gate code 2214, call on arrival…"
              hint={`${note.length}/200 characters — optional`}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="btn--block" loading={submitting} style={{ marginTop: 18 }}>
            {submitting ? 'Placing your order…' : `Place order · ${formatCurrency(total)}`}
          </Button>
        </form>

        <aside className="card summary-card" aria-label="Order summary">
          <h2 className="summary-card__title">Order summary</h2>
          <ul className="order-detail-list" style={{ marginBottom: 14 }}>
            {lines.map((line) => (
              <li key={line.dishId}>
                <span>
                  <span aria-hidden="true">{line.emoji}</span> {line.qty} × {line.name}
                </span>
                <span className="price">{formatCurrency(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong className="price">{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery {areaId ? `to ${areaName}` : ''}</span>
            <strong className="price">{areaId ? formatCurrency(fee) : '—'}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span className="price" style={{ color: 'var(--primary)' }}>
              {areaId ? formatCurrency(total) : `${formatCurrency(subtotal)} + delivery`}
            </span>
          </div>

          {areaId ? (
            <div style={{ marginTop: 14 }}>
              <DeliveryEstimate areaId={areaId} />
            </div>
          ) : (
            <p className="summary-note" style={{ marginTop: 12 }}>
              Pick a delivery area to see the fee and estimated arrival time.
            </p>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="btn--block"
            onClick={() => navigate('/cart')}
            style={{ marginTop: 14 }}
          >
            ← Back to cart
          </Button>
        </aside>
      </div>
    </section>
  );
}

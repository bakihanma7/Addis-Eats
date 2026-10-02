import { Link } from 'react-router-dom';
import { useCart, increment, decrement, removeLine } from './cartStore.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export function CartPanel() {
  const { lines } = useCart();

  if (lines.length === 0) return null;

  return (
    <ul className="cart-panel__list">
      {lines.map((line) => (
        <li key={line.dishId} className="cart-line">
          <div className="cart-line__media" aria-hidden="true">
            {line.emoji}
          </div>

          <div className="cart-line__info">
            <h3 className="cart-line__name">
              <Link to={`/menu/${line.dishId}`}>{line.name}</Link>
            </h3>
            <p className="cart-line__unit price">
              {formatCurrency(line.price)} each · line total {formatCurrency(line.price * line.qty)}
            </p>
          </div>

          <div className="cart-line__controls">
            <div className="qty-stepper" role="group" aria-label={`Quantity for ${line.name}`}>
              <button
                type="button"
                onClick={() => decrement(line.dishId)}
                aria-label={`Decrease ${line.name} quantity`}
              >
                −
              </button>
              <span className="qty-stepper__value" aria-live="polite">
                {line.qty}
              </span>
              <button
                type="button"
                onClick={() => increment(line.dishId)}
                aria-label={`Increase ${line.name} quantity`}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="cart-line__remove"
              onClick={() => removeLine(line.dishId)}
              aria-label={`Remove ${line.name} from cart`}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CartPanel;

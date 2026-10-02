import { Link } from 'react-router-dom';
import { useCart, countItems } from './cartStore.js';

export function CartBadge() {
  const { lines } = useCart();
  const count = countItems(lines);

  return (
    <Link to="/cart" className="cart-badge" aria-label={`Cart — ${count} item${count === 1 ? '' : 's'}`}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="cart-badge__count" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export default CartBadge;

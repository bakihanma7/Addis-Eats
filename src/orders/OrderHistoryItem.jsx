import { formatCurrency } from '../utils/formatCurrency.js';
import { itemCountOf, STATUS_LABELS } from './orderHistoryStore.js';

export function formatOrderDate(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderHistoryItem({ order, onReorder }) {
  return (
    <li className="order-item">
      <div className="order-item__head">
        <span className="order-item__id">{order.id}</span>
        <span className={`status-pill status--${order.status}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
        <span className="order-item__date">{formatOrderDate(order.createdAt)}</span>
      </div>

      <p className="order-item__items">
        {order.items.map((item, index) => (
          <span key={item.dishId}>
            <span aria-hidden="true">{item.emoji}</span> {item.qty} × {item.name}
            {index < order.items.length - 1 ? ' · ' : ''}
          </span>
        ))}
      </p>

      <div className="order-item__foot">
        <span className="order-item__total price">
          {formatCurrency(order.total)} <span className="summary-note">({itemCountOf(order)} items · {order.customer.areaName})</span>
        </span>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => onReorder(order)}>
          ↻ Reorder
        </button>
      </div>
    </li>
  );
}

export default OrderHistoryItem;

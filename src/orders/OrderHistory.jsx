import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from './orderHistoryStore.js';
import { reorderItems, countItems } from '../cart/cartStore.js';
import OrderHistoryItem from './OrderHistoryItem.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { useToast } from '../ui/Toast.jsx';

export default function OrderHistory() {
  const orders = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onReorder = (order) => {
    reorderItems(order.items);
    const items = countItems(order.items);
    toast(`${items} item${items === 1 ? '' : 's'} from ${order.id} added to your cart`, 'success');
    navigate('/cart');
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Your orders</h1>
          <p className="menu-meta">
            {orders.length === 0 ? 'No orders yet' : `${orders.length} past order${orders.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {orders.length === 0 && (
        <EmptyState
          emoji="🧾"
          title="No orders yet"
          action={
            <Link to="/menu" className="btn btn--primary">
              Start your first order
            </Link>
          }
        >
          When you place an order it appears here, with a one-click reorder button.
        </EmptyState>
      )}

      {orders.length > 0 && (
        <ul className="order-list">
          {orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} onReorder={onReorder} />
          ))}
        </ul>
      )}
    </section>
  );
}

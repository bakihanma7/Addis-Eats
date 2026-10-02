import { useState } from 'react';
import {
  useOrders,
  updateOrderStatus,
  deleteOrder,
  ORDER_STATUSES,
  STATUS_LABELS,
  itemCountOf,
} from '../orders/orderHistoryStore.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useToast } from '../ui/Toast.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatOrderDate } from '../orders/OrderHistoryItem.jsx';

export default function OrderManager() {
  const orders = useOrders();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  const onStatusChange = (order, status) => {
    updateOrderStatus(order.id, status);
    toast(`${order.id} → ${STATUS_LABELS[status]}`, 'info');
  };

  const confirmDelete = () => {
    deleteOrder(deleting.id);
    toast(`Order ${deleting.id} deleted`, 'info');
    setDeleting(null);
  };

  return (
    <section>
      <div className="page__head">
        <div>
          <h1 className="page__title">Orders</h1>
          <p className="menu-meta">{orders.length} order{orders.length === 1 ? '' : 's'} in the system</p>
        </div>
      </div>

      <div className="card admin-panel" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="dish-cell__name">{order.id}</span>
                    <br />
                    <span className="dish-cell__id">{formatOrderDate(order.createdAt)}</span>
                  </td>
                  <td>
                    {order.customer.name}
                    <br />
                    <span className="dish-cell__id">{order.customer.phone}</span>
                  </td>
                  <td>{itemCountOf(order)}</td>
                  <td className="price">{formatCurrency(order.total)}</td>
                  <td>
                    <label className="sr-only" htmlFor={`status-${order.id}`}>
                      Status for {order.id}
                    </label>
                    <select
                      id={`status-${order.id}`}
                      className="status-select"
                      value={order.status}
                      onChange={(event) => onStatusChange(order, event.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button variant="outline" size="sm" onClick={() => setViewing(order)}>
                        View
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleting(order)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <p className="admin-note" style={{ textAlign: 'center', padding: '18px 0' }}>
                      No orders yet — place one from the customer site to see it here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={`Order ${viewing?.id ?? ''}`} width="md">
        {viewing && (
          <>
            <dl className="kv-list" style={{ marginBottom: 16 }}>
              <dt>Status</dt>
              <dd>
                <span className={`status-pill status--${viewing.status}`}>{STATUS_LABELS[viewing.status]}</span>
              </dd>
              <dt>Placed</dt>
              <dd>{formatOrderDate(viewing.createdAt)}</dd>
              <dt>Customer</dt>
              <dd>
                {viewing.customer.name} · {viewing.customer.phone}
              </dd>
              <dt>Deliver to</dt>
              <dd>
                {viewing.customer.areaName} (fee {formatCurrency(viewing.deliveryFee)}, ETA {viewing.etaLabel})
              </dd>
              {viewing.customer.note ? (
                <>
                  <dt>Note</dt>
                  <dd>{viewing.customer.note}</dd>
                </>
              ) : null}
            </dl>

            <ul className="order-detail-list" style={{ marginBottom: 16 }}>
              {viewing.items.map((item) => (
                <li key={item.dishId}>
                  <span>
                    <span aria-hidden="true">{item.emoji}</span> {item.qty} × {item.name}
                  </span>
                  <span className="price">{formatCurrency(item.qty * item.price)}</span>
                </li>
              ))}
            </ul>

            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span className="price">{formatCurrency(viewing.total)}</span>
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this order?"
        width="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete order
            </Button>
          </>
        }
      >
        <p>
          Order <strong>{deleting?.id}</strong> ({formatCurrency(deleting?.total ?? 0)}, {deleting?.customer?.name}) will
          be removed from the system and from the customer&apos;s order history.
        </p>
      </Modal>
    </section>
  );
}

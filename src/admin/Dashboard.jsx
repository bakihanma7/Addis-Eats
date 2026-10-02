import { useOrders, totalRevenueOf, salesByDish, statusCounts, ORDER_STATUSES, STATUS_LABELS } from '../orders/orderHistoryStore.js';
import { fetchDishes } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function Dashboard() {
  const orders = useOrders();
  const { data: dishes } = useFetch(fetchDishes, []);

  const revenue = totalRevenueOf(orders);
  const orderCount = orders.length;
  const averageOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  const topDishes = salesByDish(orders).slice(0, 5);
  const counts = statusCounts(orders);
  const maxStatusCount = Math.max(1, ...ORDER_STATUSES.map((status) => counts[status]));
  const pending = counts.pending + counts.preparing;

  return (
    <section>
      <div className="page__head">
        <div>
          <h1 className="page__title">Dashboard</h1>
          <p className="menu-meta">
            {pending > 0
              ? `${pending} order${pending === 1 ? '' : 's'} need kitchen attention`
              : 'All orders are out for delivery or done 🎉'}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-card__label">
            <span aria-hidden="true">💰</span> Revenue
          </span>
          <div className="stat-card__value">{formatCurrency(revenue)}</div>
          <div className="stat-card__sub">across all orders</div>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">
            <span aria-hidden="true">🧾</span> Orders
          </span>
          <div className="stat-card__value">{orderCount}</div>
          <div className="stat-card__sub">
            {counts.pending} pending · {counts.delivered} delivered
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">
            <span aria-hidden="true">📊</span> Average order
          </span>
          <div className="stat-card__value">{formatCurrency(averageOrderValue)}</div>
          <div className="stat-card__sub">per order value</div>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">
            <span aria-hidden="true">🍲</span> Dishes on menu
          </span>
          <div className="stat-card__value">{dishes?.length ?? '—'}</div>
          <div className="stat-card__sub">manage under “Dishes”</div>
        </div>
      </div>

      <div className="card admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">
            <span aria-hidden="true">🏆</span> Top selling dishes
          </h2>
        </div>
        {topDishes.length === 0 ? (
          <p className="admin-note">No sales yet — once customers start ordering, the best sellers appear here.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Dish</th>
                  <th scope="col">Sold</th>
                  <th scope="col">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topDishes.map((entry, index) => (
                  <tr key={entry.dishId}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="dish-cell">
                        <span className="dish-cell__emoji" aria-hidden="true">
                          {entry.emoji}
                        </span>
                        <span>
                          <span className="dish-cell__name">{entry.name}</span>
                        </span>
                      </div>
                    </td>
                    <td>{entry.qty}×</td>
                    <td className="price">{formatCurrency(entry.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">
            <span aria-hidden="true">📦</span> Order status distribution
          </h2>
        </div>
        <div className="bar-chart">
          {ORDER_STATUSES.map((status) => (
            <div key={status} className="bar-chart__row" data-status={status}>
              <span className="bar-chart__label">{STATUS_LABELS[status]}</span>
              <div
                className="bar-chart__track"
                role="meter"
                aria-valuenow={counts[status]}
                aria-valuemin={0}
                aria-valuemax={maxStatusCount}
                aria-label={`${STATUS_LABELS[status]} orders`}
              >
                <div className="bar-chart__fill" style={{ width: `${(counts[status] / maxStatusCount) * 100}%` }} />
              </div>
              <span className="bar-chart__value">{counts[status]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

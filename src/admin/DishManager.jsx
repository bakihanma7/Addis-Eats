import { useMemo, useState } from 'react';
import { fetchDishes, saveDishes } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import Spinner from '../ui/Spinner.jsx';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import DishForm from './DishForm.jsx';
import { useToast } from '../ui/Toast.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function DishManager() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: dishes, loading, error } = useFetch(fetchDishes, [reloadKey]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  const visible = useMemo(() => {
    if (!dishes) return [];
    const needle = debouncedQuery.trim().toLowerCase();
    if (!needle) return dishes;
    return dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(needle) ||
        dish.category.toLowerCase().includes(needle) ||
        dish.description.toLowerCase().includes(needle)
    );
  }, [dishes, debouncedQuery]);

  const makeId = (name) => `d${Date.now().toString(36).slice(-4)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 12)}`;

  const onSave = (payload) => {
    let saved;
    if (editing === 'new') {
      saved = [...(dishes ?? []), { ...payload, id: makeId(payload.name) }];
      toast(`${payload.name} added to the menu`, 'success');
    } else {
      saved = (dishes ?? []).map((dish) => (dish.id === editing.id ? { ...dish, ...payload } : dish));
      toast(`${payload.name} updated`, 'success');
    }
    saveDishes(saved);
    setReloadKey((key) => key + 1);
    setEditing(null);
  };

  const confirmDelete = () => {
    const saved = (dishes ?? []).filter((dish) => dish.id !== deleting.id);
    saveDishes(saved);
    setReloadKey((key) => key + 1);
    toast(`${deleting.name} removed from the menu`, 'info');
    setDeleting(null);
  };

  const dishBeingEdited = editing && editing !== 'new' ? editing : null;

  return (
    <section>
      <div className="page__head">
        <div>
          <h1 className="page__title">Dishes</h1>
          <p className="menu-meta">
            {loading ? 'Loading…' : `${visible.length} of ${dishes.length} dishes shown`}
          </p>
        </div>
        <Button variant="primary" onClick={() => setEditing('new')}>
          + Add dish
        </Button>
      </div>

      <div className="admin-toolbar" style={{ marginBottom: 16 }}>
        <div className="search-field" style={{ flex: '1 1 260px' }}>
          <svg className="search-field__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes to manage…"
            aria-label="Search admin dish list"
          />
        </div>
      </div>

      {loading && (
        <div className="loading-block">
          <Spinner label="Loading dishes…" />
        </div>
      )}

      {error && (
        <div className="error-block" role="alert">
          <h2>Couldn&apos;t load dishes</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="card admin-panel" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Dish</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Flags</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((dish) => (
                  <tr key={dish.id}>
                    <td>
                      <div className="dish-cell">
                        <span className="dish-cell__emoji" aria-hidden="true">
                          {dish.emoji}
                        </span>
                        <span>
                          <span className="dish-cell__name">{dish.name}</span>
                          <br />
                          <span className="dish-cell__id">{dish.id}</span>
                        </span>
                      </div>
                    </td>
                    <td>{dish.category}</td>
                    <td className="price">{formatCurrency(dish.price)}</td>
                    <td>
                      <span className="tag tag--category">{dish.category}</span>{' '}
                      {dish.special && <span className="tag tag--special">★</span>}
                      {dish.spicy && <span className="tag tag--spicy">🌶</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Button variant="outline" size="sm" onClick={() => setEditing(dish)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleting(dish)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <p className="admin-note" style={{ textAlign: 'center', padding: '18px 0' }}>
                        No dishes match “{debouncedQuery}”.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DishForm open={Boolean(editing)} dish={dishBeingEdited} onClose={() => setEditing(null)} onSave={onSave} />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this dish?"
        width="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete dish
            </Button>
          </>
        }
      >
        <p>
          <strong>{deleting?.name}</strong> will be removed from the menu for every customer. This cannot be undone.
        </p>
      </Modal>
    </section>
  );
}

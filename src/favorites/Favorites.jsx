import { Link } from 'react-router-dom';
import { useFavoriteIds } from './favoritesStore.js';
import { fetchDishes } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import DishList from '../menu/DishList.jsx';
import Spinner from '../ui/Spinner.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function Favorites() {
  const favoriteIds = useFavoriteIds();
  const { data: dishes, loading, error } = useFetch(fetchDishes, []);

  const favoriteDishes = (dishes ?? []).filter((dish) => favoriteIds.includes(dish.id));

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Your favorites</h1>
          <p className="menu-meta">
            {loading
              ? 'Checking the kitchen…'
              : `${favoriteDishes.length} saved dish${favoriteDishes.length === 1 ? '' : 'es'}`}
          </p>
        </div>
      </div>

      {loading && (
        <div className="loading-block">
          <Spinner label="Loading favorites…" />
        </div>
      )}

      {error && (
        <div className="error-block" role="alert">
          <span className="error-block__emoji" aria-hidden="true">
            🥲
          </span>
          <h2>We couldn&apos;t load your favorites</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && favoriteDishes.length === 0 && (
        <EmptyState
          emoji="💛"
          title="No favorites yet"
          action={
            <Link to="/menu" className="btn btn--primary">
              Discover dishes
            </Link>
          }
        >
          Tap the heart on any dish card to keep it one tap away.
        </EmptyState>
      )}

      {!loading && !error && favoriteDishes.length > 0 && <DishList dishes={favoriteDishes} />}
    </section>
  );
}

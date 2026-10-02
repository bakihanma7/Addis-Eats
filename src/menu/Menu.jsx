import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDishes } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import Spinner from '../ui/Spinner.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Button from '../ui/Button.jsx';
import CategoryBar from './CategoryBar.jsx';
import DishList from './DishList.jsx';
import { CATEGORIES, categoryById } from './categories.js';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = categoryById(searchParams.get('category'));

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const { data: dishes, loading, error } = useFetch(fetchDishes, []);

  const counts = useMemo(() => {
    if (!dishes) return {};
    const next = { all: dishes.length };
    for (const cat of CATEGORIES) {
      next[cat.id] = dishes.filter((dish) => dish.category === cat.match).length;
    }
    return next;
  }, [dishes]);

  const visible = useMemo(() => {
    if (!dishes) return [];
    const needle = debouncedQuery.trim().toLowerCase();
    return dishes.filter((dish) => {
      const matchesCategory = !category || dish.category === category.match;
      const matchesSearch =
        !needle ||
        dish.name.toLowerCase().includes(needle) ||
        dish.description.toLowerCase().includes(needle) ||
        dish.category.toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [dishes, category, debouncedQuery]);

  const heading = loading ? 'Menu' : `${counts.all ?? '—'} dishes delivered hot`;

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Our Menu</h1>
          <p className="menu-meta">
            {category ? (
              <>
                Showing <strong>{category.label}</strong> —{' '}
              </>
            ) : (
              <>
                All categories —{' '}
              </>
            )}
            {visible.length} match{visible.length === 1 ? '' : 'es'}
          </p>
        </div>
      </div>

      <div className="menu-toolbar">
        <div className="search-field">
          <svg className="search-field__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes — try “doro”, “pizza”, “coffee”…"
            aria-label="Search dishes"
          />
          {query && (
            <button
              type="button"
              className="search-field__clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <CategoryBar active={category?.id ?? null} counts={counts} />
      </div>

      {loading && (
        <div className="loading-block">
          <Spinner size="lg" label="Loading the menu…" />
          <p>Fetching today&apos;s dishes from the kitchen…</p>
        </div>
      )}

      {error && (
        <div className="error-block" role="alert">
          <span className="error-block__emoji" aria-hidden="true">
            🥲
          </span>
          <h2>We couldn&apos;t load the menu</h2>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <EmptyState
          emoji="🔍"
          title={debouncedQuery ? `No dishes match “${debouncedQuery}”` : 'Nothing in this category yet'}
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
            >
              Clear filters
            </Button>
          }
        >
          {debouncedQuery
            ? 'Try a shorter search term, or browse by category instead.'
            : 'The kitchen is restocking this category — check back soon.'}
        </EmptyState>
      )}

      {!loading && !error && visible.length > 0 && <DishList dishes={visible} />}
    </section>
  );
}

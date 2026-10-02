import { Link } from 'react-router-dom';
import { fetchDishes } from '../api/dishes.js';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../ui/Spinner.jsx';
import DishCard from '../menu/DishCard.jsx';
import { CATEGORIES } from '../menu/categories.js';

export default function Home() {
  const { data: dishes, loading, error } = useFetch(fetchDishes, []);

  const specials = dishes?.filter((dish) => dish.special) ?? [];
  const counts = CATEGORIES.map((category) => ({
    ...category,
    count: dishes?.filter((dish) => dish.category === category.match).length ?? 0,
  }));

  return (
    <section className="page">
      <div className="hero">
        <span className="hero__eyebrow">ጤ Addis Ababa · delivered hot</span>
        <h1 className="hero__title">
          Ethiopian classics, pizza &amp; burgers — <em>from our kitchen to your door</em>
        </h1>
        <p className="hero__text">
          Addis Eats brings the best of Addis Ababa&apos;s kitchens together in one order. Browse the full menu, build
          your tray of injera favorites or a Friday-night pizza, and track it from oven to doorstep.
        </p>
        <div className="hero__actions">
          <Link to="/menu" className="btn btn--primary btn--lg">
            Browse the menu
          </Link>
          <Link to="/orders" className="btn btn--outline btn--lg">
            Track my order
          </Link>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <b>{dishes?.length ?? '—'}</b>
            <span>dishes</span>
          </div>
          <div className="hero__stat">
            <b>8</b>
            <span>delivery areas</span>
          </div>
          <div className="hero__stat">
            <b>25 min</b>
            <span>avg delivery</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 className="section-title">
          <span className="section-title__accent" aria-hidden="true" />
          Browse by craving
        </h2>
        <div className="category-quick">
          {counts.map((category) => (
            <Link key={category.id} to={`/menu?category=${category.id}`} className="category-quick__card">
              <span className="category-quick__emoji" aria-hidden="true">
                {category.emoji}
              </span>
              {category.label}
              <span className="category-quick__count">{loading ? '…' : `${category.count} dishes`}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 className="section-title">
          <span className="section-title__accent" aria-hidden="true" />
          Today&apos;s specials
        </h2>
        {loading && (
          <div className="loading-block">
            <Spinner label="Loading specials…" />
          </div>
        )}
        {error && (
          <p className="error-block" role="alert">
            Specials are unavailable right now — <Link to="/menu">open the full menu instead</Link>.
          </p>
        )}
        {!loading && !error && specials.length > 0 && (
          <div className="dish-grid">
            {specials.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 className="section-title">
          <span className="section-title__accent" aria-hidden="true" />
          How it works
        </h2>
        <div className="how-it-works">
          <div className="how-step">
            <span className="how-step__num" aria-hidden="true">
              1
            </span>
            <div>
              <h3>Pick your dishes</h3>
              <p>Browse the menu, search live and save favorites with the heart icon.</p>
            </div>
          </div>
          <div className="how-step">
            <span className="how-step__num" aria-hidden="true">
              2
            </span>
            <div>
              <h3>Check out in seconds</h3>
              <p>Sign in with your name and phone, pick your area and add a note for the kitchen.</p>
            </div>
          </div>
          <div className="how-step">
            <span className="how-step__num" aria-hidden="true">
              3
            </span>
            <div>
              <h3>Track &amp; reorder</h3>
              <p>Follow your order&apos;s status and reorder any past order with one click.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

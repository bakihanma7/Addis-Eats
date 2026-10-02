import { Link } from 'react-router-dom';
import { CATEGORIES } from './categories.js';

export function CategoryBar({ active, counts = {} }) {
  return (
    <div className="category-bar" role="group" aria-label="Filter by category">
      <Link
        to="/menu"
        className={`category-chip${!active ? ' is-active' : ''}`}
        aria-current={!active ? 'true' : undefined}
      >
        All dishes
        {typeof counts.all === 'number' && <span className="category-chip__count">{counts.all}</span>}
      </Link>
      {CATEGORIES.map((category) => {
        const isActive = active === category.id;
        return (
          <Link
            key={category.id}
            to={`/menu?category=${category.id}`}
            className={`category-chip${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span aria-hidden="true">{category.emoji}</span>
            {category.label}
            {typeof counts[category.id] === 'number' && (
              <span className="category-chip__count">{counts[category.id]}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryBar;

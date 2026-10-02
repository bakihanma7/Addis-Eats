import { useFavoriteIds, toggleFavorite } from './favoritesStore.js';

export function FavoriteButton({ dishId, dishName = 'this dish', className }) {
  const favorites = useFavoriteIds();
  const isFavorite = favorites.includes(dishId);

  return (
    <button
      type="button"
      className={`fav-btn${isFavorite ? ' is-favorite' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => toggleFavorite(dishId)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${dishName} from favorites` : `Add ${dishName} to favorites`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isFavorite ? 'fav-btn__pop' : undefined}
        key={isFavorite ? 'on' : 'off'}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;

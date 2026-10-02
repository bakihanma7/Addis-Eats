import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import FavoriteButton from '../favorites/FavoriteButton.jsx';
import { addLine } from '../cart/cartStore.js';
import { useToast } from '../ui/Toast.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

export function DishCard({ dish }) {
  const { toast } = useToast();

  const onAddToCart = () => {
    addLine(dish, 1);
    toast(`${dish.name} added to cart`, 'success');
  };

  return (
    <article className="dish-card" aria-label={dish.name}>
      <div className="dish-card__media">
        <span aria-hidden="true">{dish.emoji}</span>
        <FavoriteButton dishId={dish.id} dishName={dish.name} className="dish-card__fav" />
      </div>

      <div className="dish-card__body">
        <div className="dish-card__top">
          <h3 className="dish-card__name">
            <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>
          <span className="dish-card__price price">{formatCurrency(dish.price)}</span>
        </div>

        <p className="dish-card__desc">{dish.description}</p>

        <div className="dish-card__meta">
          {dish.special && <span className="tag tag--special">★ Special</span>}
          {dish.spicy && <span className="tag tag--spicy">🌶 Spicy</span>}
          <span className="tag tag--rating">★ {dish.rating}</span>
        </div>

        <div className="dish-card__foot">
          <span className="dish-card__prep">~{dish.prepMinutes} min</span>
          <Button variant="primary" size="sm" onClick={onAddToCart} aria-label={`Add ${dish.name} to cart`}>
            + Add
          </Button>
        </div>
      </div>
    </article>
  );
}

export default DishCard;

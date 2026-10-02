import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/useAuth.js';
import ThemeToggle from './theme/ThemeToggle.jsx';
import CartBadge from './cart/CartBadge.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/orders', label: 'Orders' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand" aria-label="Addis Eats — home">
            <span className="brand__mark" aria-hidden="true">
              ጤ
            </span>
            <span className="brand__text">
              Addis&nbsp;Eats <em className="brand__tag">Addis Ababa delivery</em>
            </span>
          </Link>

          <div className="site-header__actions">
            {user ? (
              <div className="account-chip">
                <span className="account-chip__avatar" aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="account-chip__name">{user.name.split(' ')[0]}</span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={onSignOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <NavLink to="/signin" className="btn btn--outline btn--sm">
                Sign in
              </NavLink>
            )}
            <ThemeToggle />
            <CartBadge />
          </div>
        </div>

        <nav className="site-nav" aria-label="Main navigation">
          <ul className="site-nav__list">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__brand">
            <strong>ጤ Addis Eats</strong> — Ethiopian kitchen classics, pizza, burgers and drinks, delivered across
            Addis Ababa.
          </p>
          <p className="site-footer__meta">Open daily 8:00–22:00 · +251 11 552 0000 · hello@addiseats.et</p>
        </div>
      </footer>
    </div>
  );
}

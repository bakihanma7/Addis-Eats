import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth.js';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import Button from '../ui/Button.jsx';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/menu', label: 'Dishes', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
];


export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <header className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span aria-hidden="true">🔔</span> Addis Eats <span className="admin-sidebar__brand-badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {ADMIN_NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' is-active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="admin-note">Signed in as {admin?.username}</span>
          <ThemeToggle />
          <Link to="/" className="btn btn--outline btn--sm">
            Customer site
          </Link>
          <Button onClick={onLogout} variant="ghost" size="sm">
            Logout
          </Button>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

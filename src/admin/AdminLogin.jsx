import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth, ADMIN_CREDENTIALS } from './useAdminAuth.js';
import Field from '../checkout/Field.jsx';
import Button from '../ui/Button.jsx';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Please fill in both username and password.');
      return;
    }
    if (!login(username, password)) {
      setError('Wrong username or password — try the demo credentials below.');
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-login">
      <div className="card admin-login__card">
        <span className="admin-login__emoji" role="img" aria-label="Kitchen bell">
          🔔
        </span>
        <h1 className="page__title">Addis Eats Admin</h1>
        <p className="page__intro">Kitchen operations — dishes, orders and the day&apos;s numbers.</p>

        <form className="form" onSubmit={onSubmit} noValidate aria-label="Admin sign in">
          <Field
            label="Username"
            name="admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={!error || error.includes('Wrong') ? '' : error}
            placeholder="admin"
            autoComplete="username"
          />
          <Field
            label="Password"
            name="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={error.includes('Wrong') || error.includes('fill') ? error : ''}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary" className="btn--block">
            Enter the kitchen
          </Button>
        </form>

        <p className="admin-login__hint">Demo credentials: {ADMIN_CREDENTIALS.username} / {ADMIN_CREDENTIALS.password}</p>
        <p className="summary-note" style={{ textAlign: 'center' }}>
          Customer? <Link to="/">Back to Addis Eats</Link>
        </p>
      </div>
    </div>
  );
}

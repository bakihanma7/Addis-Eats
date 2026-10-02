import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import Button from '../ui/Button.jsx';
import Field from '../checkout/Field.jsx';
import { validateName, validatePhone } from '../checkout/validate.js';

export default function SignIn() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/menu';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  if (user) {
    return (
      <section className="page signIn-page">
        <div className="card card--tight auth-card">
          <h1 className="page__title">You are signed in</h1>
          <p className="page__intro">
            Welcome back, <strong>{user.name}</strong>. Your checkout is unlocked and your details are pre-filled for
            faster ordering.
          </p>
          <div className="auth-card__actions">
            <Button variant="primary" onClick={() => navigate(from)}>
              Continue
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    signIn({ name: name.trim(), phone: phone.trim() });
    navigate(from, { replace: true });
  };

  return (
    <section className="page signIn-page">
      <div className="card card--tight auth-card">
        <h1 className="page__title">Sign in to order</h1>
        <p className="page__intro">
          Addis Eats needs your name and phone number for delivery. Signing in unlocks checkout — no password required.
        </p>
        <form className="form" onSubmit={onSubmit} noValidate>
          <Field
            label="Full name"
            name="signin-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
            placeholder="e.g. Selam Bekele"
            autoComplete="name"
          />
          <Field
            label="Phone number"
            name="signin-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            error={errors.phone}
            placeholder="09XXXXXXXX or +2519XXXXXXXX"
            autoComplete="tel"
          />
          <Button type="submit" variant="primary" className="form__submit">
            Sign in
          </Button>
        </form>
        <p className="auth-card__hint">
          Just browsing? <Link to="/menu">Explore the menu</Link> — you only need to sign in when you check out.
        </p>
      </div>
    </section>
  );
}

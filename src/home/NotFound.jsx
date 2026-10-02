import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page">
      <div className="empty-state">
        <span className="empty-state__emoji" aria-hidden="true">
          🧭
        </span>
        <h1 className="empty-state__title">This page is off the map</h1>
        <p className="empty-state__message">
          The address you typed doesn&apos;t exist on Addis Eats. Let&apos;s get you back to something delicious.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn--primary">
            Go home
          </Link>
          <Link to="/menu" className="btn btn--outline">
            Open the menu
          </Link>
        </div>
      </div>
    </section>
  );
}

import classNames from './classNames.js';

export function EmptyState({ emoji = '🍽️', title, children, action, className }) {
  return (
    <div className={classNames('empty-state', className)}>
      <span className="empty-state__emoji" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="empty-state__title">{title}</h3>
      {children && <p className="empty-state__message">{children}</p>}
      {action}
    </div>
  );
}

export default EmptyState;

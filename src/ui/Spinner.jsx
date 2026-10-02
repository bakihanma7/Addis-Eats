import classNames from './classNames.js';

export function Spinner({ label = 'Loading…', size = 'md', className }) {
  return (
    <span role="status" className={classNames('spinner-wrap', className)}>
      <span className={classNames('spinner', `spinner--${size}`)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;

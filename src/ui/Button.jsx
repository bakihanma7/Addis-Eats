import classNames from './classNames.js';

export function Button({ variant = 'primary', size = 'md', type = 'button', loading = false, disabled, className, children, ...rest }) {
  return (
    <button
      type={type}
      className={classNames('btn', `btn--${variant}`, `btn--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="spinner spinner--inline" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;

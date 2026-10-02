export function Field({ label, name, error, hint, required = true, as = 'input', children, ...rest }) {
  const Control = as;
  const errorId = `${name}-error`;

  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={name}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <Control id={name} name={name} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errorId : undefined} {...rest}>
        {as === 'select' ? children : null}
      </Control>
      {error && (
        <p className="field__error" id={errorId} role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {!error && hint && (
        <p className="field__hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default Field;

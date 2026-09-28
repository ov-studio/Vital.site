import './index.css';

/**
 * Shared action button.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'action'} [props.variant]
 * @param {'lg'} [props.size]  Larger padding (action only)
 * @param {boolean} [props.danger]  Danger tone (action only)
 * @param {string} [props.href]  Render as <a> when set
 * @param {string | boolean} [props.download]  Anchor download attr (true → empty string)
 * @param {string} [props.target]
 * @param {string} [props.rel]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {import('react').MouseEventHandler} [props.onClick]
 */
export function Button({
  variant = 'primary',
  size = undefined,
  danger = false,
  href = undefined,
  download = undefined,
  target = undefined,
  rel = undefined,
  type = 'button',
  disabled = false,
  className = '',
  children = null,
  onClick = undefined,
  ...rest
}) {
  const cls = [
    'ui-btn',
    `ui-btn--${variant}`,
    danger ? 'ui-btn--danger' : '',
    size === 'lg' ? 'ui-btn--lg' : '',
    className,
  ].filter(Boolean).join(' ');

  if (href != null && href !== '') {
    return (
      <a
        href={href}
        className={cls}
        download={download === true ? '' : download || undefined}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

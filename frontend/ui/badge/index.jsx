import './index.css';

/**
 * Small pill badge — same look as docs breadcrumb / Shared·Client·Server chips.
 * Reusable from the site and external apps that share this UI kit.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children]  Badge text (any string)
 * @param {string} [props.label]  Alt to children
 * @param {'primary' | 'shared' | 'client' | 'server' | 'deprecated' | string} [props.tone='primary']
 * @param {string} [props.type]  Alias for tone; if set and no children/label, capitalizes type as text
 * @param {string} [props.className]
 */
export function Badge({
  children = undefined,
  label = undefined,
  tone = 'primary',
  type = undefined,
  className = '',
}) {
  const resolved_tone = (type || tone || 'primary').toLowerCase();
  const text =
    children != null && children !== false
      ? children
      : label != null
        ? label
        : type
          ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          : null;

  if (text == null || text === '') return null;

  return (
    <span
      className={`ui-badge ui-badge--${resolved_tone}${className ? ` ${className}` : ''}`}
    >
      {text}
    </span>
  );
}

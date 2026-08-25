import * as react from 'react';
import './index.css';

// lucide-react icons are React.forwardRef components, so `typeof Icon ===
// 'function'` is false for them. Don't gate on typeof — anything that
// isn't already a rendered element is treated as a component type.
/**
 * @param {Object} props
 * @param {import('react').ElementType | import('react').ReactElement | null} [props.icon] Icon component (e.g. a lucide-react icon) or a pre-rendered element.
 * @param {Object} [props.iconProps] Props forwarded to the icon when it's rendered from a component.
 * @param {string} [props.title]
 * @param {string} [props.label]
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 */
export function IconButton({
  icon = null,
  iconProps = {},
  title = undefined,
  label = undefined,
  onClick = undefined,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const resolved_title = title ?? label ?? undefined;

  const rendered = icon == null
    ? null
    : react.isValidElement(icon)
      ? icon
      : react.createElement(icon, { size: 13, strokeWidth: 2.6, ...iconProps });

  return (
    <button
      type={type}
      className={`ui-icon-btn${className ? ` ${className}` : ''}`}
      aria-label={resolved_title}
      onClick={onClick}
      disabled={disabled}
    >
      {rendered}
    </button>
  );
}

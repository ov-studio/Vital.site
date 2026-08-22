import * as react from 'react';
import './index.css';

// lucide-react icons are React.forwardRef components, so `typeof Icon ===
// 'function'` is false for them. Don't gate on typeof — anything that
// isn't already a rendered element is treated as a component type.
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
      title={resolved_title}
      aria-label={resolved_title}
      onClick={onClick}
      disabled={disabled}
    >
      {rendered}
    </button>
  );
}

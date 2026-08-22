import * as react from 'react';

/**
 * IconButton — a single-icon square button used across HUD/toolbar contexts.
 *
 * Accepts either a rendered icon node (`icon={<Download size={15}/>}`) or an
 * icon component reference (`icon={Download} iconProps={{ size: 13 }}`), so
 * it's a drop-in for both the old `hud-icon-btn` (mainmenu) and `action-btn`
 * (console) call sites without changing how callers already pass icons.
 *
 * Ships unstyled beyond a base reset (see ui.css `.ui-icon-btn`) — pass
 * `className` to layer an app's existing look (`hud-icon-btn`, `action-btn`,
 * etc.) on top, so this can be adopted without a visual rewrite.
 */
export function IconButton({
  icon,
  iconProps = {},
  title,
  label,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const resolved_title = title ?? label ?? undefined;

  // NOTE: lucide-react icons are React.forwardRef components, so
  // `typeof Icon === 'function'` is FALSE for them — forwardRef returns an
  // object, not a plain function. Don't gate on typeof; anything that isn't
  // already a rendered element is treated as a component type and handed
  // to createElement, which accepts functions, classes, forwardRef, and
  // memo components alike.
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

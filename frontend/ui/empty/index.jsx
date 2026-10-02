/**
 * Empty / error state (icon + message), uses the global `.state-empty` look.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.icon]
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function EmptyState({
  icon = null,
  children,
  className = ''
}) {
  return (
    <div className={`state-empty${className ? ` ${className}` : ''}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

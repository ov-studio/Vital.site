import './index.css';

/**
 * @param {Object} props
 * @param {string} props.value
 * @param {(id: string) => void} [props.onChange]
 * @param {{ id: string, label: string, icon?: import('react').ReactNode }[]} [props.items]
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel]
 * @param {boolean} [props.disabled]
 */
export function Tabs({
  value,
  onChange = undefined,
  items = [],
  className = '',
  ariaLabel = 'Tabs',
  disabled = false,
}) {
  return (
    <div
      className={`ui-tabs${className ? ` ${className}` : ''}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            className={`ui-tab${active ? ' ui-tab--active' : ''}`}
            onClick={disabled ? undefined : () => onChange?.(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

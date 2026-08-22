import './index.css';

/**
 * @param {Object} props
 * @param {string} [props.value]
 * @param {Function} [props.onChange]
 * @param {string} [props.placeholder]
 * @param {import('react').ReactNode} [props.icon]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
export function Search({
  value = '',
  onChange = undefined,
  placeholder = 'Search…',
  icon = undefined,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`ui-search${className ? ` ${className}` : ''}`}>
      {icon}
      <input
        type="text"
        value={value}
        onChange={disabled ? undefined : e => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        disabled={disabled}
      />
    </div>
  );
}

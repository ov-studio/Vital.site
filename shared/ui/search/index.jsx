import './index.css';

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

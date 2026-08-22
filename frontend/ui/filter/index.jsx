import './index.css';

/**
 * @param {Object} props
 * @param {string[]} [props.tags]
 * @param {string | null} [props.active]
 * @param {Function} [props.onChange]
 * @param {string} [props.allLabel]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {string} [props.buttonClassName]
 */
export function Filter({
  tags = [],
  active = null,
  onChange = undefined,
  allLabel = 'All',
  disabled = false,
  className = '',
  buttonClassName = '',
}) {
  return (
    <div className={`ui-filter${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className={`ui-filter-btn${buttonClassName ? ` ${buttonClassName}` : ''}${active === null ? ' active' : ''}`}
        onClick={disabled ? undefined : () => onChange?.(null)}
        disabled={disabled}
      >
        {allLabel}
      </button>
      {tags.map(tag => (
        <button
          type="button"
          key={tag}
          className={`ui-filter-btn${buttonClassName ? ` ${buttonClassName}` : ''}${active === tag ? ' active' : ''}`}
          onClick={disabled ? undefined : () => onChange?.(tag === active ? null : tag)}
          disabled={disabled}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

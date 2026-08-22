/**
 * FilterBar — a row of tag filter pills plus a search input. Used by any
 * "browse a grid of X" view — kit's masterlist filters and site's vault
 * filters are the same interaction with different data.
 */
export function FilterBar({
  tags = [],
  activeTag = null,
  onTagChange,
  allLabel = 'All',
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  searchIcon,
  disabled = false,
  className = '',
  tagsClassName = '',
  tagButtonClassName = '',
  searchClassName = '',
}) {
  return (
    <div className={`ui-filterbar${className ? ` ${className}` : ''}`}>
      <div className={`ui-filterbar-tags${tagsClassName ? ` ${tagsClassName}` : ''}`}>
        <button
          type="button"
          className={`ui-filterbar-btn${tagButtonClassName ? ` ${tagButtonClassName}` : ''}${activeTag === null ? ' active' : ''}`}
          onClick={disabled ? undefined : () => onTagChange?.(null)}
          disabled={disabled}
        >
          {allLabel}
        </button>
        {tags.map(tag => (
          <button
            type="button"
            key={tag}
            className={`ui-filterbar-btn${tagButtonClassName ? ` ${tagButtonClassName}` : ''}${activeTag === tag ? ' active' : ''}`}
            onClick={disabled ? undefined : () => onTagChange?.(tag === activeTag ? null : tag)}
            disabled={disabled}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={`ui-filterbar-search${searchClassName ? ` ${searchClassName}` : ''}`}>
        {searchIcon}
        <input
          type="text"
          value={search}
          onChange={disabled ? undefined : e => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

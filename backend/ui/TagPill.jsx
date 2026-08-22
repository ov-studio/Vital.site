/**
 * TagPill — small "#label" pill. The `.tag-pill` class already lives in
 * shared/app/global.css and is pulled in by every consumer (site, kit,
 * vault), so this only DRYs up the repeated JSX, not the styling.
 */
export function TagPill({ label, className = '', prefix = '#' }) {
  return (
    <span className={`tag-pill${className ? ` ${className}` : ''}`}>
      {prefix}{label}
    </span>
  );
}

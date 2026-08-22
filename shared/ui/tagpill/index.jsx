// .tag-pill already lives in shared/app/global.css and is pulled in by
// every consumer, so there's no index.css here — nothing new to style.
export function TagPill({ label, className = '', prefix = '#' }) {
  return (
    <span className={`tag-pill${className ? ` ${className}` : ''}`}>
      {prefix}{label}
    </span>
  );
}

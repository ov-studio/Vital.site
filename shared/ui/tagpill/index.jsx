import './index.css';

export function TagPill({ label, className = '', prefix = '#' }) {
  return (
    <span className={`tag-pill${className ? ` ${className}` : ''}`}>
      {prefix}{label}
    </span>
  );
}

import './index.css';

/**
 * Tag / label pill.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.className]
 * @param {string} [props.prefix='#']  Prefix before label (empty string to disable)
 */
export function TagPill({
  label,
  className = '',
  prefix = '#'
}) {
  return (
    <span className={`tag-pill${className ? ` ${className}` : ''}`}>
      {prefix}{label}
    </span>
  );
}

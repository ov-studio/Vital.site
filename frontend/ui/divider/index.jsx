import './index.css';

/**
 * Horizontal rule used under filter/search bars and similar toolbars.
 * @param {Object} props
 * @param {string} [props.className]
 */
export function Divider({ className = '' }) {
  return <div className={`ui-divider${className ? ` ${className}` : ''}`} />;
}

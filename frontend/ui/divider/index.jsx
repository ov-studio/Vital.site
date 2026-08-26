import './index.css';

/**
 * @param {Object} props
 * @param {string} [props.className]
 */
export function Divider({ className = '' }) {
  return <div className={`ui-divider${className ? ` ${className}` : ''}`}/>;
}

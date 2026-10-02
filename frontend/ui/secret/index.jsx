import './index.css';

/**
 * Click-to-reveal secret value (tokens, keys).
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {boolean} [props.open=false]
 * @param {() => void} [props.onToggle]
 * @param {string} [props.className]
 */
export function Secret({
  value,
  open = false,
  onToggle = undefined,
  className = ''
}) {
  return (
    <button
      type="button"
      className={`ui-secret${open ? ' ui-secret--open' : ''}${className ? ` ${className}` : ''}`}
      onClick={onToggle}
      title={open ? 'Click to hide' : 'Click to reveal'}
    >
      <code className="ui-secret-value">
        {open ? value : '•'.repeat(Math.min(48, value.length))}
      </code>
      <span className="ui-secret-hint">{open ? 'Hide' : 'Reveal'}</span>
    </button>
  );
}

import './index.css';

/**
 * Single-line text field. Edits are reported live through `onChange`;
 * `onCommit` fires once when the user confirms (Enter or leaving the field).
 *
 * @param {Object} props
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onChange]
 * @param {(value: string) => void} [props.onCommit]
 * @param {string} [props.placeholder]
 * @param {number} [props.maxLength]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 */
export function EditBox({
  value = '',
  onChange = undefined,
  onCommit = undefined,
  placeholder = '',
  maxLength = undefined,
  disabled = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
}) {
  return (
    <input
      id={id}
      name={name}
      type="text"
      className={`ui-editbox${className ? ` ${className}` : ''}`}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      aria-label={ariaLabel}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      onChange={e => onChange?.(e.target.value)}
      onBlur={e => onCommit?.(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
    />
  );
}

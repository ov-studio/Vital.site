import './index.css';

/**
 * Percent range slider with live readout.
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {number} props.value
 * @param {(value: number) => void} props.onChange
 * @param {number} [props.min]
 * @param {number} [props.max]
 * @param {string} [props.className]
 */
export function RangeSlider({
  label = '',
  value,
  onChange,
  min = 1,
  max = 100,
  className = '',
}) {
  return (
    <div className={`ui-rangeslider${className ? ` ${className}` : ''}`}>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        style={{ '--fill': `${((value - min) / (max - min)) * 100}%` }}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span className="ui-rangeslider-value">{value}%</span>
    </div>
  );
}

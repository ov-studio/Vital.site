import { useRef } from 'react';
import './index.css';

/**
 * Percent range slider with live readout.
 *
 * The native input stays on top (invisible) for pointer / keyboard / a11y; the
 * visible fill and thumb are separate elements so they can animate smoothly.
 * While dragging, the thumb follows the pointer continuously (no 1% stepping, no
 * easing lag) and eases to the snapped value on release; clicks and keys ease.
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
  const span = max - min;
  const ratio = span > 0 ? Math.min(1, Math.max(0, (value - min) / span)) : 0;
  const track = useRef(null);
  const down = useRef(null);
  const set_p = p => track.current?.style.setProperty('--p', p);
  const on_down = e => {
    down.current = { x: e.clientX };
  };

  const on_move = e => {
    if (!down.current || !(e.buttons & 1)) return;
    const el = track.current;
    if (!el) return;
    if (!el.hasAttribute('data-dragging')) {
      if (Math.abs(e.clientX - down.current.x) < 3) return;
      el.setAttribute('data-dragging', '');
    }
    const r = el.getBoundingClientRect();
    const thumb = parseFloat(getComputedStyle(el).getPropertyValue('--rs-thumb-w')) || 8;
    const free = r.width - thumb;
    const p = free > 0 ? (e.clientX - r.left - thumb / 2) / free : 0;
    set_p(Math.min(1, Math.max(0, p)));
  };

  const on_end = e => {
    if (!down.current) return;
    down.current = null;
    const el = track.current;
    if (!el) return;
    el.removeAttribute('data-dragging');
    const v = Number(e.currentTarget.value);
    set_p(span > 0 ? Math.min(1, Math.max(0, (v - min) / span)) : 0);
  };

  return (
    <div className={`ui-rangeslider${className ? ` ${className}` : ''}`}>
      <div className="ui-rangeslider-track" ref={track} style={{ '--p': ratio }}>
        <span className="ui-rangeslider-rail" aria-hidden="true"/>
        <span className="ui-rangeslider-fill" aria-hidden="true"/>
        <span className="ui-rangeslider-thumb" aria-hidden="true"/>
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          onPointerDown={on_down}
          onPointerMove={on_move}
          onPointerUp={on_end}
          onPointerCancel={on_end}
        />
      </div>
      <span className="ui-rangeslider-value">{value}%</span>
    </div>
  );
}

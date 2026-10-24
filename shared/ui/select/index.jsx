'use client';
import * as lucide    from 'lucide-react';
import * as react     from 'react';
import * as react_dom from 'react-dom';
import './index.css';

/**
 * Themed select with portaled dropdown — floats outside modal overflow/clip.
 *
 * @param {Object} props
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onChange]
 * @param {{ value: string, label: string, disabled?: boolean }[]} [props.options]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]  Renders a hidden input when set
 */
export function Select({
  value = '',
  onChange,
  options = [],
  placeholder = 'Select…',
  disabled = false,
  loading = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
}) {
  const [open, setOpen] = react.useState(false);
  const [menuStyle, setMenuStyle] = react.useState({});
  const rootRef = react.useRef(null);
  const triggerRef = react.useRef(null);
  const listRef = react.useRef(null);

  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || loading;

  const close = react.useCallback(() => setOpen(false), []);

  const positionMenu = react.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 6;
    const maxH = Math.min(240, window.innerHeight * 0.4);
    const spaceBelow = window.innerHeight - r.bottom - gap - 12;
    const spaceAbove = r.top - gap - 12;
    const openUp = spaceBelow < Math.min(maxH, 120) && spaceAbove > spaceBelow;
    const height = Math.min(maxH, openUp ? spaceAbove : spaceBelow);

    setMenuStyle({
      position: 'fixed',
      left: r.left,
      width: r.width,
      zIndex: 700,
      maxHeight: height,
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap, top: 'auto' }
        : { top: r.bottom + gap, bottom: 'auto' }),
    });
  }, []);

  react.useEffect(() => {
    if (!open) return;
    positionMenu();
    function onDoc(e) {
      const t = e.target;
      if (rootRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      close();
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }
    function onReposition() {
      positionMenu();
    }
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open, close, positionMenu]);

  react.useEffect(() => {
    if (!open || !listRef.current) return;
    const active = listRef.current.querySelector('[data-selected="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [open, value]);

  const pick = (v) => {
    if (isDisabled) return;
    onChange?.(v);
    close();
  };

  const display = loading
    ? 'Loading…'
    : selected
      ? selected.label
      : placeholder;

  const menu = open && !isDisabled && typeof document !== 'undefined'
    ? react_dom.createPortal(
        <ul
          ref={listRef}
          className="ui-select-menu"
          role="listbox"
          aria-label={ariaLabel || placeholder}
          style={menuStyle}
        >
          {options.length === 0 ? (
            <li className="ui-select-empty" role="presentation">
              No options
            </li>
          ) : (
            options.map((o) => {
              const isSel = o.value === value;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSel}
                  data-selected={isSel ? 'true' : undefined}
                  className={[
                    'ui-select-option',
                    isSel ? 'is-selected' : '',
                    o.disabled ? 'is-disabled' : '',
                  ].filter(Boolean).join(' ')}
                  onMouseDown={(e) => {
                    // prevent blur/close before click registers
                    e.preventDefault();
                    if (!o.disabled) pick(o.value);
                  }}
                >
                  {o.label}
                </li>
              );
            })
          )}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div
      ref={rootRef}
      className={[
        'ui-select',
        open ? 'is-open' : '',
        isDisabled ? 'is-disabled' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {name ? <input type="hidden" name={name} value={value}/> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="ui-select-trigger"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        onClick={() => !isDisabled && setOpen((o) => !o)}
      >
        <span className={`ui-select-value${!value && !loading ? ' is-placeholder' : ''}`}>
          {display}
        </span>
        {loading ? (
          <span className="ui-select-spinner" aria-hidden/>
        ) : (
          <lucide.ChevronDown
            className="ui-select-chevron"
            size={15}
            strokeWidth={2.25}
            aria-hidden
          />
        )}
      </button>
      {menu}
    </div>
  );
}

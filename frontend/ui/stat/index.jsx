import './index.css';

/**
 * Compact stat / environment tile — label + optional icon on top, value below.
 * Shared by benchmarks env row, workspace summary, and similar surfaces.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.label]
 * @param {import('react').ReactNode} [props.value]
 * @param {import('react').ReactNode} [props.icon]
 * @param {import('react').ReactNode} [props.children]  Override body (instead of value)
 * @param {string | number} [props.index]  Stagger animation index (`--i`)
 * @param {boolean} [props.animate=false]
 * @param {string} [props.className]
 * @param {string} [props.labelClassName]
 * @param {string} [props.valueClassName]
 * @param {string} [props.iconClassName]
 * @param {Object} [props.style]
 */
export function Stat({
  label = undefined,
  value = undefined,
  icon = undefined,
  children = undefined,
  index = undefined,
  animate = false,
  className = '',
  labelClassName = '',
  valueClassName = '',
  iconClassName = '',
  style = undefined
}) {
  const mergedStyle =
    index != null
      ? { ...(style || {}), ['--i']: index }
      : style;

  return (
    <div
      className={`ui-stat${animate ? ' ui-stat--animate' : ''}${className ? ` ${className}` : ''}`}
      style={mergedStyle}
    >
      {(label != null || icon != null) && (
        <div className="ui-stat-top">
          {label != null ? (
            <span className={`ui-stat-label${labelClassName ? ` ${labelClassName}` : ''}`}>
              {label}
            </span>
          ) : (
            <span/>
          )}
          {icon != null ? (
            <span className={`ui-stat-icon${iconClassName ? ` ${iconClassName}` : ''}`}>
              {icon}
            </span>
          ) : null}
        </div>
      )}
      {children != null ? (
        children
      ) : value != null ? (
        <div className={`ui-stat-value${valueClassName ? ` ${valueClassName}` : ''}`}>
          {value}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Responsive grid of Stat tiles.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {2 | 3 | 4 | 'auto'} [props.columns='auto']  Column preset
 * @param {string} [props.minWidth]  CSS minmax min when columns='auto' (sets --ui-stat-min)
 * @param {string} [props.className]
 * @param {Object} [props.style]
 */
export function StatGrid({
  children,
  columns = 'auto',
  minWidth = undefined,
  className = '',
  style = undefined
}) {
  const colsClass =
    columns === 4 ? ' ui-stat-grid--cols-4'
    : columns === 3 ? ' ui-stat-grid--cols-3'
    : columns === 2 ? ' ui-stat-grid--cols-2'
    : ' ui-stat-grid--auto';

  const mergedStyle = minWidth
    ? { ...(style || {}), ['--ui-stat-min']: minWidth }
    : style;

  return (
    <div
      className={`ui-stat-grid${colsClass}${className ? ` ${className}` : ''}`}
      style={mergedStyle}
    >
      {children}
    </div>
  );
}

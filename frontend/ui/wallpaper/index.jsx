import './index.css';

/**
 * @param {Object}  props
 * @param {number}  [props.variant=1]   pattern id (1–12)
 * @param {number}  [props.opacity=1]
 * @param {boolean} [props.vignette=true]
 * @param {string}  [props.color]       CSS color for strokes (default var(--rule7))
 */
export function Wallpaper({
  variant = 1,
  opacity = 1,
  vignette = true,
  color,
}) {
  const v = Math.max(1, Math.min(12, Number(variant) || 1));
  const cls = [
    'ui-wallpaper',
    vignette ? 'ui-wallpaper--vignette' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      data-variant={v}
      style={{
        opacity,
        ...(color ? { ['--wallpaper-color']: color } : {}),
      }}
      aria-hidden="true"
    />
  );
}

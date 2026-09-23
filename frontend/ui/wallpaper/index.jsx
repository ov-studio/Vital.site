import './index.css';

/**
 * @param {Object} props
 * @param {'icon' | 'line'} [props.type='icon']
 * @param {number}  [props.seed=0]     icon tile seed
 * @param {number}  [props.opacity]    overall opacity (icon default 0.1, line default 1)
 * @param {boolean} [props.vignette=true]
 * @param {string}  [props.src]        icon: override tile URL
 * @param {string}  [props.color]      icon: mask fill color
 * @param {number}  [props.angle=-45]  line: gradient angle in degrees
 */
export function Wallpaper({
  type = 'icon',
  seed = 0,
  opacity,
  vignette = true,
  src,
  color,
  angle = -45,
}) {
  const resolvedOpacity = opacity ?? (type === 'line' ? 1 : 0.1);
  const cls = [
    'ui-wallpaper',
    type === 'line' ? 'ui-wallpaper--line' : 'ui-wallpaper--icon',
    vignette ? 'ui-wallpaper--vignette' : '',
  ].filter(Boolean).join(' ');

  if (type === 'line') {
    return (
      <div
        className={cls}
        style={{
          opacity: resolvedOpacity,
          ['--wallpaper-line-angle']: `${angle}deg`,
        }}
        aria-hidden="true"
      />
    );
  }

  const url = src ?? `/cdn/wallpaper/seed-${seed}.webp`;
  return (
    <div
      className={cls}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        backgroundColor: color ?? 'var(--brand-neon-core)',
        opacity: resolvedOpacity,
      }}
      aria-hidden="true"
    />
  );
}

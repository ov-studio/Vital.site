import './index.css';

/**
 * @param {Object} props
 * @param {number}  [props.seed=0]
 * @param {number}  [props.opacity=0.12]
 * @param {boolean} [props.vignette=true]
 * @param {string}  [props.src]   - Override tile URL
 * @param {string}  [props.color] - CSS color (default brand neon)
 */
export function Wallpaper({
  seed = 0,
  opacity = 0.12,
  vignette = true,
  src,
}) {
  const url = src ?? `/cdn/wallpaper/seed-${seed}.webp`;
  return (
    <div
      className={`ui-wallpaper${vignette ? ' ui-wallpaper--vignette' : ''}`}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        backgroundColor: color ?? 'var(--brand-neon-core)',
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

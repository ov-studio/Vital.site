import './index.css';

/**
 * @param {Object} props
 * @param {number}  [props.seed=0]
 * @param {number}  [props.opacity=0.09]
 * @param {boolean} [props.vignette=true]
 * @param {string}  [props.src] - Override tile URL
 */
export function Wallpaper({
  seed = 0,
  opacity = 0.09,
  vignette = true,
  src,
}) {
  const url = src ?? `/cdn/wallpaper/seed-${seed}.webp`;
  return (
    <div
      className={`ui-wallpaper${vignette ? ' ui-wallpaper--vignette' : ''}`}
      style={{ backgroundImage: `url(${url})`, opacity }}
      aria-hidden="true"
    />
  );
}

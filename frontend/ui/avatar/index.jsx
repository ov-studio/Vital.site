import './index.css';

/**
 * Round avatar with a neon ring.
 * Shared by the navbar, its account menu, the workspace profile and the contributors grid.
 *
 * @param {Object} props
 * @param {string} props.src  Image URL
 * @param {string} [props.alt='']
 * @param {number | 'fill'} [props.size=28]  Diameter in px, or 'fill' to take the size of the parent
 * @param {number} [props.ring=3]  Ring width in px
 * @param {'core' | 'mid'} [props.tone='core']  Ring color. Override `--ui-avatar-ring` to change it from outside (e.g. on hover)
 * @param {boolean} [props.lazy=false]  Lazy-load the image
 * @param {string} [props.className]
 */
export function Avatar({
  src,
  alt = '',
  size = 28,
  ring = 3,
  tone = 'core',
  lazy = false,
  className = '',
}) {
  const fill = size === 'fill';
  const style = {
    '--ui-avatar-ring-width': `${ring}px`,
    ...(fill ? {} : { '--ui-avatar-size': `${size}px` }),
  };

  return (
    <span
      className={`ui-avatar ui-avatar--${tone}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        referrerPolicy="no-referrer"
      />
    </span>
  );
}

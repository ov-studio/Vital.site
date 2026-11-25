import './index.css';

/**
 * Horizontal section divider. Pass children to use it as a heading with an underline.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children]  Heading content shown above the line
 * @param {string} [props.className]
 */
export function Divider({
  children = null,
  className = ''
}) {
  return <div className={`ui-divider${className ? ` ${className}` : ''}`}>{children}</div>;
}

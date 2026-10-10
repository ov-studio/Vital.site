import { Wallpaper } from '../wallpaper';

/**
 * Standard page shell: section + wallpaper + `.sw` content wrapper.
 *
 * @param {Object} props
 * @param {number} [props.wallpaper=2]  Wallpaper variant
 * @param {string} [props.id]
 * @param {'section' | 'main'} [props.as='section']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function Page({
  wallpaper = 2,
  id = undefined,
  as: Tag = 'section',
  className = '',
  children
}) {
  return (
    <Tag id={id} className={`sec-pad${className ? ` ${className}` : ''}`}>
      <Wallpaper variant={wallpaper}/>
      <div className="sw">
        {children}
      </div>
    </Tag>
  );
}

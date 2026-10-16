import { Divider } from '../divider';
import './index.css';

/**
 * Section heading with its divider underneath.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children  Heading text
 * @param {string} [props.className]       Applied to the divider
 * @param {string} [props.titleClassName]  Applied to the heading
 */
export function Section({
  children,
  className = '',
  titleClassName = ''
}) {
  return (
    <>
      <div className={`sec-title ui-section-title${titleClassName ? ` ${titleClassName}` : ''}`}>{children}</div>
      <Divider className={className}/>
    </>
  );
}

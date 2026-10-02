/**
 * Page header: small label, big title, optional intro text and extra content.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.label
 * @param {import('react').ReactNode} props.title
 * @param {import('react').ReactNode} [props.intro]       Rendered as `.page-intro`
 * @param {string} [props.introClassName]
 * @param {import('react').ReactNode} [props.children]    Extra content under the title
 */
export function PageHead({
  label,
  title,
  intro = undefined,
  introClassName = '',
  children = undefined
}) {
  return (
    <div className="page-head">
      <div className="sec-head sec-head--intro">
        <div>
          <div className="slabel">{label}</div>
          <h2>{title}</h2>
        </div>
      </div>
      {intro != null && (
        <p className={`page-intro${introClassName ? ` ${introClassName}` : ''}`}>{intro}</p>
      )}
      {children}
    </div>
  );
}

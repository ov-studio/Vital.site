import './index.css';

/**
 * @param {Object} props
 * @param {'overlay' | 'stack'} [props.layout]
 * @param {boolean} [props.scrim]
 * @param {string} [props.cover]
 * @param {string} [props.coverAlt]
 * @param {Function} [props.onCoverError]
 * @param {import('react').ReactNode} [props.coverPlaceholder]
 * @param {import('react').ReactNode} [props.coverNode]
 * @param {import('react').ReactNode} [props.topLeft]
 * @param {import('react').ReactNode} [props.topRight]
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.subtitle]
 * @param {import('react').ReactNode} [props.description]
 * @param {import('react').ReactNode} [props.footer]
 * @param {import('react').ReactNode} [props.bodyContent]
 * @param {boolean} [props.featured]
 * @param {Function} [props.onClick]
 * @param {Object} [props.style]
 * @param {string} [props.className]
 * @param {string} [props.coverClassName]
 * @param {string} [props.scrimClassName]
 * @param {string} [props.topClassName]
 * @param {string} [props.topLeftClassName]
 * @param {string} [props.topRightClassName]
 * @param {string} [props.bodyClassName]
 * @param {string} [props.titleClassName]
 * @param {string} [props.subtitleClassName]
 * @param {string} [props.descriptionClassName]
 * @param {string} [props.footerClassName]
 * @param {boolean} [props.interactive]
 */
export function Card({
  layout = 'overlay',
  scrim = layout === 'overlay',
  cover = undefined,
  coverAlt = '',
  onCoverError = undefined,
  coverPlaceholder = undefined,
  coverNode = undefined,
  topLeft = undefined,
  topRight = undefined,
  title = undefined,
  subtitle = undefined,
  description = undefined,
  footer = undefined,
  bodyContent = undefined,
  featured = false,
  onClick = undefined,
  style = undefined,
  className = '',
  coverClassName = '',
  scrimClassName = '',
  topClassName = '',
  topLeftClassName = '',
  topRightClassName = '',
  bodyClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  descriptionClassName = '',
  footerClassName = '',
  interactive = Boolean(onClick),
}) {
  return (
    <div
      className={`ui-card${layout === 'stack' ? ' ui-card--stack' : ''}${featured ? ' ui-card--featured' : ''}${interactive ? ' ui-card--interactive' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(e); }) : undefined}
    >
      {coverNode ?? (
        <div className={`ui-card-cover${coverClassName ? ` ${coverClassName}` : ''}`}>
          {cover
            ? <img src={cover} alt={coverAlt} onError={onCoverError}/>
            : (coverPlaceholder ?? <div className="ui-card-cover-placeholder"/>)
          }
        </div>
      )}

      {scrim && <div className={`ui-card-scrim${scrimClassName ? ` ${scrimClassName}` : ''}`}/>}

      {(topLeft || topRight) && (
        <div className={`ui-card-top${topClassName ? ` ${topClassName}` : ''}`}>
          <div className={`ui-card-top-left${topLeftClassName ? ` ${topLeftClassName}` : ''}`}>{topLeft}</div>
          <div className={`ui-card-top-right${topRightClassName ? ` ${topRightClassName}` : ''}`}>{topRight}</div>
        </div>
      )}

      <div className={`ui-card-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>
        {bodyContent !== undefined ? bodyContent : (
          <>
            {title !== undefined && (
              <div className={`ui-card-title${titleClassName ? ` ${titleClassName}` : ''}`}>{title}</div>
            )}
            {subtitle !== undefined && (
              <div className={`ui-card-subtitle${subtitleClassName ? ` ${subtitleClassName}` : ''}`}>{subtitle}</div>
            )}
            {description !== undefined && (
              <div className={`ui-card-desc${descriptionClassName ? ` ${descriptionClassName}` : ''}`}>{description}</div>
            )}
            {footer !== undefined && (
              <div className={`ui-card-footer${footerClassName ? ` ${footerClassName}` : ''}`}>{footer}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

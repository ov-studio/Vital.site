/**
 * Card — generic media card. Covers two shapes seen across the project:
 *
 *  - layout="overlay" (default) — a hero tile with the cover as a full-bleed
 *    background, a scrim, and the body pinned absolutely over the bottom.
 *    This is kit's `GameCard` shape.
 *  - layout="stack" — a normal flex-column card: cover on top, body flows
 *    below it in normal document flow, no scrim. This is site's `VaultCard`
 *    shape.
 *
 * Every slot takes its own `*ClassName` so an app's existing look (`gc-*`,
 * `vault-card-*`) can be layered on top of the minimal base skin in ui.css —
 * that's what makes this a safe drop-in for an existing card without having
 * to touch its CSS at the same time.
 *
 * Two ways to fill the body:
 *  - title/subtitle/description/footer — fixed slots, rendered in that
 *    order, each in its own `ui-card-*` div. Good when a card's body really
 *    is just that shape (GameCard).
 *  - bodyContent — raw children rendered directly inside `.ui-card-body`,
 *    bypassing the fixed slots entirely. Use this when a body's internal
 *    order/structure doesn't match the fixed slots (VaultCard has a
 *    meta-row before its title, which the fixed slots don't have room for).
 *
 * Two ways to fill the cover:
 *  - cover (url) — renders a plain <img>, or coverPlaceholder/a default
 *    placeholder block when there's no url.
 *  - coverNode — a fully custom node (e.g. an existing `Banner` component
 *    that already knows how to render its own image/placeholder/overlay),
 *    rendered as-is with no extra wrapper div.
 */
export function Card({
  layout = 'overlay',
  scrim = layout === 'overlay',
  cover,
  coverAlt = '',
  onCoverError,
  coverPlaceholder,
  coverNode,
  topLeft,
  topRight,
  title,
  subtitle,
  description,
  footer,
  bodyContent,
  featured = false,
  onClick,
  style,
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
            ? <img src={cover} alt={coverAlt} onError={onCoverError} />
            : (coverPlaceholder ?? <div className="ui-card-cover-placeholder" />)
          }
        </div>
      )}

      {scrim && <div className={`ui-card-scrim${scrimClassName ? ` ${scrimClassName}` : ''}`} />}

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

import './index.css';

type BrandSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BrandVariant = 'full' | 'logo-only' | 'wordmark-only';

interface BrandProps {
  size?: BrandSize;
  variant?: BrandVariant;
  className?: string;
  color?: string;
  href?: string;
}

export function Brand({
  size = 'md',
  variant = 'full',
  className = '',
  color,
  href,
}: BrandProps) {
  const colorStyle = color ? ({ '--brand-color': color } as React.CSSProperties) : undefined;

  const inner = (
    <>
      {variant !== 'wordmark-only' && (
        <div className="vital-brand__logo-wrapper">
          <div className="vital-brand__logo" />
        </div>
      )}
      {variant !== 'logo-only' && (
        <span className="vital-brand__wordmark">Vital.sandbox</span>
      )}
    </>
  );

  return (
    <div
      className={`vital-brand vital-brand--${size} vital-brand--${variant} ${className}`}
      style={colorStyle}
    >
      {href ? (<a href={href} className="vital-brand__link">{inner}</a>) : inner}
    </div>
  );
}
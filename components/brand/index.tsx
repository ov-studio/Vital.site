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
        <div className="brand_logo-wrapper">
          <div className="brand_logo" />
        </div>
      )}
      {variant !== 'logo-only' && (
        <span className="brand_wordmark">Vital.sandbox</span>
      )}
    </>
  );

  return (
    <div
      className={`brand brand--${size} brand--${variant} ${className}`}
      style={colorStyle}
    >
      {href ? (<a href={href} className="brand_link">{inner}</a>) : inner}
    </div>
  );
}
import './VitalBrand.css';

type VitalBrandSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type VitalBrandVariant = 'full' | 'logo-only' | 'wordmark-only';

interface VitalBrandProps {
  size?: VitalBrandSize;
  variant?: VitalBrandVariant;
  className?: string;
  color?: string; // overrides default hsl(220, 60%, 72%)
}

export function VitalBrand({
  size = 'md',
  variant = 'full',
  className = '',
  color,
}: VitalBrandProps) {
  const colorStyle = color ? ({ '--brand-color': color } as React.CSSProperties) : undefined;

  return (
    <div
      className={`vital-brand vital-brand--${size} vital-brand--${variant} ${className}`}
      style={colorStyle}
    >
      {variant !== 'wordmark-only' && (
        <div className="vital-brand__logo-wrapper">
          <div className="vital-brand__logo" />
        </div>
      )}

      {variant !== 'logo-only' && (
        <span className="vital-brand__wordmark">Vital.sandbox</span>
      )}
    </div>
  );
}
